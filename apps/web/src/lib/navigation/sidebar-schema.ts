import { FeatureFlagKey } from '@/providers/FeatureFlagProvider';
import { PermissionCode } from '@/providers/PermissionProvider';

export interface NavItem {
  id: string;
  title: string;
  href: string;
  iconName: string;
  requiredFeature?: FeatureFlagKey;
  requiredPermissions?: PermissionCode[];
  isLocked?: boolean;
  lockReason?: string;
  badgeText?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export interface SidebarNavigation {
  groups: NavGroup[];
}
