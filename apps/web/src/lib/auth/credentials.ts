import { PermissionCode } from '@/providers/PermissionProvider';
import { TenantFeaturesMap } from '@/providers/FeatureFlagProvider';

export interface CredentialUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleTitle: string;
  roleKey: 'super_admin' | 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'patient' | 'admin';
  targetDashboard: string;
  permissions: PermissionCode[];
  features: TenantFeaturesMap;
  isImmutable?: boolean;
}

const fullFeatures: TenantFeaturesMap = {
  appointments: true,
  patients: true,
  billing: true,
  ehr: true,
  pharmacy: true,
  laboratory: true,
  inventory: true,
  hr: true,
  bedManagement: true,
  telemedicine: true,
  aiScribe: true,
  marketing: true,
  insurance: true,
};

export const DEMO_CREDENTIALS: CredentialUser[] = [
  {
    email: 'admin@quravo.com',
    password: 'superadmin123',
    firstName: 'Root',
    lastName: 'SuperAdmin',
    roleTitle: 'Platform Super-Admin',
    roleKey: 'super_admin',
    targetDashboard: '/super-admin',
    permissions: ['admin:access', 'patients:read', 'patients:write', 'appointments:read', 'emr:read', 'billing:read', 'settings:read', 'settings:write'],
    features: fullFeatures,
    isImmutable: true,
  },
  {
    email: 'doctor@clinic.com',
    password: 'doctor123',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    roleTitle: 'Lead Physician',
    roleKey: 'doctor',
    targetDashboard: '/dashboards/doctor',
    permissions: ['patients:read', 'patients:write', 'appointments:read', 'emr:read', 'emr:write'],
    features: { ...fullFeatures, pharmacy: false, laboratory: false, hr: false, bedManagement: false },
  },
  {
    email: 'nurse@clinic.com',
    password: 'nurse123',
    firstName: 'Emily',
    lastName: 'Blunt',
    roleTitle: 'Triage Head Nurse',
    roleKey: 'nurse',
    targetDashboard: '/dashboards/nurse',
    permissions: ['patients:read', 'patients:write', 'appointments:read', 'emr:read'],
    features: { ...fullFeatures, billing: false, pharmacy: false, hr: false },
  },
  {
    email: 'receptionist@clinic.com',
    password: 'receptionist123',
    firstName: 'Jessica',
    lastName: 'Taylor',
    roleTitle: 'Front Desk Receptionist',
    roleKey: 'receptionist',
    targetDashboard: '/dashboards/receptionist',
    permissions: ['patients:read', 'patients:write', 'appointments:read', 'appointments:write', 'billing:read', 'billing:write'],
    features: { ...fullFeatures, ehr: false, pharmacy: false, laboratory: false, inventory: false, hr: false, bedManagement: false },
  },
  {
    email: 'pharmacist@clinic.com',
    password: 'pharmacist123',
    firstName: 'Michael',
    lastName: 'Scott',
    roleTitle: 'Chief Pharmacist',
    roleKey: 'pharmacist',
    targetDashboard: '/dashboards/pharmacist',
    permissions: ['patients:read', 'billing:read'],
    features: { ...fullFeatures, appointments: false, ehr: false, laboratory: false, hr: false, bedManagement: false },
  },
  {
    email: 'patient@clinic.com',
    password: 'patient123',
    firstName: 'Eleanor',
    lastName: 'Vance',
    roleTitle: 'Patient User',
    roleKey: 'patient',
    targetDashboard: '/dashboards/patient',
    permissions: ['patients:read', 'appointments:read'],
    features: { ...fullFeatures, pharmacy: false, laboratory: false, inventory: false, hr: false, bedManagement: false },
  },
  {
    email: 'owner@clinic.com',
    password: 'owner123',
    firstName: 'Alexander',
    lastName: 'Vance',
    roleTitle: 'Clinic Owner & Director',
    roleKey: 'admin',
    targetDashboard: '/dashboards/admin',
    permissions: ['admin:access', 'patients:read', 'patients:write', 'appointments:read', 'emr:read', 'billing:read', 'settings:read', 'settings:write'],
    features: fullFeatures,
  },
];
