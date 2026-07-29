"use client";

import React, { useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { useTenant } from '@/providers/TenantProvider';
import { Settings, Palette, Globe, Building2, Save, Check, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';

export default function SettingsPage() {
  const { theme, updateCustomTheme } = useTheme();
  const { tenant } = useTenant();

  const [clinicName, setClinicName] = useState(tenant?.name || 'Apex Health Clinic');
  const [subdomain, setSubdomain] = useState(tenant?.subdomain || 'apexhealth');
  const [customDomain, setCustomDomain] = useState(tenant?.customDomain || 'clinic.apexhealth.com');
  const [primaryColor, setPrimaryColor] = useState('221.2 83.2% 53.3%');
  const [saved, setSaved] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiFetch('/clinic/branding', {
        method: 'PUT',
        body: JSON.stringify({
          name: clinicName,
          subdomain,
          customDomain,
          primaryColor
        }),
      });
      updateCustomTheme({ primary: primaryColor });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save branding settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic & Branding Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure white-label branding colors, custom domain names, and branch parameters
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Saving...' : saved ? 'Saved Changes!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* 1. White Label Branding Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">White-Label Branding Engine</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Clinic Identity Name</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Primary Accent Brand Color (HSL)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div
                className="h-9 w-12 rounded-lg border border-border shrink-0 shadow-xs"
                style={{ backgroundColor: `hsl(${primaryColor})` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Custom Domain & Subdomain Resolution */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">Domain & Tenant Resolution</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Platform Subdomain</label>
            <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
              <span className="font-mono text-foreground">{subdomain}</span>
              <span className="text-muted-foreground ml-1">.platform.com</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Custom Domain URL</label>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
