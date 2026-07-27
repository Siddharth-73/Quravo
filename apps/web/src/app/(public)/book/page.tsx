"use client";

import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle2, ChevronRight, ArrowLeft, Stethoscope, Sparkles, MapPin, Download } from 'lucide-react';

interface DoctorOption {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  availability: string[];
}

const doctors: DoctorOption[] = [
  { id: 'doc-1', name: 'Dr. Sarah Jenkins', specialty: 'Lead Family Physician', avatar: 'SJ', availability: ['09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM'] },
  { id: 'doc-2', name: 'Dr. Robert Chen', specialty: 'General Practitioner & Pediatrics', avatar: 'RC', availability: ['09:30 AM', '11:00 AM', '01:30 PM', '03:45 PM'] },
];

export default function PatientSelfBookingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorOption>(doctors[0]);
  const [visitType, setVisitType] = useState('General Consultation ($120)');
  const [selectedDate, setSelectedDate] = useState('2026-07-29 (Tomorrow)');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');

  // Patient Intake Form Fields
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('1994-05-12');
  const [chiefComplaint, setChiefComplaint] = useState('');

  const [confirmationId, setConfirmationId] = useState('');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3) {
      const refId = `APPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmationId(refId);
      setStep(4);
    } else {
      setStep((prev) => (prev + 1) as typeof step);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Stepper Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-center justify-between text-xs">
        {[
          { number: 1, label: 'Doctor & Service' },
          { number: 2, label: 'Date & Time' },
          { number: 3, label: 'Patient Info' },
          { number: 4, label: 'Confirmation' },
        ].map((s) => (
          <div key={s.number} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs ${
                step === s.number
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : step > s.number
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s.number ? '✓' : s.number}
            </div>
            <span className={`hidden sm:inline font-semibold ${step === s.number ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Select Doctor & Visit Type */}
      {step === 1 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Select Practitioner & Consultation Type</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose your preferred doctor and the reason for your clinic visit
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">Select Doctor</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedDoctor.id === doc.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                      : 'border-border bg-muted/20 hover:bg-muted/40'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-sm shrink-0">
                    {doc.avatar}
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-foreground text-sm">{doc.name}</div>
                    <div className="text-muted-foreground font-medium mt-0.5">{doc.specialty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">Consultation Reason</label>
            <select
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="General Consultation ($120)">General Consultation ($120)</option>
              <option value="Follow-Up Visit ($80)">Follow-Up Visit ($80)</option>
              <option value="Preventive Health Checkup ($150)">Preventive Health Checkup ($150)</option>
              <option value="Pediatrics Consultation ($100)">Pediatrics Consultation ($100)</option>
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Select Date & Time</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Date & Time Slot */}
      {step === 2 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Select Date & Available Slot</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Booking with <span className="font-bold text-foreground">{selectedDoctor.name}</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">Appointment Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="2026-07-29 (Tomorrow)">2026-07-29 (Tomorrow)</option>
              <option value="2026-07-30 (Thursday)">2026-07-30 (Thursday)</option>
              <option value="2026-07-31 (Friday)">2026-07-31 (Friday)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">Available Time Slots</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedDoctor.availability.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold font-mono transition-all ${
                    selectedTime === time
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-muted/20 hover:bg-muted/40 text-foreground'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Enter Patient Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Patient Intake Details */}
      {step === 3 && (
        <form onSubmit={handleNextStep} className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Patient Information</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter patient details to receive SMS & email appointment confirmations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Email Address *</label>
              <input
                type="email"
                required
                placeholder="eleanor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Phone Number (For SMS Reminder) *</label>
              <input
                type="text"
                required
                placeholder="+1 (555) 234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-foreground">Reason for Visit / Symptoms Notes</label>
            <textarea
              rows={3}
              placeholder="Describe symptoms or reasons for appointment..."
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Confirm & Book Slot</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Booking Confirmation Screen */}
      {step === 4 && (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Appointment Confirmed!</h2>
            <p className="text-xs text-muted-foreground">
              Your appointment has been successfully scheduled. An SMS confirmation was sent to <span className="font-bold text-foreground">{phone}</span>.
            </p>
          </div>

          {/* Reference Card */}
          <div className="rounded-xl border border-border bg-muted/20 p-5 max-w-md mx-auto text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Booking Ref ID:</span>
              <span className="font-mono font-bold text-primary text-sm">{confirmationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Patient:</span>
              <span className="font-bold text-foreground">{patientName || 'Eleanor Vance'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Attending Physician:</span>
              <span className="font-bold text-foreground">{selectedDoctor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scheduled Date & Time:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedDate} @ {selectedTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => alert(`Downloading appointment confirmation PDF for ${confirmationId}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-muted"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Download PDF Ticket</span>
            </button>
            <button
              onClick={() => {
                setStep(1);
                setPatientName('');
              }}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
