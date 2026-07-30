import { NavGroup, SidebarNavigation } from './sidebar-schema';
import { TenantFeaturesMap } from '@/providers/FeatureFlagProvider';
import { PermissionCode } from '@/providers/PermissionProvider';

export interface GetSidebarOptions {
  features?: TenantFeaturesMap;
  permissions?: PermissionCode[];
  role?: string;
}

export function getSidebar({ features = {} as TenantFeaturesMap, permissions = [], role }: GetSidebarOptions = {}): SidebarNavigation {
  const r = (role || '').toLowerCase();

  // 1. Super Admin Sidebar
  if (r.includes('super_admin') || r.includes('super')) {
    return {
      groups: [
        {
          id: 'superadmin',
          title: 'Platform Super-Admin',
          items: [
            { id: 'sa-root', title: 'Root Platform Console', href: '/super-admin', iconName: 'Shield' },
            { id: 'sa-tenants', title: 'Tenants & Medical Centers', href: '/super-admin/tenants', iconName: 'Building2' },
            { id: 'sa-users', title: 'Platform Directory & Users', href: '/super-admin/users', iconName: 'Users' },
            { id: 'sa-audit', title: 'Security Audit Logs', href: '/super-admin/audit-logs', iconName: 'ShieldAlert' },
          ],
        },
      ],
    };
  }

  // 2. Clinic Owner & Admin Executive Sidebar (STRICT - Only if owner or admin)
  if (r.includes('owner') || r.includes('admin')) {
    return {
      groups: [
        {
          id: 'executive',
          title: 'Clinical Management',
          items: [
            { id: 'admin-dash', title: 'Owner Executive Workspace', href: '/dashboards/admin', iconName: 'Building2' },
            { id: 'dashboard', title: 'Clinical Command Center', href: '/dashboard', iconName: 'LayoutDashboard' },
            { id: 'appointments', title: 'Appointments & Scheduling', href: '/appointments', iconName: 'Calendar' },
            { id: 'patients', title: 'Patients Directory & EHR', href: '/patients', iconName: 'Users' },
            { id: 'encounters', title: 'SOAP Encounters', href: '/encounters', iconName: 'Stethoscope' },
          ],
        },
        {
          id: 'operations',
          title: 'Clinic Operations',
          items: [
            { id: 'billing', title: 'Billing & Razorpay POS', href: '/billing', iconName: 'CreditCard' },
            { id: 'inventory', title: 'Inventory & Stock', href: '/inventory', iconName: 'Package' },
            { id: 'pharmacy', title: 'Pharmacy', href: '/pharmacy', iconName: 'Pill' },
            { id: 'laboratory', title: 'Laboratory', href: '/laboratory', iconName: 'TestTube' },
          ],
        },
        {
          id: 'administration',
          title: 'Clinic Administration',
          items: [
            { id: 'profile', title: 'My User Profile', href: '/profile', iconName: 'User' },
            { id: 'staff', title: 'Staff Directory & Roles', href: '/staff', iconName: 'UserCheck' },
            { id: 'approvals', title: 'Staff Join Approvals', href: '/staff/approvals', iconName: 'UserCheck' },
            { id: 'roles', title: 'RBAC Roles & Scopes', href: '/settings/roles', iconName: 'ShieldCheck' },
            { id: 'branches', title: 'Branch Locations', href: '/settings/branches', iconName: 'Building2' },
            { id: 'audit-logs', title: 'Security Audit Stream', href: '/settings/audit-logs', iconName: 'ShieldAlert' },
            { id: 'settings', title: 'Clinic Profile & Branding', href: '/settings', iconName: 'Settings' },
          ],
        },
      ],
    };
  }

  // 3. Receptionist Sidebar (Check before generic staff)
  if (r.includes('reception') || r.includes('front desk')) {
    return {
      groups: [
        {
          id: 'front-desk',
          title: 'Front Desk Operations',
          items: [
            { id: 'reception-dash', title: 'Front Desk Center', href: '/dashboards/receptionist', iconName: 'LayoutDashboard' },
            { id: 'appointments', title: 'Book & Queue Slots', href: '/appointments', iconName: 'Calendar' },
            { id: 'patients', title: 'Patient Registration & EHR', href: '/patients', iconName: 'Users' },
            { id: 'billing', title: 'Billing & POS Cashier', href: '/billing', iconName: 'CreditCard' },
          ],
        },
        {
          id: 'personal',
          title: 'Account Settings',
          items: [
            { id: 'profile', title: 'My User Profile', href: '/profile', iconName: 'User' },
          ],
        },
      ],
    };
  }

  // 4. Doctor Sidebar
  if (r.includes('doctor') || r.includes('physician') || r.includes('dr.')) {
    return {
      groups: [
        {
          id: 'clinical',
          title: 'Doctor Clinical Suite',
          items: [
            { id: 'doctor-dash', title: 'Physician Command Center', href: '/dashboards/doctor', iconName: 'Stethoscope' },
            { id: 'appointments', title: 'Consultation Appointments', href: '/appointments', iconName: 'Calendar' },
            { id: 'patients', title: 'My Patients & EHR', href: '/patients', iconName: 'Users' },
            { id: 'encounters', title: 'SOAP Encounters', href: '/encounters', iconName: 'FileText' },
            { id: 'pharmacy', title: 'E-Prescriptions & Rx', href: '/pharmacy', iconName: 'Pill' },
            { id: 'laboratory', title: 'Lab Orders & Diagnostic Reports', href: '/laboratory', iconName: 'TestTube' },
          ],
        },
        {
          id: 'personal',
          title: 'Account Settings',
          items: [
            { id: 'profile', title: 'My User Profile', href: '/profile', iconName: 'User' },
          ],
        },
      ],
    };
  }

  // 5. Nurse Sidebar
  if (r.includes('nurse')) {
    return {
      groups: [
        {
          id: 'nursing',
          title: 'Nurse Triage Suite',
          items: [
            { id: 'nurse-dash', title: 'Triage Command Center', href: '/dashboards/nurse', iconName: 'Activity' },
            { id: 'patients', title: 'Patient Directory & Vitals', href: '/patients', iconName: 'Users' },
            { id: 'appointments', title: 'Appointments Queue', href: '/appointments', iconName: 'Calendar' },
            { id: 'encounters', title: 'SOAP Encounter Logs', href: '/encounters', iconName: 'Stethoscope' },
          ],
        },
        {
          id: 'personal',
          title: 'Account Settings',
          items: [
            { id: 'profile', title: 'My User Profile', href: '/profile', iconName: 'User' },
          ],
        },
      ],
    };
  }

  // 6. Pharmacist Sidebar
  if (r.includes('pharmacist') || r.includes('pharma')) {
    return {
      groups: [
        {
          id: 'pharmacy-suite',
          title: 'Pharmacy Operations',
          items: [
            { id: 'pharma-dash', title: 'Pharmacy Desk', href: '/dashboards/pharmacist', iconName: 'Pill' },
            { id: 'pharmacy', title: 'Rx Prescription Dispensing', href: '/pharmacy', iconName: 'FileText' },
            { id: 'inventory', title: 'Medication Inventory & Stock', href: '/inventory', iconName: 'Package' },
          ],
        },
        {
          id: 'personal',
          title: 'Account Settings',
          items: [
            { id: 'profile', title: 'My User Profile', href: '/profile', iconName: 'User' },
          ],
        },
      ],
    };
  }

  // 7. Patient Sidebar
  if (r.includes('patient')) {
    return {
      groups: [
        {
          id: 'patient-suite',
          title: 'Patient Health Portal',
          items: [
            { id: 'patient-dash', title: 'My Health Portal', href: '/dashboards/patient', iconName: 'User' },
            { id: 'appointments', title: 'Book Consultation Slot', href: '/appointments', iconName: 'Calendar' },
            { id: 'encounters', title: 'My Medical Records', href: '/encounters', iconName: 'FileText' },
            { id: 'pharmacy', title: 'My Prescriptions', href: '/pharmacy', iconName: 'Pill' },
            { id: 'billing', title: 'My Payment Receipts', href: '/billing', iconName: 'CreditCard' },
          ],
        },
        {
          id: 'personal',
          title: 'Account Settings',
          items: [
            { id: 'profile', title: 'My User Profile', href: '/profile', iconName: 'User' },
          ],
        },
      ],
    };
  }

  // Default Front Desk Receptionist Sidebar for generic staff
  return {
    groups: [
      {
        id: 'front-desk',
        title: 'Front Desk Operations',
        items: [
          { id: 'reception-dash', title: 'Front Desk Center', href: '/dashboards/receptionist', iconName: 'LayoutDashboard' },
          { id: 'appointments', title: 'Book & Queue Slots', href: '/appointments', iconName: 'Calendar' },
          { id: 'patients', title: 'Patient Registration & EHR', href: '/patients', iconName: 'Users' },
          { id: 'billing', title: 'Billing & POS Cashier', href: '/billing', iconName: 'CreditCard' },
        ],
      },
      {
        id: 'personal',
        title: 'Account Settings',
        items: [
          { id: 'profile', title: 'My User Profile', href: '/profile', iconName: 'User' },
        ],
      },
    ],
  };
}
