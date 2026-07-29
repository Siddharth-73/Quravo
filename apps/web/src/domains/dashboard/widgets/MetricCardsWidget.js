"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricCardsWidget = MetricCardsWidget;
const react_1 = __importDefault(require("react"));
const react_query_1 = require("@tanstack/react-query");
const dashboard_1 = require("@/lib/query-keys/dashboard");
const client_1 = require("@/lib/api/client");
const lucide_react_1 = require("lucide-react");
async function fetchMetrics() {
    try {
        const res = await (0, client_1.apiFetch)('/analytics/dashboard');
        return [
            {
                id: 'appts',
                label: "Today's Appointments",
                value: String(res.totalAppointments || 0),
                change: '+12% vs yesterday',
                isPositive: true,
                iconName: 'Calendar',
            },
            {
                id: 'rev',
                label: 'Collected Today',
                value: `$${parseFloat(res.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                change: '+8% vs average',
                isPositive: true,
                iconName: 'DollarSign',
            },
            {
                id: 'queue',
                label: 'Patients in Waiting Room',
                value: String(res.totalWalkIns || 0),
                change: 'Avg wait: 14 mins',
                isPositive: true,
                iconName: 'Clock',
            },
            {
                id: 'encounters',
                label: 'Pending SOAP Notes',
                value: '1',
                change: 'Needs signing',
                isPositive: false,
                iconName: 'Users',
            },
        ];
    }
    catch (error) {
        console.error('Failed to fetch real metrics, returning empty states:', error);
        return [
            { id: 'appts', label: "Today's Appointments", value: '0', change: '0% vs yesterday', isPositive: true, iconName: 'Calendar' },
            { id: 'rev', label: 'Collected Today', value: '$0.00', change: '0% vs average', isPositive: true, iconName: 'DollarSign' },
            { id: 'queue', label: 'Patients in Waiting Room', value: '0', change: 'Avg wait: --', isPositive: true, iconName: 'Clock' },
            { id: 'encounters', label: 'Pending SOAP Notes', value: '0', change: 'All signed', isPositive: true, iconName: 'Users' },
        ];
    }
}
const iconMap = {
    Calendar: lucide_react_1.Calendar,
    DollarSign: lucide_react_1.DollarSign,
    Users: lucide_react_1.Users,
    Clock: lucide_react_1.Clock,
};
function MetricCardsWidget() {
    const { data, isLoading, isError, refetch } = (0, react_query_1.useQuery)({
        queryKey: dashboard_1.dashboardKeys.metrics(),
        queryFn: fetchMetrics,
    });
    if (isLoading) {
        return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (<div key={i} className="h-28 rounded-xl border border-border bg-card p-4 animate-pulse">
            <div className="h-3 w-24 bg-muted rounded mb-3"/>
            <div className="h-6 w-16 bg-muted rounded mb-2"/>
            <div className="h-2.5 w-20 bg-muted rounded"/>
          </div>))}
      </div>);
    }
    if (isError) {
        return (<div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex items-center justify-between text-xs text-destructive">
        <span>Failed to load metrics widget.</span>
        <button onClick={() => refetch()} className="flex items-center gap-1 font-medium hover:underline">
          <lucide_react_1.RefreshCw className="w-3 h-3"/> Retry
        </button>
      </div>);
    }
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.map((metric) => {
            const Icon = iconMap[metric.iconName];
            return (<div key={metric.id} className="rounded-xl border border-border bg-card p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-4 w-4"/>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold tracking-tight text-foreground">{metric.value}</div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                <lucide_react_1.ArrowUpRight className={`w-3 h-3 ${metric.isPositive ? 'text-emerald-500' : 'text-amber-500'}`}/>
                <span>{metric.change}</span>
              </div>
            </div>
          </div>);
        })}
    </div>);
}
