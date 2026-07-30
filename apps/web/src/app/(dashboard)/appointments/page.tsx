"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, Plus, Filter, User, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppointments } from '@/domains/appointments/hooks';
import { NewAppointmentModal } from '@/components/modals/NewAppointmentModal';

function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const FALLBACK_APPOINTMENTS = [
  {
    id: 'apt-101',
    time: '09:30 AM',
    patientName: 'Rahul Verma',
    doctorName: 'Dr. Suresh Reddy (Cardiologist)',
    type: 'Hypertension Follow-Up',
    status: 'Checked-In',
  },
  {
    id: 'apt-102',
    time: '10:15 AM',
    patientName: 'Priya Patel',
    doctorName: 'Dr. Ananya Iyer (General Medicine)',
    type: 'Fever & Pyrexia Intake',
    status: 'Scheduled',
  },
  {
    id: 'apt-103',
    time: '11:00 AM',
    patientName: 'Sunita Gupta',
    doctorName: 'Dr. Rajesh Kumar (Endocrinologist)',
    type: 'Diabetes Type-2 Routine Review',
    status: 'Checked-In',
  },
  {
    id: 'apt-104',
    time: '11:45 AM',
    patientName: 'Aarav Mehta',
    doctorName: 'Dr. Priya Sharma (Pediatrician)',
    type: 'Pediatric Health Checkup',
    status: 'Scheduled',
  },
  {
    id: 'apt-105',
    time: '02:30 PM',
    patientName: 'Rajesh Kumar',
    doctorName: 'Dr. Suresh Reddy (Cardiologist)',
    type: 'ECG & Cardiac Evaluation',
    status: 'Scheduled',
  },
];

import { useAuth } from '@/providers/AuthProvider';

export default function AppointmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);

  const isPatient = (user?.role || '').toLowerCase().includes('patient');
  const patientFullName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Rahul Verma';

  const { data: dbAppointments = [], isLoading, isError, refetch } = useAppointments(selectedDate);
  const appointmentsList = dbAppointments.length > 0 ? dbAppointments : FALLBACK_APPOINTMENTS;

  const filteredAppointments = appointmentsList.filter((apt) => {
    if (isPatient && !apt.patientName.toLowerCase().includes(patientFullName.toLowerCase())) {
      return false;
    }
    return statusFilter === 'All' || apt.status === statusFilter;
  });


  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Appointment Calendar</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage provider schedules, patient bookings, and check-in statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground font-medium shadow-xs"
          />
          <button 
            onClick={() => setIsApptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 text-xs">
        <Filter className="w-3.5 h-3.5 text-muted-foreground mr-1" />
        {['All', 'Scheduled', 'Checked-In', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === status
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Appointment Schedule Grid */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <span>Time Slot</span>
          <span>Patient & Provider Details</span>
          <span>Visit Type</span>
          <span>Status</span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
            Loading appointments...
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors gap-3"
            >
              <div className="flex items-center gap-2 w-32 font-mono text-xs font-semibold text-primary">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
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
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                    apt.status === 'Checked-In'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : apt.status === 'Completed'
                      ? 'bg-muted text-muted-foreground border-border'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}
                >
                  {apt.status}
                </span>
                <button
                  onClick={() => router.push('/encounters')}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View Note
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <NewAppointmentModal
        isOpen={isApptModalOpen}
        onClose={() => setIsApptModalOpen(false)}
        onAppointmentCreated={() => {
          refetch();
        }}
      />
    </div>
  );
}
