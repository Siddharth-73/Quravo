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
exports.default = LoginPage;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const AuthProvider_1 = require("@/providers/AuthProvider");
const PermissionProvider_1 = require("@/providers/PermissionProvider");
const FeatureFlagProvider_1 = require("@/providers/FeatureFlagProvider");
const credentials_1 = require("@/lib/auth/credentials");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const client_1 = require("@/lib/api/client");
const ALL_PERMISSIONS = [
    'patients:read',
    'patients:write',
    'patients:delete',
    'appointments:read',
    'appointments:write',
    'emr:read',
    'emr:write',
    'billing:read',
    'billing:write',
    'admin:access',
    'settings:read',
    'settings:write',
];
function expandPermissions(rawPermissions) {
    const result = new Set();
    for (const perm of rawPermissions) {
        if (perm === '*') {
            ALL_PERMISSIONS.forEach((p) => result.add(p));
        }
        else if (perm.endsWith(':*')) {
            const prefix = perm.slice(0, -2);
            ALL_PERMISSIONS.forEach((p) => {
                if (p.startsWith(prefix + ':')) {
                    result.add(p);
                }
            });
            if (prefix === 'emr' || prefix === 'prescriptions') {
                result.add('emr:read');
                result.add('emr:write');
            }
        }
        else {
            if (perm === 'vitals:write') {
                result.add('emr:write');
            }
            else if (ALL_PERMISSIONS.includes(perm)) {
                result.add(perm);
            }
        }
    }
    return Array.from(result);
}
const getDashboardForRole = (role) => {
    switch (role) {
        case 'super_admin':
            return '/super-admin';
        case 'doctor':
        case 'Lead Physician':
            return '/dashboards/doctor';
        case 'nurse':
        case 'Triage Head Nurse':
            return '/dashboards/nurse';
        case 'receptionist':
        case 'Front Desk Receptionist':
            return '/dashboards/receptionist';
        case 'pharmacist':
        case 'Chief Pharmacist':
            return '/dashboards/pharmacist';
        case 'patient':
        case 'Patient User':
            return '/dashboards/patient';
        case 'owner':
        case 'admin':
        case 'Clinic Owner & Director':
        default:
            return '/dashboards/admin';
    }
};
function LoginPage() {
    const router = (0, navigation_1.useRouter)();
    const { setUser } = (0, AuthProvider_1.useAuth)();
    const { setPermissions } = (0, PermissionProvider_1.usePermissions)();
    const { setFeatures } = (0, FeatureFlagProvider_1.useFeatureFlags)();
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [subdomain, setSubdomain] = (0, react_1.useState)('apexhealth');
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        // 1. Check against defined DEMO registry for instant authentication
        const matchedDemo = credentials_1.DEMO_CREDENTIALS.find((c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
        if (matchedDemo) {
            setTimeout(() => {
                setUser({
                    id: `usr-${matchedDemo.roleKey}`,
                    email: matchedDemo.email,
                    firstName: matchedDemo.firstName,
                    lastName: matchedDemo.lastName,
                    role: matchedDemo.roleTitle,
                });
                setPermissions(matchedDemo.permissions);
                setFeatures(matchedDemo.features);
                router.push(matchedDemo.targetDashboard);
            }, 300);
            return;
        }
        // 2. Otherwise attempt live NestJS API authentication
        try {
            const authData = await (0, client_1.apiFetch)('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    clinicSlug: subdomain,
                }),
            });
            let clientPermissions = [];
            let clientFeatures = credentials_1.fullFeatures;
            if (authData.user.role === 'super_admin') {
                clientPermissions = ['admin:access'];
            }
            else {
                const rolesData = await (0, client_1.apiFetch)('/rbac/roles', {
                    token: authData.accessToken,
                    headers: {
                        'X-Tenant-ID': authData.user.tenantId,
                    },
                }).catch(() => []);
                const modulesData = await (0, client_1.apiFetch)('/rbac/modules', {
                    token: authData.accessToken,
                    headers: {
                        'X-Tenant-ID': authData.user.tenantId,
                    },
                }).catch(() => ({}));
                const userRole = Array.isArray(rolesData) ? rolesData.find((r) => r.name === authData.user.role) : undefined;
                const rawPermissions = userRole ? userRole.permissions : [];
                clientPermissions = expandPermissions(rawPermissions);
                clientFeatures = { ...credentials_1.fullFeatures, ...modulesData };
            }
            setUser({
                id: authData.user.id,
                email: authData.user.email,
                firstName: authData.user.firstName || 'User',
                lastName: authData.user.lastName || '',
                role: authData.user.role,
            });
            setPermissions(clientPermissions);
            setFeatures(clientFeatures);
            const targetDashboard = getDashboardForRole(authData.user.role);
            router.push(targetDashboard);
        }
        catch (apiError) {
            setErrorMessage(apiError.message || 'Invalid email address or password. Please check your credentials.');
            setLoading(false);
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg mb-2">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Clinic Staff Sign In</h1>
          <p className="text-xs text-muted-foreground">
            Enter your credentials to access your workspace
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
          {errorMessage && (<div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 animate-in fade-in duration-200 font-medium">
              <lucide_react_1.AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{errorMessage}</span>
            </div>)}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Clinic Subdomain</label>
              <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                <lucide_react_1.Building2 className="w-4 h-4 text-muted-foreground mr-2 shrink-0"/>
                <input type="text" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} className="w-full bg-transparent text-foreground focus:outline-none font-mono"/>
                <span className="text-muted-foreground text-[11px]">.platform.com</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Email Address</label>
              <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                <lucide_react_1.Mail className="w-4 h-4 text-muted-foreground mr-2 shrink-0"/>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@clinic.com" className="w-full bg-transparent text-foreground focus:outline-none"/>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground">Password</label>
                <link_1.default href="/forgot-password" className="text-[11px] text-primary hover:underline font-medium">
                  Forgot password?
                </link_1.default>
              </div>
              <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                <lucide_react_1.Lock className="w-4 h-4 text-muted-foreground mr-2 shrink-0"/>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-transparent text-foreground focus:outline-none font-mono"/>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm mt-2">
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <lucide_react_1.ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border text-[11px] text-muted-foreground">
            Don't have a clinic account?{' '}
            <link_1.default href="/signup" className="text-primary font-semibold hover:underline">
              Register New Clinic
            </link_1.default>
          </div>
        </div>
      </div>
    </div>);
}
