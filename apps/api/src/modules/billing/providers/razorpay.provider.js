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
exports.RazorpayProvider = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
/**
 * Thin wrapper around the Razorpay REST API (Orders API + signature verification).
 *
 * We deliberately use `fetch` + Basic Auth instead of the `razorpay` npm SDK to
 * match the existing pattern in this codebase for other third-party HTTP calls
 * (see TurnstileGuard, worker's EmailProvider) and avoid an extra dependency for
 * what is a very small surface area (create order + verify signature).
 */
let RazorpayProvider = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RazorpayProvider = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RazorpayProvider = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        logger = new common_1.Logger(RazorpayProvider.name);
        baseUrl = 'https://api.razorpay.com/v1';
        constructor(configService) {
            this.configService = configService;
        }
        getCredentials() {
            const keyId = this.configService.get('RAZORPAY_KEY_ID');
            const keySecret = this.configService.get('RAZORPAY_KEY_SECRET');
            return { keyId, keySecret };
        }
        isConfigured() {
            const { keyId, keySecret } = this.getCredentials();
            return Boolean(keyId && keySecret);
        }
        getPublicKeyId() {
            return this.getCredentials().keyId;
        }
        /**
         * Creates a Razorpay Order. Amount must be in the smallest currency unit
         * (paise for INR, i.e. amount * 100).
         */
        async createOrder(params) {
            const { keyId, keySecret } = this.getCredentials();
            if (!keyId || !keySecret) {
                throw new common_1.InternalServerErrorException('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
            }
            const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
            const response = await fetch(`${this.baseUrl}/orders`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${basicAuth}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: params.amountInPaise,
                    currency: params.currency,
                    receipt: params.receipt,
                    notes: params.notes || {},
                }),
            });
            if (!response.ok) {
                const errText = await response.text();
                this.logger.error(`Razorpay order creation failed: ${response.status} ${errText}`);
                throw new common_1.InternalServerErrorException('Failed to create Razorpay order.');
            }
            return (await response.json());
        }
        /**
         * Verifies the signature Razorpay's Checkout.js returns to the client after a
         * successful payment: HMAC_SHA256(order_id + "|" + payment_id, key_secret).
         * This proves the payment_id/order_id pair was genuinely signed by Razorpay,
         * but does NOT by itself prove it belongs to a given invoice/tenant — callers
         * must additionally check the order_id against their own stored pending payment.
         */
        verifyPaymentSignature(orderId, paymentId, signature) {
            const { keySecret } = this.getCredentials();
            if (!keySecret)
                return false;
            const expected = (0, crypto_1.createHmac)('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');
            return expected === signature;
        }
        /**
         * Verifies a Razorpay webhook payload signature using the separate webhook
         * secret configured in the Razorpay dashboard (Settings > Webhooks).
         * `rawBody` must be the exact, unparsed request body bytes/string.
         */
        verifyWebhookSignature(rawBody, signature) {
            const webhookSecret = this.configService.get('RAZORPAY_WEBHOOK_SECRET');
            if (!webhookSecret) {
                this.logger.warn('RAZORPAY_WEBHOOK_SECRET not configured — rejecting webhook.');
                return false;
            }
            const expected = (0, crypto_1.createHmac)('sha256', webhookSecret).update(rawBody).digest('hex');
            return expected === signature;
        }
    };
    return RazorpayProvider = _classThis;
})();
exports.RazorpayProvider = RazorpayProvider;
