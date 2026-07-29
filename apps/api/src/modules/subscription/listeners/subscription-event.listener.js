"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionEventListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const common_2 = require("@quravo/common");
const db_1 = require("@quravo/db");
let SubscriptionEventListener = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _handleSubscriptionTierChanged_decorators;
    var SubscriptionEventListener = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _handleSubscriptionTierChanged_decorators = [(0, event_emitter_1.OnEvent)('subscription.upgraded'), (0, event_emitter_1.OnEvent)('subscription.downgraded')];
            __esDecorate(this, null, _handleSubscriptionTierChanged_decorators, { kind: "method", name: "handleSubscriptionTierChanged", static: false, private: false, access: { has: obj => "handleSubscriptionTierChanged" in obj, get: obj => obj.handleSubscriptionTierChanged }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SubscriptionEventListener = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService = __runInitializers(this, _instanceExtraInitializers);
        tenantCacheService;
        logger = new common_1.Logger(SubscriptionEventListener.name);
        constructor(dbService, tenantCacheService) {
            this.dbService = dbService;
            this.tenantCacheService = tenantCacheService;
        }
        async handleSubscriptionTierChanged(event) {
            const { tenantId, newPlanTier } = event.data;
            this.logger.log(`⚡ Syncing tenant_modules for clinic ${tenantId} [New Tier: ${newPlanTier}]`);
            const db = this.dbService.db;
            // Update tenant planTier in tenants table
            await db.update(db_1.tenants).set({ planTier: newPlanTier }).where((0, db_1.eq)(db_1.tenants.id, tenantId));
            // Get module keys for new plan tier
            const targetModuleKeys = (0, common_2.getInitialModulesForPlanTier)(newPlanTier);
            // Upsert module enablement state
            for (const key of targetModuleKeys) {
                await db
                    .insert(db_1.tenantModules)
                    .values({ tenantId, moduleKey: key, enabled: true })
                    .onConflictDoUpdate({
                    target: [db_1.tenantModules.tenantId, db_1.tenantModules.moduleKey],
                    set: { enabled: true, updatedAt: new Date() },
                });
            }
            // Invalidate Redis cache
            await this.tenantCacheService.invalidateTenantModules(tenantId);
            this.logger.log(`✅ tenant_modules synchronized and Redis cache purged for tenant ${tenantId}`);
        }
    };
    return SubscriptionEventListener = _classThis;
})();
exports.SubscriptionEventListener = SubscriptionEventListener;
