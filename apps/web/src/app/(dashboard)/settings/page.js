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
exports.default = SettingsPage;
const react_1 = __importStar(require("react"));
const ThemeProvider_1 = require("@/providers/ThemeProvider");
const TenantProvider_1 = require("@/providers/TenantProvider");
const lucide_react_1 = require("lucide-react");
const client_1 = require("@/lib/api/client");
function SettingsPage() {
    const { theme, updateCustomTheme } = (0, ThemeProvider_1.useTheme)();
    const { tenant } = (0, TenantProvider_1.useTenant)();
    const [clinicName, setClinicName] = (0, react_1.useState)(tenant?.name || 'Apex Health Clinic');
    const [subdomain, setSubdomain] = (0, react_1.useState)(tenant?.subdomain || 'apexhealth');
    const [customDomain, setCustomDomain] = (0, react_1.useState)(tenant?.customDomain || 'clinic.apexhealth.com');
    const [primaryColor, setPrimaryColor] = (0, react_1.useState)('221.2 83.2% 53.3%');
    const [saved, setSaved] = (0, react_1.useState)(false);
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await (0, client_1.apiFetch)('/clinic/branding', {
                method: 'PUT',
                body: JSON.stringify({
                    name: clinicName,
                    subdomain,
                    customDomain,
                    primaryColor
                }),
            });
            updateCustomTheme({ primary: primaryColor });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
        catch (error) {
            console.error('Failed to save branding settings', error);
        }
        finally {
            setIsSaving(false);
        }
    };
    return (<div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic & Branding Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure white-label branding colors, custom domain names, and branch parameters
          </p>
        </div>

        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50">
          {isSaving ? <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/> : saved ? <lucide_react_1.Check className="w-3.5 h-3.5"/> : <lucide_react_1.Save className="w-3.5 h-3.5"/>}
          <span>{isSaving ? 'Saving...' : saved ? 'Saved Changes!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* 1. White Label Branding Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <lucide_react_1.Palette className="w-4 h-4 text-primary"/>
          <h3 className="font-bold text-sm text-foreground">White-Label Branding Engine</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Clinic Identity Name</label>
            <input type="text" value={clinicName} onChange={(e) => setClinicName(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Primary Accent Brand Color (HSL)</label>
            <div className="flex items-center gap-2">
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
              <div className="h-9 w-12 rounded-lg border border-border shrink-0 shadow-xs" style={{ backgroundColor: `hsl(${primaryColor})` }}/>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Custom Domain & Subdomain Resolution */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <lucide_react_1.Globe className="w-4 h-4 text-primary"/>
          <h3 className="font-bold text-sm text-foreground">Domain & Tenant Resolution</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Platform Subdomain</label>
            <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
              <span className="font-mono text-foreground">{subdomain}</span>
              <span className="text-muted-foreground ml-1">.platform.com</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Custom Domain URL</label>
            <input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
          </div>
        </div>
      </div>
    </div>);
}
