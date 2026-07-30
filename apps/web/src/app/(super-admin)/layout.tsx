"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { ShieldAlert, Building, BarChart3, Activity, ArrowLeft, LogOut, Lock } from 'lucide-react';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.role === 'Platform Super-Admin';

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push('/login');
    }
  }, [isSuperAdmin, router]);

  if (!isSuperAdmin) {
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
            <span className="text-[10px] text-slate-400">{user?.email}</span>
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
      <div className="flex flex-1">
        {/* Isolated Super Admin Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-4 space-y-4">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Management
          </div>
          <nav className="space-y-1">
            <Link
              href="/super-admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/super-admin'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Platform Overview</span>
            </Link>

            <Link
              href="/super-admin/tenants"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/super-admin/tenants'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Tenants Directory</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-8 bg-slate-950 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
