"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const common_1 = require("@quravo/common");
(0, vitest_1.describe)('PermissionsGuard Wildcard & Authorization Evaluator (Phase 4 Unit Test)', () => {
    (0, vitest_1.it)('should grant access when superadmin wildcard "*" is present', () => {
        const granted = ['*'];
        (0, vitest_1.expect)((0, common_1.hasPermission)(granted, 'patients:read')).toBe(true);
        (0, vitest_1.expect)((0, common_1.hasPermission)(granted, 'billing:manage')).toBe(true);
    });
    (0, vitest_1.it)('should grant access when resource-level wildcard "resource:*" is present', () => {
        const granted = ['patients:*', 'appointments:read'];
        (0, vitest_1.expect)((0, common_1.hasPermission)(granted, 'patients:read')).toBe(true);
        (0, vitest_1.expect)((0, common_1.hasPermission)(granted, 'patients:write')).toBe(true);
        (0, vitest_1.expect)((0, common_1.hasPermission)(granted, 'patients:delete')).toBe(true);
        (0, vitest_1.expect)((0, common_1.hasPermission)(granted, 'appointments:read')).toBe(true);
        (0, vitest_1.expect)((0, common_1.hasPermission)(granted, 'appointments:write')).toBe(false);
    });
    (0, vitest_1.it)('should reject access when required permission is missing', () => {
        const granted = ['patients:read', 'vitals:write'];
        (0, vitest_1.expect)((0, common_1.hasPermission)(granted, 'patients:delete')).toBe(false);
        (0, vitest_1.expect)((0, common_1.hasPermission)(granted, 'billing:manage')).toBe(false);
    });
    (0, vitest_1.it)('should verify all required permissions using hasAllPermissions', () => {
        const granted = ['patients:*', 'appointments:*'];
        (0, vitest_1.expect)((0, common_1.hasAllPermissions)(granted, ['patients:read', 'appointments:write'])).toBe(true);
        (0, vitest_1.expect)((0, common_1.hasAllPermissions)(granted, ['patients:read', 'billing:manage'])).toBe(false);
    });
});
