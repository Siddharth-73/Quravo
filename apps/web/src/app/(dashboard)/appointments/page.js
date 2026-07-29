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
exports.default = AppointmentsPage;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const hooks_1 = require("@/domains/appointments/hooks");
const NewAppointmentModal_1 = require("@/components/modals/NewAppointmentModal");
function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function AppointmentsPage() {
    const [selectedDate, setSelectedDate] = (0, react_1.useState)(() => getLocalDateString());
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('All');
    const [isApptModalOpen, setIsApptModalOpen] = (0, react_1.useState)(false);
    const { data: appointmentsList = [], isLoading, isError, refetch } = (0, hooks_1.useAppointments)(selectedDate);
    const filteredAppointments = appointmentsList.filter((apt) => statusFilter === 'All' || apt.status === statusFilter);
    return (<div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Appointment Calendar</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage provider schedules, patient bookings, and check-in statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground font-medium shadow-xs"/>
          <button onClick={() => setIsApptModalOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
            <lucide_react_1.Plus className="w-3.5 h-3.5"/>
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 text-xs">
        <lucide_react_1.Filter className="w-3.5 h-3.5 text-muted-foreground mr-1"/>
        {['All', 'Scheduled', 'Checked-In', 'Completed', 'Cancelled'].map((status) => (<button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 rounded-md transition-colors ${statusFilter === status
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            {status}
          </button>))}
      </div>

      {/* Appointment Schedule Grid */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <span>Time Slot</span>
          <span>Patient & Provider Details</span>
          <span>Visit Type</span>
          <span>Status</span>
        </div>

        {isLoading ? (<div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
            Loading appointments...
          </div>) : isError ? (<div className="py-8 text-center text-xs text-rose-500 flex flex-col items-center gap-2">
            <span>Failed to load appointments.</span>
            <button onClick={() => refetch()} className="flex items-center gap-1.5 font-medium hover:underline text-primary">
              <lucide_react_1.RefreshCw className="w-3 h-3"/> Retry
            </button>
          </div>) : filteredAppointments.length === 0 ? (<div className="py-8 text-center text-xs text-muted-foreground">
            No appointments scheduled for this day.
          </div>) : (filteredAppointments.map((apt) => (<div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors gap-3">
              <div className="flex items-center gap-2 w-32 font-mono text-xs font-semibold text-primary">
                <lucide_react_1.Clock className="w-3.5 h-3.5 text-muted-foreground"/>
                <span>{apt.time}</span>
              </div>

              <div className="flex-1">
                <div className="text-xs font-semibold text-foreground">{apt.patientName}</div>
                <div className="text-[11px] text-muted-foreground">{apt.doctorName}</div>
              </div>

              <div className="w-36 text-xs text-muted-foreground font-medium">
                {apt.type}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${apt.status === 'Checked-In'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : apt.status === 'Completed'
                    ? 'bg-muted text-muted-foreground border-border'
                    : 'bg-primary/10 text-primary border-primary/20'}`}>
                  {apt.status}
                </span>
                <button className="text-xs font-medium text-primary hover:underline">
                  View Note
                </button>
              </div>
            </div>)))}
      </div>

      <NewAppointmentModal_1.NewAppointmentModal isOpen={isApptModalOpen} onClose={() => setIsApptModalOpen(false)} onAppointmentCreated={() => {
            refetch();
        }}/>
    </div>);
}
