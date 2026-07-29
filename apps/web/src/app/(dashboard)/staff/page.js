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
exports.default = StaffPage;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const hooks_1 = require("@/domains/clinic/hooks");
function StaffPage() {
    const { data: staffList = [], isLoading } = (0, hooks_1.useStaff)();
    const inviteStaffMutation = (0, hooks_1.useInviteStaff)();
    const [isInviting, setIsInviting] = (0, react_1.useState)(false);
    const [inviteEmail, setInviteEmail] = (0, react_1.useState)('');
    const [inviteRole, setInviteRole] = (0, react_1.useState)('staff');
    const [successMessage, setSuccessMessage] = (0, react_1.useState)('');
    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail)
            return;
        try {
            const result = await inviteStaffMutation.mutateAsync({
                email: inviteEmail,
                role: inviteRole,
            });
            setSuccessMessage(result.message);
            setInviteEmail('');
            setIsInviting(false);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
        catch (error) {
            console.error(error);
        }
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff & Role Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage clinic practitioners, staff invitations, and RBAC permission roles
          </p>
        </div>

        <button onClick={() => setIsInviting(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
          <lucide_react_1.UserPlus className="w-3.5 h-3.5"/>
          <span>Invite Staff Member</span>
        </button>
      </div>

      {successMessage && (<div className="p-3 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
          {successMessage}
        </div>)}

      {isInviting && (<form onSubmit={handleInvite} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm text-xs animate-in fade-in duration-200">
          <h3 className="font-bold text-sm text-foreground">Invite New Staff Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Email Address *</label>
              <input type="email" required placeholder="e.g. doctor@clinic.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" disabled={inviteStaffMutation.isPending}/>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Assigned Role *</label>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" disabled={inviteStaffMutation.isPending}>
                <option value="admin">Administrator</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="receptionist">Receptionist</option>
                <option value="accountant">Accountant</option>
                <option value="staff">General Staff</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsInviting(false)} className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted" disabled={inviteStaffMutation.isPending}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2" disabled={inviteStaffMutation.isPending}>
              {inviteStaffMutation.isPending ? <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/> : null}
              {inviteStaffMutation.isPending ? 'Sending Invite...' : 'Send Invitation'}
            </button>
          </div>
        </form>)}

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <span className="w-1/3">Staff Name & Email</span>
          <span className="w-1/4">Assigned Role</span>
          <span className="w-1/4">Account Status</span>
        </div>

        {isLoading ? (<div className="flex justify-center p-8">
             <lucide_react_1.Loader2 className="w-6 h-6 animate-spin text-muted-foreground"/>
          </div>) : (<div className="space-y-2">
            {staffList.map((staff) => (<div key={staff.id} className="flex flex-col sm:flex-row sm:items-center p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors gap-4">
                <div className="flex items-center gap-3 w-1/3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                    {staff.firstName?.charAt(0) || staff.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-foreground">
                      {staff.firstName} {staff.lastName}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                      <lucide_react_1.Mail className="w-3 h-3 shrink-0"/> {staff.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground w-1/4 capitalize">
                  <lucide_react_1.ShieldCheck className="w-3.5 h-3.5 text-primary"/>
                  <span>{staff.role}</span>
                </div>

                <div className="w-1/4">
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border capitalize ${staff.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
                    {staff.status}
                  </span>
                </div>
              </div>))}
            {staffList.length === 0 && (<div className="text-center py-8 text-muted-foreground text-sm">
                No staff members found.
              </div>)}
          </div>)}
      </div>
    </div>);
}
