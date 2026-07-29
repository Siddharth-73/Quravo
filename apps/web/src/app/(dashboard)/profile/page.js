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
exports.default = ProfilePage;
const react_1 = __importStar(require("react"));
const AuthProvider_1 = require("@/providers/AuthProvider");
const lucide_react_1 = require("lucide-react");
const client_1 = require("@/lib/api/client");
function ProfilePage() {
    const { user } = (0, AuthProvider_1.useAuth)();
    const [firstName, setFirstName] = (0, react_1.useState)(user?.firstName || 'Sarah');
    const [lastName, setLastName] = (0, react_1.useState)(user?.lastName || 'Jenkins');
    const [email, setEmail] = (0, react_1.useState)(user?.email || 'sarah.jenkins@apexhealth.com');
    const [currentPassword, setCurrentPassword] = (0, react_1.useState)('');
    const [newPassword, setNewPassword] = (0, react_1.useState)('');
    const [saved, setSaved] = (0, react_1.useState)(false);
    const [isPending, setIsPending] = (0, react_1.useState)(false);
    const [errorMsg, setErrorMsg] = (0, react_1.useState)('');
    const handleSave = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMsg('');
        try {
            await (0, client_1.apiFetch)('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            setCurrentPassword('');
            setNewPassword('');
        }
        catch (err) {
            setErrorMsg(err.message || 'Failed to update profile');
        }
        finally {
            setIsPending(false);
        }
    };
    return (<div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Profile & Account Security</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your personal credentials, contact email, and security settings
          </p>
        </div>

        <button onClick={handleSave} disabled={isPending} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50">
          {isPending ? <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/> : saved ? <lucide_react_1.Check className="w-3.5 h-3.5"/> : <lucide_react_1.Save className="w-3.5 h-3.5"/>}
          <span>{isPending ? 'Saving...' : saved ? 'Saved Changes!' : 'Save Profile'}</span>
        </button>
      </div>

      {errorMsg && (<div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
          <lucide_react_1.AlertCircle className="w-4 h-4 shrink-0"/>
          <span>{errorMsg}</span>
        </div>)}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs text-center space-y-4">
          <div className="relative inline-block">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 font-bold text-2xl text-primary mx-auto border-2 border-primary/20 shadow-inner">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:opacity-90">
              <lucide_react_1.Camera className="w-3.5 h-3.5"/>
            </button>
          </div>

          <div>
            <div className="font-bold text-sm text-foreground">{firstName} {lastName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{user?.role || 'Lead Physician'}</div>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
            <lucide_react_1.ShieldCheck className="w-3.5 h-3.5"/>
            <span>Active Staff Credentials</span>
          </div>
        </div>

        {/* Form Controls */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-foreground border-b border-border pb-3">Personal Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
            </div>
          </form>

          {/* Password Security */}
          <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-foreground border-b border-border pb-3">Security & Password</h3>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Current Password</label>
              <input type="password" placeholder="••••••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">New Password</label>
              <input type="password" placeholder="••••••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
            </div>
          </form>
        </div>
      </div>
    </div>);
}
