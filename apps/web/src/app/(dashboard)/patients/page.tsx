"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/components/data-table/DataTable';
import { Plus, User, Phone, Mail, FileText, Calendar, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { usePatients, Patient } from '@/domains/patients/hooks';
import { useRequestExport, useExportStatus } from '@/domains/export/hooks';

export default function PatientsDirectoryPage() {
  const router = useRouter();
  const { data: patients = [], isLoading } = usePatients();
  
  const [exportJobId, setExportJobId] = useState<string | null>(null);
  const requestExportMutation = useRequestExport();
  const { data: exportStatus } = useExportStatus(exportJobId);

  const handleExport = async () => {
    try {
      const result = await requestExportMutation.mutateAsync({ format: 'csv', resource: 'patients' });
      setExportJobId(result.jobId);
    } catch (e) {
      console.error(e);
    }
  };

  const isExporting = requestExportMutation.isPending || (exportStatus && exportStatus.status === 'pending');

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patient Directory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search, filter, and manage registered clinic patients and health records
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exportStatus?.status === 'completed' && exportStatus.url ? (
            <a
              href={exportStatus.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setExportJobId(null)}
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

          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
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
    </div>
  );
}

