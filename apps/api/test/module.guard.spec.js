"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const common_1 = require("@quravo/common");
(0, vitest_1.describe)('ModuleGuard & Plan Tier Enablement (Phase 4 Unit Test)', () => {
    (0, vitest_1.it)('should verify starter tier includes core starter modules', () => {
        (0, vitest_1.expect)(common_1.STARTER_MODULES).toContain(common_1.MODULE_KEYS.APPOINTMENTS);
        (0, vitest_1.expect)(common_1.STARTER_MODULES).toContain(common_1.MODULE_KEYS.PATIENTS);
        (0, vitest_1.expect)(common_1.STARTER_MODULES).toContain(common_1.MODULE_KEYS.EMR);
        (0, vitest_1.expect)(common_1.STARTER_MODULES).toContain(common_1.MODULE_KEYS.BILLING);
        (0, vitest_1.expect)(common_1.STARTER_MODULES).not.toContain(common_1.MODULE_KEYS.PHARMACY);
    });
    (0, vitest_1.it)('should verify growth tier includes starter plus inventory and analytics', () => {
        (0, vitest_1.expect)(common_1.GROWTH_MODULES).toContain(common_1.MODULE_KEYS.ANALYTICS);
        (0, vitest_1.expect)(common_1.GROWTH_MODULES).toContain(common_1.MODULE_KEYS.INVENTORY);
        (0, vitest_1.expect)(common_1.GROWTH_MODULES).not.toContain(common_1.MODULE_KEYS.PHARMACY);
    });
    (0, vitest_1.it)('should verify ERP tier includes all platform modules', () => {
        (0, vitest_1.expect)(common_1.ERP_MODULES).toContain(common_1.MODULE_KEYS.PHARMACY);
        (0, vitest_1.expect)(common_1.ERP_MODULES).toContain(common_1.MODULE_KEYS.LABORATORY);
        (0, vitest_1.expect)(common_1.ERP_MODULES).toContain(common_1.MODULE_KEYS.PROCUREMENT);
    });
});
