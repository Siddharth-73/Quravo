"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERP_MODULES = exports.GROWTH_MODULES = exports.STARTER_MODULES = exports.MODULE_KEYS = void 0;
exports.getInitialModulesForPlanTier = getInitialModulesForPlanTier;
exports.MODULE_KEYS = {
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
};
exports.STARTER_MODULES = [
    exports.MODULE_KEYS.APPOINTMENTS,
    exports.MODULE_KEYS.PATIENTS,
    exports.MODULE_KEYS.EMR,
    exports.MODULE_KEYS.PRESCRIPTIONS,
    exports.MODULE_KEYS.BILLING,
    exports.MODULE_KEYS.NOTIFICATIONS,
];
exports.GROWTH_MODULES = [
    ...exports.STARTER_MODULES,
    exports.MODULE_KEYS.ANALYTICS,
    exports.MODULE_KEYS.MULTI_BRANCH,
    exports.MODULE_KEYS.INVENTORY,
    exports.MODULE_KEYS.ADVANCED_REPORTS,
    exports.MODULE_KEYS.AI_FEATURES,
];
exports.ERP_MODULES = Object.values(exports.MODULE_KEYS);
function getInitialModulesForPlanTier(planTier) {
    switch (planTier.toLowerCase()) {
        case 'growth':
            return exports.GROWTH_MODULES;
        case 'erp':
            return exports.ERP_MODULES;
        case 'starter':
        default:
            return exports.STARTER_MODULES;
    }
}
