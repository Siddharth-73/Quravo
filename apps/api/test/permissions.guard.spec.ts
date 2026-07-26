import { describe, it, expect } from 'vitest';
import { hasPermission, hasAllPermissions } from '@quravo/common';

describe('PermissionsGuard Wildcard & Authorization Evaluator (Phase 4 Unit Test)', () => {
  it('should grant access when superadmin wildcard "*" is present', () => {
    const granted = ['*'];
    expect(hasPermission(granted, 'patients:read')).toBe(true);
    expect(hasPermission(granted, 'billing:manage')).toBe(true);
  });

  it('should grant access when resource-level wildcard "resource:*" is present', () => {
    const granted = ['patients:*', 'appointments:read'];

    expect(hasPermission(granted, 'patients:read')).toBe(true);
    expect(hasPermission(granted, 'patients:write')).toBe(true);
    expect(hasPermission(granted, 'patients:delete')).toBe(true);

    expect(hasPermission(granted, 'appointments:read')).toBe(true);
    expect(hasPermission(granted, 'appointments:write')).toBe(false);
  });

  it('should reject access when required permission is missing', () => {
    const granted = ['patients:read', 'vitals:write'];

    expect(hasPermission(granted, 'patients:delete')).toBe(false);
    expect(hasPermission(granted, 'billing:manage')).toBe(false);
  });

  it('should verify all required permissions using hasAllPermissions', () => {
    const granted = ['patients:*', 'appointments:*'];

    expect(hasAllPermissions(granted, ['patients:read', 'appointments:write'])).toBe(true);
    expect(hasAllPermissions(granted, ['patients:read', 'billing:manage'])).toBe(false);
  });
});
