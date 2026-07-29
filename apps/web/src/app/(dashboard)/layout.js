"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardLayout;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const AppHeader_1 = require("@/components/layout/AppHeader");
const AppSidebar_1 = require("@/components/layout/AppSidebar");
const get_sidebar_1 = require("@/lib/navigation/get-sidebar");
const FeatureFlagProvider_1 = require("@/providers/FeatureFlagProvider");
const PermissionProvider_1 = require("@/providers/PermissionProvider");
const TenantProvider_1 = require("@/providers/TenantProvider");
const AuthProvider_1 = require("@/providers/AuthProvider");
const lucide_react_1 = require("lucide-react");
const CommandPalette_1 = require("@/components/command-palette/CommandPalette");
function DashboardLayout({ children }) {
    const { features, setFeatures } = (0, FeatureFlagProvider_1.useFeatureFlags)();
    const { permissions, setPermissions } = (0, PermissionProvider_1.usePermissions)();
    const { tenant, setTenant } = (0, TenantProvider_1.useTenant)();
    const { user, setUser } = (0, AuthProvider_1.useAuth)();
    const router = (0, navigation_1.useRouter)();
    const [upgradeModalItem, setUpgradeModalItem] = (0, react_1.useState)(null);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        async function restoreSession() {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
                const res = await fetch(`${API_BASE}/auth/session`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (res.status === 401) {
                    // No valid session — redirect to login
                    setUser(null);
                    router.push('/login');
                    return;
                }
                if (!res.ok) {
                    // Transient error (429, 500, etc.) — don't throw user out
                    // Just stop the loading spinner and let them use existing context
                    setLoading(false);
                    return;
                }
                const session = await res.json();
                setUser(session.user);
                setTenant(session.tenant);
                setPermissions(session.permissions);
                setFeatures(session.features);
                setLoading(false);
            }
            catch {
                // Network error or server down — don't kick out, stop loading
                setLoading(false);
            }
        }
        restoreSession();
    }, [setUser, setTenant, setPermissions, setFeatures, router]);
    (0, react_1.useEffect)(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsCommandPaletteOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);
    // Compute navigation tree via NavigationService outside components
    const navigation = (0, get_sidebar_1.getSidebar)({ features, permissions });
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <lucide_react_1.Loader2 className="w-8 h-8 animate-spin text-primary"/>
          <p className="text-xs text-muted-foreground animate-pulse font-medium">Validating clinic session...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Header Bar */}
      <AppHeader_1.AppHeader tenantName={tenant?.name || 'Apex Health Clinic'} logoUrl={tenant?.logoUrl} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}/>

      {/* Main Workspace Layout */}
      <div className="flex flex-1">
        {/* Purely Presentational Sidebar */}
        <AppSidebar_1.AppSidebar navigation={navigation} onUpgradeClick={(item) => setUpgradeModalItem(item)}/>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 bg-muted/20 overflow-y-auto min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Upgrade Teaser Modal for Locked Subscription Modules */}
      {upgradeModalItem && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                <lucide_react_1.Lock className="w-4 h-4"/>
                <span>Feature Locked</span>
              </div>
              <button onClick={() => setUpgradeModalItem(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <lucide_react_1.X className="w-4 h-4"/>
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
              <lucide_react_1.Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5"/>
              <div className="text-xs text-foreground">
                <span className="font-semibold">Instant Activation:</span> Upgrade takes effect immediately across all branches without losing clinic data.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setUpgradeModalItem(null)} className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors text-foreground">
                Maybe Later
              </button>
              <button onClick={() => {
                alert(`Upgrading tenant to unlock ${upgradeModalItem.title}`);
                setUpgradeModalItem(null);
            }} className="px-4 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5">
                <lucide_react_1.Sparkles className="w-3.5 h-3.5"/>
                <span>Upgrade Plan</span>
              </button>
            </div>
          </div>
        </div>)}

      <CommandPalette_1.CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)}/>
    </div>);
}
