import { NavGroup, SidebarNavigation } from './sidebar-schema';
import { canAccessItem } from './can-access';
import { TenantFeaturesMap } from '@/providers/FeatureFlagProvider';
import { PermissionCode } from '@/providers/PermissionProvider';

const masterNavGroups: NavGroup[] = [
  {
    id: 'clinical',
    title: 'Clinical',
    items: [
      {
        id: 'dashboard',
        title: 'Command Center',
        href: '/dashboard',
        iconName: 'LayoutDashboard',
        requiredPermissions: ['patients:read'],
      },
      {
        id: 'appointments',
        title: 'Appointments',
        href: '/appointments',
        iconName: 'Calendar',
        requiredFeature: 'appointments',
        requiredPermissions: ['appointments:read'],
      },
      {
        id: 'patients',
        title: 'Patients & EHR',
        href: '/patients',
        iconName: 'Users',
        requiredFeature: 'patients',
        requiredPermissions: ['patients:read'],
      },
      {
        id: 'encounters',
        title: 'SOAP Encounters',
        href: '/encounters',
        iconName: 'Stethoscope',
        requiredFeature: 'ehr',
        requiredPermissions: ['emr:read'],
      },
      {
        id: 'pharmacy',
        title: 'Pharmacy',
        href: '/pharmacy',
        iconName: 'Pill',
        requiredFeature: 'pharmacy',
        requiredPermissions: ['patients:read'],
      },
      {
        id: 'laboratory',
        title: 'Laboratory',
        href: '/laboratory',
        iconName: 'TestTube',
        requiredFeature: 'laboratory',
        requiredPermissions: ['patients:read'],
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    items: [
      {
        id: 'billing',
        title: 'Billing & POS',
        href: '/billing',
        iconName: 'CreditCard',
        requiredFeature: 'billing',
        requiredPermissions: ['billing:read'],
      },
      {
        id: 'inventory',
        title: 'Inventory & Stock',
        href: '/inventory',
        iconName: 'Package',
        requiredFeature: 'inventory',
        requiredPermissions: ['admin:access'],
      },
    ],
  },
  {
    id: 'administration',
    title: 'Administration',
    items: [
      {
        id: 'profile',
        title: 'My User Profile',
        href: '/profile',
        iconName: 'User',
      },
      {
        id: 'staff',
        title: 'Staff Directory',
        href: '/staff',
        iconName: 'UserCheck',
        requiredPermissions: ['admin:access'],
      },
      {
        id: 'approvals',
        title: 'Staff Join Approvals',
        href: '/staff/approvals',
        iconName: 'UserCheck',
        requiredPermissions: ['admin:access'],
      },
      {
        id: 'roles',
        title: 'RBAC Roles & Modules',
        href: '/settings/roles',
        iconName: 'ShieldCheck',
        requiredPermissions: ['admin:access'],
      },
      {
        id: 'branches',
        title: 'Branch Locations',
        href: '/settings/branches',
        iconName: 'Building2',
        requiredPermissions: ['admin:access'],
      },
      {
        id: 'audit-logs',
        title: 'Security Audit Logs',
        href: '/settings/audit-logs',
        iconName: 'ShieldAlert',
        requiredPermissions: ['admin:access'],
      },
      {
        id: 'settings',
        title: 'Clinic Branding',
        href: '/settings',
        iconName: 'Settings',
        requiredPermissions: ['settings:read'],
      },
      {
        id: 'superadmin',
        title: 'Super-Admin Console',
        href: '/super-admin',
        iconName: 'Shield',
        requiredPermissions: ['super_admin:access' as any],
      },

    ],
  },
];

export interface GetSidebarOptions {
  features?: TenantFeaturesMap;
  permissions?: PermissionCode[];
  role?: string;
}

export function getSidebar({ features = {} as TenantFeaturesMap, permissions = [], role }: GetSidebarOptions = {}): SidebarNavigation {

  const safePermissions = (Array.isArray(permissions) ? permissions : ['*']) as PermissionCode[];
  const safeFeatures = features || ({} as TenantFeaturesMap);


  const filteredGroups: NavGroup[] = masterNavGroups
    .map((group) => {
      const visibleItems = group.items
        .map((item) => {
          const access = canAccessItem({
            features: safeFeatures,
            userPermissions: safePermissions,
            requiredFeature: item.requiredFeature,
            requiredPermissions: item.requiredPermissions,
          });

          if (!access.hasPermissionAccess) {
            return null;
          }

          if (!access.hasFeatureAccess) {
            return {
              ...item,
              isLocked: true,
              lockReason: `Requires ${item.title} plan upgrade`,
            };
          }

          return item;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      return {
        ...group,
        items: visibleItems,
      };
    })
    .filter((group) => group.items.length > 0);

  return { groups: filteredGroups };
}

