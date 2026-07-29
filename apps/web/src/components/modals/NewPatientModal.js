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
exports.NewPatientModal = NewPatientModal;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const hooks_1 = require("@/domains/patients/hooks");
function NewPatientModal({ isOpen, onClose, onPatientCreated }) {
    const [fullName, setFullName] = (0, react_1.useState)('');
    const [gender, setGender] = (0, react_1.useState)('Female');
    const [age, setAge] = (0, react_1.useState)('30');
    const [phone, setPhone] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const createPatientMutation = (0, hooks_1.useCreatePatient)();
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName)
            return;
        // Parse full name into first and last name
        const names = fullName.trim().split(' ');
        const firstName = names[0];
        const lastName = names.length > 1 ? names.slice(1).join(' ') : 'Unknown';
        // Calculate approx date of birth from age
        const parsedAge = parseInt(age, 10) || 30;
        const dobYear = new Date().getFullYear() - parsedAge;
        const dateOfBirth = `${dobYear}-01-01`;
        try {
            const savedPatient = await createPatientMutation.mutateAsync({
                firstName,
                lastName,
                dateOfBirth,
                gender,
                phone: phone || '+1 (555) 000-0000',
                email: email || `${firstName.toLowerCase()}@example.com`,
            });
            onPatientCreated({
                mrn: savedPatient.mrn,
                fullName: savedPatient.fullName,
                gender: savedPatient.gender,
                age: parsedAge,
                phone: savedPatient.phone,
                email: savedPatient.email,
            });
            setFullName('');
            setPhone('');
            setEmail('');
            setAge('30');
            onClose();
        }
        catch (err) {
            alert(err.message || 'Failed to create patient.');
        }
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <lucide_react_1.User className="w-4 h-4 text-primary"/>
            <h3 className="font-bold text-sm text-foreground">Register New Patient</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <lucide_react_1.X className="w-4 h-4"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Full Name *</label>
            <input type="text" required placeholder="e.g. Clara Oswald" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Phone Number</label>
            <input type="text" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Email Address</label>
            <input type="email" placeholder="patient@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground">
              Cancel
            </button>
            <button type="submit" disabled={createPatientMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5 disabled:opacity-50">
              {createPatientMutation.isPending ? (<>
                  <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/>
                  <span>Registering...</span>
                </>) : (<>
                  <lucide_react_1.Save className="w-3.5 h-3.5"/>
                  <span>Register Patient</span>
                </>)}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
