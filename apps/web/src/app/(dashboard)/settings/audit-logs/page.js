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
exports.default = AuditLogsPage;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const lucide_react_2 = require("lucide-react");
const hooks_1 = require("@/domains/audit/hooks");
function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const { data, isLoading, isError } = (0, hooks_1.useAuditLogs)({ action: searchQuery });
    const logs = data?.data || [];
    return (<div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Security Audit & Activity Ledger</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Searchable HIPAA & GDPR compliant security ledger tracking all user actions, patient access, and IP logs
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <lucide_react_1.ShieldAlert className="w-4 h-4 text-primary"/>
            <h3 className="font-bold text-sm text-foreground">System Audit Events</h3>
          </div>

          <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs w-full sm:w-72">
            <lucide_react_1.Search className="w-3.5 h-3.5 text-muted-foreground mr-2 shrink-0"/>
            <input type="text" placeholder="Search by staff name, action, or patient..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent text-foreground focus:outline-none"/>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {isLoading ? (<div className="py-8 flex justify-center items-center text-muted-foreground">
              <lucide_react_2.Loader2 className="w-6 h-6 animate-spin text-primary"/>
            </div>) : isError ? (<div className="py-8 text-center text-rose-500">
              Failed to load audit logs. Please try again.
            </div>) : logs.length === 0 ? (<div className="py-8 text-center text-muted-foreground">
              No audit logs found.
            </div>) : (logs.map((log) => (<div key={log.id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{log.action}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20`}>
                    Success
                  </span>
                </div>
                <div className="text-muted-foreground">{log.resource} {log.resourceId ? `(${log.resourceId})` : ''}</div>
                <div className="text-muted-foreground flex items-center gap-3 text-[11px] font-mono pt-0.5">
                  <span className="flex items-center gap-1"><lucide_react_1.User className="w-3 h-3 text-primary"/> {log.userId || 'System'}</span>
                  <span className="flex items-center gap-1"><lucide_react_1.Globe className="w-3 h-3 text-muted-foreground"/> {log.ipAddress || 'N/A'}</span>
                  <span className="flex items-center gap-1"><lucide_react_1.Clock className="w-3 h-3 text-muted-foreground"/> {new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>)))}
        </div>
      </div>
    </div>);
}
