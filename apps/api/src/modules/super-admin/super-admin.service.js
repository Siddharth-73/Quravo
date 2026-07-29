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
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const argon2 = __importStar(require("@node-rs/argon2"));
let SuperAdminService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SuperAdminService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SuperAdminService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        tenantService;
        constructor(dbService, tenantService) {
            this.dbService = dbService;
            this.tenantService = tenantService;
        }
        async provisionTenant(dto) {
            const db = this.dbService.db;
            // Check if tenant slug exists
            const [existingTenant] = await db.select().from(db_1.tenants).where((0, db_1.eq)(db_1.tenants.slug, dto.clinicSlug.toLowerCase())).limit(1);
            if (existingTenant) {
                throw new common_1.ConflictException('Clinic subdomain/slug is already taken.');
            }
            // Check if user already exists
            let [user] = await db.select().from(db_1.users).where((0, db_1.eq)(db_1.users.email, dto.email.toLowerCase())).limit(1);
            if (!user) {
                // TODO: force password reset on first login instead of a shared default password
                const passwordHash = await argon2.hash('Quravo@123!');
                const [newUser] = await db
                    .insert(db_1.users)
                    .values({
                    email: dto.email.toLowerCase(),
                    passwordHash,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    isEmailVerified: true,
                    status: 'active',
                })
                    .returning();
                user = newUser;
            }
            // Create Tenant
            const [tenant] = await db
                .insert(db_1.tenants)
                .values({
                name: dto.clinicName,
                slug: dto.clinicSlug.toLowerCase(),
                planTier: dto.planTier,
                status: 'active',
            })
                .returning();
            // Link user to tenant
            await db.insert(db_1.tenantMemberships).values({
                tenantId: tenant.id,
                userId: user.id,
                role: 'owner',
                status: 'active',
            });
            // Emit event
            await this.tenantService.emitTenantCreatedEvent({
                tenantId: tenant.id,
                name: tenant.name,
                slug: tenant.slug,
                planTier: tenant.planTier,
                ownerUserId: user.id,
                ownerEmail: user.email,
            });
            return {
                message: 'Tenant provisioned successfully.',
                tenant,
                user: { id: user.id, email: user.email },
            };
        }
        async listTenants() {
            const db = this.dbService.db;
            const list = await db.select().from(db_1.tenants).orderBy(db_1.tenants.createdAt);
            const result = [];
            for (const t of list) {
                const branches = await db
                    .select()
                    .from(db_1.clinicBranches)
                    .where((0, db_1.eq)(db_1.clinicBranches.tenantId, t.id));
                result.push({
                    id: t.id,
                    name: t.name,
                    subdomain: t.slug,
                    plan: t.planTier === 'starter' ? 'Starter' : t.planTier === 'growth' ? 'Growth' : 'ERP',
                    branches: branches.length,
                    status: t.status === 'active' ? 'Active' : 'Suspended',
                });
            }
            return result;
        }
        async getTenantConfig(tenantId) {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(tenantId)) {
                throw new common_1.BadRequestException('Invalid UUID format.');
            }
            const db = this.dbService.db;
            const [tenant] = await db.select().from(db_1.tenants).where((0, db_1.eq)(db_1.tenants.id, tenantId)).limit(1);
            if (!tenant) {
                throw new common_1.NotFoundException('Tenant not found.');
            }
            // Get or create config
            let [config] = await db.select().from(db_1.tenantConfigs).where((0, db_1.eq)(db_1.tenantConfigs.tenantId, tenantId)).limit(1);
            if (!config) {
                [config] = await db.insert(db_1.tenantConfigs).values({ tenantId }).returning();
            }
            // Get enabled modules
            const modules = await db.select().from(db_1.tenantModules).where((0, db_1.eq)(db_1.tenantModules.tenantId, tenantId));
            return { tenant, config, modules };
        }
        async updateTenantConfig(tenantId, dto) {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(tenantId)) {
                throw new common_1.BadRequestException('Invalid UUID format.');
            }
            const db = this.dbService.db;
            const [tenant] = await db.select().from(db_1.tenants).where((0, db_1.eq)(db_1.tenants.id, tenantId)).limit(1);
            if (!tenant) {
                throw new common_1.NotFoundException('Tenant not found.');
            }
            // Update tenant-level fields
            const tenantUpdates = {};
            if (dto.planTier)
                tenantUpdates.planTier = dto.planTier;
            if (dto.status)
                tenantUpdates.status = dto.status;
            if (dto.customDomain !== undefined)
                tenantUpdates.customDomain = dto.customDomain || null;
            tenantUpdates.updatedAt = new Date();
            if (Object.keys(tenantUpdates).length > 1) {
                await db.update(db_1.tenants).set(tenantUpdates).where((0, db_1.eq)(db_1.tenants.id, tenantId));
            }
            // Update config-level fields
            const configUpdates = {};
            if (dto.primaryColor)
                configUpdates.primaryColor = dto.primaryColor;
            if (dto.accentColor)
                configUpdates.accentColor = dto.accentColor;
            if (dto.timezone)
                configUpdates.timezone = dto.timezone;
            if (dto.currency)
                configUpdates.currency = dto.currency;
            if (dto.settings)
                configUpdates.settings = dto.settings;
            configUpdates.updatedAt = new Date();
            // Upsert config
            const [existingConfig] = await db.select().from(db_1.tenantConfigs).where((0, db_1.eq)(db_1.tenantConfigs.tenantId, tenantId)).limit(1);
            if (existingConfig) {
                await db.update(db_1.tenantConfigs).set(configUpdates).where((0, db_1.eq)(db_1.tenantConfigs.tenantId, tenantId));
            }
            else {
                await db.insert(db_1.tenantConfigs).values({ tenantId, ...configUpdates });
            }
            // Fetch updated state
            return this.getTenantConfig(tenantId);
        }
    };
    return SuperAdminService = _classThis;
})();
exports.SuperAdminService = SuperAdminService;
