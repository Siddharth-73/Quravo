"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { usePermissions, PermissionCode } from '@/providers/PermissionProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagProvider';
import { Lock, Mail, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { setFeatures } = useFeatureFlags();

  const [role, setRole] = useState<'doctor' | 'receptionist' | 'clinic_admin' | 'super_admin'>('doctor');
  const [tier, setTier] = useState<'starter' | 'growth' | 'erp'>('growth');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'super_admin') {
      router.push('/super-admin');
      return;
    }

    // Configure role permissions and tier features
    let userPermissions: PermissionCode[] = [];
    if (role === 'doctor') {
      userPermissions = ['patients:read', 'patients:write', 'appointments:read', 'emr:read', 'emr:write'];
    } else if (role === 'receptionist') {
      userPermissions = ['patients:read', 'patients:write', 'appointments:read', 'appointments:write', 'billing:read', 'billing:write'];
    } else if (role === 'clinic_admin') {
      userPermissions = ['admin:access', 'patients:read', 'patients:write', 'appointments:read', 'emr:read', 'billing:read', 'settings:read', 'settings:write'];
    }

    setUser({
      id: 'usr-1',
      email: 'staff@apexhealth.com',
      firstName: role === 'doctor' ? 'Sarah' : role === 'receptionist' ? 'Jessica' : 'Alexander',
      lastName: role === 'doctor' ? 'Jenkins' : role === 'receptionist' ? 'Taylor' : 'Vance',
      role: role === 'doctor' ? 'Lead Physician' : role === 'receptionist' ? 'Lead Receptionist' : 'Clinic Owner',
    });

    setFeatures({
      appointments: true,
      patients: true,
      billing: true,
      ehr: true,
      pharmacy: tier === 'erp',
      laboratory: tier === 'erp',
      inventory: tier !== 'starter',
      hr: tier === 'erp',
      bedManagement: tier === 'erp',
    });

    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg mb-2">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Staff Sign In</h1>
          <p className="text-xs text-muted-foreground">
            Select a role and tier to interactively test permissions & features
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Select Active Role (Interactive Testing)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as typeof role)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              >
                <option value="doctor">Doctor / Physician (Clinical & EHR Focus)</option>
                <option value="receptionist">Receptionist (Appointments & Billing POS Focus)</option>
                <option value="clinic_admin">Clinic Owner / Admin (Full Access & Settings)</option>
                <option value="super_admin">Platform Super-Admin (Tenant Telemetry & Console)</option>
              </select>
            </div>

            {role !== 'super_admin' && (
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Tenant Subscription Plan Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as typeof tier)}
                  className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="starter">Starter Plan (Appointments, Patients, EMR, Billing)</option>
                  <option value="growth">Growth Plan (+ Multi-branch, Inventory)</option>
                  <option value="erp">ERP Enterprise Plan (Full À La Carte Modules: Pharmacy, Lab, HR)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm mt-2"
            >
              <span>Launch Workspace as {role.replace('_', ' ').toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border text-[11px] text-muted-foreground">
            Don't have a clinic account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Register New Clinic
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
