"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const common_2 = require("@quravo/common");
let RbacService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RbacService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RbacService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        tenantCacheService;
        eventEmitter;
        constructor(dbService, tenantCacheService, eventEmitter) {
            this.dbService = dbService;
            this.tenantCacheService = tenantCacheService;
            this.eventEmitter = eventEmitter;
        }
        async seedInitialTenantModules(tenantId, planTier) {
            const db = this.dbService.db;
            const initialModuleKeys = (0, common_2.getInitialModulesForPlanTier)(planTier);
            for (const key of initialModuleKeys) {
                await db
                    .insert(db_1.tenantModules)
                    .values({ tenantId, moduleKey: key, enabled: true })
                    .onConflictDoNothing();
            }
            await this.tenantCacheService.invalidateTenantModules(tenantId);
        }
        async getTenantModules(tenantId) {
            return this.tenantCacheService.getEnabledModules(tenantId);
        }
        async toggleTenantModule(tenantId, moduleKey, enabled) {
            const db = this.dbService.db;
            const [existing] = await db
                .select()
                .from(db_1.tenantModules)
                .where((0, db_1.and)((0, db_1.eq)(db_1.tenantModules.tenantId, tenantId), (0, db_1.eq)(db_1.tenantModules.moduleKey, moduleKey)))
                .limit(1);
            if (existing) {
                await db
                    .update(db_1.tenantModules)
                    .set({ enabled, updatedAt: new Date() })
                    .where((0, db_1.eq)(db_1.tenantModules.id, existing.id));
            }
            else {
                await db.insert(db_1.tenantModules).values({ tenantId, moduleKey, enabled });
            }
            // Invalidate Redis cache
            await this.tenantCacheService.invalidateTenantModules(tenantId);
            // Emit ModuleToggledEvent
            this.eventEmitter.emit('tenant.module_toggled', new common_2.ModuleToggledEvent({ tenantId, moduleKey, enabled }));
            return { tenantId, moduleKey, enabled };
        }
        async getTenantRoles(tenantId) {
            const db = this.dbService.db;
            return db.select().from(db_1.roles).where((0, db_1.eq)(db_1.roles.tenantId, tenantId));
        }
        async createRole(tenantId, name, description, permissions) {
            const db = this.dbService.db;
            const [existing] = await db
                .select()
                .from(db_1.roles)
                .where((0, db_1.and)((0, db_1.eq)(db_1.roles.tenantId, tenantId), (0, db_1.eq)(db_1.roles.name, name)))
                .limit(1);
            if (existing) {
                throw new common_1.ConflictException(`Role '${name}' already exists in this clinic.`);
            }
            const [role] = await db
                .insert(db_1.roles)
                .values({ tenantId, name, description, permissions })
                .returning();
            await this.tenantCacheService.invalidateRolePermissions(tenantId, name);
            this.eventEmitter.emit('tenant.role_updated', new common_2.RoleUpdatedEvent({ tenantId, roleName: name, permissions }));
            return role;
        }
        async updateRolePermissions(tenantId, name, permissions) {
            const db = this.dbService.db;
            const [role] = await db
                .select()
                .from(db_1.roles)
                .where((0, db_1.and)((0, db_1.eq)(db_1.roles.tenantId, tenantId), (0, db_1.eq)(db_1.roles.name, name)))
                .limit(1);
            if (!role) {
                throw new common_1.NotFoundException(`Role '${name}' not found.`);
            }
            const [updated] = await db
                .update(db_1.roles)
                .set({ permissions, updatedAt: new Date() })
                .where((0, db_1.eq)(db_1.roles.id, role.id))
                .returning();
            // Invalidate Redis cache
            await this.tenantCacheService.invalidateRolePermissions(tenantId, name);
            // Emit RoleUpdatedEvent
            this.eventEmitter.emit('tenant.role_updated', new common_2.RoleUpdatedEvent({ tenantId, roleName: name, permissions }));
            return updated;
        }
    };
    return RbacService = _classThis;
})();
exports.RbacService = RbacService;
