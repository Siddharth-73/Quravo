"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PatientsDirectoryPage;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const DataTable_1 = require("@/components/data-table/DataTable");
const lucide_react_1 = require("lucide-react");
const hooks_1 = require("@/domains/patients/hooks");
const hooks_2 = require("@/domains/export/hooks");
const NewPatientModal_1 = require("@/components/modals/NewPatientModal");
const client_1 = require("@/lib/api/client");
function PatientsDirectoryPage() {
    const router = (0, navigation_1.useRouter)();
    const { data: patients = [], isLoading } = (0, hooks_1.usePatients)();
    const [exportId, setExportId] = (0, react_1.useState)(null);
    const [showNewPatientModal, setShowNewPatientModal] = (0, react_1.useState)(false);
    const requestExportMutation = (0, hooks_2.useRequestExport)();
    const { data: exportStatus } = (0, hooks_2.useExportStatus)(exportId);
    const handleExport = async () => {
        try {
            const result = await requestExportMutation.mutateAsync({ format: 'csv', entity: 'patients' });
            setExportId(result.exportId);
        }
        catch (e) {
            console.error(e);
        }
    };
    const isExporting = requestExportMutation.isPending || (exportStatus && (exportStatus.status === 'pending' || exportStatus.status === 'processing'));
    const columns = [
        {
            key: 'mrn',
            header: 'Medical Record #',
            sortable: true,
            accessor: (patient) => (<span className="font-mono text-xs font-semibold text-primary">{patient.mrn}</span>),
        },
        {
            key: 'fullName',
            header: 'Patient Name',
            sortable: true,
            accessor: (patient) => (<div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-semibold text-xs text-secondary-foreground">
            {patient.fullName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-foreground">{patient.fullName}</div>
            <div className="text-[10px] text-muted-foreground">{patient.gender}, {patient.age} yrs</div>
          </div>
        </div>),
        },
        {
            key: 'phone',
            header: 'Contact Info',
            accessor: (patient) => (<div>
          <div className="text-xs text-foreground flex items-center gap-1">
            <lucide_react_1.Phone className="w-3 h-3 text-muted-foreground"/>
            <span>{patient.phone}</span>
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <lucide_react_1.Mail className="w-3 h-3 text-muted-foreground"/>
            <span>{patient.email}</span>
          </div>
        </div>),
        },
        {
            key: 'createdAt',
            header: 'Created At',
            sortable: true,
            accessor: (patient) => (<div className="flex items-center gap-1 text-xs text-muted-foreground">
          <lucide_react_1.Calendar className="w-3 h-3"/>
          <span>{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}</span>
        </div>),
        },
        {
            key: 'status',
            header: 'Status',
            accessor: (patient) => (<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${patient.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-muted text-muted-foreground border-border'}`}>
          {patient.status}
        </span>),
        },
    ];
    return (<div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patient Directory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search, filter, and manage registered clinic patients and health records
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exportStatus?.status === 'completed' ? (<a href={`${client_1.API_BASE_URL}/export/${exportId}/download`} target="_blank" rel="noopener noreferrer" onClick={() => setExportId(null)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm">
              <lucide_react_1.CheckCircle2 className="w-3.5 h-3.5"/>
              <span>Download CSV</span>
            </a>) : (<button onClick={handleExport} disabled={isExporting} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted transition-colors shadow-sm disabled:opacity-50">
              {isExporting ? <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/> : <lucide_react_1.Download className="w-3.5 h-3.5"/>}
              <span>{isExporting ? 'Preparing Export...' : 'Export CSV'}</span>
            </button>)}

          <button onClick={() => setShowNewPatientModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
            <lucide_react_1.Plus className="w-3.5 h-3.5"/>
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {isLoading ? (<div className="flex justify-center p-8 border border-border bg-card rounded-xl">
          <lucide_react_1.Loader2 className="w-6 h-6 animate-spin text-muted-foreground"/>
        </div>) : (<DataTable_1.DataTable data={patients} columns={columns} searchPlaceholder="Search patients by name, MRN, phone..." onRowClick={(patient) => router.push(`/patients/${patient.id}`)}/>)}

      <NewPatientModal_1.NewPatientModal isOpen={showNewPatientModal} onClose={() => setShowNewPatientModal(false)} onPatientCreated={(patient) => {
            // React Query will typically handle refetching if configured,
            // but you could also do something with the newly returned patient here if needed.
        }}/>
    </div>);
}
