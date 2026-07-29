"use strict";
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
exports.ProvisionTenantModal = ProvisionTenantModal;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const client_1 = require("@/lib/api/client");
function ProvisionTenantModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        const data = {
            clinicName: formData.get('clinicName'),
            clinicSlug: formData.get('clinicSlug'),
            planTier: formData.get('planTier'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
        };
        try {
            const result = await (0, client_1.apiFetch)('/super-admin/tenants', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            onSuccess(result.tenant);
            onClose();
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-white">Provision New Tenant</h2>
            <p className="text-xs text-slate-400 mt-0.5">Create a new clinic workspace and admin account</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <lucide_react_1.X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (<div className="p-3 text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
              {error}
            </div>)}

          <div className="grid grid-cols-2 gap-6">
            {/* Clinic Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2">
                Workspace Configuration
              </h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Clinic Name</label>
                <div className="relative">
                  <lucide_react_1.Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
                  <input required name="clinicName" placeholder="e.g. Apex Health Clinic" className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Subdomain (Slug)</label>
                <div className="relative">
                  <lucide_react_1.Link className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
                  <input required name="clinicSlug" pattern="^[a-z0-9-]+$" title="Only lowercase letters, numbers, and hyphens" placeholder="e.g. apexhealth" className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Subscription Plan</label>
                <select required name="planTier" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none">
                  <option value="starter">Starter Plan</option>
                  <option value="growth">Growth Plan</option>
                  <option value="erp">ERP Enterprise</option>
                </select>
              </div>
            </div>

            {/* Admin Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2">
                Primary Administrator
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">First Name</label>
                  <div className="relative">
                    <lucide_react_1.User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
                    <input required name="firstName" placeholder="Sarah" className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Last Name</label>
                  <input required name="lastName" placeholder="Jenkins" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Admin Email</label>
                <div className="relative">
                  <lucide_react_1.Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
                  <input required type="email" name="email" placeholder="sarah@example.com" className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-slate-500 bg-slate-800/30 p-2 rounded border border-slate-800">
                  The admin will be created with a secure temporary password. They should use the "Forgot Password" flow to set a new one if email integration is disabled.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 transition-colors">
              {loading && <lucide_react_1.Loader2 className="w-4 h-4 animate-spin"/>}
              {loading ? 'Provisioning...' : 'Provision Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
