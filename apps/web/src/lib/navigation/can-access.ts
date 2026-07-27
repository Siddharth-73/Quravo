import { FeatureFlagKey, TenantFeaturesMap } from '@/providers/FeatureFlagProvider';
import { PermissionCode } from '@/providers/PermissionProvider';

export interface CanAccessParams {
  features: TenantFeaturesMap;
  userPermissions: PermissionCode[];
  requiredFeature?: FeatureFlagKey;
  requiredPermissions?: PermissionCode[];
}

export interface AccessResult {
  hasPermissionAccess: boolean; // Controls Visibility (false = hide completely)
  hasFeatureAccess: boolean;    // Controls Subscription Locking (false = show with lock)
}

export function canAccessItem({
  features,
  userPermissions,
  requiredFeature,
  requiredPermissions,
}: CanAccessParams): AccessResult {
  // 1. Evaluate RBAC Permission (RBAC Restriction -> Hide completely)
  const hasPermissionAccess =
    !requiredPermissions ||
    requiredPermissions.length === 0 ||
    userPermissions.includes('admin:access') ||
    requiredPermissions.some((perm) => userPermissions.includes(perm));

  // 2. Evaluate Feature Flag (Subscription Plan Restriction -> Show + Lock)
  const hasFeatureAccess =
    !requiredFeature || !!features[requiredFeature];

  return {
    hasPermissionAccess,
    hasFeatureAccess,
  };
}
