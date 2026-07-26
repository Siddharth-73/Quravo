/**
 * Evaluates whether granted permissions include required permissions.
 * Supports:
 *  - '*' (Superadmin access)
 *  - 'resource:*' (Resource level wildcard e.g. 'patients:*' grants 'patients:read')
 *  - Exact string match 'resource:action'
 */
export function hasPermission(grantedPermissions: string[], requiredPermission: string): boolean {
  if (!grantedPermissions || grantedPermissions.length === 0) {
    return false;
  }

  // 1. Superadmin wildcard
  if (grantedPermissions.includes('*')) {
    return true;
  }

  // 2. Exact match
  if (grantedPermissions.includes(requiredPermission)) {
    return true;
  }

  // 3. Resource level wildcard (e.g. required 'patients:read', granted 'patients:*')
  const parts = requiredPermission.split(':');
  if (parts.length === 2) {
    const resourceWildcard = `${parts[0]}:*`;
    if (grantedPermissions.includes(resourceWildcard)) {
      return true;
    }
  }

  return false;
}

export function hasAllPermissions(grantedPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every((perm) => hasPermission(grantedPermissions, perm));
}
