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
exports.default = DashboardOverviewPage;
const react_1 = __importStar(require("react"));
const MetricCardsWidget_1 = require("@/domains/dashboard/widgets/MetricCardsWidget");
const TodayScheduleWidget_1 = require("@/domains/dashboard/widgets/TodayScheduleWidget");
const PatientQueueWidget_1 = require("@/domains/dashboard/widgets/PatientQueueWidget");
const NewPatientModal_1 = require("@/components/modals/NewPatientModal");
const NewAppointmentModal_1 = require("@/components/modals/NewAppointmentModal");
const SocketProvider_1 = require("@/providers/SocketProvider");
const lucide_react_1 = require("lucide-react");
function DashboardOverviewPage() {
    const [isPatientModalOpen, setIsPatientModalOpen] = (0, react_1.useState)(false);
    const [isApptModalOpen, setIsApptModalOpen] = (0, react_1.useState)(false);
    const { triggerToast } = (0, SocketProvider_1.useSocket)();
    return (<div className="space-y-6">
      {/* Page Title & Interactive Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinical Command Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Realtime overview of clinic scheduling, waiting room queue, and financials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setIsPatientModalOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-xs">
            <lucide_react_1.UserPlus className="w-3.5 h-3.5 text-primary"/>
            <span>New Patient</span>
          </button>
          <button onClick={() => setIsApptModalOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
            <lucide_react_1.Plus className="w-3.5 h-3.5"/>
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* 1. Independent Metric Cards Widget */}
      <MetricCardsWidget_1.MetricCardsWidget />

      {/* 2. Main Workspace Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodayScheduleWidget_1.TodayScheduleWidget />
        </div>
        <div>
          <PatientQueueWidget_1.PatientQueueWidget />
        </div>
      </div>

      {/* Interactive Modals */}
      <NewPatientModal_1.NewPatientModal isOpen={isPatientModalOpen} onClose={() => setIsPatientModalOpen(false)} onPatientCreated={(patient) => {
            triggerToast('Patient Registered', `Successfully added ${patient.fullName} (${patient.mrn}) to system.`);
        }}/>

      <NewAppointmentModal_1.NewAppointmentModal isOpen={isApptModalOpen} onClose={() => setIsApptModalOpen(false)} onAppointmentCreated={(appt) => {
            triggerToast('Appointment Booked', `Booked ${appt.patientName} at ${appt.time} with ${appt.doctorName}.`);
        }}/>
    </div>);
}
