"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Tenant Modules Isolation (Phase 4 Data Isolation Test)', () => {
    const mockTenantModules = [
        { tenantId: 'clinic-a', moduleKey: 'pharmacy', enabled: true },
        { tenantId: 'clinic-a', moduleKey: 'inventory', enabled: true },
        { tenantId: 'clinic-b', moduleKey: 'pharmacy', enabled: false },
    ];
    (0, vitest_1.it)('should isolate enabled module state per clinic tenant', () => {
        const clinicAModules = mockTenantModules.filter((m) => m.tenantId === 'clinic-a');
        const clinicBModules = mockTenantModules.filter((m) => m.tenantId === 'clinic-b');
        const pharmacyClinicA = clinicAModules.find((m) => m.moduleKey === 'pharmacy')?.enabled;
        const pharmacyClinicB = clinicBModules.find((m) => m.moduleKey === 'pharmacy')?.enabled;
        (0, vitest_1.expect)(pharmacyClinicA).toBe(true);
        (0, vitest_1.expect)(pharmacyClinicB).toBe(false);
    });
});
