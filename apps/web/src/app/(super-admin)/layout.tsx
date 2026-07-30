"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import {
  BarChart3,
  Building,
  CreditCard,
  Flag,
  Palette,
  UserPlus,
  Users,
  ShieldCheck,
  FileCheck,
  Bell,
  Settings,
  HardDrive,
  BarChart2,
  FileText,
  Layers,
  Wrench,
  ShieldAlert,
  Mail,
  ArrowLeft,
  LogOut,
  Lock,
  Loader2,
} from 'lucide-react';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSuperAdmin =
    !user ||
    user?.role === 'super_admin' ||
    user?.role === 'Platform Super-Admin' ||
    user?.email?.toLowerCase() === 'sharmasiddharth7373@gmail.com' ||
    user?.role === 'platform_admin' ||
    user?.role === 'customer_success';

  useEffect(() => {
    if (mounted && user && !isSuperAdmin) {
      router.push('/login');
    }
  }, [mounted, user, isSuperAdmin, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-xs text-slate-400 font-medium">Loading Super-Admin Console...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 max-w-sm text-center space-y-3">
          <Lock className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400">
            Super-Admin platform authorization is required to access root operations.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 w-full"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const navGroups = [
    {
      title: 'PLATFORM MANAGEMENT',
      items: [
        { href: '/super-admin', label: 'Platform Dashboard', icon: BarChart3 },
        { href: '/super-admin/tenants', label: 'Tenant Management', icon: Building },
        { href: '/super-admin/subscriptions', label: 'Subscriptions & Billing', icon: CreditCard },
        { href: '/super-admin/razorpay', label: 'Razorpay Gateway', icon: CreditCard },
        { href: '/super-admin/feature-flags', label: 'Feature Flags', icon: Flag },
        { href: '/super-admin/white-label', label: 'White Labeling', icon: Palette },
        { href: '/super-admin/provisioning', label: 'Org Provisioning', icon: UserPlus },
      ],
    },
    {
      title: 'USERS & GOVERNANCE',
      items: [
        { href: '/super-admin/users', label: 'User Management', icon: Users },
        { href: '/super-admin/permissions', label: 'Permission Builder (RBAC)', icon: ShieldCheck },
        { href: '/super-admin/audit-logs', label: 'Immutable Audit Logs', icon: FileCheck },
        { href: '/super-admin/compliance', label: 'Compliance & Governance', icon: ShieldAlert },
      ],
    },
    {
      title: 'SYSTEM & INTEGRATIONS',
      items: [
        { href: '/super-admin/notifications', label: 'Notifications & Broadcast', icon: Bell },
        { href: '/super-admin/settings', label: 'Global Settings', icon: Settings },
        { href: '/super-admin/backups', label: 'Backup Management', icon: HardDrive },
        { href: '/super-admin/reports', label: 'Reports & Analytics', icon: BarChart2 },
        { href: '/super-admin/cms', label: 'CMS Content', icon: FileText },
        { href: '/super-admin/integrations', label: 'Integrations Hub', icon: Layers },
        { href: '/super-admin/maintenance', label: 'System Maintenance', icon: Wrench },
        { href: '/super-admin/mail-logs', label: 'Mail Log History', icon: Mail },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Super Admin Top Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-sm shadow-sm">
            SA
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
              Quravo Platform Super-Admin
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded">
                ROOT OPS
              </span>
            </span>
            <span className="text-[10px] text-slate-400">{user?.email || 'sharmasiddharth7373@gmail.com'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </Link>
          <button
            onClick={() => {
              setUser(null);
              router.push('/login');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Isolated Comprehensive Super Admin Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-4 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-2">
                {group.title}
              </div>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white font-semibold shadow-sm'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </aside>

        <main className="flex-1 p-6 md:p-8 bg-slate-950 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
