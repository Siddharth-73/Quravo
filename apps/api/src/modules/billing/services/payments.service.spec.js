"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const payments_service_1 = require("./payments.service");
(0, vitest_1.describe)('PaymentsService', () => {
    let service;
    let mockEventEmitter;
    let mockRazorpayProvider;
    (0, vitest_1.beforeEach)(() => {
        mockEventEmitter = { emit: vitest_1.vi.fn() };
        mockRazorpayProvider = {
            isConfigured: vitest_1.vi.fn().mockReturnValue(false),
            getPublicKeyId: vitest_1.vi.fn().mockReturnValue(undefined),
            createOrder: vitest_1.vi.fn(),
            verifyPaymentSignature: vitest_1.vi.fn(),
            verifyWebhookSignature: vitest_1.vi.fn(),
        };
        service = new payments_service_1.PaymentsService(mockEventEmitter, mockRazorpayProvider);
    });
    (0, vitest_1.it)('should be defined', () => {
        (0, vitest_1.expect)(service).toBeDefined();
    });
});
