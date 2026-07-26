import { describe, it, expect } from 'vitest';
import { STARTER_MODULES, GROWTH_MODULES, ERP_MODULES, MODULE_KEYS } from '@quravo/common';

describe('ModuleGuard & Plan Tier Enablement (Phase 4 Unit Test)', () => {
  it('should verify starter tier includes core starter modules', () => {
    expect(STARTER_MODULES).toContain(MODULE_KEYS.APPOINTMENTS);
    expect(STARTER_MODULES).toContain(MODULE_KEYS.PATIENTS);
    expect(STARTER_MODULES).toContain(MODULE_KEYS.EMR);
    expect(STARTER_MODULES).toContain(MODULE_KEYS.BILLING);
    expect(STARTER_MODULES).not.toContain(MODULE_KEYS.PHARMACY);
  });

  it('should verify growth tier includes starter plus inventory and analytics', () => {
    expect(GROWTH_MODULES).toContain(MODULE_KEYS.ANALYTICS);
    expect(GROWTH_MODULES).toContain(MODULE_KEYS.INVENTORY);
    expect(GROWTH_MODULES).not.toContain(MODULE_KEYS.PHARMACY);
  });

  it('should verify ERP tier includes all platform modules', () => {
    expect(ERP_MODULES).toContain(MODULE_KEYS.PHARMACY);
    expect(ERP_MODULES).toContain(MODULE_KEYS.LABORATORY);
    expect(ERP_MODULES).toContain(MODULE_KEYS.PROCUREMENT);
  });
});
