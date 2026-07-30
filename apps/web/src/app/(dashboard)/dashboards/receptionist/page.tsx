"use client";

import React, { useState } from 'react';
import {
  UserPlus,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  X,
  UserCheck,
  Building2,
  DollarSign,
  Phone,
  ShieldCheck,
  Check,
  Receipt,
} from 'lucide-react';
import Link from 'next/link';
import { usePatients } from '@/domains/patients/hooks';
import { useTenant } from '@/providers/TenantProvider';

interface QueueItem {
  id: string;
  name: string;
  mrn: string;
  gender: string;
  age: number;
  phone: string;
  doctor: string;
  slot: string;
  status: 'Checked-In' | 'Scheduled' | 'Completed' | 'Payment Pending';
  fee: string;
}

const INITIAL_RECEPTION_QUEUE: QueueItem[] = [
  {
    id: 'q-101',
    name: 'Rahul Verma',
    mrn: 'MRN-IN-1001',
    gender: 'Male',
    age: 38,
    phone: '+91 98112 34567',
    doctor: 'Dr. Suresh Reddy (Cardiologist)',
    slot: '09:30 AM',
    status: 'Checked-In',
    fee: '₹800.00',
  },
  {
    id: 'q-102',
    name: 'Priya Patel',
    mrn: 'MRN-IN-1002',
    gender: 'Female',
    age: 34,
    phone: '+91 98221 87654',
    doctor: 'Dr. Ananya Iyer (General Medicine)',
    slot: '10:15 AM',
    status: 'Payment Pending',
    fee: '₹1,200.00',
  },
  {
    id: 'q-103',
    name: 'Sunita Gupta',
    mrn: 'MRN-IN-1004',
    gender: 'Female',
    age: 51,
    phone: '+91 98445 66778',
    doctor: 'Dr. Rajesh Kumar (Endocrinologist)',
    slot: '11:00 AM',
    status: 'Checked-In',
    fee: '₹950.00',
  },
  {
    id: 'q-104',
    name: 'Aarav Mehta',
    mrn: 'MRN-IN-1003',
    gender: 'Male',
    age: 11,
    phone: '+91 98334 11223',
    doctor: 'Dr. Priya Sharma (Pediatrician)',
    slot: '11:45 AM',
    status: 'Scheduled',
    fee: '₹700.00',
  },
];

export default function ReceptionistDashboardPage() {
  const { tenant } = useTenant();
  const { data: dbPatients = [] } = usePatients();

  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_RECEPTION_QUEUE);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewWalkinOpen, setIsNewWalkinOpen] = useState(false);
  const [selectedPaymentItem, setSelectedPaymentItem] = useState<QueueItem | null>(null);

  // Walk-in Form State
  const [patientName, setPatientName] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('30');
  const [phone, setPhone] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Suresh Reddy (Cardiologist)');
  const [consultationFee, setConsultationFee] = useState('800');

  const handleRegisterWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      name: patientName,
      mrn: `MRN-IN-${Math.floor(1000 + Math.random() * 9000)}`,
      gender,
      age: parseInt(age) || 30,
      phone: phone || '+91 98000 11122',
      doctor: selectedDoctor,
      slot: 'Walk-In Now',
      status: 'Checked-In',
      fee: `₹${parseFloat(consultationFee).toFixed(2)}`,
    };

    setQueue([newItem, ...queue]);
    setIsNewWalkinOpen(false);

    // Reset
    setPatientName('');
    setPhone('');
  };

  const handleCheckIn = (id: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'Checked-In' as const } : q))
    );
  };

  const handleCompletePayment = () => {
    if (!selectedPaymentItem) return;
    setQueue((prev) =>
      prev.map((q) => (q.id === selectedPaymentItem.id ? { ...q, status: 'Checked-In' as const } : q))
    );
    setSelectedPaymentItem(null);
  };

  const filteredQueue = queue.filter(
    (q) =>
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkedInCount = queue.filter((q) => q.status === 'Checked-In').length;
  const pendingPaymentCount = queue.filter((q) => q.status === 'Payment Pending').length;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <span>Front Desk & Reception Command Center</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {tenant?.name || 'Apollo Hospitals, New Delhi'} — Walk-in registrations, patient check-ins, and POS cashier receipts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewWalkinOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Walk-In Patient</span>
          </button>
        </div>
      </div>

      {/* Reception Front Desk Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Checked-In Patients Today</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-500">{checkedInCount} Checked In</div>
          <div className="text-[11px] text-muted-foreground">Arrived in OPD Waiting Room</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Pending POS Billing Collection</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500">{pendingPaymentCount} Pending</div>
          <div className="text-[11px] text-amber-400">Awaiting cashier checkout</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Today's Total POS Collections</span>
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">₹24,500.00</div>
          <div className="text-[11px] text-emerald-500 font-medium">Cash + Razorpay Card/UPI</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Upcoming OPD Slots</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">6 Slots Open</div>
          <div className="text-[11px] text-muted-foreground">Available for walk-in booking</div>
        </div>
      </div>

      {/* Main Front Desk OPD Queue & Actions */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="font-bold text-base text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Today's OPD Queue & Patient Arrivals</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Check in arrived patients, manage walk-in appointments, and issue POS cashier receipts
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by patient, MRN, doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        {/* Queue Items */}
        <div className="space-y-3">
          {filteredQueue.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-all gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    {item.name}
                    <span className="font-mono text-[11px] text-muted-foreground font-normal">({item.mrn})</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.gender}, {item.age} yrs • {item.phone}
                  </p>
                </div>
              </div>

              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-foreground block">{item.doctor}</span>
                <span className="text-[11px] text-muted-foreground font-mono">Slot: {item.slot} • Fee: {item.fee}</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                    item.status === 'Checked-In'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : item.status === 'Payment Pending'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}
                >
                  {item.status}
                </span>

                {item.status === 'Scheduled' && (
                  <button
                    onClick={() => handleCheckIn(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Check-In</span>
                  </button>
                )}

                {item.status === 'Payment Pending' && (
                  <button
                    onClick={() => setSelectedPaymentItem(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Collect {item.fee}</span>
                  </button>
                )}

                {item.status === 'Checked-In' && (
                  <Link
                    href="/billing"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    <Receipt className="w-3.5 h-3.5 text-primary" />
                    <span>View Receipt</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Walk-in Registration Modal */}
      {isNewWalkinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-base">
                <UserPlus className="w-5 h-5 text-primary" />
                <span>Register Walk-In OPD Patient</span>
              </div>
              <button
                onClick={() => setIsNewWalkinOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterWalkin} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Attending Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none"
                >
                  <option value="Dr. Suresh Reddy (Cardiologist)">Dr. Suresh Reddy (Cardiologist)</option>
                  <option value="Dr. Ananya Iyer (General Medicine)">Dr. Ananya Iyer (General Medicine)</option>
                  <option value="Dr. Rajesh Kumar (Endocrinologist)">Dr. Rajesh Kumar (Endocrinologist)</option>
                  <option value="Dr. Priya Sharma (Pediatrician)">Dr. Priya Sharma (Pediatrician)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">OPD Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewWalkinOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                >
                  Register & Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POS Payment Collection Modal */}
      {selectedPaymentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-base">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span>POS Cashier Payment Collect</span>
              </div>
              <button
                onClick={() => setSelectedPaymentItem(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-muted/30 p-3 border border-border space-y-1">
                <p className="text-muted-foreground">Patient: <span className="font-bold text-foreground">{selectedPaymentItem.name}</span> ({selectedPaymentItem.mrn})</p>
                <p className="text-muted-foreground">Doctor: <span className="font-semibold text-foreground">{selectedPaymentItem.doctor}</span></p>
                <div className="pt-2 border-t border-border/50 flex justify-between items-center text-sm font-bold">
                  <span>Total Amount Due:</span>
                  <span className="text-emerald-500 font-mono">{selectedPaymentItem.fee}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" className="p-2.5 rounded-lg border border-primary bg-primary/10 text-primary font-bold text-center">Cash</button>
                  <button type="button" className="p-2.5 rounded-lg border border-border bg-muted/30 text-foreground font-medium text-center hover:bg-muted">Card / POS</button>
                  <button type="button" className="p-2.5 rounded-lg border border-border bg-muted/30 text-foreground font-medium text-center hover:bg-muted">Razorpay UPI</button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentItem(null)}
                  className="px-4 py-2 rounded-lg font-medium border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompletePayment}
                  className="px-4 py-2 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                >
                  Collect {selectedPaymentItem.fee} & Issue Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
