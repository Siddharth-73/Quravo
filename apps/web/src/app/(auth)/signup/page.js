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
exports.default = SmartSignupPage;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function SmartSignupPage() {
    const router = (0, navigation_1.useRouter)();
    const [fullName, setFullName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('doctor');
    // Conditional Fields
    const [selectedClinic, setSelectedClinic] = (0, react_1.useState)('Apex Health Main Clinic');
    const [clinicName, setClinicName] = (0, react_1.useState)('');
    const [subdomain, setSubdomain] = (0, react_1.useState)('');
    const [submittedStatus, setSubmittedStatus] = (0, react_1.useState)('none');
    const handleSignup = (e) => {
        e.preventDefault();
        if (role === 'patient') {
            setSubmittedStatus('patient_success');
        }
        else if (role === 'admin') {
            setSubmittedStatus('admin_pending');
        }
        else {
            setSubmittedStatus('staff_pending');
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg mb-2">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Your Account</h1>
          <p className="text-xs text-muted-foreground">
            Select your role to request clinic access or register a new healthcare practice
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
          {submittedStatus === 'none' ? (<form onSubmit={handleSignup} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Full Name *</label>
                <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <lucide_react_1.User className="w-4 h-4 text-muted-foreground mr-2 shrink-0"/>
                  <input type="text" required placeholder="e.g. Dr. Gregory House" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-transparent text-foreground focus:outline-none"/>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Email Address *</label>
                <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <lucide_react_1.Mail className="w-4 h-4 text-muted-foreground mr-2 shrink-0"/>
                  <input type="email" required placeholder="house@clinic.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent text-foreground focus:outline-none"/>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Password *</label>
                <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <lucide_react_1.Lock className="w-4 h-4 text-muted-foreground mr-2 shrink-0"/>
                  <input type="password" required placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent text-foreground focus:outline-none font-mono"/>
                </div>
              </div>

              {/* Role Selection Dropdown (No Super-Admin) */}
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Select Your Account Role *</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium">
                  <option value="doctor">Doctor / Physician (Clinical Staff)</option>
                  <option value="nurse">Nurse / Triage Head (Clinical Staff)</option>
                  <option value="receptionist">Front Desk Receptionist (Operations)</option>
                  <option value="pharmacist">Pharmacist (Pharmacy Operations)</option>
                  <option value="patient">Patient (Self-Service Patient Portal)</option>
                  <option value="admin">Clinic Owner / Hospital Director (New Practice)</option>
                </select>
              </div>

              {/* Conditional Dropdown for Staff */}
              {role !== 'patient' && role !== 'admin' && (<div className="space-y-1 animate-in fade-in duration-200">
                  <label className="font-semibold text-foreground">Select Registered Clinic to Join *</label>
                  <select value={selectedClinic} onChange={(e) => setSelectedClinic(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium">
                    <option value="Apex Health Main Clinic">Apex Health Main Clinic</option>
                    <option value="Sunrise Dental & Medical Chain">Sunrise Dental & Medical Chain</option>
                    <option value="Valley Community Hospital">Valley Community Hospital</option>
                    <option value="Metro Urgent Care Center">Metro Urgent Care Center</option>
                  </select>
                  <p className="text-[10px] text-muted-foreground pt-0.5">
                    Your request will be sent to the Clinic Administrator for approval before login.
                  </p>
                </div>)}

              {/* Conditional Fields for Clinic Owner */}
              {role === 'admin' && (<div className="space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Practice / Clinic Name *</label>
                    <input type="text" required placeholder="e.g. Baker Street Medical" value={clinicName} onChange={(e) => {
                    setClinicName(e.target.value);
                    setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                }} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"/>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Desired Subdomain URL</label>
                    <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
                      <input type="text" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} placeholder="bakerhealth" className="w-full bg-transparent font-mono text-foreground focus:outline-none"/>
                      <span className="text-muted-foreground text-[11px]">.platform.com</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground">
                    Your tenant onboarding request will be sent to the Platform Super-Admin for verification & provisioning.
                  </p>
                </div>)}

              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm mt-2">
                <span>Submit Registration Request</span>
                <lucide_react_1.ArrowRight className="w-3.5 h-3.5"/>
              </button>
            </form>) : (<div className="text-center space-y-4 py-4 text-xs animate-in zoom-in-95 duration-200">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <lucide_react_1.Clock className="w-7 h-7"/>
              </div>

              {submittedStatus === 'patient_success' && (<div className="space-y-2">
                  <h3 className="font-bold text-base text-foreground">Patient Registration Complete!</h3>
                  <p className="text-muted-foreground">
                    Your patient account has been created. You can log in immediately to book appointments.
                  </p>
                </div>)}

              {submittedStatus === 'staff_pending' && (<div className="space-y-2">
                  <h3 className="font-bold text-base text-foreground">Request Sent to Clinic Administrator</h3>
                  <p className="text-muted-foreground">
                    Your request to join <span className="font-bold text-foreground">{selectedClinic}</span> as a <span className="font-bold text-foreground">{role.toUpperCase()}</span> is pending approval by the Clinic Administrator.
                  </p>
                </div>)}

              {submittedStatus === 'admin_pending' && (<div className="space-y-2">
                  <h3 className="font-bold text-base text-foreground">Hospital Onboarding Request Sent</h3>
                  <p className="text-muted-foreground">
                    Your clinic onboarding request for <span className="font-bold text-foreground">{clinicName || 'New Clinic'}</span> (<span className="font-mono text-primary">{subdomain}.platform.com</span>) has been sent to the **Platform Super-Admin** for provisioning.
                  </p>
                </div>)}

              <link_1.default href="/login" className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold">
                <span>Return to Login</span>
              </link_1.default>
            </div>)}

          <div className="text-center pt-2 border-t border-border text-[11px] text-muted-foreground">
            Already registered?{' '}
            <link_1.default href="/login" className="text-primary font-semibold hover:underline">
              Sign In Here
            </link_1.default>
          </div>
        </div>
      </div>
    </div>);
}
