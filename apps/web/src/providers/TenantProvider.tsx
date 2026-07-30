"use client";

import React, { createContext, useContext, useState } from 'react';

export interface TenantMetadata {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  customDomain?: string;
  logoUrl?: string;
  planTier?: string;
  currency?: string;
  timezone?: string;
}

interface TenantContextType {
  tenant: TenantMetadata | null;
  setTenant: (tenant: TenantMetadata | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({
  children,
  initialTenant = null,
}: {
  children: React.ReactNode;
  initialTenant?: TenantMetadata | null;
}) {
  const [tenant, setTenantState] = useState<TenantMetadata | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quravo_tenant_context');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved tenant context', e);
        }
      }
    }
    return initialTenant;
  });

  const setTenant = (newTenant: TenantMetadata | null) => {
    setTenantState(newTenant);
    if (typeof window !== 'undefined') {
      if (newTenant) {
        localStorage.setItem('quravo_tenant_context', JSON.stringify(newTenant));
      } else {
        localStorage.removeItem('quravo_tenant_context');
      }
    }
  };

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
