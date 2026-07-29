"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PublicLayout;
const react_1 = __importDefault(require("react"));
const TenantProvider_1 = require("@/providers/TenantProvider");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function PublicLayout({ children }) {
    const { tenant } = (0, TenantProvider_1.useTenant)();
    return (<div className="min-h-screen flex flex-col bg-background text-foreground">
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
            <lucide_react_1.PhoneCall className="w-3.5 h-3.5 text-primary"/>
            <span>Emergency: +1 (800) 555-0199</span>
          </div>

          <link_1.default href="/login" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-foreground hover:bg-muted transition-colors font-semibold">
            <lucide_react_1.ShieldCheck className="w-3.5 h-3.5 text-primary"/>
            <span>Staff Login</span>
          </link_1.default>
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
    </div>);
}
