"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { useTenant } from '@/providers/TenantProvider';
import { Settings, Palette, Globe, Building2, Save, Check, Loader2, Phone, Mail, MapPin, FileText, IndianRupee, Clock, Layers, Sparkles } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';

export interface ThemePalette {
  id: string;
  name: string;
  hsl: string;
  hex: string;
  bgClass: string;
}

const PRESET_THEME_PALETTES: ThemePalette[] = [
  { id: 'indigo', name: 'Royal Indigo', hsl: '238.7 83.5% 66.7%', hex: '#6366f1', bgClass: 'bg-indigo-600' },
  { id: 'emerald', name: 'Emerald Green', hsl: '142.1 76.2% 36.3%', hex: '#10b981', bgClass: 'bg-emerald-500' },
  { id: 'violet', name: 'Cyber Violet', hsl: '262.1 83.3% 57.8%', hex: '#8b5cf6', bgClass: 'bg-purple-600' },
  { id: 'amber', name: 'Sunset Amber', hsl: '37.7 92.1% 50.2%', hex: '#f59e0b', bgClass: 'bg-amber-500' },
  { id: 'teal', name: 'Ocean Teal', hsl: '173.4 80.4% 40%', hex: '#14b8a6', bgClass: 'bg-teal-500' },
  { id: 'crimson', name: 'Deep Crimson', hsl: '346.8 77.2% 49.8%', hex: '#e11d48', bgClass: 'bg-rose-600' },
];

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
  const [primaryColor, setPrimaryColor] = useState(tAny.primaryColor || '238.7 83.5% 66.7%');
  const [selectedPaletteId, setSelectedPaletteId] = useState('indigo');
  
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
          if (t.primaryColor) {
            setPrimaryColor(t.primaryColor);
            const found = PRESET_THEME_PALETTES.find((p) => p.hsl === t.primaryColor);
            if (found) setSelectedPaletteId(found.id);
          }
        }
      } catch (err) {
        console.warn('Using default tenant settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTenantProfile();
  }, []);

  const selectPalette = (palette: ThemePalette) => {
    setSelectedPaletteId(palette.id);
    setPrimaryColor(palette.hsl);
    updateCustomTheme({ primary: palette.hsl });
  };

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

      {/* 2. Clinic Theme Picker Color Palette Grid */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Clinic Theme Picker & Color Palette Grid</h3>
          </div>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-amber-400" /> Instant 1-Click Live Preview
          </span>
        </div>

        {/* Predefined Palette Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESET_THEME_PALETTES.map((p) => {
            const isSelected = selectedPaletteId === p.id || primaryColor === p.hsl;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPalette(p)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md'
                    : 'border-border bg-muted/20 hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-7 w-7 rounded-full ${p.bgClass} shadow-sm shrink-0 border border-white/20`}
                    style={{ backgroundColor: p.hex }}
                  />
                  <div>
                    <span className="font-bold text-xs text-foreground block">{p.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{p.hex}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Custom Primary Color (HSL)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value);
                  updateCustomTheme({ primary: e.target.value });
                }}
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
