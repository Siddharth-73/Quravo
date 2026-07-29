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
exports.ClinicService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const argon2 = __importStar(require("@node-rs/argon2"));
const crypto_1 = require("crypto");
let ClinicService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ClinicService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ClinicService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        queueService;
        tenantCacheService;
        configService;
        constructor(dbService, queueService, tenantCacheService, configService) {
            this.dbService = dbService;
            this.queueService = queueService;
            this.tenantCacheService = tenantCacheService;
            this.configService = configService;
        }
        hashToken(token) {
            return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
        }
        // --- BRANDING & CONFIG ---
        async getBranding(tenantId) {
            const db = this.dbService.db;
            let [config] = await db.select().from(db_1.tenantConfigs).where((0, db_1.eq)(db_1.tenantConfigs.tenantId, tenantId)).limit(1);
            if (!config) {
                // Seed default config
                [config] = await db
                    .insert(db_1.tenantConfigs)
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
        async updateBranding(tenantId, dto) {
            const db = this.dbService.db;
            let [config] = await db.select().from(db_1.tenantConfigs).where((0, db_1.eq)(db_1.tenantConfigs.tenantId, tenantId)).limit(1);
            if (config) {
                [config] = await db
                    .update(db_1.tenantConfigs)
                    .set({ ...dto, updatedAt: new Date() })
                    .where((0, db_1.eq)(db_1.tenantConfigs.id, config.id))
                    .returning();
            }
            else {
                [config] = await db
                    .insert(db_1.tenantConfigs)
                    .values({ tenantId, ...dto })
                    .returning();
            }
            return config;
        }
        // --- BRANCHES & HOURS ---
        async seedMainBranch(tenantId, clinicName) {
            const db = this.dbService.db;
            const [branch] = await db
                .insert(db_1.clinicBranches)
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
            await db.insert(db_1.branchWorkingHours).values(hoursToSeed);
            return branch;
        }
        async getBranches(tenantId) {
            const db = this.dbService.db;
            return db.select().from(db_1.clinicBranches).where((0, db_1.eq)(db_1.clinicBranches.tenantId, tenantId));
        }
        async createBranch(tenantId, dto) {
            const db = this.dbService.db;
            const [branch] = await db
                .insert(db_1.clinicBranches)
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
            await db.insert(db_1.branchWorkingHours).values(hoursToSeed);
            return branch;
        }
        async getWorkingHours(tenantId, branchId) {
            const db = this.dbService.db;
            return db
                .select()
                .from(db_1.branchWorkingHours)
                .where((0, db_1.and)((0, db_1.eq)(db_1.branchWorkingHours.tenantId, tenantId), (0, db_1.eq)(db_1.branchWorkingHours.branchId, branchId)));
        }
        async updateWorkingHours(tenantId, branchId, dto) {
            const db = this.dbService.db;
            for (const item of dto.hours) {
                await db
                    .insert(db_1.branchWorkingHours)
                    .values({
                    tenantId,
                    branchId,
                    dayOfWeek: item.dayOfWeek,
                    openTime: item.openTime,
                    closeTime: item.closeTime,
                    isClosed: item.isClosed,
                })
                    .onConflictDoUpdate({
                    target: [db_1.branchWorkingHours.branchId, db_1.branchWorkingHours.dayOfWeek],
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
        async getStaff(tenantId) {
            const db = this.dbService.db;
            const staff = await db
                .select({
                id: db_1.users.id,
                firstName: db_1.users.firstName,
                lastName: db_1.users.lastName,
                email: db_1.users.email,
                role: db_1.tenantMemberships.role,
                status: db_1.tenantMemberships.status,
            })
                .from(db_1.tenantMemberships)
                .innerJoin(db_1.users, (0, db_1.eq)(db_1.tenantMemberships.userId, db_1.users.id))
                .where((0, db_1.eq)(db_1.tenantMemberships.tenantId, tenantId));
            return staff;
        }
        async inviteStaff(tenantId, invitedByUserId, dto) {
            const db = this.dbService.db;
            const [tenant] = await db.select().from(db_1.tenants).where((0, db_1.eq)(db_1.tenants.id, tenantId)).limit(1);
            if (!tenant)
                throw new common_1.NotFoundException('Clinic tenant not found.');
            const rawToken = (0, crypto_1.randomUUID)();
            const tokenHash = this.hashToken(rawToken);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            const [invitation] = await db
                .insert(db_1.staffInvitations)
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
            const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
            const parsedUrl = new URL(frontendUrl);
            const inviteUrl = `${parsedUrl.protocol}//${tenant.slug}.${parsedUrl.host}/accept-invite?token=${rawToken}`;
            await this.queueService.addJob('staff-invite', {
                type: 'staff-invite',
                to: dto.email.toLowerCase(),
                subject: `Invitation to join ${tenant.name}`,
                clinicName: tenant.name,
                role: dto.role,
                inviteUrl,
            });
            return {
                message: `Invitation email dispatched to ${dto.email}`,
                invitationId: invitation.id,
            };
        }
        async acceptInvite(dto) {
            const db = this.dbService.db;
            const tokenHash = this.hashToken(dto.token);
            const [invitation] = await db
                .select()
                .from(db_1.staffInvitations)
                .where((0, db_1.and)((0, db_1.eq)(db_1.staffInvitations.tokenHash, tokenHash), (0, db_1.eq)(db_1.staffInvitations.status, 'pending')))
                .limit(1);
            if (!invitation || invitation.expiresAt < new Date()) {
                throw new common_1.BadRequestException('Invalid or expired staff invitation link.');
            }
            // Check if user account exists or create new
            let [user] = await db.select().from(db_1.users).where((0, db_1.eq)(db_1.users.email, invitation.email)).limit(1);
            const passwordHash = await argon2.hash(dto.password);
            if (!user) {
                [user] = await db
                    .insert(db_1.users)
                    .values({
                    email: invitation.email,
                    passwordHash,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    isEmailVerified: true,
                })
                    .returning();
            }
            else {
                await db.update(db_1.users).set({ passwordHash }).where((0, db_1.eq)(db_1.users.id, user.id));
            }
            // Create Membership in tenant
            await db
                .insert(db_1.tenantMemberships)
                .values({
                tenantId: invitation.tenantId,
                userId: user.id,
                role: invitation.role,
                status: 'active',
            })
                .onConflictDoNothing();
            // Mark invitation accepted
            await db.update(db_1.staffInvitations).set({ status: 'accepted' }).where((0, db_1.eq)(db_1.staffInvitations.id, invitation.id));
            return {
                message: 'Invitation accepted successfully. You may now log in to the clinic dashboard.',
                user: { id: user.id, email: user.email },
            };
        }
    };
    return ClinicService = _classThis;
})();
exports.ClinicService = ClinicService;
