"use client";

import React from 'react';
import { Stethoscope, User, Save, Sparkles, Plus, Trash2, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEncounters } from '@/domains/emr/hooks';

export default function EncountersPage() {
  const { data: encounters = [], isLoading } = useEncounters();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Encounters Directory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            View all clinical encounters across the clinic
          </p>
        </div>

        <div className="flex items-center gap-2">
           <Link href="/encounters/new" className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm">
             <Plus className="w-3.5 h-3.5" />
             <span>New Encounter</span>
           </Link>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
             <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
             <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
                <span className="w-1/4">Date</span>
                <span className="w-1/3">Patient Name</span>
                <span className="w-1/4">Chief Complaint</span>
                <span className="w-1/6 text-right">Status</span>
             </div>
             
             {encounters.map(encounter => (
                <div key={encounter.id} className="flex items-center justify-between text-xs p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40">
                  <span className="w-1/4 flex items-center gap-1.5 font-medium">
                     <Clock className="w-3.5 h-3.5 text-primary" />
                     {new Date(encounter.date).toLocaleDateString()}
                  </span>
                  <span className="w-1/3 flex items-center gap-1.5 font-medium text-foreground">
                     <User className="w-3.5 h-3.5 text-muted-foreground" />
                     {encounter.patientName || 'Unknown Patient'}
                  </span>
                  <span className="w-1/4 truncate text-muted-foreground">
                     {encounter.chiefComplaint || 'No chief complaint'}
                  </span>
                  <span className="w-1/6 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${encounter.status === 'Final' || encounter.status === 'Signed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                      {encounter.status}
                    </span>
                  </span>
                </div>
             ))}

             {encounters.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No encounters found.
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

