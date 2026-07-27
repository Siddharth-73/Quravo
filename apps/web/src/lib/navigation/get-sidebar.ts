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
        href: '/',
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
      {
        id: 'bed-management',
        title: 'Bed Management',
        href: '/bed-management',
        iconName: 'Bed',
        requiredFeature: 'bedManagement',
        requiredPermissions: ['admin:access'],
      },
    ],
  },
  {
    id: 'administration',
    title: 'Administration',
    items: [
      {
        id: 'staff',
        title: 'Staff & Roles',
        href: '/staff',
        iconName: 'UserCheck',
        requiredPermissions: ['admin:access'],
      },
      {
        id: 'hr',
        title: 'HR & Payroll',
        href: '/hr',
        iconName: 'Briefcase',
        requiredFeature: 'hr',
        requiredPermissions: ['admin:access'],
      },
      {
        id: 'settings',
        title: 'Clinic Settings',
        href: '/settings',
        iconName: 'Settings',
        requiredPermissions: ['settings:read'],
      },
    ],
  },
];

export interface GetSidebarOptions {
  features: TenantFeaturesMap;
  permissions: PermissionCode[];
}

export function getSidebar({ features, permissions }: GetSidebarOptions): SidebarNavigation {
  const filteredGroups: NavGroup[] = masterNavGroups
    .map((group) => {
      const visibleItems = group.items
        .map((item) => {
          const access = canAccessItem({
            features,
            userPermissions: permissions,
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
