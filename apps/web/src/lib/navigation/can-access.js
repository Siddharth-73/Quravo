"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessItem = canAccessItem;
function canAccessItem({ features, userPermissions, requiredFeature, requiredPermissions, }) {
    // 1. Evaluate RBAC Permission (RBAC Restriction -> Hide completely)
    const hasPermissionAccess = !requiredPermissions ||
        requiredPermissions.length === 0 ||
        userPermissions.includes('*') ||
        userPermissions.includes('admin:access') ||
        requiredPermissions.some((perm) => userPermissions.includes(perm));
    // 2. Evaluate Feature Flag (Subscription Plan Restriction -> Show + Lock)
    const hasFeatureAccess = !requiredFeature || !!features[requiredFeature];
    return {
        hasPermissionAccess,
        hasFeatureAccess,
    };
}
