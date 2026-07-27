"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Mail, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [clinicName, setClinicName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [tier, setTier] = useState<'starter' | 'growth' | 'erp'>('growth');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg mb-2">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Register New Clinic Tenant</h1>
          <p className="text-xs text-muted-foreground">
            Create your white-label Healthcare SaaS clinic workspace in seconds
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
          <form onSubmit={handleSignup} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Clinic / Healthcare Practice Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Health Clinic"
                value={clinicName}
                onChange={(e) => {
                  setClinicName(e.target.value);
                  setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                }}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Tenant Subdomain URL</label>
              <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="clinicname"
                  className="w-full bg-transparent font-mono text-foreground focus:outline-none"
                />
                <span className="text-muted-foreground text-[11px]">.platform.com</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Lead Doctor / Practitioner Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Sarah Jenkins"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Select Subscription Plan</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as typeof tier)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              >
                <option value="starter">Starter Plan (Core EMR, Appointments, Invoicing)</option>
                <option value="growth">Growth Plan (+ Multi-branch, Stock Inventory)</option>
                <option value="erp">ERP Enterprise Plan (Pharmacy, Laboratory, HR, Beds)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm mt-2"
            >
              <span>Provision Clinic Workspace</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border text-[11px] text-muted-foreground">
            Already registered?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
