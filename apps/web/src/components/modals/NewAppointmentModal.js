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
exports.NewAppointmentModal = NewAppointmentModal;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const hooks_1 = require("@/domains/patients/hooks");
const hooks_2 = require("@/domains/clinic/hooks");
const hooks_3 = require("@/domains/clinic/hooks");
const hooks_4 = require("@/domains/appointments/hooks");
function NewAppointmentModal({ isOpen, onClose, onAppointmentCreated }) {
    const { data: patientsList = [] } = (0, hooks_1.usePatients)();
    const { data: staffList = [] } = (0, hooks_2.useStaff)();
    const { data: branches = [] } = (0, hooks_3.useBranches)();
    const createAppointmentMutation = (0, hooks_4.useCreateAppointment)();
    const [patientId, setPatientId] = (0, react_1.useState)('');
    const [doctorId, setDoctorId] = (0, react_1.useState)('');
    const [date, setDate] = (0, react_1.useState)(() => new Date().toISOString().split('T')[0]);
    const [time, setTime] = (0, react_1.useState)('09:00');
    const [chiefComplaint, setChiefComplaint] = (0, react_1.useState)('General Consultation');
    const [notes, setNotes] = (0, react_1.useState)('');
    // Autofill initial selections when lists load
    (0, react_1.useEffect)(() => {
        if (patientsList.length > 0 && !patientId) {
            setPatientId(patientsList[0].id);
        }
    }, [patientsList, patientId]);
    (0, react_1.useEffect)(() => {
        const doctors = staffList.filter((s) => s.role === 'doctor');
        if (doctors.length > 0 && !doctorId) {
            setDoctorId(doctors[0].id);
        }
        else if (staffList.length > 0 && !doctorId) {
            setDoctorId(staffList[0].id);
        }
    }, [staffList, doctorId]);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!patientId || !doctorId)
            return;
        const branchId = branches[0]?.id;
        if (!branchId) {
            alert('No clinic branch registered. Cannot book appointment.');
            return;
        }
        // Combine date and time to ISO string
        const startTimeIso = new Date(`${date}T${time}:00`).toISOString();
        try {
            await createAppointmentMutation.mutateAsync({
                branchId,
                patientId,
                doctorId,
                startTime: startTimeIso,
                chiefComplaint,
                notes
            });
            const patient = patientsList.find(p => p.id === patientId);
            const doctor = staffList.find(s => s.id === doctorId);
            onAppointmentCreated({
                patientName: patient ? patient.fullName : 'Patient',
                doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Practitioner',
                time: `${date} ${time}`,
                type: chiefComplaint
            });
            onClose();
        }
        catch (err) {
            alert(err.message || 'Failed to book appointment.');
        }
    };
    const doctorsList = staffList.filter((s) => s.role === 'doctor' || s.role === 'owner');
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <lucide_react_1.Calendar className="w-4 h-4 text-primary"/>
            <h3 className="font-bold text-sm text-foreground">Book Patient Appointment</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <lucide_react_1.X className="w-4 h-4"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Select Patient</label>
            <select required value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
              {patientsList.length === 0 ? (<option value="">No patients registered</option>) : (patientsList.map((p) => (<option key={p.id} value={p.id}>
                    {p.fullName} ({p.mrn})
                  </option>)))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Attending Practitioner</label>
            <select required value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
              {doctorsList.length === 0 ? (<option value="">No practitioners registered</option>) : (doctorsList.map((s) => (<option key={s.id} value={s.id}>
                    Dr. {s.firstName} {s.lastName}
                  </option>)))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Date</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Time Slot</label>
              <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Visit Type / Complaint</label>
            <input type="text" required placeholder="e.g. Follow-Up Visit" value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Internal Notes (Optional)</label>
            <textarea placeholder="Symptom details, vital observations..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"/>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground">
              Cancel
            </button>
            <button type="submit" disabled={createAppointmentMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5 disabled:opacity-50">
              {createAppointmentMutation.isPending ? (<>
                  <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/>
                  <span>Booking...</span>
                </>) : (<>
                  <lucide_react_1.Plus className="w-3.5 h-3.5"/>
                  <span>Confirm Booking</span>
                </>)}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
