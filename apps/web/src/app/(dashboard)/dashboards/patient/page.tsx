"use client";

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Pill,
  FileText,
  Download,
  Plus,
  Clock,
  Search,
  MapPin,
  Star,
  Users,
  Building2,
  Stethoscope,
  Heart,
  Sparkles,
  Bot,
  CreditCard,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
  X,
  Send,
  Eye,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { apiFetch } from '@/lib/api/client';

interface DoctorDirectoryEntry {
  id: string;
  name: string;
  specialty: string;
  hospitalName: string;
  city: string;
  rating: number;
  consultationFeeRs: number;
  availableToday: boolean;
  symptoms: string[];
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
}

const INITIAL_DIRECTORY_DOCTORS: DoctorDirectoryEntry[] = [
  {
    id: 'doc-1',
    name: 'Dr. Suresh Reddy',
    specialty: 'Cardiologist (MMC Reg. 84920)',
    hospitalName: 'Apollo Hospitals, New Delhi',
    city: 'New Delhi',
    rating: 4.9,
    consultationFeeRs: 800,
    availableToday: true,
    symptoms: ['Chest Pain', 'High BP', 'Palpitations'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Iyer',
    specialty: 'General Medicine & Fever Specialist',
    hospitalName: 'Fortis Healthcare, Mumbai',
    city: 'Mumbai',
    rating: 4.85,
    consultationFeeRs: 600,
    availableToday: true,
    symptoms: ['Fever', 'Viral Infection', 'Body Pain'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Endocrinologist & Diabetes Lead',
    hospitalName: 'Max Super Specialty, Bengaluru',
    city: 'Bengaluru',
    rating: 4.95,
    consultationFeeRs: 1200,
    availableToday: false,
    symptoms: ['Diabetes', 'Thyroid', 'Obesity'],
  },
  {
    id: 'doc-4',
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatric Specialist',
    hospitalName: 'Medanta, Gurugram',
    city: 'Gurugram',
    rating: 4.88,
    consultationFeeRs: 700,
    availableToday: true,
    symptoms: ['Child Growth', 'Vaccination', 'Pediatric Fever'],
  },
];

const getPatientDetails = (email: string, firstName?: string, lastName?: string) => {
  const e = (email || '').toLowerCase();
  if (e.includes('priya') || e.includes('mumbai') || e.includes('fortis')) {
    return {
      name: 'Priya Patel',
      mrn: 'MRN-IN-1002',
      clinic: 'Fortis Healthcare, Mumbai',
      condition: 'Viral Pyrexia & High Grade Fever Intake',
      doctor: 'Dr. Ananya Iyer (General Medicine)',
      nextVisit: 'Tomorrow @ 10:15 AM',
      prescription: 'Amoxicillin 500mg (1 cap TDS x 5 days)',
      labReport: 'Dengue NS1 & CRP Antigen Report Ready',
    };
  }
  if (e.includes('sunita') || e.includes('bengaluru') || e.includes('max')) {
    return {
      name: 'Sunita Gupta',
      mrn: 'MRN-IN-1004',
      clinic: 'Max Super Specialty, Bengaluru',
      condition: 'Type-2 Diabetes Mellitus & Thyroid Follow-Up',
      doctor: 'Dr. Rajesh Kumar (Endocrinologist)',
      nextVisit: '2026-08-01 @ 11:00 AM',
      prescription: 'Metformin 500mg SR (1-0-1)',
      labReport: 'HbA1c & Fasting Lipid Profile Ready',
    };
  }
  if (e.includes('aarav') || e.includes('hyderabad') || e.includes('manipal')) {
    return {
      name: 'Aarav Mehta',
      mrn: 'MRN-IN-1003',
      clinic: 'Manipal Hospital, Hyderabad',
      condition: 'Pediatric Health Checkup & Vaccination',
      doctor: 'Dr. Priya Sharma (Pediatrician)',
      nextVisit: '2026-08-03 @ 11:45 AM',
      prescription: 'Paracetamol Syrup 125mg/5ml',
      labReport: 'Pediatric IgE Allergy Panel Ready',
    };
  }
  if (e.includes('rajesh') || e.includes('gurugram') || e.includes('medanta')) {
    return {
      name: 'Rajesh Kumar',
      mrn: 'MRN-IN-1005',
      clinic: 'Medanta The Medicity, Gurugram',
      condition: 'ECG & Cardiac Evaluation',
      doctor: 'Dr. Vikramaditya Singh (Orthopedic Specialist)',
      nextVisit: '2026-08-05 @ 02:30 PM',
      prescription: 'Etoricoxib 90mg (1 tab OD)',
      labReport: 'Lumbar Spine MRI Scan Report Ready',
    };
  }
  const derivedName = firstName ? `${firstName} ${lastName || ''}`.trim() : 'Rahul Verma';
  return {
    name: derivedName,
    mrn: 'MRN-IN-1001',
    clinic: 'Apollo Hospitals, New Delhi',
    condition: 'Hypertension Follow-Up & ECG Review',
    doctor: 'Dr. Suresh Reddy (Cardiologist)',
    nextVisit: 'Today @ 09:30 AM',
    prescription: 'Paracetamol 650mg (1-0-1)',
    labReport: 'Complete Blood Count (CBC) Report Ready',
  };
};

export default function PatientPortalDashboardPage() {
  const { user } = useAuth();
  const patient = getPatientDetails(user?.email || '', user?.firstName, user?.lastName);
  const patientName = patient.name;

  const [activeTab, setActiveTab] = useState<'overview' | 'discover' | 'appointments' | 'records' | 'family' | 'ai'>('overview');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(['doc-1']);

  // Family profiles
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: 'fam-1', name: patientName, relation: 'Self', age: 38, gender: 'Male' },
    { id: 'fam-2', name: 'Sunita Verma', relation: 'Spouse', age: 35, gender: 'Female' },
    { id: 'fam-3', name: 'Aarav Verma', relation: 'Child', age: 10, gender: 'Male' },
  ]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>('fam-1');

  // AI Assistant Query
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;

    setIsAiThinking(true);
    setTimeout(() => {
      setAiResponse(
        `Gemini Health Assistant Explanation:\n\n` +
          `Your recent CBC test report shows normal WBC count (7,800 /mcL) and healthy Hemoglobin levels (14.2 g/dL).\n` +
          `Your prescribed medication Paracetamol 650mg is an antipyretic for fever relief. Ensure adequate hydration (3L water daily).\n\n` +
          `*Note: This summary is generated for educational understanding. Always follow your attending physician's clinical advice.*`
      );
      setIsAiThinking(false);
    }, 1000);
  };

  const filteredDirectory = INITIAL_DIRECTORY_DOCTORS.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = selectedCity === 'All' || doc.city === selectedCity;
    const matchesToday = !onlyAvailableToday || doc.availableToday;

    return matchesSearch && matchesCity && matchesToday;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Platform Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 font-sans">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            <span>Patient Platform & Health Portal</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Welcome back, <span className="font-bold text-foreground">{patientName}</span>. Discover doctors, manage appointments, and access medical records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Family Switcher */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Profile:</span>
            <select
              value={selectedFamilyMember}
              onChange={(e) => setSelectedFamilyMember(e.target.value)}
              className="bg-transparent font-bold text-foreground focus:outline-none cursor-pointer"
            >
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.relation})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 text-xs overflow-x-auto">
        {[
          { id: 'overview', label: 'Health Dashboard', icon: Heart },
          { id: 'discover', label: 'Discover Doctors & Clinics', icon: Search },
          { id: 'appointments', label: 'My Appointments (2)', icon: Calendar },
          { id: 'records', label: 'Medical Records & Labs', icon: FileText },
          { id: 'family', label: 'Family Members', icon: Users },
          { id: 'ai', label: 'Gemini AI Assistant', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Health Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
              <span className="text-xs text-muted-foreground font-medium">Next Scheduled Visit</span>
              <div className="text-lg font-bold text-foreground">{patient.nextVisit}</div>
              <div className="text-xs text-primary font-semibold flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{patient.doctor}</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
              <span className="text-xs text-muted-foreground font-medium font-sans">Active Prescriptions (Rx)</span>
              <div className="text-lg font-bold text-foreground">{patient.prescription}</div>
              <div className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <Pill className="w-3.5 h-3.5" />
                <span>{patient.clinic}</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
              <span className="text-xs text-muted-foreground font-medium">Diagnostic Lab Report</span>
              <div className="text-lg font-bold text-emerald-500">{patient.labReport}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                <span>{patient.mrn} • Signed by Attending</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Patient Platform Services</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <button
                onClick={() => setActiveTab('discover')}
                className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all text-left space-y-2"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
                  <Search className="w-4 h-4" />
                </div>
                <div className="font-bold text-foreground">Find Doctors</div>
                <p className="text-[11px] text-muted-foreground">Search by specialty, symptom, or clinic location</p>
              </button>

              <button
                onClick={() => setActiveTab('records')}
                className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all text-left space-y-2"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 w-fit">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="font-bold text-foreground">Medical Records</div>
                <p className="text-[11px] text-muted-foreground">View prescriptions, SOAP notes, and lab PDFs</p>
              </button>

              <button
                onClick={() => setActiveTab('family')}
                className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all text-left space-y-2"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 w-fit">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-bold text-foreground">Family Care</div>
                <p className="text-[11px] text-muted-foreground">Manage spouse, children, and elderly parents</p>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all text-left space-y-2"
              >
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 w-fit">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="font-bold text-foreground">AI Health Scribe</div>
                <p className="text-[11px] text-muted-foreground">Summarize lab tests and understand prescriptions</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Discover Healthcare Directory Tab */}
      {activeTab === 'discover' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search doctor, specialty (Cardiology, Pediatrics), or symptom (Fever, BP)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="flex items-center gap-3 text-xs">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none"
                >
                  <option value="All">All Cities</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Gurugram">Gurugram</option>
                </select>

                <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium">
                  <input
                    type="checkbox"
                    checked={onlyAvailableToday}
                    onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Available Today</span>
                </label>
              </div>
            </div>
          </div>

          {/* Directory Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDirectory.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20">
                        {doc.name.charAt(4)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          {doc.name}
                          <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-normal">
                            <Star className="w-3 h-3 fill-amber-500" /> {doc.rating}
                          </span>
                        </h3>
                        <p className="text-xs text-primary font-medium">{doc.specialty}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(doc.id)}
                      className={`p-1.5 rounded-lg border ${
                        favorites.includes(doc.id)
                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(doc.id) ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{doc.hospitalName}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{doc.city} • Fee: ₹{doc.consultationFeeRs}.00</span>
                    </div>
                  </div>

                  {/* Symptoms Tags */}
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {doc.symptoms.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-muted/50 border border-border text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      doc.availableToday
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {doc.availableToday ? 'Available Today' : 'Next Slot Tomorrow'}
                  </span>

                  <Link
                    href={`/appointments`}
                    className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-xs"
                  >
                    Book Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. My Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>My Upcoming & Past Appointments</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-foreground text-sm">Dr. Suresh Reddy (Cardiologist)</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
                    Checked-In
                  </span>
                </div>
                <p className="text-muted-foreground">Apollo Hospitals, New Delhi • Date: 2026-07-30 @ 09:30 AM</p>
                <p className="text-xs text-foreground font-medium">Reason: Hypertension Follow-Up & ECG Review</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/encounters"
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  View SOAP Record
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-foreground text-sm">Dr. Ananya Iyer (General Medicine)</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-primary/10 text-primary border border-primary/20">
                    Scheduled
                  </span>
                </div>
                <p className="text-muted-foreground">Fortis Healthcare, Mumbai • Date: 2026-08-02 @ 10:15 AM</p>
                <p className="text-xs text-foreground font-medium">Reason: Routine Health Checkup & Blood Test</p>
              </div>

              <button className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted">
                Reschedule Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Medical Records Tab */}
      {activeTab === 'records' && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>Personal EHR & Diagnostic Reports</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
              <div className="space-y-0.5">
                <h4 className="font-bold text-foreground">Complete Blood Count (CBC) Diagnostic Report</h4>
                <p className="text-muted-foreground text-[11px] font-mono">Issued: 2026-07-28 • Metro Diagnostic Labs</p>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
              <div className="space-y-0.5">
                <h4 className="font-bold text-foreground">Digital Chest X-Ray Scan Report</h4>
                <p className="text-muted-foreground text-[11px] font-mono">Issued: 2026-07-20 • Apollo Hospital Radiology</p>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Download Scan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Family Members Tab */}
      {activeTab === 'family' && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Family Member Health Profiles</span>
            </h3>

            <button
              onClick={() => {
                const name = prompt('Enter Family Member Name:');
                if (name) {
                  setFamilyMembers([
                    ...familyMembers,
                    { id: `fam-${Date.now()}`, name, relation: 'Dependent', age: 25, gender: 'Other' },
                  ]);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Family Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {familyMembers.map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="font-bold text-sm text-foreground">{m.name}</div>
                <div className="text-muted-foreground text-[11px] font-mono">Relation: {m.relation} • Age: {m.age} yrs ({m.gender})</div>
                <button
                  onClick={() => setSelectedFamilyMember(m.id)}
                  className="w-full py-1.5 rounded-lg bg-card border border-border font-semibold hover:bg-muted text-foreground text-[11px]"
                >
                  Switch to Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Gemini AI Assistant Tab */}
      {activeTab === 'ai' && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Bot className="w-5 h-5 text-rose-500" />
            <span>Gemini AI Patient Health Assistant</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ask Gemini AI to explain your lab reports or understand prescription dosage instructions.
          </p>

          <form onSubmit={handleAskAi} className="space-y-3 text-xs">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Explain my Paracetamol 650mg dosage and CBC test result..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full pl-4 pr-24 py-3 rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={isAiThinking}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAiThinking ? 'Analyzing...' : 'Ask AI'}</span>
              </button>
            </div>

            {aiResponse && (
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 text-foreground leading-relaxed whitespace-pre-line font-medium text-xs">
                {aiResponse}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
