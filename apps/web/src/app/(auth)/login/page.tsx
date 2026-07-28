"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { usePermissions, PermissionCode } from '@/providers/PermissionProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagProvider';
import { DEMO_CREDENTIALS, CredentialUser, fullFeatures } from '@/lib/auth/credentials';
import { Lock, Mail, Building2, ArrowRight, AlertCircle, ShieldCheck, Key, Check } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/client';

interface LoginResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    tenantId: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
}

const ALL_PERMISSIONS: PermissionCode[] = [
  'patients:read',
  'patients:write',
  'patients:delete',
  'appointments:read',
  'appointments:write',
  'emr:read',
  'emr:write',
  'billing:read',
  'billing:write',
  'admin:access',
  'settings:read',
  'settings:write',
];

function expandPermissions(rawPermissions: string[]): PermissionCode[] {
  const result = new Set<PermissionCode>();
  for (const perm of rawPermissions) {
    if (perm === '*') {
      ALL_PERMISSIONS.forEach((p) => result.add(p));
    } else if (perm.endsWith(':*')) {
      const prefix = perm.slice(0, -2);
      ALL_PERMISSIONS.forEach((p) => {
        if (p.startsWith(prefix + ':')) {
          result.add(p);
        }
      });
      if (prefix === 'emr' || prefix === 'prescriptions') {
        result.add('emr:read');
        result.add('emr:write');
      }
    } else {
      if (perm === 'vitals:write') {
        result.add('emr:write');
      } else if (ALL_PERMISSIONS.includes(perm as PermissionCode)) {
        result.add(perm as PermissionCode);
      }
    }
  }
  return Array.from(result);
}

const getDashboardForRole = (role: string): string => {
  switch (role) {
    case 'super_admin':
      return '/super-admin';
    case 'doctor':
      return '/dashboards/doctor';
    case 'nurse':
      return '/dashboards/nurse';
    case 'receptionist':
      return '/dashboards/receptionist';
    case 'pharmacist':
      return '/dashboards/pharmacist';
    case 'patient':
      return '/dashboards/patient';
    case 'owner':
    case 'admin':
    default:
      return '/dashboard';
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { setPermissions } = usePermissions();
  const { setFeatures } = useFeatureFlags();

  const [email, setEmail] = useState('doctor@clinic.com');
  const [password, setPassword] = useState('doctor123');
  const [subdomain, setSubdomain] = useState('apexhealth');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fillCredentials = (cred: CredentialUser) => {
    setEmail(cred.email);
    setPassword(cred.password);
    if (cred.roleKey !== 'super_admin') {
      setSubdomain('apexhealth');
    }
    setErrorMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // 1. Attempt dynamic authentication against NestJS API
      const authData = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          clinicSlug: subdomain,
        }),
      });

      let clientPermissions: PermissionCode[] = [];
      let clientFeatures = fullFeatures;

      if (authData.user.role === 'super_admin') {
        clientPermissions = ['admin:access'];
      } else {
        // 2. Fetch roles and permissions for this tenant
        const rolesData = await apiFetch<{ name: string; permissions: string[] }[]>('/rbac/roles', {
          token: authData.accessToken,
          headers: {
            'X-Tenant-ID': authData.user.tenantId,
          },
        });

        // 3. Fetch enabled feature modules
        const modulesData = await apiFetch<Record<string, boolean>>('/rbac/modules', {
          token: authData.accessToken,
          headers: {
            'X-Tenant-ID': authData.user.tenantId,
          },
        });

        // Map dynamic backend permissions & modules to client formats
        const userRole = rolesData.find((r) => r.name === authData.user.role);
        const rawPermissions = userRole ? userRole.permissions : [];
        clientPermissions = expandPermissions(rawPermissions);
        clientFeatures = { ...fullFeatures, ...modulesData };
      }

      // 4. Set frontend contexts
      setUser({
        id: authData.user.id,
        email: authData.user.email,
        firstName: authData.user.firstName || 'User',
        lastName: authData.user.lastName || '',
        role: authData.user.role,
      });

      setPermissions(clientPermissions);
      setFeatures(clientFeatures);

      // Redirect to correct dashboard
      const targetDashboard = getDashboardForRole(authData.user.role);
      router.push(targetDashboard);
    } catch (apiError: any) {
      setErrorMessage(
        apiError.message || 'Invalid email address or password. Try a demo quick-fill option below.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg mb-2">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Staff Sign In</h1>
          <p className="text-xs text-muted-foreground">
            Enter valid credentials to access your role-specific dashboard
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
          {errorMessage && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 animate-in fade-in duration-200 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Clinic Subdomain</label>
              <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                <Building2 className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="w-full bg-transparent text-foreground focus:outline-none font-mono"
                />
                <span className="text-muted-foreground text-[11px]">.platform.com</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Email Address</label>
              <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                <Mail className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@clinic.com"
                  className="w-full bg-transparent text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                <Lock className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-foreground focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Credential Helper Chips */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Quick Demo Credentials</span>
              <span className="text-[10px]">Click to auto-fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => fillCredentials(cred)}
                  className={`p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
                    cred.isImmutable
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold'
                      : 'bg-muted/30 border-border hover:bg-muted text-foreground'
                  }`}
                >
                  <span className="truncate">{cred.roleTitle}</span>
                  {email === cred.email && <Check className="w-3 h-3 text-primary shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

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
