import React, { useState, useEffect } from 'react';
import { X, Palette, Globe, Settings, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';

interface ManageConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string | null;
  onSuccess: (updatedTenant: any) => void;
}

export function ManageConfigModal({ isOpen, onClose, tenantId, onSuccess }: ManageConfigModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configData, setConfigData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && tenantId) {
      fetchTenantConfig();
    } else {
      setConfigData(null);
    }
  }, [isOpen, tenantId]);

  const fetchTenantConfig = async () => {
    setFetching(true);
    setError(null);
    try {
      const data = await apiFetch<any>(`/super-admin/tenants/${tenantId}/config`);
      setConfigData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load configuration');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tenantId) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      planTier: formData.get('planTier') as string,
      status: formData.get('status') as string,
      customDomain: formData.get('customDomain') as string,
      primaryColor: formData.get('primaryColor') as string,
      accentColor: formData.get('accentColor') as string,
      timezone: formData.get('timezone') as string,
      currency: formData.get('currency') as string,
    };

    try {
      const result = await apiFetch<any>(`/super-admin/tenants/${tenantId}/config`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      onSuccess(result.tenant);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-white">Manage Clinic Configuration</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {configData?.tenant?.name ? `Configure ${configData.tenant.name}` : 'Load clinic details...'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-sm text-slate-400">Fetching configuration from database...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column: Subscriptions & Domain */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2">
                  Plan & Core settings
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Subscription Plan</label>
                  <select
                    required
                    name="planTier"
                    defaultValue={configData?.tenant?.planTier || 'starter'}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="starter">Starter Plan</option>
                    <option value="growth">Growth Plan</option>
                    <option value="erp">ERP Enterprise</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Clinic Status</label>
                  <select
                    required
                    name="status"
                    defaultValue={configData?.tenant?.status || 'active'}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Custom Domain</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      name="customDomain"
                      defaultValue={configData?.tenant?.customDomain || ''}
                      placeholder="e.g. clinic.yourdomain.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Theme & Localization */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2">
                  Theme & Branding
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Primary Color</label>
                    <div className="relative">
                      <Palette className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        required
                        name="primaryColor"
                        type="text"
                        defaultValue={configData?.config?.primaryColor || '#0284c7'}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Accent Color</label>
                    <input
                      required
                      name="accentColor"
                      type="text"
                      defaultValue={configData?.config?.accentColor || '#0f172a'}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Timezone</label>
                  <select
                    required
                    name="timezone"
                    defaultValue={configData?.config?.timezone || 'UTC'}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Asia/Kolkata">India Standard Time (IST)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Currency</label>
                  <select
                    required
                    name="currency"
                    defaultValue={configData?.config?.currency || 'USD'}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 transition-colors"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
