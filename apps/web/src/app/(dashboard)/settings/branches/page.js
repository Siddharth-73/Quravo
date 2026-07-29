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
exports.default = BranchManagementPage;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const hooks_1 = require("@/domains/clinic/hooks");
function BranchManagementPage() {
    const { data: branches = [], isLoading } = (0, hooks_1.useBranches)();
    const createBranchMutation = (0, hooks_1.useCreateBranch)();
    const [newBranchName, setNewBranchName] = (0, react_1.useState)('');
    const [isAdding, setIsAdding] = (0, react_1.useState)(false);
    const [selectedBranchIdForHours, setSelectedBranchIdForHours] = (0, react_1.useState)(null);
    const handleAddBranch = async (e) => {
        e.preventDefault();
        if (!newBranchName)
            return;
        const newCode = newBranchName.substring(0, 4).toUpperCase();
        await createBranchMutation.mutateAsync({
            name: newBranchName,
            code: newCode,
            address: '100 New Clinic Way',
            phone: '+1 (555) 000-0000',
        });
        setNewBranchName('');
        setIsAdding(false);
    };
    return (<div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Branch & Location Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage multi-branch locations, operating hours, and branch routing parameters
          </p>
        </div>

        <button onClick={() => setIsAdding(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm">
          <lucide_react_1.Plus className="w-3.5 h-3.5"/>
          <span>Add New Branch</span>
        </button>
      </div>

      {isAdding && (<form onSubmit={handleAddBranch} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm text-xs animate-in fade-in duration-200">
          <h3 className="font-bold text-sm text-foreground">Provision New Clinic Branch Location</h3>
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Branch Location Name *</label>
            <input type="text" required placeholder="e.g. Southside Medical Center" value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" disabled={createBranchMutation.isPending}/>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted" disabled={createBranchMutation.isPending}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2" disabled={createBranchMutation.isPending}>
              {createBranchMutation.isPending ? <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/> : null}
              {createBranchMutation.isPending ? 'Saving...' : 'Save Branch'}
            </button>
          </div>
        </form>)}

      {/* Branches Directory */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <lucide_react_1.Building2 className="w-4 h-4 text-primary"/>
          <h3 className="font-bold text-sm text-foreground">Active Clinic Locations</h3>
        </div>

        {isLoading ? (<div className="flex justify-center p-8">
             <lucide_react_1.Loader2 className="w-6 h-6 animate-spin text-muted-foreground"/>
          </div>) : (<div className="space-y-3 text-xs">
            {branches.map((b) => (<div key={b.id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">{b.name}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      CODE: {b.code}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <lucide_react_1.MapPin className="w-3 h-3 text-primary shrink-0"/> {b.address || 'No address set'}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1"><lucide_react_1.Phone className="w-3 h-3 text-muted-foreground"/> {b.phone || 'No phone set'}</span>
                    <span className="flex items-center gap-1"><lucide_react_1.Clock className="w-3 h-3 text-muted-foreground"/> Click Configure Hours to view</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${b.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20'}`}>
                    {b.status === 'active' ? 'Active' : 'Inactive'}
                  </span>

                  <button onClick={() => setSelectedBranchIdForHours(b.id)} className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted font-medium">
                    Configure Hours
                  </button>
                </div>
              </div>))}
            {branches.length === 0 && (<div className="text-center py-8 text-muted-foreground">
                No branches found.
              </div>)}
          </div>)}
      </div>

      {selectedBranchIdForHours && (<BranchHoursModal branchId={selectedBranchIdForHours} onClose={() => setSelectedBranchIdForHours(null)}/>)}
    </div>);
}
function BranchHoursModal({ branchId, onClose }) {
    const { data: hours = [], isLoading } = (0, hooks_1.useBranchWorkingHours)(branchId);
    const updateHoursMutation = (0, hooks_1.useUpdateBranchWorkingHours)();
    const [localHours, setLocalHours] = (0, react_1.useState)([]);
    // Initialize local hours when data loads
    react_1.default.useEffect(() => {
        if (hours.length > 0) {
            setLocalHours(hours);
        }
        else if (!isLoading) {
            // Defaults if none exist
            const defaults = Array.from({ length: 7 }).map((_, i) => ({
                dayOfWeek: i,
                openTime: '09:00',
                closeTime: '17:00',
                isClosed: i === 0 || i === 6, // Closed on weekends default
            }));
            setLocalHours(defaults);
        }
    }, [hours, isLoading]);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const handleSave = async () => {
        try {
            await updateHoursMutation.mutateAsync({ branchId, hours: localHours });
            onClose();
        }
        catch (e) {
            console.error(e);
        }
    };
    const updateDay = (dayIndex, field, value) => {
        setLocalHours((prev) => prev.map((h) => (h.dayOfWeek === dayIndex ? { ...h, [field]: value } : h)));
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <lucide_react_1.Clock className="w-4 h-4 text-primary"/>
            <h3 className="font-bold text-sm text-foreground">Configure Hours</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <lucide_react_1.X className="w-4 h-4"/>
          </button>
        </div>

        {isLoading ? (<div className="flex justify-center p-8"><lucide_react_1.Loader2 className="w-6 h-6 animate-spin text-muted-foreground"/></div>) : (<div className="space-y-3 text-xs">
            {localHours.map((h) => (<div key={h.dayOfWeek} className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/20">
                <div className="w-24 font-semibold text-foreground">
                  {days[h.dayOfWeek]}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={h.isClosed} onChange={(e) => updateDay(h.dayOfWeek, 'isClosed', e.target.checked)} className="rounded border-border"/>
                    <span className="text-muted-foreground">Closed</span>
                  </label>
                  {!h.isClosed && (<div className="flex items-center gap-1">
                      <input type="time" value={h.openTime} onChange={(e) => updateDay(h.dayOfWeek, 'openTime', e.target.value)} className="rounded border border-border bg-card px-1.5 py-1"/>
                      <span className="text-muted-foreground">-</span>
                      <input type="time" value={h.closeTime} onChange={(e) => updateDay(h.dayOfWeek, 'closeTime', e.target.value)} className="rounded border border-border bg-card px-1.5 py-1"/>
                    </div>)}
                </div>
              </div>))}
          </div>)}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted font-medium text-xs">
            Cancel
          </button>
          <button onClick={handleSave} disabled={updateHoursMutation.isPending || isLoading} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 text-xs disabled:opacity-50">
            {updateHoursMutation.isPending ? <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/> : <lucide_react_1.Save className="w-3.5 h-3.5"/>}
            {updateHoursMutation.isPending ? 'Saving...' : 'Save Hours'}
          </button>
        </div>
      </div>
    </div>);
}
