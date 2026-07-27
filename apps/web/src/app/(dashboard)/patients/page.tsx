"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/components/data-table/DataTable';
import { Plus, User, Phone, Mail, FileText, Calendar } from 'lucide-react';

interface PatientRow {
  id: string;
  mrn: string;
  fullName: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
}

const mockPatients: PatientRow[] = [
  {
    id: 'p-101',
    mrn: 'MRN-2026-001',
    fullName: 'Eleanor Vance',
    gender: 'Female',
    age: 34,
    phone: '+1 (555) 234-5678',
    email: 'eleanor.vance@example.com',
    lastVisit: '2026-07-20',
    status: 'Active',
  },
  {
    id: 'p-102',
    mrn: 'MRN-2026-002',
    fullName: 'Marcus Aurelius',
    gender: 'Male',
    age: 52,
    phone: '+1 (555) 876-5432',
    email: 'marcus.aurelius@example.com',
    lastVisit: '2026-07-25',
    status: 'Active',
  },
  {
    id: 'p-103',
    mrn: 'MRN-2026-003',
    fullName: 'Sophia Lin',
    gender: 'Female',
    age: 28,
    phone: '+1 (555) 345-6789',
    email: 'sophia.lin@example.com',
    lastVisit: '2026-07-15',
    status: 'Active',
  },
  {
    id: 'p-104',
    mrn: 'MRN-2026-004',
    fullName: 'David Miller',
    gender: 'Male',
    age: 45,
    phone: '+1 (555) 987-6543',
    email: 'david.miller@example.com',
    lastVisit: '2026-06-30',
    status: 'Inactive',
  },
  {
    id: 'p-105',
    mrn: 'MRN-2026-005',
    fullName: 'Hannah Abbott',
    gender: 'Female',
    age: 29,
    phone: '+1 (555) 654-3210',
    email: 'hannah.abbott@example.com',
    lastVisit: '2026-07-27',
    status: 'Active',
  },
];

export default function PatientsDirectoryPage() {
  const router = useRouter();

  const columns: ColumnDef<PatientRow>[] = [
    {
      key: 'mrn',
      header: 'Medical Record #',
      sortable: true,
      accessor: (patient) => (
        <span className="font-mono text-xs font-semibold text-primary">{patient.mrn}</span>
      ),
    },
    {
      key: 'fullName',
      header: 'Patient Name',
      sortable: true,
      accessor: (patient) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-semibold text-xs text-secondary-foreground">
            {patient.fullName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-foreground">{patient.fullName}</div>
            <div className="text-[10px] text-muted-foreground">{patient.gender}, {patient.age} yrs</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact Info',
      accessor: (patient) => (
        <div>
          <div className="text-xs text-foreground flex items-center gap-1">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span>{patient.phone}</span>
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span>{patient.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'lastVisit',
      header: 'Last Visit Date',
      sortable: true,
      accessor: (patient) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{patient.lastVisit}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (patient) => (
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            patient.status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-muted text-muted-foreground border-border'
          }`}
        >
          {patient.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patient Directory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search, filter, and manage registered clinic patients and health records
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Patient</span>
        </button>
      </div>

      <DataTable
        data={mockPatients}
        columns={columns}
        searchPlaceholder="Search patients by name, MRN, phone..."
        onRowClick={(patient) => router.push(`/patients/${patient.id}`)}
      />
    </div>
  );
}
