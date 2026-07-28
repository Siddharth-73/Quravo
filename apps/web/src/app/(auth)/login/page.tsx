"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { usePermissions } from '@/providers/PermissionProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagProvider';
import { DEMO_CREDENTIALS, CredentialUser } from '@/lib/auth/credentials';
import { Lock, Mail, Building2, ArrowRight, AlertCircle, ShieldCheck, Key, Check } from 'lucide-react';
import Link from 'next/link';

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
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      // Validate credentials against registry
      const matched = DEMO_CREDENTIALS.find(
        (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
      );

      if (!matched) {
        setErrorMessage('Invalid email address or password. Try a demo quick-fill option below.');
        setLoading(false);
        return;
      }

      // Update Auth context, permissions, and feature flags
      setUser({
        id: `usr-${matched.roleKey}`,
        email: matched.email,
        firstName: matched.firstName,
        lastName: matched.lastName,
        role: matched.roleTitle,
      });

      setPermissions(matched.permissions);
      setFeatures(matched.features);

      // Redirect to role-specific dashboard
      router.push(matched.targetDashboard);
    }, 400);
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
