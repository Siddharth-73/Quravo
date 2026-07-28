"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Plus, Loader2 } from 'lucide-react';
import { usePatients } from '@/domains/patients/hooks';
import { useStaff } from '@/domains/clinic/hooks';
import { useBranches } from '@/domains/clinic/hooks';
import { useCreateAppointment } from '@/domains/appointments/hooks';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated: (appt: { patientName: string; doctorName: string; time: string; type: string }) => void;
}

export function NewAppointmentModal({ isOpen, onClose, onAppointmentCreated }: NewAppointmentModalProps) {
  const { data: patientsList = [] } = usePatients();
  const { data: staffList = [] } = useStaff();
  const { data: branches = [] } = useBranches();
  const createAppointmentMutation = useCreateAppointment();

  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [chiefComplaint, setChiefComplaint] = useState('General Consultation');
  const [notes, setNotes] = useState('');

  // Autofill initial selections when lists load
  useEffect(() => {
    if (patientsList.length > 0 && !patientId) {
      setPatientId(patientsList[0].id);
    }
  }, [patientsList, patientId]);

  useEffect(() => {
    const doctors = staffList.filter((s: any) => s.role === 'doctor');
    if (doctors.length > 0 && !doctorId) {
      setDoctorId(doctors[0].id);
    } else if (staffList.length > 0 && !doctorId) {
      setDoctorId(staffList[0].id);
    }
  }, [staffList, doctorId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId) return;

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
      } as any);

      const patient = patientsList.find(p => p.id === patientId);
      const doctor = staffList.find(s => s.id === doctorId);

      onAppointmentCreated({
        patientName: patient ? patient.fullName : 'Patient',
        doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Practitioner',
        time: `${date} ${time}`,
        type: chiefComplaint
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to book appointment.');
    }
  };

  const doctorsList = staffList.filter((s: any) => s.role === 'doctor' || s.role === 'owner');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Book Patient Appointment</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Select Patient</label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {patientsList.length === 0 ? (
                <option value="">No patients registered</option>
              ) : (
                patientsList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.mrn})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Attending Practitioner</label>
            <select
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {doctorsList.length === 0 ? (
                <option value="">No practitioners registered</option>
              ) : (
                doctorsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    Dr. {s.firstName} {s.lastName}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Time Slot</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Visit Type / Complaint</label>
            <input
              type="text"
              required
              placeholder="e.g. Follow-Up Visit"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Internal Notes (Optional)</label>
            <textarea
              placeholder="Symptom details, vital observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAppointmentMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {createAppointmentMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
