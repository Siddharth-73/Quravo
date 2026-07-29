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
exports.MockBillingProvider = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let MockBillingProvider = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MockBillingProvider = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MockBillingProvider = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        logger = new common_1.Logger(MockBillingProvider.name);
        constructor(configService) {
            this.configService = configService;
        }
        async createCheckoutSession(tenantId, planTier, returnUrl) {
            const sessionId = `mock_sess_${(0, crypto_1.randomUUID)()}`;
            const checkoutUrl = `${returnUrl}?session_id=${sessionId}&plan=${planTier}&status=success`;
            this.logger.log(`💳 Created Mock Checkout Session for tenant ${tenantId} [Plan: ${planTier}]`);
            return {
                sessionId,
                checkoutUrl,
                provider: 'mock',
            };
        }
        async cancelSubscription(subscriptionId) {
            this.logger.log(`💳 Mock Cancelled subscription ${subscriptionId}`);
            return true;
        }
        async changePlan(subscriptionId, newPlanTier) {
            this.logger.log(`💳 Mock Changed subscription ${subscriptionId} to plan ${newPlanTier}`);
            return true;
        }
        // Placeholder shared-secret comparison until a real billing provider (e.g. Stripe/Razorpay)
        // replaces MockBillingProvider with proper HMAC-based signature verification.
        verifyWebhook(signature, payload) {
            const configuredSecret = this.configService.get('SUBSCRIPTION_WEBHOOK_SECRET');
            if (!configuredSecret) {
                this.logger.warn('SUBSCRIPTION_WEBHOOK_SECRET is not configured; rejecting all webhook requests.');
                return false;
            }
            return signature === configuredSecret;
        }
    };
    return MockBillingProvider = _classThis;
})();
exports.MockBillingProvider = MockBillingProvider;
