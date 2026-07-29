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
exports.default = RolesAndModulesPage;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const FeatureFlagProvider_1 = require("@/providers/FeatureFlagProvider");
const hooks_1 = require("@/domains/rbac/hooks");
function RolesAndModulesPage() {
    const { features, setFeatures } = (0, FeatureFlagProvider_1.useFeatureFlags)();
    const { data: rolesList = [], isLoading: isLoadingRoles } = (0, hooks_1.useRoles)();
    const { data: modulesList = [], isLoading: isLoadingModules } = (0, hooks_1.useModules)();
    const toggleModuleMutation = (0, hooks_1.useToggleModule)();
    const createRoleMutation = (0, hooks_1.useCreateRole)();
    const [saved, setSaved] = (0, react_1.useState)(false);
    const [showCreateRoleModal, setShowCreateRoleModal] = (0, react_1.useState)(false);
    const [newRoleData, setNewRoleData] = (0, react_1.useState)({ name: '', description: '' });
    const handleCreateRole = async (e) => {
        e.preventDefault();
        try {
            await createRoleMutation.mutateAsync({
                name: newRoleData.name,
                description: newRoleData.description,
                permissions: ['read:appointments', 'read:patients'], // Basic default permissions
            });
            setShowCreateRoleModal(false);
            setNewRoleData({ name: '', description: '' });
        }
        catch (error) {
            console.error(error);
        }
    };
    // Sync backend modules with frontend Context
    (0, react_1.useEffect)(() => {
        if (modulesList.length > 0) {
            const newFeatures = {};
            modulesList.forEach(m => {
                newFeatures[m.moduleKey] = m.enabled;
            });
            setFeatures(newFeatures);
        }
    }, [modulesList, setFeatures]);
    const toggleModule = async (moduleKey) => {
        // Optimistic UI update
        const isCurrentlyEnabled = features[moduleKey] || false;
        setFeatures({ ...features, [moduleKey]: !isCurrentlyEnabled });
        // API Call
        try {
            await toggleModuleMutation.mutateAsync({
                moduleKey,
                enabled: !isCurrentlyEnabled,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
        catch (e) {
            // Revert on failure
            setFeatures({ ...features, [moduleKey]: isCurrentlyEnabled });
        }
    };
    return (<div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">RBAC Roles & Module Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure granular permission roles and toggle à la carte subscription modules for your clinic
          </p>
        </div>
      </div>

      {/* 1. Tenant Enabled Modules Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <lucide_react_1.Layers className="w-4 h-4 text-primary"/>
          <h3 className="font-bold text-sm text-foreground">Enabled Subscription Modules (À La Carte)</h3>
          {toggleModuleMutation.isPending && <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-2"/>}
        </div>

        {isLoadingModules ? (<div className="flex justify-center p-8">
             <lucide_react_1.Loader2 className="w-6 h-6 animate-spin text-muted-foreground"/>
           </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
                { key: 'appointments', label: 'Appointments Calendar', desc: 'Patient scheduling & slot booking' },
                { key: 'patients', label: 'Patient Directory & EHR', desc: 'Health timeline & allergies' },
                { key: 'billing', label: 'Billing & POS Invoicing', desc: 'Checkout terminal & receipt printing' },
                { key: 'emr', label: 'SOAP Encounter Builder', desc: 'ICD-10 clinical notes & Rx builder' },
                { key: 'pharmacy', label: 'Pharmacy Fulfillment', desc: 'Prescription queue & dispensing' },
                { key: 'laboratory', label: 'Laboratory Diagnostics', desc: 'Lab report upload & PDF generator' },
                { key: 'inventory', label: 'Stock & Supply Inventory', desc: 'Reorder thresholds & stock balances' },
                { key: 'hr', label: 'HR & Payroll', desc: 'Staff directory & payroll processing' },
                { key: 'bedManagement', label: 'Bed Management', desc: 'Inpatient ward & bed occupancy' },
            ].map((mod) => (<div key={mod.key} onClick={() => toggleModule(mod.key)} className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${features[mod.key]
                    ? 'border-primary bg-primary/5 shadow-xs'
                    : 'border-border bg-muted/20 hover:bg-muted/40 opacity-70'}`}>
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground">{mod.label}</div>
                  <div className="text-[11px] text-muted-foreground">{mod.desc}</div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${features[mod.key]
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'}`}>
                  {features[mod.key] ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>))}
          </div>)}
      </div>

      {/* 2. RBAC Roles Directory */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <lucide_react_1.ShieldCheck className="w-4 h-4 text-primary"/>
            <h3 className="font-bold text-sm text-foreground">Clinic RBAC Roles & Permissions</h3>
          </div>

          <button onClick={() => setShowCreateRoleModal(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted">
            <lucide_react_1.Plus className="w-3.5 h-3.5 text-primary"/>
            <span>Create Custom Role</span>
          </button>
        </div>

        {isLoadingRoles ? (<div className="flex justify-center p-8">
             <lucide_react_1.Loader2 className="w-6 h-6 animate-spin text-muted-foreground"/>
          </div>) : (<div className="space-y-3 text-xs">
            {rolesList.map((role) => (<div key={role.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm capitalize">{role.name}</span>
                  </div>
                </div>

                <p className="text-muted-foreground">{role.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {role.permissions?.map((perm) => (<span key={perm} className="px-2 py-0.5 rounded font-mono text-[10px] bg-card border border-border text-foreground">
                      {perm}
                    </span>))}
                </div>
              </div>))}
          </div>)}
      </div>

      {showCreateRoleModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <lucide_react_1.ShieldCheck className="w-4 h-4 text-primary"/>
                <h3 className="font-bold text-sm text-foreground">Create Custom Role</h3>
              </div>
              <button onClick={() => setShowCreateRoleModal(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <lucide_react_1.X className="w-4 h-4"/>
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Role Name *</label>
                <input type="text" required placeholder="e.g. Senior Nurse" value={newRoleData.name} onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Description *</label>
                <textarea required placeholder="What can this role do?" value={newRoleData.description} onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"/>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateRoleModal(false)} className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground">
                  Cancel
                </button>
                <button type="submit" disabled={createRoleMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5 disabled:opacity-50">
                  {createRoleMutation.isPending ? (<>
                      <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/>
                      <span>Creating...</span>
                    </>) : (<>
                      <lucide_react_1.Save className="w-3.5 h-3.5"/>
                      <span>Create Role</span>
                    </>)}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
}
