"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const invoices_service_1 = require("./invoices.service");
(0, vitest_1.describe)('InvoicesService', () => {
    let service;
    let mockEventEmitter;
    (0, vitest_1.beforeEach)(() => {
        mockEventEmitter = { emit: vitest_1.vi.fn() };
        service = new invoices_service_1.InvoicesService(mockEventEmitter);
    });
    (0, vitest_1.it)('should be defined', () => {
        (0, vitest_1.expect)(service).toBeDefined();
    });
});
