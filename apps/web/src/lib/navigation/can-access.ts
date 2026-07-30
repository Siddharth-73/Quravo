import { FeatureFlagKey, TenantFeaturesMap } from '@/providers/FeatureFlagProvider';
import { PermissionCode } from '@/providers/PermissionProvider';

export interface CanAccessParams {
  features?: TenantFeaturesMap;
  userPermissions?: PermissionCode[];
  requiredFeature?: FeatureFlagKey;
  requiredPermissions?: PermissionCode[];
}

export interface AccessResult {
  hasPermissionAccess: boolean; // Controls Visibility (false = hide completely)
  hasFeatureAccess: boolean;    // Controls Subscription Locking (false = show with lock)
}

export function canAccessItem({
  features = {} as TenantFeaturesMap,
  userPermissions = [],
  requiredFeature,
  requiredPermissions,
}: CanAccessParams): AccessResult {
  const perms = (Array.isArray(userPermissions) ? userPermissions : []) as PermissionCode[];

  let hasPermissionAccess = true;

  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requiredPermissions.includes('super_admin:access' as any)) {
      hasPermissionAccess = perms.includes('super_admin:access' as any);
    } else {
      hasPermissionAccess =
        perms.includes('*' as any) ||
        perms.includes('admin:access' as any) ||
        requiredPermissions.some((perm) => perms.includes(perm));
    }
  }

  // 2. Evaluate Feature Flag (Subscription Plan Restriction -> Show + Lock)
  const safeFeatures = features || ({} as TenantFeaturesMap);
  const hasFeatureAccess =
    !requiredFeature || !!safeFeatures[requiredFeature];

  return {
    hasPermissionAccess,
    hasFeatureAccess,
  };
}
