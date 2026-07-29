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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResetPasswordPage;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const client_1 = require("@/lib/api/client");
function ResetPasswordForm() {
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [isPending, setIsPending] = (0, react_1.useState)(false);
    const [errorMsg, setErrorMsg] = (0, react_1.useState)('');
    const [success, setSuccess] = (0, react_1.useState)(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }
        if (!token) {
            setErrorMsg('Invalid or missing reset token');
            return;
        }
        setIsPending(true);
        setErrorMsg('');
        try {
            await (0, client_1.apiFetch)('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, newPassword }),
            });
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
        catch (err) {
            setErrorMsg(err.message || 'Failed to reset password');
        }
        finally {
            setIsPending(false);
        }
    };
    return (<div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
      {!success ? (<form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (<div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errorMsg}
            </div>)}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">New Password</label>
            <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
              <lucide_react_1.Lock className="w-4 h-4 text-muted-foreground mr-2 shrink-0"/>
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-transparent text-foreground focus:outline-none font-mono"/>
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Confirm Password</label>
            <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
              <lucide_react_1.Lock className="w-4 h-4 text-muted-foreground mr-2 shrink-0"/>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-transparent text-foreground focus:outline-none font-mono"/>
            </div>
          </div>

          <button type="submit" disabled={isPending} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm mt-2 disabled:opacity-50">
            {isPending ? (<>
                <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/>
                <span>Resetting...</span>
              </>) : (<>
                <span>Reset Password</span>
                <lucide_react_1.ArrowRight className="w-3.5 h-3.5"/>
              </>)}
          </button>
        </form>) : (<div className="text-center space-y-4 py-3 text-xs">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <lucide_react_1.CheckCircle2 className="w-6 h-6"/>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-foreground">Password Reset Successful</h3>
            <p className="text-muted-foreground">
              Your password has been reset. Redirecting to login...
            </p>
          </div>
        </div>)}
      <div className="text-center pt-2 border-t border-border text-[11px]">
        <link_1.default href="/login" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
          <lucide_react_1.ArrowLeft className="w-3 h-3"/>
          <span>Back to Login</span>
        </link_1.default>
      </div>
    </div>);
}
function ResetPasswordPage() {
    return (<div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg mb-2">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Password</h1>
          <p className="text-xs text-muted-foreground">
            Please enter your new password below
          </p>
        </div>
        <react_1.Suspense fallback={<div className="flex justify-center p-8"><lucide_react_1.Loader2 className="w-6 h-6 animate-spin text-primary"/></div>}>
          <ResetPasswordForm />
        </react_1.Suspense>
      </div>
    </div>);
}
