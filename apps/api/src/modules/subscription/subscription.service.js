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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const common_2 = require("@quravo/common");
let SubscriptionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SubscriptionService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SubscriptionService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dbService;
        billingProvider;
        eventEmitter;
        constructor(dbService, billingProvider, eventEmitter) {
            this.dbService = dbService;
            this.billingProvider = billingProvider;
            this.eventEmitter = eventEmitter;
        }
        async seedTrialSubscription(tenantId, planTier = 'starter') {
            const db = this.dbService.db;
            const currentPeriodStart = new Date();
            const currentPeriodEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days trial
            const [subscription] = await db
                .insert(db_1.subscriptions)
                .values({
                tenantId,
                planTier: planTier,
                status: 'trialing',
                billingProvider: 'mock',
                currentPeriodStart,
                currentPeriodEnd,
            })
                .returning();
            return subscription;
        }
        async getSubscription(tenantId) {
            const db = this.dbService.db;
            let [subscription] = await db.select().from(db_1.subscriptions).where((0, db_1.eq)(db_1.subscriptions.tenantId, tenantId)).limit(1);
            if (!subscription) {
                subscription = await this.seedTrialSubscription(tenantId, 'starter');
            }
            return subscription;
        }
        async changePlan(tenantId, newPlanTier) {
            const db = this.dbService.db;
            let subscription = await this.getSubscription(tenantId);
            const previousPlanTier = subscription.planTier;
            if (previousPlanTier === newPlanTier) {
                return subscription;
            }
            const isUpgrade = this.isTierUpgrade(previousPlanTier, newPlanTier);
            const [updated] = await db
                .update(db_1.subscriptions)
                .set({
                planTier: newPlanTier,
                status: 'active',
                updatedAt: new Date(),
            })
                .where((0, db_1.eq)(db_1.subscriptions.id, subscription.id))
                .returning();
            const eventPayload = {
                tenantId,
                previousPlanTier,
                newPlanTier,
                status: updated.status,
                billingProvider: updated.billingProvider,
            };
            if (isUpgrade) {
                this.eventEmitter.emit('subscription.upgraded', new common_2.SubscriptionUpgradedEvent(eventPayload));
            }
            else {
                this.eventEmitter.emit('subscription.downgraded', new common_2.SubscriptionDowngradedEvent(eventPayload));
            }
            return updated;
        }
        isTierUpgrade(currentTier, newTier) {
            const ranks = { starter: 1, growth: 2, erp: 3 };
            return (ranks[newTier.toLowerCase()] || 1) > (ranks[currentTier.toLowerCase()] || 1);
        }
        // --- FEATURE FLAGS ---
        async getFeatureFlags(tenantId) {
            const db = this.dbService.db;
            return db.select().from(db_1.featureFlags).where((0, db_1.eq)(db_1.featureFlags.tenantId, tenantId));
        }
        async toggleFeatureFlag(tenantId, flagKey, enabled) {
            const db = this.dbService.db;
            const [existing] = await db
                .select()
                .from(db_1.featureFlags)
                .where((0, db_1.and)((0, db_1.eq)(db_1.featureFlags.tenantId, tenantId), (0, db_1.eq)(db_1.featureFlags.flagKey, flagKey)))
                .limit(1);
            if (existing) {
                const [updated] = await db
                    .update(db_1.featureFlags)
                    .set({ enabled, updatedAt: new Date() })
                    .where((0, db_1.eq)(db_1.featureFlags.id, existing.id))
                    .returning();
                return updated;
            }
            const [created] = await db
                .insert(db_1.featureFlags)
                .values({ tenantId, flagKey, enabled, percentageRollout: 100 })
                .returning();
            return created;
        }
        // --- WEBHOOK HANDLING ---
        async handleWebhook(signature, payload) {
            if (!signature) {
                throw new common_1.BadRequestException('Missing webhook signature');
            }
            const isValid = this.billingProvider.verifyWebhook(signature, payload);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid webhook signature');
            }
            // Process webhook event type
            if (payload.type === 'customer.subscription.updated') {
                const tenantId = payload.data?.object?.metadata?.tenantId;
                const newPlan = payload.data?.object?.metadata?.planTier;
                if (tenantId && newPlan) {
                    await this.changePlan(tenantId, newPlan);
                }
            }
            return { received: true };
        }
    };
    return SubscriptionService = _classThis;
})();
exports.SubscriptionService = SubscriptionService;
