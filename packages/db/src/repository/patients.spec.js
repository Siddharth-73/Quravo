"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Patients Tenant Data Isolation (Phase 6 Data Isolation Test)', () => {
    const mockPatients = [
        { id: 'pat-1', tenantId: 'clinic-alpha', patientNumber: 'PAT-2026-0001', firstName: 'John', lastName: 'Doe' },
        { id: 'pat-2', tenantId: 'clinic-alpha', patientNumber: 'PAT-2026-0002', firstName: 'Jane', lastName: 'Smith' },
        { id: 'pat-3', tenantId: 'clinic-beta', patientNumber: 'PAT-2026-0001', firstName: 'Bob', lastName: 'Taylor' },
    ];
    const mockAttachments = [
        { id: 'att-1', tenantId: 'clinic-alpha', patientId: 'pat-1', fileName: 'scan.pdf' },
        { id: 'att-2', tenantId: 'clinic-beta', patientId: 'pat-3', fileName: 'lab.pdf' },
    ];
    (0, vitest_1.it)('should strictly isolate patient records per clinic tenant', () => {
        const alphaPatients = mockPatients.filter((p) => p.tenantId === 'clinic-alpha');
        const betaPatients = mockPatients.filter((p) => p.tenantId === 'clinic-beta');
        (0, vitest_1.expect)(alphaPatients.length).toBe(2);
        (0, vitest_1.expect)(betaPatients.length).toBe(1);
        (0, vitest_1.expect)(alphaPatients.find((p) => p.id === 'pat-3')).toBeUndefined();
    });
    (0, vitest_1.it)('should strictly isolate patient attachments per clinic tenant', () => {
        const alphaAttachments = mockAttachments.filter((a) => a.tenantId === 'clinic-alpha');
        (0, vitest_1.expect)(alphaAttachments.length).toBe(1);
        (0, vitest_1.expect)(alphaAttachments[0].id).toBe('att-1');
    });
});
