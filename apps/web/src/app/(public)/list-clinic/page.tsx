"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { QuravoLogo } from '@/components/ui/Logo';
import { Building2, CheckCircle2, ArrowRight, Loader2, Mail, Phone, MapPin, Stethoscope, Users, FileText } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';

export default function ListYourClinicPage() {
  const [clinicName, setClinicName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('General Practice / Family Medicine');
  const [estimatedMonthlyPatients, setEstimatedMonthlyPatients] = useState('100 - 500 patients');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await apiFetch('/super-admin/list-clinic-request', {
        method: 'POST',
        body: JSON.stringify({
          clinicName,
          ownerName,
          email,
          phone,
          city,
          specialty,
          estimatedMonthlyPatients,
          additionalNotes,
        }),
      });

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit clinic listing application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 md:px-12 backdrop-blur-md">
        <Link href="/">
          <QuravoLogo size="md" />
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <Link href="/login" className="px-4 py-2 rounded-xl border border-border bg-card font-semibold text-foreground hover:bg-muted">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90">
            Start Free Trial
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-6 md:px-12 max-w-4xl mx-auto space-y-8 w-full">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Join the Quravo Healthcare Network</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            List Your <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Clinic & Practice</span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Expand your clinic footprint, automate patient scheduling, enable AI SOAP clinical charting, and streamline billing under your custom brand.
          </p>
        </div>

        {isSubmitted ? (
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200 max-w-2xl mx-auto">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Listing Request Submitted!</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Thank you, <span className="font-bold text-foreground">{ownerName}</span>. Our Super Admin team has been notified and sent an email alert. We will review <span className="font-bold text-foreground">{clinicName}</span> and contact you shortly at <span className="font-bold text-foreground">{email}</span>.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link href="/" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm">
                Return to Home Page
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xl space-y-6">
            {errorMessage && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> Clinic / Practice Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Health Clinic"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-primary" /> Owner / Lead Practitioner Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Contact Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sarah.jenkins@apexhealth.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> City / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco, CA"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-primary" /> Primary Medical Specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="General Practice / Family Medicine">General Practice / Family Medicine</option>
                  <option value="Pediatrics & Child Care">Pediatrics & Child Care</option>
                  <option value="Cardiology & Internal Medicine">Cardiology & Internal Medicine</option>
                  <option value="Dental & Oral Surgery">Dental & Oral Surgery</option>
                  <option value="Dermatology & Cosmetic Surgery">Dermatology & Cosmetic Surgery</option>
                  <option value="Multi-Specialty Polyclinic">Multi-Specialty Polyclinic</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-foreground flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" /> Estimated Monthly Patients Volume
              </label>
              <select
                value={estimatedMonthlyPatients}
                onChange={(e) => setEstimatedMonthlyPatients(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              >
                <option value="Under 100 patients">Under 100 patients / month</option>
                <option value="100 - 500 patients">100 - 500 patients / month</option>
                <option value="500 - 2,000 patients">500 - 2,000 patients / month</option>
                <option value="2,000+ patients (Multi-Branch)">2,000+ patients / month (Multi-Branch)</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" /> Additional Information / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Mention branch count, existing EMR system, or custom white-label requirements..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit Clinic Listing Request'}</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
