"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { usePermissions, PermissionCode } from '@/providers/PermissionProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagProvider';
import { fullFeatures } from '@/lib/auth/credentials';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/client';
import { QuravoLogo } from '@/components/ui/Logo';

interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
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
  'appointments:read',
  'appointments:write',
  'emr:read',
  'emr:write',
  'billing:read',
  'billing:write',
  'settings:read',
  'settings:write',
  'admin:access',
];

function expandPermissions(rawPermissions: string[]): PermissionCode[] {
  const result = new Set<PermissionCode>();
  for (const perm of rawPermissions) {
    if (perm === '*') {
      ALL_PERMISSIONS.forEach((p) => result.add(p));
      break;
    }
    if (perm.endsWith('*')) {
      const prefix = perm.slice(0, -1);
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

const getDashboardForRole = (role: string, email?: string): string => {
  if (role === 'super_admin' || role === 'Platform Super-Admin') {
    return '/super-admin';
  }
  switch (role) {
    case 'doctor':
    case 'Lead Physician':
      return '/dashboards/doctor';
    case 'nurse':
    case 'Triage Head Nurse':
      return '/dashboards/nurse';
    case 'receptionist':
    case 'Front Desk Receptionist':
      return '/dashboards/receptionist';
    case 'pharmacist':
    case 'Chief Pharmacist':
      return '/dashboards/pharmacist';
    case 'patient':
    case 'Patient User':
      return '/dashboards/patient';
    case 'owner':
    case 'admin':
    case 'Clinic Owner & Director':
    default:
      return '/dashboards/admin';
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { setPermissions } = usePermissions();
  const { setFeatures } = useFeatureFlags();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const authData = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      let clientPermissions: PermissionCode[] = [];
      let clientFeatures = fullFeatures;

      if (authData.user.role === 'super_admin' || authData.user.role === 'Platform Super-Admin') {
        clientPermissions = ['admin:access', 'settings:write'];
      } else {
        const rolesData = await apiFetch<{ name: string; permissions: string[] }[]>('/rbac/roles', {
          token: authData.accessToken,
          headers: {
            'X-Tenant-ID': authData.user.tenantId,
          },
        }).catch(() => []);

        const modulesData = await apiFetch<Record<string, boolean>>('/rbac/modules', {
          token: authData.accessToken,
          headers: {
            'X-Tenant-ID': authData.user.tenantId,
          },
        }).catch(() => ({}));

        const userRole = Array.isArray(rolesData) ? rolesData.find((r) => r.name === authData.user.role) : undefined;
        const rawPermissions = userRole ? userRole.permissions : [];
        clientPermissions = expandPermissions(rawPermissions);
        clientFeatures = { ...fullFeatures, ...modulesData };
      }

      if (typeof window !== 'undefined' && authData.accessToken) {
        localStorage.setItem('quravo_access_token', authData.accessToken);
      }

      setUser({
        id: authData.user.id,
        email: authData.user.email,
        firstName: authData.user.firstName || 'User',
        lastName: authData.user.lastName || '',
        role: authData.user.role,
        tenantId: authData.user.tenantId,
      });

      setPermissions(clientPermissions);
      setFeatures(clientFeatures);

      const targetDashboard = getDashboardForRole(authData.user.role, authData.user.email);
      window.location.href = targetDashboard;
    } catch (apiError: any) {
      setErrorMessage(
        apiError.message || 'Invalid email address or password. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 py-8 space-y-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <QuravoLogo size="lg" className="justify-center mb-2" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Sign In to Your Account</h1>
          <p className="text-xs text-muted-foreground">
            Enter your email and password to access your clinic workspace
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
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-foreground focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm mt-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
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
