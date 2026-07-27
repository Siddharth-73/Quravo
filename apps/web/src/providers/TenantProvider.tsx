"use client";

import React, { createContext, useContext, useState } from 'react';

export interface TenantMetadata {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  customDomain?: string;
  logoUrl?: string;
  planTier: 'starter' | 'growth' | 'erp';
}

interface TenantContextType {
  tenant: TenantMetadata | null;
  setTenant: (tenant: TenantMetadata) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({
  children,
  initialTenant = null,
}: {
  children: React.ReactNode;
  initialTenant?: TenantMetadata | null;
}) {
  const [tenant, setTenant] = useState<TenantMetadata | null>(initialTenant);

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
