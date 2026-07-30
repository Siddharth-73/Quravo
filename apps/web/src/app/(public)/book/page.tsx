'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar as CalendarIcon, Clock, CheckCircle2, Hospital, Stethoscope, User, CreditCard, Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';

export interface DoctorHospitalEntry {
  id: string;
  name: string;
  type: 'doctor' | 'hospital';
  specialty: string;
  symptoms: string[];
  hospitalName: string;
  city: string;
  rating: number;
  consultationFeeRs: number;
}

const FALLBACK_DIRECTORY: DoctorHospitalEntry[] = [
  {
    id: 'doc-in-1',
    name: 'Dr. Siddharth Sharma',
    type: 'doctor',
    specialty: 'Cardiologist (MMC Reg. 84920)',
    symptoms: ['Chest Pain', 'High Blood Pressure', 'Palpitations', 'Shortness of Breath', 'Fever'],
    hospitalName: 'Apollo Hospitals, New Delhi',
    city: 'New Delhi',
    rating: 4.9,
    consultationFeeRs: 800,
  },
  {
    id: 'doc-in-2',
    name: 'Dr. Ananya Iyer',
    type: 'doctor',
    specialty: 'Pediatrician (KMC Reg. 73921)',
    symptoms: ['Fever', 'Cough & Cold', 'Child Vaccination', 'Skin Rash', 'Loss of Appetite'],
    hospitalName: 'Fortis Healthcare, Mumbai',
    city: 'Mumbai',
    rating: 4.85,
    consultationFeeRs: 600,
  },
  {
    id: 'doc-in-3',
    name: 'Dr. Rajesh Kumar',
    type: 'doctor',
    specialty: 'Neurologist (DMC Reg. 64210)',
    symptoms: ['Migraine', 'Headache', 'Dizziness', 'Memory Loss', 'Numbness'],
    hospitalName: 'Max Super Specialty, Bengaluru',
    city: 'Bengaluru',
    rating: 4.95,
    consultationFeeRs: 1200,
  },
  {
    id: 'doc-in-4',
    name: 'Dr. Priya Nair',
    type: 'doctor',
    specialty: 'Dermatologist (TNC Reg. 53109)',
    symptoms: ['Acne', 'Skin Rash', 'Eczema', 'Hair Loss', 'Itchiness'],
    hospitalName: 'Manipal Hospital, Hyderabad',
    city: 'Hyderabad',
    rating: 4.8,
    consultationFeeRs: 700,
  },
  {
    id: 'doc-in-5',
    name: 'Dr. Vikramaditya Singh',
    type: 'doctor',
    specialty: 'Orthopedic Specialist (HMC Reg. 91823)',
    symptoms: ['Joint Pain', 'Backache', 'Bone Fracture', 'Arthritis', 'Sports Injury'],
    hospitalName: 'Medanta The Medicity, Gurugram',
    city: 'Gurugram',
    rating: 4.9,
    consultationFeeRs: 1000,
  },
  {
    id: 'doc-in-6',
    name: 'Dr. Meera Deshmukh',
    type: 'doctor',
    specialty: 'Gynecologist (MMC Reg. 42918)',
    symptoms: ['PCOS/PCOD', 'Irregular Periods', 'Pregnancy Care', 'Abdominal Pain'],
    hospitalName: 'Narayana Health, Chennai',
    city: 'Chennai',
    rating: 4.88,
    consultationFeeRs: 900,
  },
  { id: 'hosp-1', name: 'Apollo Hospitals, New Delhi', type: 'hospital', specialty: 'Multi-Specialty Super Healthcare', symptoms: ['Emergency', 'ICU', 'Cardiology', 'Surgery'], hospitalName: 'Apollo Hospitals', city: 'New Delhi', rating: 4.9, consultationFeeRs: 1000 },
  { id: 'hosp-2', name: 'Fortis Healthcare, Mumbai', type: 'hospital', specialty: 'Oncology & Pediatrics', symptoms: ['Pediatrics', 'Chemotherapy', 'Surgery'], hospitalName: 'Fortis Healthcare', city: 'Mumbai', rating: 4.85, consultationFeeRs: 900 },
  { id: 'hosp-3', name: 'Max Super Specialty, Bengaluru', type: 'hospital', specialty: 'Neurology & Orthopedics', symptoms: ['Brain Surgery', 'Joint Replacement', 'MRI'], hospitalName: 'Max Super Specialty', city: 'Bengaluru', rating: 4.95, consultationFeeRs: 1200 },
  { id: 'hosp-4', name: 'Manipal Hospital, Hyderabad', type: 'hospital', specialty: 'Gastroenterology & Cardiology', symptoms: ['Endoscopy', 'Angioplasty', 'Diagnostics'], hospitalName: 'Manipal Hospital', city: 'Hyderabad', rating: 4.8, consultationFeeRs: 800 },
  { id: 'hosp-5', name: 'Medanta The Medicity, Gurugram', type: 'hospital', specialty: 'Cardiac Institute & Transplant', symptoms: ['Heart Bypass', 'Organ Transplant', 'Trauma'], hospitalName: 'Medanta', city: 'Gurugram', rating: 4.9, consultationFeeRs: 1500 },
  { id: 'hosp-6', name: 'Narayana Health, Chennai', type: 'hospital', specialty: 'Cardiac & General Healthcare', symptoms: ['Dialysis', 'General Surgery', 'ECG'], hospitalName: 'Narayana Health', city: 'Chennai', rating: 4.88, consultationFeeRs: 750 },
];

// Lightweight Fuzzy Search Algorithm
function fuzzySearchMatch(query: string, target: string): boolean {
  if (!query.trim()) return true;
  const cleanQ = query.toLowerCase().trim();
  const cleanT = target.toLowerCase();
  if (cleanT.includes(cleanQ)) return true;
  let tIdx = 0;
  for (let qIdx = 0; qIdx < cleanQ.length; qIdx++) {
    const char = cleanQ[qIdx];
    tIdx = cleanT.indexOf(char, tIdx);
    if (tIdx === -1) return false;
    tIdx++;
  }
  return true;
}

export default function PatientSelfBookingPage() {
  const [directory, setDirectory] = useState<DoctorHospitalEntry[]>(FALLBACK_DIRECTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'doctors' | 'hospitals' | 'symptoms'>('all');
  const [selectedEntry, setSelectedEntry] = useState<DoctorHospitalEntry | null>(null);

  // Booking Flow State
  const [selectedDate, setSelectedDate] = useState('2026-08-01');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('online');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Search & Select, 2: Slot & Patient Form, 3: Success Confirmation
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    async function loadPublicData() {
      try {
        const [docsRes, hospRes] = await Promise.allSettled([
          apiFetch<DoctorHospitalEntry[]>('/platform/patient/doctors'),
          apiFetch<DoctorHospitalEntry[]>('/platform/patient/hospitals'),
        ]);

        const combined: DoctorHospitalEntry[] = [];
        if (docsRes.status === 'fulfilled' && Array.isArray(docsRes.value) && docsRes.value.length > 0) {
          combined.push(...docsRes.value);
        }
        if (hospRes.status === 'fulfilled' && Array.isArray(hospRes.value) && hospRes.value.length > 0) {
          combined.push(...hospRes.value);
        }

        if (combined.length > 0) {
          setDirectory(combined);
        }
      } catch (err) {
        console.warn('Using fallback Indian directory', err);
      }
    }
    loadPublicData();
  }, []);

  const filteredEntries = useMemo(() => {
    return directory.filter((item) => {
      if (activeCategory === 'doctors' && item.type !== 'doctor') return false;
      if (activeCategory === 'hospitals' && item.type !== 'hospital') return false;

      if (!searchQuery.trim()) return true;

      const matchName = fuzzySearchMatch(searchQuery, item.name);
      const matchSpecialty = fuzzySearchMatch(searchQuery, item.specialty);
      const matchCity = fuzzySearchMatch(searchQuery, item.city);
      const matchHospital = fuzzySearchMatch(searchQuery, item.hospitalName);
      const matchSymptom = item.symptoms.some((sym) => fuzzySearchMatch(searchQuery, sym));

      if (activeCategory === 'symptoms') {
        return matchSymptom;
      }

      return matchName || matchSpecialty || matchCity || matchHospital || matchSymptom;
    });
  }, [directory, searchQuery, activeCategory]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntry) return;

    if (paymentMethod === 'online') {
      setIsProcessingPayment(true);
      // Simulate Razorpay Gateway checkout popup with test key rzp_test_SwUFweahnIDY4u
      setTimeout(() => {
        setIsProcessingPayment(false);
        setBookingRef(`QUR-IN-${Math.floor(100000 + Math.random() * 900000)}`);
        setStep(3);
      }, 1500);
    } else {
      setBookingRef(`QUR-IN-${Math.floor(100000 + Math.random() * 900000)}`);
      setStep(3);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Find Doctors & Book Appointments</h1>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          {/* Fuzzy Search Bar & Filters */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl backdrop-blur-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Symptoms (Fever, Chest pain, Migraine), Doctor Name, or Indian Hospital..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium shadow-inner"
              />
              <Search className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  activeCategory === 'all'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                All Directory
              </button>
              <button
                onClick={() => setActiveCategory('hospitals')}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  activeCategory === 'hospitals'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Registered Hospitals 🏥
              </button>
              <button
                onClick={() => setActiveCategory('doctors')}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  activeCategory === 'doctors'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Specialist Doctors 👨‍⚕️
              </button>
              <button
                onClick={() => setActiveCategory('symptoms')}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  activeCategory === 'symptoms'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Search by Symptoms 🩺
              </button>
            </div>
          </div>

          {/* Directory Cards Grid with Visible Scrollbar */}
          <div className="max-h-[550px] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4">

            {filteredEntries.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4 hover:border-purple-500/40 hover:bg-slate-900/80 transition-all shadow-md group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      {item.type === 'doctor' ? '👨‍⚕️ Doctor / Specialist' : '🏥 Registered Hospital'}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">{item.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" /> {item.specialty} • {item.city}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-lg">
                    ★ {item.rating}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.symptoms.map((sym) => (
                    <span key={sym} className="px-2 py-0.5 bg-slate-950 text-slate-300 text-[11px] rounded border border-slate-800 font-medium">
                      {sym}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Consultation Fee</span>
                    <p className="font-bold text-emerald-400 text-sm">₹{item.consultationFeeRs} (INR)</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEntry(item);
                      setStep(2);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow flex items-center gap-1 transition-colors"
                  >
                    <span>Select & Book Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Slot Selector & Patient Details Form */}
      {step === 2 && selectedEntry && (
        <form onSubmit={handleConfirmBooking} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6 max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-purple-400">Step 2: Schedule & Checkout</span>
              <h2 className="text-xl font-bold text-white">{selectedEntry.name}</h2>
              <p className="text-xs text-slate-400">{selectedEntry.hospitalName} • {selectedEntry.city}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 border border-slate-800 rounded-lg"
            >
              ← Change Doctor
            </button>
          </div>

          {/* Date & Time Slot Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Select Appointment Date & Slot</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min="2026-07-30"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white font-medium focus:outline-none"
                >
                  {['09:00 AM', '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM', '06:00 PM'].map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Patient Details Intake */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Patient Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Number (SMS Confirmation) *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment Option (₹{selectedEntry.consultationFeeRs} INR)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <label
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  paymentMethod === 'online'
                    ? 'border-purple-500 bg-purple-500/10 text-white ring-2 ring-purple-500/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>💳 Online Payment</span>
                  {paymentMethod === 'online' && <span className="text-purple-400">✓</span>}
                </div>
                <p className="text-[11px] text-slate-400">Razorpay (UPI, Netbanking, Cards)</p>
                <span className="inline-block text-[10px] font-mono text-amber-400">Key: rzp_test_SwUFweahnIDY4u</span>
              </label>

              <label
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  paymentMethod === 'cash'
                    ? 'border-purple-500 bg-purple-500/10 text-white ring-2 ring-purple-500/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>🏥 Pay at Clinic</span>
                  {paymentMethod === 'cash' && <span className="text-purple-400">✓</span>}
                </div>
                <p className="text-[11px] text-slate-400">Pay cash/card upon arrival at desk</p>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-slate-800">
            <div>
              <span className="text-slate-400 text-xs">Total Fee</span>
              <p className="text-2xl font-bold text-emerald-400">₹{selectedEntry.consultationFeeRs}</p>
            </div>
            <button
              type="submit"
              disabled={isProcessingPayment}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-colors text-xs flex items-center gap-2"
            >
              {isProcessingPayment ? (
                <span>⚡ Processing Razorpay Payment...</span>
              ) : (
                <span>Confirm & Book Appointment →</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Booking Confirmation Screen */}
      {step === 3 && selectedEntry && (
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl text-center space-y-6 max-w-xl mx-auto shadow-2xl backdrop-blur-md">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Appointment Confirmed!</h2>
            <p className="text-xs text-slate-400">
              SMS confirmation dispatched to <span className="font-bold text-white">{patientPhone || '+91 98765 43210'}</span>.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Booking Reference:</span>
              <span className="font-bold text-purple-400">{bookingRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Patient Name:</span>
              <span className="text-white font-semibold font-sans">{patientName || 'Rahul Sharma'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Doctor / Hospital:</span>
              <span className="text-white font-semibold font-sans">{selectedEntry.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scheduled Time:</span>
              <span className="text-emerald-400 font-bold">{selectedDate} @ {selectedSlot}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 font-sans font-bold text-white text-sm">
              <span>Paid Amount:</span>
              <span className="text-emerald-400">₹{selectedEntry.consultationFeeRs} INR</span>
            </div>
          </div>

          <button
            onClick={() => {
              setStep(1);
              setSelectedEntry(null);
            }}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl"
          >
            Book Another Appointment
          </button>
        </div>
      )}
    </div>
  );
}
