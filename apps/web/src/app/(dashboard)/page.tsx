"use client";

import React, { useState } from 'react';
import { MetricCardsWidget } from '@/domains/dashboard/widgets/MetricCardsWidget';
import { TodayScheduleWidget } from '@/domains/dashboard/widgets/TodayScheduleWidget';
import { PatientQueueWidget } from '@/domains/dashboard/widgets/PatientQueueWidget';
import { NewPatientModal } from '@/components/modals/NewPatientModal';
import { NewAppointmentModal } from '@/components/modals/NewAppointmentModal';
import { useSocket } from '@/providers/SocketProvider';
import { Plus, UserPlus } from 'lucide-react';

export default function DashboardOverviewPage() {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const { triggerToast } = useSocket();

  return (
    <div className="space-y-6">
      {/* Page Title & Interactive Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinical Command Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Realtime overview of clinic scheduling, waiting room queue, and financials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPatientModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-primary" />
            <span>New Patient</span>
          </button>
          <button
            onClick={() => setIsApptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* 1. Independent Metric Cards Widget */}
      <MetricCardsWidget />

      {/* 2. Main Workspace Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodayScheduleWidget />
        </div>
        <div>
          <PatientQueueWidget />
        </div>
      </div>

      {/* Interactive Modals */}
      <NewPatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onPatientCreated={(patient) => {
          triggerToast('Patient Registered', `Successfully added ${patient.fullName} (${patient.mrn}) to system.`);
        }}
      />

      <NewAppointmentModal
        isOpen={isApptModalOpen}
        onClose={() => setIsApptModalOpen(false)}
        onAppointmentCreated={(appt) => {
          triggerToast('Appointment Booked', `Booked ${appt.patientName} at ${appt.time} with ${appt.doctorName}.`);
        }}
      />
    </div>
  );
}
