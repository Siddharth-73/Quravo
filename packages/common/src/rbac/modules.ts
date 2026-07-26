export const MODULE_KEYS = {
  APPOINTMENTS: 'appointments',
  PATIENTS: 'patients',
  EMR: 'emr',
  PRESCRIPTIONS: 'prescriptions',
  BILLING: 'billing',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  MULTI_BRANCH: 'multi_branch',
  INVENTORY: 'inventory',
  ADVANCED_REPORTS: 'advanced_reports',
  AI_FEATURES: 'ai_features',
  PHARMACY: 'pharmacy',
  LABORATORY: 'laboratory',
  PROCUREMENT: 'procurement',
  HR: 'hr',
  PAYROLL: 'payroll',
  INSURANCE: 'insurance',
  BED_MANAGEMENT: 'bed_management',
  DEPARTMENT_MANAGEMENT: 'department_management',
  HOSPITAL_ADMIN: 'hospital_admin',
} as const;

export type ModuleKey = (typeof MODULE_KEYS)[keyof typeof MODULE_KEYS];

export const STARTER_MODULES: ModuleKey[] = [
  MODULE_KEYS.APPOINTMENTS,
  MODULE_KEYS.PATIENTS,
  MODULE_KEYS.EMR,
  MODULE_KEYS.PRESCRIPTIONS,
  MODULE_KEYS.BILLING,
  MODULE_KEYS.NOTIFICATIONS,
];

export const GROWTH_MODULES: ModuleKey[] = [
  ...STARTER_MODULES,
  MODULE_KEYS.ANALYTICS,
  MODULE_KEYS.MULTI_BRANCH,
  MODULE_KEYS.INVENTORY,
  MODULE_KEYS.ADVANCED_REPORTS,
  MODULE_KEYS.AI_FEATURES,
];

export const ERP_MODULES: ModuleKey[] = Object.values(MODULE_KEYS);

export function getInitialModulesForPlanTier(planTier: string): ModuleKey[] {
  switch (planTier.toLowerCase()) {
    case 'growth':
      return GROWTH_MODULES;
    case 'erp':
      return ERP_MODULES;
    case 'starter':
    default:
      return STARTER_MODULES;
  }
}
