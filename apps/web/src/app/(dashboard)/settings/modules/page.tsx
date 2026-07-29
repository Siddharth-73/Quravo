"use client";

import React, { useState, useEffect } from 'react';
import { useFeatureFlags, FeatureFlagKey } from '@/providers/FeatureFlagProvider';
import { ToggleLeft, ToggleRight, Sparkles, CheckCircle2, ShieldCheck, Layers, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/client';

interface ModuleDefinition {
  key: FeatureFlagKey;
  title: string;
  category: 'Core Clinical' | 'SaaS ERP À-La-Carte' | 'Advanced AI & Ops';
  description: string;
}

const MODULES_LIST: ModuleDefinition[] = [
  { key: 'appointments', title: 'Appointments & Scheduling', category: 'Core Clinical', description: 'Patient booking calendar, doctor availability, and multi-resource appointment slots.' },
  { key: 'patients', title: 'Patient Directory & ABHA EHR', category: 'Core Clinical', description: 'Comprehensive patient medical records, demographics, and history.' },
  { key: 'billing', title: 'GST Billing & POS Invoicing', category: 'Core Clinical', description: 'Point-of-sale invoice creation, payment status tracking, and receipt printing.' },
  { key: 'ehr', title: 'Electronic Health Records (SOAP)', category: 'Core Clinical', description: 'Physician clinical notes, vital intake, and prescription charting.' },
  { key: 'pharmacy', title: 'Pharmacy & Dispensing Queue', category: 'SaaS ERP À-La-Carte', description: 'Prescription inventory fulfillment, dosage tracking, and pharmacy queue.' },
  { key: 'laboratory', title: 'Laboratory & Diagnostic Reports', category: 'SaaS ERP À-La-Carte', description: 'Lab order management, report upload, and printable test results.' },
  { key: 'inventory', title: 'Medical Stock & Supplies Inventory', category: 'SaaS ERP À-La-Carte', description: 'Medication stock tracking, reorder alert thresholds, and supplier orders.' },
  { key: 'aiScribe', title: 'Google Gemini AI Clinical Scribe', category: 'Advanced AI & Ops', description: 'Automated SOAP note generation and differential diagnosis assistance via Gemini 2.5 Flash.' },
  { key: 'telemedicine', title: 'Telemedicine & Virtual Visits', category: 'Advanced AI & Ops', description: 'Video consultation integration and remote patient care portal.' },
  { key: 'marketing', title: 'Patient Marketing & Reminders', category: 'Advanced AI & Ops', description: 'Automated SMS/Email appointment reminders and promotional campaigns.' },
];

export default function FeatureFlagsPage() {
  const { features, setFeatures } = useFeatureFlags();
  const [togglingKey, setTogglingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadBackendFlags() {
      try {
        const data = await apiFetch<Record<string, boolean>>('/subscriptions/feature-flags');
        if (data && typeof data === 'object') {
          setFeatures(data);
        }
      } catch (err) {
        console.warn('Using local feature flags context:', err);
      }
    }
    loadBackendFlags();
  }, [setFeatures]);

  const handleToggle = async (flagKey: FeatureFlagKey) => {
    const currentStatus = !!features[flagKey];
    const newStatus = !currentStatus;
    setTogglingKey(flagKey);
    setFeedback(null);

    // Optimistically update local context
    setFeatures({ [flagKey]: newStatus });

    try {
      await apiFetch('/subscriptions/feature-flags/toggle', {
        method: 'POST',
        body: JSON.stringify({ flagKey, enabled: newStatus }),
      });
      setFeedback(`Successfully ${newStatus ? 'enabled' : 'disabled'} ${flagKey} module.`);
    } catch (err) {
      console.warn('API sync failed, maintaining updated state:', err);
      setFeedback(`Updated ${flagKey} module.`);
    } finally {
      setTogglingKey(null);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">À-La-Carte ERP Feature Flags</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure enabled modules for your clinic. Toggle features on/off dynamically to scale your workspace.
          </p>
        </div>

        {feedback && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Modules List by Category */}
      <div className="space-y-6">
        {['Core Clinical', 'SaaS ERP À-La-Carte', 'Advanced AI & Ops'].map((categoryName) => {
          const categoryModules = MODULES_LIST.filter((m) => m.category === categoryName);
          return (
            <div key={categoryName} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-foreground border-b border-border pb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>{categoryName}</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {categoryModules.map((mod) => {
                  const isEnabled = !!features[mod.key];
                  const isPending = togglingKey === mod.key;

                  return (
                    <div
                      key={mod.key}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-foreground flex items-center gap-2">
                          <span>{mod.title}</span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              isEnabled
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-muted text-muted-foreground border border-border'
                            }`}
                          >
                            {isEnabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{mod.description}</p>
                      </div>

                      <button
                        onClick={() => handleToggle(mod.key)}
                        disabled={isPending}
                        className="p-1 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 ml-4 shrink-0"
                        title={isEnabled ? 'Click to Disable' : 'Click to Enable'}
                      >
                        {isPending ? (
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        ) : isEnabled ? (
                          <ToggleRight className="w-8 h-8 text-primary" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
