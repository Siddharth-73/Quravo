"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const argon2 = __importStar(require("@node-rs/argon2"));
const crypto_1 = require("crypto");
let AuthService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        jwtService;
        configService;
        queueService;
        tenantService;
        constructor(dbService, jwtService, configService, queueService, tenantService) {
            this.dbService = dbService;
            this.jwtService = jwtService;
            this.configService = configService;
            this.queueService = queueService;
            this.tenantService = tenantService;
        }
        hashToken(token) {
            return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
        }
        async register(dto) {
            const db = this.dbService.db;
            // Check if user already exists
            const [existingUser] = await db.select().from(db_1.users).where((0, db_1.eq)(db_1.users.email, dto.email.toLowerCase())).limit(1);
            if (existingUser) {
                throw new common_1.ConflictException('An account with this email address already exists.');
            }
            // Check if tenant slug exists
            const [existingTenant] = await db.select().from(db_1.tenants).where((0, db_1.eq)(db_1.tenants.slug, dto.clinicSlug.toLowerCase())).limit(1);
            if (existingTenant) {
                throw new common_1.ConflictException('Clinic subdomain/slug is already taken. Please choose another.');
            }
            // Hash password with Argon2id
            const passwordHash = await argon2.hash(dto.password);
            // Create Tenant & User transactionally
            const [tenant] = await db
                .insert(db_1.tenants)
                .values({
                name: dto.clinicName,
                slug: dto.clinicSlug.toLowerCase(),
                planTier: 'starter',
                status: 'active',
            })
                .returning();
            const [user] = await db
                .insert(db_1.users)
                .values({
                email: dto.email.toLowerCase(),
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                isEmailVerified: false,
            })
                .returning();
            // Create Membership as Owner
            await db.insert(db_1.tenantMemberships).values({
                tenantId: tenant.id,
                userId: user.id,
                role: 'owner',
                status: 'active',
            });
            // Create Verification Token
            const rawToken = (0, crypto_1.randomUUID)();
            const tokenHash = this.hashToken(rawToken);
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            await db.insert(db_1.verificationTokens).values({
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
            const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
            await this.queueService.addJob('verify-email', {
                type: 'verify-email',
                to: user.email,
                subject: 'Verify your Quravo Clinic account',
                firstName: user.firstName,
                verificationUrl: `${frontendUrl}/verify-email?token=${rawToken}`,
            });
            return {
                message: 'Clinic registered successfully. Please check your email to verify your account.',
                tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
                user: { id: user.id, email: user.email, firstName: user.firstName },
            };
        }
        async login(dto) {
            const db = this.dbService.db;
            // Find User
            const [user] = await db.select().from(db_1.users).where((0, db_1.eq)(db_1.users.email, dto.email.toLowerCase())).limit(1);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid email or password credentials.');
            }
            // Verify Password
            const isValidPassword = await argon2.verify(user.passwordHash, dto.password);
            if (!isValidPassword) {
                throw new common_1.UnauthorizedException('Invalid email or password credentials.');
            }
            // Special bypass for Platform Super-Admin
            if (user.email === 'admin@quravo.com') {
                return this.generateAuthSession(user.id, user.email, '00000000-0000-0000-0000-000000000000', 'super_admin', undefined, user.firstName, user.lastName);
            }
            // Find Tenant Membership
            let membership;
            if (dto.clinicSlug) {
                const [tenant] = await db.select().from(db_1.tenants).where((0, db_1.eq)(db_1.tenants.slug, dto.clinicSlug.toLowerCase())).limit(1);
                if (!tenant) {
                    throw new common_1.BadRequestException('Target clinic not found.');
                }
                [membership] = await db
                    .select()
                    .from(db_1.tenantMemberships)
                    .where((0, db_1.and)((0, db_1.eq)(db_1.tenantMemberships.userId, user.id), (0, db_1.eq)(db_1.tenantMemberships.tenantId, tenant.id)))
                    .limit(1);
            }
            else {
                // Pick first active membership
                [membership] = await db
                    .select()
                    .from(db_1.tenantMemberships)
                    .where((0, db_1.eq)(db_1.tenantMemberships.userId, user.id))
                    .limit(1);
            }
            if (!membership) {
                throw new common_1.UnauthorizedException('User is not a member of any active clinic.');
            }
            // Generate Session Tokens with Refresh Token Rotation
            return this.generateAuthSession(user.id, user.email, membership.tenantId, membership.role, undefined, user.firstName, user.lastName);
        }
        async refreshToken(rawRefreshToken) {
            const db = this.dbService.db;
            const tokenHash = this.hashToken(rawRefreshToken);
            const [tokenRecord] = await db.select().from(db_1.refreshTokens).where((0, db_1.eq)(db_1.refreshTokens.tokenHash, tokenHash)).limit(1);
            if (!tokenRecord) {
                throw new common_1.UnauthorizedException('Invalid refresh token.');
            }
            // Automatic Token Reuse Detection & Revocation
            if (tokenRecord.isRevoked) {
                // Invalidate ALL tokens in this family (Theft defense)
                await db
                    .update(db_1.refreshTokens)
                    .set({ isRevoked: true })
                    .where((0, db_1.eq)(db_1.refreshTokens.familyId, tokenRecord.familyId));
                throw new common_1.UnauthorizedException('Revoked token reuse detected. All active sessions invalidated for security.');
            }
            if (tokenRecord.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException('Refresh token has expired.');
            }
            // Revoke current token
            await db.update(db_1.refreshTokens).set({ isRevoked: true }).where((0, db_1.eq)(db_1.refreshTokens.id, tokenRecord.id));
            // Fetch user & membership
            const [user] = await db.select().from(db_1.users).where((0, db_1.eq)(db_1.users.id, tokenRecord.userId)).limit(1);
            if (!user) {
                throw new common_1.UnauthorizedException('User no longer active.');
            }
            // Special bypass for Platform Super-Admin
            if (user.email === 'admin@quravo.com') {
                return this.generateAuthSession(user.id, user.email, '00000000-0000-0000-0000-000000000000', 'super_admin', tokenRecord.familyId, user.firstName, user.lastName);
            }
            const [membership] = await db
                .select()
                .from(db_1.tenantMemberships)
                .where((0, db_1.and)((0, db_1.eq)(db_1.tenantMemberships.userId, tokenRecord.userId), (0, db_1.eq)(db_1.tenantMemberships.tenantId, tokenRecord.tenantId)))
                .limit(1);
            if (!membership) {
                throw new common_1.UnauthorizedException('User membership no longer active.');
            }
            // Rotate and generate new token pair keeping familyId intact
            return this.generateAuthSession(user.id, user.email, membership.tenantId, membership.role, tokenRecord.familyId, user.firstName, user.lastName);
        }
        async generateAuthSession(userId, email, tenantId, role, existingFamilyId, firstName, lastName) {
            const db = this.dbService.db;
            const payload = { sub: userId, email, tenantId, role };
            const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
            const rawRefreshToken = (0, crypto_1.randomUUID)();
            // Super admin uses a synthetic tenantId that doesn't exist in the tenants table,
            // so skip the refresh token DB insert to avoid FK constraint violations.
            if (role !== 'super_admin') {
                const tokenHash = this.hashToken(rawRefreshToken);
                const familyId = existingFamilyId || (0, crypto_1.randomUUID)();
                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
                await db.insert(db_1.refreshTokens).values({
                    tokenHash,
                    familyId,
                    userId,
                    tenantId,
                    isRevoked: false,
                    expiresAt,
                });
            }
            return {
                accessToken,
                refreshToken: rawRefreshToken,
                user: { id: userId, email, tenantId, role, firstName, lastName },
            };
        }
        async forgotPassword(dto) {
            const db = this.dbService.db;
            const [user] = await db.select().from(db_1.users).where((0, db_1.eq)(db_1.users.email, dto.email.toLowerCase())).limit(1);
            if (user) {
                const rawToken = (0, crypto_1.randomUUID)();
                const tokenHash = this.hashToken(rawToken);
                const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
                await db.insert(db_1.verificationTokens).values({
                    tokenHash,
                    userId: user.id,
                    type: 'password_reset',
                    expiresAt,
                });
                const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
                await this.queueService.addJob('password-reset', {
                    type: 'password-reset',
                    to: user.email,
                    subject: 'Reset your Quravo password',
                    firstName: user.firstName,
                    resetUrl: `${frontendUrl}/reset-password?token=${rawToken}`,
                });
            }
            // Always return standard message to prevent user enumeration
            return { message: 'If an account exists with that email, a password reset link has been sent.' };
        }
        async resetPassword(dto) {
            const db = this.dbService.db;
            const tokenHash = this.hashToken(dto.token);
            const [tokenRecord] = await db
                .select()
                .from(db_1.verificationTokens)
                .where((0, db_1.and)((0, db_1.eq)(db_1.verificationTokens.tokenHash, tokenHash), (0, db_1.eq)(db_1.verificationTokens.type, 'password_reset')))
                .limit(1);
            if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                throw new common_1.BadRequestException('Invalid or expired password reset token.');
            }
            const newPasswordHash = await argon2.hash(dto.newPassword);
            await db.update(db_1.users).set({ passwordHash: newPasswordHash }).where((0, db_1.eq)(db_1.users.id, tokenRecord.userId));
            // Delete used token
            await db.delete(db_1.verificationTokens).where((0, db_1.eq)(db_1.verificationTokens.id, tokenRecord.id));
            return { message: 'Password reset successfully. You may now log in with your new password.' };
        }
        async updateProfile(userId, dto) {
            const db = this.dbService.db;
            const updates = {};
            if (dto.firstName !== undefined)
                updates.firstName = dto.firstName;
            if (dto.lastName !== undefined)
                updates.lastName = dto.lastName;
            if (dto.phone !== undefined)
                updates.phone = dto.phone;
            updates.updatedAt = new Date();
            const [updatedUser] = await db.update(db_1.users).set(updates).where((0, db_1.eq)(db_1.users.id, userId)).returning();
            if (!updatedUser) {
                throw new common_1.NotFoundException('User not found.');
            }
            const { passwordHash, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        }
        async getSession(userId, tenantId, roleName) {
            const db = this.dbService.db;
            // Load User Details
            const [user] = await db
                .select({
                id: db_1.users.id,
                email: db_1.users.email,
                firstName: db_1.users.firstName,
                lastName: db_1.users.lastName,
            })
                .from(db_1.users)
                .where((0, db_1.eq)(db_1.users.id, userId))
                .limit(1);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found.');
            }
            // Special bypass for Platform Super-Admin
            if (roleName === 'super_admin') {
                return {
                    user: {
                        ...user,
                        role: 'super_admin',
                    },
                    tenant: {
                        id: '00000000-0000-0000-0000-000000000000',
                        name: 'Quravo Platform',
                        slug: 'super-admin',
                        planTier: 'erp',
                    },
                    permissions: ['admin:access'],
                    features: {
                        patients: true,
                        appointments: true,
                        emr: true,
                        billing: true,
                        pharmacy: true,
                        laboratory: true,
                        inventory: true,
                    },
                };
            }
            // Load Tenant Details
            const [tenant] = await db
                .select({
                id: db_1.tenants.id,
                name: db_1.tenants.name,
                slug: db_1.tenants.slug,
                planTier: db_1.tenants.planTier,
            })
                .from(db_1.tenants)
                .where((0, db_1.eq)(db_1.tenants.id, tenantId))
                .limit(1);
            if (!tenant) {
                throw new common_1.UnauthorizedException('Tenant not found.');
            }
            // Load Role Permissions
            const [role] = await db
                .select({
                permissions: db_1.roles.permissions,
            })
                .from(db_1.roles)
                .where((0, db_1.and)((0, db_1.eq)(db_1.roles.tenantId, tenantId), (0, db_1.eq)(db_1.roles.name, roleName)))
                .limit(1);
            const rawPermissions = role ? role.permissions : [];
            // Load Modules
            const modulesList = await db
                .select()
                .from(db_1.tenantModules)
                .where((0, db_1.eq)(db_1.tenantModules.tenantId, tenantId));
            const features = {
                patients: true,
                appointments: true,
                emr: true,
                billing: true,
            };
            for (const mod of modulesList) {
                features[mod.moduleKey] = mod.enabled;
            }
            return {
                user: {
                    ...user,
                    role: roleName,
                },
                tenant: {
                    id: tenant.id,
                    name: tenant.name,
                    slug: tenant.slug,
                    logoUrl: undefined,
                    planTier: tenant.planTier,
                },
                permissions: rawPermissions,
                features,
            };
        }
    };
    return AuthService = _classThis;
})();
exports.AuthService = AuthService;
