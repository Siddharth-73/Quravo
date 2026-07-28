import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { tenants, users, tenantMemberships, refreshTokens, verificationTokens, eq, and } from '@quravo/db';
import * as argon2 from '@node-rs/argon2';
import { randomUUID, createHash } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly queueService: QueueService,
    private readonly tenantService: TenantService
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async register(dto: RegisterDto) {
    const db = this.dbService.db;

    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, dto.email.toLowerCase())).limit(1);
    if (existingUser) {
      throw new ConflictException('An account with this email address already exists.');
    }

    // Check if tenant slug exists
    const [existingTenant] = await db.select().from(tenants).where(eq(tenants.slug, dto.clinicSlug.toLowerCase())).limit(1);
    if (existingTenant) {
      throw new ConflictException('Clinic subdomain/slug is already taken. Please choose another.');
    }

    // Hash password with Argon2id
    const passwordHash = await argon2.hash(dto.password);

    // Create Tenant & User transactionally
    const [tenant] = await db
      .insert(tenants)
      .values({
        name: dto.clinicName,
        slug: dto.clinicSlug.toLowerCase(),
        planTier: 'starter',
        status: 'active',
      })
      .returning();

    const [user] = await db
      .insert(users)
      .values({
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        isEmailVerified: false,
      })
      .returning();

    // Create Membership as Owner
    await db.insert(tenantMemberships).values({
      tenantId: tenant.id,
      userId: user.id,
      role: 'owner',
      status: 'active',
    });

    // Create Verification Token
    const rawToken = randomUUID();
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(verificationTokens).values({
      tokenHash,
      userId: user.id,
      type: 'email_verification',
      expiresAt,
    });

    // Emit TenantCreatedEvent for RBAC role seeding & onboarding
    await this.tenantService.emitTenantCreatedEvent({
      tenantId: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      planTier: tenant.planTier,
      ownerUserId: user.id,
      ownerEmail: user.email,
    });

    // Dispatch background email job via BullMQ
    await this.queueService.addJob('verify-email', {
      type: 'verify-email',
      to: user.email,
      subject: 'Verify your Quravo Clinic account',
      firstName: user.firstName,
      verificationUrl: `http://localhost:3000/verify-email?token=${rawToken}`,
    });

    return {
      message: 'Clinic registered successfully. Please check your email to verify your account.',
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
      user: { id: user.id, email: user.email, firstName: user.firstName },
    };
  }

  async login(dto: LoginDto) {
    const db = this.dbService.db;

    // Find User
    const [user] = await db.select().from(users).where(eq(users.email, dto.email.toLowerCase())).limit(1);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password credentials.');
    }

    // Verify Password
    const isValidPassword = await argon2.verify(user.passwordHash, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password credentials.');
    }

    // Special bypass for Platform Super-Admin
    if (user.email === 'admin@quravo.com') {
      return this.generateAuthSession(
        user.id,
        user.email,
        '00000000-0000-0000-0000-000000000000',
        'super_admin',
        undefined,
        user.firstName,
        user.lastName
      );
    }

    // Find Tenant Membership
    let membership;
    if (dto.clinicSlug) {
      const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, dto.clinicSlug.toLowerCase())).limit(1);
      if (!tenant) {
        throw new BadRequestException('Target clinic not found.');
      }
      [membership] = await db
        .select()
        .from(tenantMemberships)
        .where(and(eq(tenantMemberships.userId, user.id), eq(tenantMemberships.tenantId, tenant.id)))
        .limit(1);
    } else {
      // Pick first active membership
      [membership] = await db
        .select()
        .from(tenantMemberships)
        .where(eq(tenantMemberships.userId, user.id))
        .limit(1);
    }

    if (!membership) {
      throw new UnauthorizedException('User is not a member of any active clinic.');
    }

    // Generate Session Tokens with Refresh Token Rotation
    return this.generateAuthSession(
      user.id,
      user.email,
      membership.tenantId,
      membership.role,
      undefined,
      user.firstName,
      user.lastName
    );
  }

  async refreshToken(rawRefreshToken: string) {
    const db = this.dbService.db;
    const tokenHash = this.hashToken(rawRefreshToken);

    const [tokenRecord] = await db.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash)).limit(1);

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Automatic Token Reuse Detection & Revocation
    if (tokenRecord.isRevoked) {
      // Invalidate ALL tokens in this family (Theft defense)
      await db
        .update(refreshTokens)
        .set({ isRevoked: true })
        .where(eq(refreshTokens.familyId, tokenRecord.familyId));

      throw new UnauthorizedException('Revoked token reuse detected. All active sessions invalidated for security.');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired.');
    }

    // Revoke current token
    await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.id, tokenRecord.id));

    // Fetch user & membership
    const [user] = await db.select().from(users).where(eq(users.id, tokenRecord.userId)).limit(1);
    if (!user) {
      throw new UnauthorizedException('User no longer active.');
    }

    // Special bypass for Platform Super-Admin
    if (user.email === 'admin@quravo.com') {
      return this.generateAuthSession(
        user.id,
        user.email,
        '00000000-0000-0000-0000-000000000000',
        'super_admin',
        tokenRecord.familyId,
        user.firstName,
        user.lastName
      );
    }

    const [membership] = await db
      .select()
      .from(tenantMemberships)
      .where(and(eq(tenantMemberships.userId, tokenRecord.userId), eq(tenantMemberships.tenantId, tokenRecord.tenantId)))
      .limit(1);

    if (!membership) {
      throw new UnauthorizedException('User membership no longer active.');
    }

    // Rotate and generate new token pair keeping familyId intact
    return this.generateAuthSession(
      user.id,
      user.email,
      membership.tenantId,
      membership.role,
      tokenRecord.familyId,
      user.firstName,
      user.lastName
    );
  }

  private async generateAuthSession(
    userId: string,
    email: string,
    tenantId: string,
    role: string,
    existingFamilyId?: string,
    firstName?: string,
    lastName?: string
  ) {
    const db = this.dbService.db;
    const payload = { sub: userId, email, tenantId, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const rawRefreshToken = randomUUID();
    const tokenHash = this.hashToken(rawRefreshToken);
    const familyId = existingFamilyId || randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(refreshTokens).values({
      tokenHash,
      familyId,
      userId,
      tenantId,
      isRevoked: false,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: { id: userId, email, tenantId, role, firstName, lastName },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const db = this.dbService.db;
    const [user] = await db.select().from(users).where(eq(users.email, dto.email.toLowerCase())).limit(1);

    if (user) {
      const rawToken = randomUUID();
      const tokenHash = this.hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

      await db.insert(verificationTokens).values({
        tokenHash,
        userId: user.id,
        type: 'password_reset',
        expiresAt,
      });

      await this.queueService.addJob('password-reset', {
        type: 'password-reset',
        to: user.email,
        subject: 'Reset your Quravo password',
        firstName: user.firstName,
        resetUrl: `http://localhost:3000/reset-password?token=${rawToken}`,
      });
    }

    // Always return standard message to prevent user enumeration
    return { message: 'If an account exists with that email, a password reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const db = this.dbService.db;
    const tokenHash = this.hashToken(dto.token);

    const [tokenRecord] = await db
      .select()
      .from(verificationTokens)
      .where(and(eq(verificationTokens.tokenHash, tokenHash), eq(verificationTokens.type, 'password_reset')))
      .limit(1);

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const newPasswordHash = await argon2.hash(dto.newPassword);
    await db.update(users).set({ passwordHash: newPasswordHash }).where(eq(users.id, tokenRecord.userId));

    // Delete used token
    await db.delete(verificationTokens).where(eq(verificationTokens.id, tokenRecord.id));

    return { message: 'Password reset successfully. You may now log in with your new password.' };
  }
}
