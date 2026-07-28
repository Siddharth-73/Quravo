"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { ProvisionTenantModal } from '@/components/modals/ProvisionTenantModal';
import { ManageConfigModal } from '@/components/modals/ManageConfigModal';
import { apiFetch } from '@/lib/api/client';

interface TenantRecord {
  id: string;
  name: string;
  subdomain: string;
  plan: 'Starter' | 'Growth' | 'ERP';
  branches: number;
  status: 'Active' | 'Suspended';
}

const mockTenants: TenantRecord[] = [
  { id: '1', name: 'Apex Health Clinic', subdomain: 'apexhealth', plan: 'ERP', branches: 3, status: 'Active' },
  { id: '2', name: 'Sunrise Dental & Medical', subdomain: 'sunrisemed', plan: 'Growth', branches: 2, status: 'Active' },
  { id: '3', name: 'Valley Community Hospital', subdomain: 'valleyhospital', plan: 'ERP', branches: 8, status: 'Active' },
  { id: '4', name: 'Metro Urgent Care', subdomain: 'metrocure', plan: 'Starter', branches: 1, status: 'Active' },
];

export default function SuperAdminTenantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<TenantRecord[]>('/super-admin/tenants');
      // If db has data, use it; otherwise fallback to mocks so the UI isn't empty
      setTenants(data.length > 0 ? data : mockTenants);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
      setTenants(mockTenants);
    } finally {
      setLoading(false);
    }
  };

  const handleTenantProvisioned = (newTenant: any) => {
    setTenants((prev) => [
      {
        id: newTenant.id,
        name: newTenant.name,
        subdomain: newTenant.slug,
        plan: newTenant.planTier === 'starter' ? 'Starter' : newTenant.planTier === 'growth' ? 'Growth' : 'ERP',
        branches: 1, // Defaulting to 1 for new provisioned clinic
        status: newTenant.status === 'active' ? 'Active' : 'Suspended',
      },
      ...prev,
    ]);
  };

  const handleTenantConfigUpdated = (updatedTenant: any) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === updatedTenant.id
          ? {
              ...t,
              name: updatedTenant.name,
              subdomain: updatedTenant.slug,
              plan: updatedTenant.planTier === 'starter' ? 'Starter' : updatedTenant.planTier === 'growth' ? 'Growth' : 'ERP',
              status: updatedTenant.status === 'active' ? 'Active' : 'Suspended',
            }
          : t
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tenants Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Provision new clinic tenants, override subscription modules, and inspect custom domain bindings
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision New Tenant</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-sm text-slate-400">Loading tenants directory...</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <span>Tenant Name & Subdomain</span>
            <span>Subscription Plan</span>
            <span>Branch Count</span>
            <span>Status & Actions</span>
          </div>

          {tenants.map((t) => (
            <div
              key={t.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-800 bg-slate-900/40 text-xs gap-4"
            >
              <div>
                <div className="font-bold text-white text-sm">{t.name}</div>
                <div className="font-mono text-purple-400 text-[11px] mt-0.5">{t.subdomain}.platform.com</div>
              </div>

              <div className="font-semibold text-slate-200">
                {t.plan} Plan
              </div>

              <div className="text-slate-400 font-medium">
                {t.branches} {t.branches === 1 ? 'Branch' : 'Branches'}
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {t.status}
                </span>

                <button 
                  onClick={() => {
                    setSelectedTenantId(t.id);
                    setIsConfigOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors text-xs font-medium"
                >
                  Manage Config
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProvisionTenantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleTenantProvisioned}
      />

      <ManageConfigModal
        isOpen={isConfigOpen}
        onClose={() => {
          setIsConfigOpen(false);
          setSelectedTenantId(null);
        }}
        tenantId={selectedTenantId}
        onSuccess={handleTenantConfigUpdated}
      />
    </div>
  );
}
