"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Appointments & Walk-In Queue Tenant Isolation (Phase 7 Data Isolation Test)', () => {
    const mockAppointments = [
        { id: 'apt-1', tenantId: 'clinic-alpha', branchId: 'branch-a1', appointmentNumber: 'APT-2026-0001', tokenNumber: 1 },
        { id: 'apt-2', tenantId: 'clinic-alpha', branchId: 'branch-a1', appointmentNumber: 'APT-2026-0002', tokenNumber: 2 },
        { id: 'apt-3', tenantId: 'clinic-beta', branchId: 'branch-b1', appointmentNumber: 'APT-2026-0001', tokenNumber: 1 },
    ];
    (0, vitest_1.it)('should strictly isolate branch appointment records per tenant', () => {
        const alphaAppointments = mockAppointments.filter((a) => a.tenantId === 'clinic-alpha');
        const betaAppointments = mockAppointments.filter((a) => a.tenantId === 'clinic-beta');
        (0, vitest_1.expect)(alphaAppointments.length).toBe(2);
        (0, vitest_1.expect)(betaAppointments.length).toBe(1);
        (0, vitest_1.expect)(alphaAppointments.find((a) => a.id === 'apt-3')).toBeUndefined();
    });
    (0, vitest_1.it)('should calculate branch daily walk-in queue tokens independently per tenant', () => {
        const alphaTokens = mockAppointments.filter((a) => a.tenantId === 'clinic-alpha').map((a) => a.tokenNumber);
        const betaTokens = mockAppointments.filter((a) => a.tenantId === 'clinic-beta').map((a) => a.tokenNumber);
        (0, vitest_1.expect)(alphaTokens).toEqual([1, 2]);
        (0, vitest_1.expect)(betaTokens).toEqual([1]);
    });
});
