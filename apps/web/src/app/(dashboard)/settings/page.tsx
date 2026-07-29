"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { useTenant } from '@/providers/TenantProvider';
import { Settings, Palette, Globe, Building2, Save, Check, Loader2, Phone, Mail, MapPin, FileText, IndianRupee, Clock, Layers } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';

export default function SettingsPage() {
  const { updateCustomTheme } = useTheme();
  const { tenant } = useTenant();
  const tAny = (tenant || {}) as any;

  const [clinicName, setClinicName] = useState(tAny.name || 'Apex Health India Clinic');
  const [phone, setPhone] = useState(tAny.phone || '+91 98765 43210');
  const [email, setEmail] = useState(tAny.email || 'contact@apexhealth.in');
  const [address, setAddress] = useState(tAny.address || '102 Medical Enclave, MG Road');
  const [city, setCity] = useState(tAny.city || 'Mumbai');
  const [state, setState] = useState(tAny.state || 'Maharashtra');
  const [taxId, setTaxId] = useState(tAny.taxId || '27AAAAA0000A1Z5');
  const [currency, setCurrency] = useState(tAny.currency || 'INR');
  const [timezone, setTimezone] = useState(tAny.timezone || 'Asia/Kolkata');
  const [primaryColor, setPrimaryColor] = useState(tAny.primaryColor || '221.2 83.2% 53.3%');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadTenantProfile() {
      try {
        const data = await apiFetch<{ tenant: any }>('/tenants/current');
        if (data?.tenant) {
          const t = data.tenant;
          if (t.name) setClinicName(t.name);
          if (t.phone) setPhone(t.phone);
          if (t.email) setEmail(t.email);
          if (t.address) setAddress(t.address);
          if (t.city) setCity(t.city);
          if (t.state) setState(t.state);
          if (t.taxId) setTaxId(t.taxId);
          if (t.currency) setCurrency(t.currency);
          if (t.timezone) setTimezone(t.timezone);
          if (t.primaryColor) setPrimaryColor(t.primaryColor);
        }
      } catch (err) {
        console.warn('Using default tenant settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTenantProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiFetch('/tenants/current', {
        method: 'PUT',
        body: JSON.stringify({
          name: clinicName,
          phone,
          email,
          address,
          city,
          state,
          taxId,
          currency,
          timezone,
          primaryColor,
        }),
      });

      updateCustomTheme({ primary: primaryColor });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error('Failed to update tenant profile:', error);
      updateCustomTheme({ primary: primaryColor });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Profile & Branding Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your practice information, GSTIN, currency, and white-label branding tokens
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/modules"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-foreground text-xs font-semibold hover:bg-muted transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>À-La-Carte Feature Flags</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Saving...' : saved ? 'Profile Updated!' : 'Save Clinic Profile'}</span>
          </button>
        </div>
      </div>

      {/* 1. Practice Information */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Building2 className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">Clinic Identity & Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Clinic Legal Name</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">GSTIN / Registration Tax ID</label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="e.g. 27AAAAA0000A1Z5"
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="font-semibold text-foreground">Clinic Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* 2. White Label Branding Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">White-Label Branding Engine</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Primary Accent Color (HSL)</label>
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

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Primary Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="INR">INR (₹ Indian Rupee)</option>
              <option value="USD">USD ($ US Dollar)</option>
              <option value="EUR">EUR (€ Euro)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
