import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { TenantCacheService } from '../tenant/tenant-cache.service';
import {
  tenants,
  tenantConfigs,
  clinicBranches,
  branchWorkingHours,
  staffInvitations,
  users,
  tenantMemberships,
  eq,
  and,
} from '@quravo/db';
import { UpdateBrandingDto } from './dto/branding.dto';
import { CreateBranchDto, UpdateWorkingHoursDto } from './dto/branch.dto';
import { InviteStaffDto, AcceptInviteDto } from './dto/invite.dto';
import * as argon2 from '@node-rs/argon2';
import { randomUUID, createHash } from 'crypto';

@Injectable()
export class ClinicService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly queueService: QueueService,
    private readonly tenantCacheService: TenantCacheService
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // --- BRANDING & CONFIG ---
  async getBranding(tenantId: string) {
    const db = this.dbService.db;
    let [config] = await db.select().from(tenantConfigs).where(eq(tenantConfigs.tenantId, tenantId)).limit(1);

    if (!config) {
      // Seed default config
      [config] = await db
        .insert(tenantConfigs)
        .values({
          tenantId,
          primaryColor: '#0284c7',
          accentColor: '#0f172a',
          timezone: 'UTC',
          currency: 'USD',
        })
        .returning();
    }

    return config;
  }

  async updateBranding(tenantId: string, dto: UpdateBrandingDto) {
    const db = this.dbService.db;
    let [config] = await db.select().from(tenantConfigs).where(eq(tenantConfigs.tenantId, tenantId)).limit(1);

    if (config) {
      [config] = await db
        .update(tenantConfigs)
        .set({ ...dto, updatedAt: new Date() })
        .where(eq(tenantConfigs.id, config.id))
        .returning();
    } else {
      [config] = await db
        .insert(tenantConfigs)
        .values({ tenantId, ...dto })
        .returning();
    }

    return config;
  }

  // --- BRANCHES & HOURS ---
  async seedMainBranch(tenantId: string, clinicName: string) {
    const db = this.dbService.db;
    const [branch] = await db
      .insert(clinicBranches)
      .values({
        tenantId,
        name: `${clinicName} — Main Branch`,
        code: 'MAIN',
        isMain: true,
        status: 'active',
      })
      .returning();

    // Seed default working hours (Monday-Friday 09:00-17:00, Sat-Sun closed)
    const hoursToSeed = [];
    for (let day = 0; day <= 6; day++) {
      hoursToSeed.push({
        tenantId,
        branchId: branch.id,
        dayOfWeek: day,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: day === 0 || day === 6,
      });
    }

    await db.insert(branchWorkingHours).values(hoursToSeed);
    return branch;
  }

  async getBranches(tenantId: string) {
    const db = this.dbService.db;
    return db.select().from(clinicBranches).where(eq(clinicBranches.tenantId, tenantId));
  }

  async createBranch(tenantId: string, dto: CreateBranchDto) {
    const db = this.dbService.db;

    const [branch] = await db
      .insert(clinicBranches)
      .values({ tenantId, ...dto })
      .returning();

    // Seed default working hours
    const hoursToSeed = [];
    for (let day = 0; day <= 6; day++) {
      hoursToSeed.push({
        tenantId,
        branchId: branch.id,
        dayOfWeek: day,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: day === 0 || day === 6,
      });
    }

    await db.insert(branchWorkingHours).values(hoursToSeed);
    return branch;
  }

  async getWorkingHours(tenantId: string, branchId: string) {
    const db = this.dbService.db;
    return db
      .select()
      .from(branchWorkingHours)
      .where(and(eq(branchWorkingHours.tenantId, tenantId), eq(branchWorkingHours.branchId, branchId)));
  }

  async updateWorkingHours(tenantId: string, branchId: string, dto: UpdateWorkingHoursDto) {
    const db = this.dbService.db;

    for (const item of dto.hours) {
      await db
        .insert(branchWorkingHours)
        .values({
          tenantId,
          branchId,
          dayOfWeek: item.dayOfWeek,
          openTime: item.openTime,
          closeTime: item.closeTime,
          isClosed: item.isClosed,
        })
        .onConflictDoUpdate({
          target: [branchWorkingHours.branchId, branchWorkingHours.dayOfWeek],
          set: {
            openTime: item.openTime,
            closeTime: item.closeTime,
            isClosed: item.isClosed,
            updatedAt: new Date(),
          },
        });
    }

    return this.getWorkingHours(tenantId, branchId);
  }

  // --- STAFF & INVITATIONS ---
  async getStaff(tenantId: string) {
    const db = this.dbService.db;
    const staff = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: tenantMemberships.role,
        status: tenantMemberships.status,
      })
      .from(tenantMemberships)
      .innerJoin(users, eq(tenantMemberships.userId, users.id))
      .where(eq(tenantMemberships.tenantId, tenantId));
    
    return staff;
  }

  async inviteStaff(tenantId: string, invitedByUserId: string, dto: InviteStaffDto) {
    const db = this.dbService.db;

    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    if (!tenant) throw new NotFoundException('Clinic tenant not found.');

    const rawToken = randomUUID();
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const [invitation] = await db
      .insert(staffInvitations)
      .values({
        tenantId,
        branchId: dto.branchId,
        email: dto.email.toLowerCase(),
        role: dto.role,
        tokenHash,
        invitedByUserId,
        expiresAt,
        status: 'pending',
      })
      .returning();

    // Enqueue staff invite email to BullMQ
    await this.queueService.addJob('staff-invite', {
      type: 'staff-invite',
      to: dto.email.toLowerCase(),
      subject: `Invitation to join ${tenant.name}`,
      clinicName: tenant.name,
      role: dto.role,
      inviteUrl: `http://${tenant.slug}.localhost:3000/accept-invite?token=${rawToken}`,
    });

    return {
      message: `Invitation email dispatched to ${dto.email}`,
      invitationId: invitation.id,
    };
  }

  async acceptInvite(dto: AcceptInviteDto) {
    const db = this.dbService.db;
    const tokenHash = this.hashToken(dto.token);

    const [invitation] = await db
      .select()
      .from(staffInvitations)
      .where(and(eq(staffInvitations.tokenHash, tokenHash), eq(staffInvitations.status, 'pending')))
      .limit(1);

    if (!invitation || invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired staff invitation link.');
    }

    // Check if user account exists or create new
    let [user] = await db.select().from(users).where(eq(users.email, invitation.email)).limit(1);
    const passwordHash = await argon2.hash(dto.password);

    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          email: invitation.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          isEmailVerified: true,
        })
        .returning();
    } else {
      await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
    }

    // Create Membership in tenant
    await db
      .insert(tenantMemberships)
      .values({
        tenantId: invitation.tenantId,
        userId: user.id,
        role: invitation.role as any,
        status: 'active',
      })
      .onConflictDoNothing();

    // Mark invitation accepted
    await db.update(staffInvitations).set({ status: 'accepted' }).where(eq(staffInvitations.id, invitation.id));

    return {
      message: 'Invitation accepted successfully. You may now log in to the clinic dashboard.',
      user: { id: user.id, email: user.email },
    };
  }
}
