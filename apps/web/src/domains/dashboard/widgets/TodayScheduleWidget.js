"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodayScheduleWidget = TodayScheduleWidget;
const react_1 = __importDefault(require("react"));
const react_query_1 = require("@tanstack/react-query");
const dashboard_1 = require("@/lib/query-keys/dashboard");
const client_1 = require("@/lib/api/client");
const lucide_react_1 = require("lucide-react");
function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
async function fetchTodaySchedule() {
    try {
        const todayStr = getLocalDateString();
        const startIso = new Date(`${todayStr}T00:00:00`).toISOString();
        const endIso = new Date(`${todayStr}T23:59:59`).toISOString();
        const list = await (0, client_1.apiFetch)(`/appointments?startDate=${startIso}&endDate=${endIso}`);
        return list.map(apt => {
            const timeStr = new Date(apt.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            return {
                id: apt.id,
                time: timeStr,
                patientName: apt.patientFirstName ? `${apt.patientFirstName} ${apt.patientLastName}` : 'Unknown Patient',
                reason: apt.chiefComplaint || 'General Consultation',
                status: apt.status,
                doctorName: apt.doctorFirstName ? `Dr. ${apt.doctorFirstName} ${apt.doctorLastName}` : 'Unknown Practitioner'
            };
        });
    }
    catch (error) {
        console.error('Failed to fetch schedule:', error);
        return [];
    }
}
const statusBadges = {
    in_progress: 'bg-primary/10 text-primary border-primary/20',
    checked_in: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    scheduled: 'bg-muted text-muted-foreground border-border',
    completed: 'bg-muted text-muted-foreground line-through opacity-70 border-border',
};
function TodayScheduleWidget() {
    const { data, isLoading, isError, refetch } = (0, react_query_1.useQuery)({
        queryKey: dashboard_1.dashboardKeys.todaySchedule(),
        queryFn: fetchTodaySchedule,
    });
    if (isLoading) {
        return (<div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="h-4 w-40 bg-muted rounded animate-pulse"/>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (<div key={i} className="h-16 rounded-lg bg-muted/40 animate-pulse"/>))}
        </div>
      </div>);
    }
    if (isError) {
        return (<div className="rounded-xl border border-destructive/20 bg-card p-5 text-xs text-destructive flex items-center justify-between">
        <span>Unable to load today's schedule.</span>
        <button onClick={() => refetch()} className="flex items-center gap-1 font-medium hover:underline">
          <lucide_react_1.RefreshCw className="w-3 h-3"/> Retry
        </button>
      </div>);
    }
    return (<div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm text-foreground">Today's Appointment Schedule</h3>
            <p className="text-xs text-muted-foreground">Upcoming patient appointments grid</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {data?.length || 0} Visits
          </span>
        </div>

        {data?.length === 0 ? (<div className="py-12 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
            No appointments scheduled for today.
          </div>) : (<div className="space-y-2.5">
            {data?.map((apt) => (<div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-mono font-medium text-muted-foreground w-20">
                    <lucide_react_1.Clock className="w-3 h-3"/>
                    <span>{apt.time}</span>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">{apt.patientName}</div>
                    <div className="text-[11px] text-muted-foreground">{apt.reason}</div>
                  </div>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border capitalize ${statusBadges[apt.status] || 'bg-muted text-muted-foreground'}`}>
                  {(apt.status || 'scheduled').replace('_', ' ')}
                </span>
              </div>))}
          </div>)}
      </div>
    </div>);
}
