"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Mail, Lock, CheckCircle2, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SmartSignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'admin'>('doctor');

  // Conditional Fields
  const [selectedClinic, setSelectedClinic] = useState('Apex Health Main Clinic');
  const [clinicName, setClinicName] = useState('');
  const [subdomain, setSubdomain] = useState('');

  const [submittedStatus, setSubmittedStatus] = useState<'none' | 'patient_success' | 'staff_pending' | 'admin_pending'>('none');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'patient') {
      setSubmittedStatus('patient_success');
    } else if (role === 'admin') {
      setSubmittedStatus('admin_pending');
    } else {
      setSubmittedStatus('staff_pending');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg mb-2">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Your Account</h1>
          <p className="text-xs text-muted-foreground">
            Select your role to request clinic access or register a new healthcare practice
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
          {submittedStatus === 'none' ? (
            <form onSubmit={handleSignup} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Full Name *</label>
                <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <User className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Gregory House"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Email Address *</label>
                <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <Mail className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="house@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Password *</label>
                <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <Lock className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-foreground focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Role Selection Dropdown (No Super-Admin) */}
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Select Your Account Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as typeof role)}
                  className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="doctor">Doctor / Physician (Clinical Staff)</option>
                  <option value="nurse">Nurse / Triage Head (Clinical Staff)</option>
                  <option value="receptionist">Front Desk Receptionist (Operations)</option>
                  <option value="pharmacist">Pharmacist (Pharmacy Operations)</option>
                  <option value="patient">Patient (Self-Service Patient Portal)</option>
                  <option value="admin">Clinic Owner / Hospital Director (New Practice)</option>
                </select>
              </div>

              {/* Conditional Dropdown for Staff */}
              {role !== 'patient' && role !== 'admin' && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <label className="font-semibold text-foreground">Select Registered Clinic to Join *</label>
                  <select
                    value={selectedClinic}
                    onChange={(e) => setSelectedClinic(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  >
                    <option value="Apex Health Main Clinic">Apex Health Main Clinic</option>
                    <option value="Sunrise Dental & Medical Chain">Sunrise Dental & Medical Chain</option>
                    <option value="Valley Community Hospital">Valley Community Hospital</option>
                    <option value="Metro Urgent Care Center">Metro Urgent Care Center</option>
                  </select>
                  <p className="text-[10px] text-muted-foreground pt-0.5">
                    Your request will be sent to the Clinic Administrator for approval before login.
                  </p>
                </div>
              )}

              {/* Conditional Fields for Clinic Owner */}
              {role === 'admin' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Practice / Clinic Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Baker Street Medical"
                      value={clinicName}
                      onChange={(e) => {
                        setClinicName(e.target.value);
                        setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                      }}
                      className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Desired Subdomain URL</label>
                    <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value)}
                        placeholder="bakerhealth"
                        className="w-full bg-transparent font-mono text-foreground focus:outline-none"
                      />
                      <span className="text-muted-foreground text-[11px]">.platform.com</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground">
                    Your tenant onboarding request will be sent to the Platform Super-Admin for verification & provisioning.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm mt-2"
              >
                <span>Submit Registration Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4 text-xs animate-in zoom-in-95 duration-200">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Clock className="w-7 h-7" />
              </div>

              {submittedStatus === 'patient_success' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-foreground">Patient Registration Complete!</h3>
                  <p className="text-muted-foreground">
                    Your patient account has been created. You can log in immediately to book appointments.
                  </p>
                </div>
              )}

              {submittedStatus === 'staff_pending' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-foreground">Request Sent to Clinic Administrator</h3>
                  <p className="text-muted-foreground">
                    Your request to join <span className="font-bold text-foreground">{selectedClinic}</span> as a <span className="font-bold text-foreground">{role.toUpperCase()}</span> is pending approval by the Clinic Administrator.
                  </p>
                </div>
              )}

              {submittedStatus === 'admin_pending' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-foreground">Hospital Onboarding Request Sent</h3>
                  <p className="text-muted-foreground">
                    Your clinic onboarding request for <span className="font-bold text-foreground">{clinicName || 'New Clinic'}</span> (<span className="font-mono text-primary">{subdomain}.platform.com</span>) has been sent to the **Platform Super-Admin** for provisioning.
                  </p>
                </div>
              )}

              <Link
                href="/login"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
              >
                <span>Return to Login</span>
              </Link>
            </div>
          )}

          <div className="text-center pt-2 border-t border-border text-[11px] text-muted-foreground">
            Already registered?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
