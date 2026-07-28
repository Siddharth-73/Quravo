"use client";

import React, { createContext, useContext, useState } from 'react';

export type PermissionCode =
  | 'patients:read'
  | 'patients:write'
  | 'patients:delete'
  | 'appointments:read'
  | 'appointments:write'
  | 'emr:read'
  | 'emr:write'
  | 'billing:read'
  | 'billing:write'
  | 'admin:access'
  | 'settings:read'
  | 'settings:write';

interface PermissionContextType {
  permissions: PermissionCode[];
  setPermissions: (permissions: PermissionCode[]) => void;
  hasPermission: (permission: PermissionCode) => boolean;
  hasAllPermissions: (permissions: PermissionCode[]) => boolean;
  hasAnyPermission: (permissions: PermissionCode[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({
  children,
  initialPermissions = [],
}: {
  children: React.ReactNode;
  initialPermissions?: PermissionCode[];
}) {
  const [permissions, setPermissions] = useState<PermissionCode[]>(initialPermissions);

  const hasPermission = (permission: PermissionCode): boolean => {
    return permissions.includes(permission) || permissions.includes('admin:access');
  };

  const hasAllPermissions = (perms: PermissionCode[]): boolean => {
    return perms.every((p) => hasPermission(p));
  };

  const hasAnyPermission = (perms: PermissionCode[]): boolean => {
    return perms.some((p) => hasPermission(p));
  };

  return (
    <PermissionContext.Provider
      value={{ permissions, setPermissions, hasPermission, hasAllPermissions, hasAnyPermission }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}
