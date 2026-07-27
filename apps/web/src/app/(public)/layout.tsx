"use client";

import React from 'react';
import { useTenant } from '@/providers/TenantProvider';
import { Building2, ShieldCheck, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenant();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Public Patient Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm">
            {tenant?.name ? tenant.name.charAt(0) : 'Q'}
          </div>
          <div>
            <div className="font-bold text-sm text-foreground tracking-tight">
              {tenant?.name || 'Apex Health Clinic'}
            </div>
            <div className="text-[11px] text-muted-foreground">Online Patient Booking Portal</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
            <PhoneCall className="w-3.5 h-3.5 text-primary" />
            <span>Emergency: +1 (800) 555-0199</span>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-foreground hover:bg-muted transition-colors font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Staff Login</span>
          </Link>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1 flex flex-col justify-center p-4 md:p-8 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/40 py-6 text-center text-xs text-muted-foreground space-y-1">
        <div>Powered by Quravo Healthcare SaaS Platform • HIPAA Compliant Engine</div>
        <div className="text-[11px] opacity-70">© 2026 {tenant?.name || 'Apex Health Clinic'}. All rights reserved.</div>
      </footer>
    </div>
  );
}
