"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Check, Save, Layers, Loader2 } from 'lucide-react';
import { useFeatureFlags } from '@/providers/FeatureFlagProvider';
import { useRoles, useModules, useToggleModule } from '@/domains/rbac/hooks';

export default function RolesAndModulesPage() {
  const { features, setFeatures } = useFeatureFlags();
  const { data: rolesList = [], isLoading: isLoadingRoles } = useRoles();
  const { data: modulesList = [], isLoading: isLoadingModules } = useModules();
  const toggleModuleMutation = useToggleModule();
  
  const [saved, setSaved] = useState(false);

  // Sync backend modules with frontend Context
  useEffect(() => {
    if (modulesList.length > 0) {
      const newFeatures: Record<string, boolean> = {};
      modulesList.forEach(m => {
        newFeatures[m.moduleKey] = m.enabled;
      });
      setFeatures(newFeatures);
    }
  }, [modulesList, setFeatures]);

  const toggleModule = async (moduleKey: string) => {
    // Optimistic UI update
    const isCurrentlyEnabled = features[moduleKey as keyof typeof features] || false;
    setFeatures({ ...features, [moduleKey]: !isCurrentlyEnabled });
    
    // API Call
    try {
      await toggleModuleMutation.mutateAsync({
        moduleKey,
        enabled: !isCurrentlyEnabled,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      // Revert on failure
      setFeatures({ ...features, [moduleKey]: isCurrentlyEnabled });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">RBAC Roles & Module Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure granular permission roles and toggle à la carte subscription modules for your clinic
          </p>
        </div>
      </div>

      {/* 1. Tenant Enabled Modules Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">Enabled Subscription Modules (À La Carte)</h3>
          {toggleModuleMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-2" />}
        </div>

        {isLoadingModules ? (
           <div className="flex justify-center p-8">
             <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              { key: 'appointments', label: 'Appointments Calendar', desc: 'Patient scheduling & slot booking' },
              { key: 'patients', label: 'Patient Directory & EHR', desc: 'Health timeline & allergies' },
              { key: 'billing', label: 'Billing & POS Invoicing', desc: 'Checkout terminal & receipt printing' },
              { key: 'emr', label: 'SOAP Encounter Builder', desc: 'ICD-10 clinical notes & Rx builder' },
              { key: 'pharmacy', label: 'Pharmacy Fulfillment', desc: 'Prescription queue & dispensing' },
              { key: 'laboratory', label: 'Laboratory Diagnostics', desc: 'Lab report upload & PDF generator' },
              { key: 'inventory', label: 'Stock & Supply Inventory', desc: 'Reorder thresholds & stock balances' },
              { key: 'hr', label: 'HR & Payroll', desc: 'Staff directory & payroll processing' },
              { key: 'bedManagement', label: 'Bed Management', desc: 'Inpatient ward & bed occupancy' },
            ].map((mod) => (
              <div
                key={mod.key}
                onClick={() => toggleModule(mod.key)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                  features[mod.key as keyof typeof features]
                    ? 'border-primary bg-primary/5 shadow-xs'
                    : 'border-border bg-muted/20 hover:bg-muted/40 opacity-70'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground">{mod.label}</div>
                  <div className="text-[11px] text-muted-foreground">{mod.desc}</div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    features[mod.key as keyof typeof features]
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {features[mod.key as keyof typeof features] ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. RBAC Roles Directory */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Clinic RBAC Roles & Permissions</h3>
          </div>

          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted">
            <Plus className="w-3.5 h-3.5 text-primary" />
            <span>Create Custom Role</span>
          </button>
        </div>

        {isLoadingRoles ? (
          <div className="flex justify-center p-8">
             <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            {rolesList.map((role) => (
              <div key={role.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm capitalize">{role.name}</span>
                  </div>
                </div>

                <p className="text-muted-foreground">{role.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {role.permissions?.map((perm) => (
                    <span key={perm} className="px-2 py-0.5 rounded font-mono text-[10px] bg-card border border-border text-foreground">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

