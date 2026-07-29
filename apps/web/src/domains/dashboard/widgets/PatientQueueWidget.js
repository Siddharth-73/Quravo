"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientQueueWidget = PatientQueueWidget;
const react_1 = __importDefault(require("react"));
const react_query_1 = require("@tanstack/react-query");
const dashboard_1 = require("@/lib/query-keys/dashboard");
const client_1 = require("@/lib/api/client");
const lucide_react_1 = require("lucide-react");
async function fetchPatientQueue() {
    try {
        const branches = await (0, client_1.apiFetch)('/clinic/branches');
        if (!branches || branches.length === 0)
            return [];
        const branchId = branches[0].id;
        const list = await (0, client_1.apiFetch)(`/appointments/queue/live?branchId=${branchId}`);
        return list.map(apt => {
            const timeStr = new Date(apt.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const waitMins = Math.max(5, Math.floor((new Date().getTime() - new Date(apt.startTime).getTime()) / (60 * 1000)));
            return {
                id: apt.id,
                patientName: apt.patientFirstName ? `${apt.patientFirstName} ${apt.patientLastName}` : 'Unknown Patient',
                checkInTime: timeStr,
                waitTime: `${waitMins} mins`,
                triageCategory: (apt.tokenNumber || 1) % 3 === 0 ? 'Urgent' : (apt.tokenNumber || 1) % 2 === 0 ? 'Priority' : 'Normal'
            };
        });
    }
    catch (error) {
        console.error('Failed to fetch patient queue:', error);
        return [];
    }
}
const triageColors = {
    Urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    Priority: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Normal: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};
function PatientQueueWidget() {
    const { data, isLoading } = (0, react_query_1.useQuery)({
        queryKey: dashboard_1.dashboardKeys.patientQueue(),
        queryFn: fetchPatientQueue,
    });
    if (isLoading) {
        return (<div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="h-4 w-32 bg-muted rounded animate-pulse"/>
        <div className="space-y-2">
          {[1, 2].map((i) => (<div key={i} className="h-14 rounded-lg bg-muted/40 animate-pulse"/>))}
        </div>
      </div>);
    }
    return (<div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <lucide_react_1.UserCheck className="w-4 h-4 text-emerald-500"/>
            <h3 className="font-semibold text-sm text-foreground">Waiting Room Queue</h3>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {data?.length || 0} Waiting
          </span>
        </div>

        {data?.length === 0 ? (<div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
            No patients currently in waiting room.
          </div>) : (<div className="space-y-2">
            {data?.map((item) => (<div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div>
                  <div className="text-xs font-medium text-foreground">{item.patientName}</div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <lucide_react_1.Clock className="w-3 h-3"/> Wait: {item.waitTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${triageColors[item.triageCategory]}`}>
                    {item.triageCategory}
                  </span>
                  <button className="p-1 rounded text-primary hover:bg-primary/10 transition-colors" title="Call Patient">
                    <lucide_react_1.ArrowRight className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
}
