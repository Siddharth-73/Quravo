"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { getSidebar } from '@/lib/navigation/get-sidebar';
import { useFeatureFlags } from '@/providers/FeatureFlagProvider';
import { usePermissions } from '@/providers/PermissionProvider';
import { useTenant } from '@/providers/TenantProvider';
import { useAuth } from '@/providers/AuthProvider';
import { apiFetch } from '@/lib/api/client';
import { NavItem } from '@/lib/navigation/sidebar-schema';
import { Lock, Sparkles, X, Loader2 } from 'lucide-react';
import { CommandPalette } from '@/components/command-palette/CommandPalette';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { features, setFeatures } = useFeatureFlags();
  const { permissions, setPermissions } = usePermissions();
  const { tenant, setTenant } = useTenant();
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [upgradeModalItem, setUpgradeModalItem] = useState<NavItem | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const session = await apiFetch<any>('/auth/session');
        setUser(session.user);
        setTenant(session.tenant);
        setPermissions(session.permissions);
        setFeatures(session.features);
        setLoading(false);
      } catch (err) {
        console.warn('Session restoration failed:', err);
        // Clear auth contexts
        setUser(null);
        router.push('/login');
      }
    }
    restoreSession();
  }, [setUser, setTenant, setPermissions, setFeatures, router]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Compute navigation tree via NavigationService outside components
  const navigation = getSidebar({ features, permissions });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground animate-pulse font-medium">Validating clinic session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Header Bar */}
      <AppHeader
        tenantName={tenant?.name || 'Apex Health Clinic'}
        logoUrl={tenant?.logoUrl}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1">
        {/* Purely Presentational Sidebar */}
        <AppSidebar
          navigation={navigation}
          onUpgradeClick={(item) => setUpgradeModalItem(item)}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 bg-muted/20 overflow-y-auto min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Upgrade Teaser Modal for Locked Subscription Modules */}
      {upgradeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                <Lock className="w-4 h-4" />
                <span>Feature Locked</span>
              </div>
              <button
                onClick={() => setUpgradeModalItem(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Unlock {upgradeModalItem.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The <span className="font-semibold text-foreground">{upgradeModalItem.title}</span> module is available on our <span className="text-primary font-medium">Growth & ERP</span> tiers. Upgrade today to streamline clinic operations.
              </p>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-foreground">
                <span className="font-semibold">Instant Activation:</span> Upgrade takes effect immediately across all branches without losing clinic data.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUpgradeModalItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors text-foreground"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  alert(`Upgrading tenant to unlock ${upgradeModalItem.title}`);
                  setUpgradeModalItem(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
}
