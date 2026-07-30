"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/components/data-table/DataTable';
import { Plus, User, Phone, Mail, FileText, Calendar, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { usePatients, Patient } from '@/domains/patients/hooks';
import { useRequestExport, useExportStatus } from '@/domains/export/hooks';
import { NewPatientModal } from '@/components/modals/NewPatientModal';
import { API_BASE_URL } from '@/lib/api/client';

const FALLBACK_PATIENTS: Patient[] = [
  {
    id: 'p-101',
    tenantId: 't-apollo',
    mrn: 'MRN-IN-1001',
    fullName: 'Rahul Verma',
    gender: 'Male',
    age: 38,
    phone: '+91 98112 34567',
    email: 'rahul.verma@example.com',
    status: 'Active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'p-102',
    tenantId: 't-apollo',
    mrn: 'MRN-IN-1002',
    fullName: 'Priya Patel',
    gender: 'Female',
    age: 34,
    phone: '+91 98221 87654',
    email: 'priya.patel@example.com',
    status: 'Active',
    createdAt: '2026-02-10T00:00:00.000Z',
  },
  {
    id: 'p-103',
    tenantId: 't-apollo',
    mrn: 'MRN-IN-1003',
    fullName: 'Aarav Mehta',
    gender: 'Male',
    age: 11,
    phone: '+91 98334 11223',
    email: 'parent.mehta@example.com',
    status: 'Active',
    createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'p-104',
    tenantId: 't-apollo',
    mrn: 'MRN-IN-1004',
    fullName: 'Sunita Gupta',
    gender: 'Female',
    age: 51,
    phone: '+91 98445 66778',
    email: 'sunita.gupta@example.com',
    status: 'Active',
    createdAt: '2026-03-18T00:00:00.000Z',
  },
  {
    id: 'p-105',
    tenantId: 't-apollo',
    mrn: 'MRN-IN-1005',
    fullName: 'Rajesh Kumar',
    gender: 'Male',
    age: 46,
    phone: '+91 98556 99001',
    email: 'rajesh.kumar@example.com',
    status: 'Active',
    createdAt: '2026-04-05T00:00:00.000Z',
  },
];

export default function PatientsDirectoryPage() {
  const router = useRouter();
  const { data: dbPatients = [], isLoading } = usePatients();
  const patients = dbPatients.length > 0 ? dbPatients : FALLBACK_PATIENTS;

  const [exportId, setExportId] = useState<string | null>(null);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const requestExportMutation = useRequestExport();
  const { data: exportStatus } = useExportStatus(exportId);

  const handleExport = async () => {
    try {
      const result = await requestExportMutation.mutateAsync({ format: 'csv', entity: 'patients' });
      setExportId(result.exportId);
    } catch (e) {
      console.error(e);
    }
  };

  const isExporting = requestExportMutation.isPending || (exportStatus && (exportStatus.status === 'pending' || exportStatus.status === 'processing'));

  const columns: ColumnDef<Patient>[] = [
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
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      accessor: (patient) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            <span>Patients Directory & Electronic Health Records (EHR)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search, filter, and manage registered clinic patients and health records
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exportStatus?.status === 'completed' ? (
            <a
              href={`${API_BASE_URL}/export/${exportId}/download`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setExportId(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </a>
          ) : (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted transition-colors shadow-sm disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isExporting ? 'Preparing Export...' : 'Export CSV'}</span>
            </button>
          )}

          <button
            onClick={() => setShowNewPatientModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 border border-border bg-card rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DataTable
          data={patients}
          columns={columns}
          searchPlaceholder="Search patients by name, MRN, phone..."
          onRowClick={(patient) => router.push(`/patients/${patient.id}`)}
        />
      )}

      <NewPatientModal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        onPatientCreated={() => {}}
      />
    </div>
  );
}
