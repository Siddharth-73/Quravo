"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '@/lib/query-keys/dashboard';
import { apiFetch } from '@/lib/api/client';
import { UserCheck, Clock, ArrowRight } from 'lucide-react';

interface QueueItem {
  id: string;
  patientName: string;
  checkInTime: string;
  waitTime: string;
  triageCategory: 'Normal' | 'Urgent' | 'Priority';
}

async function fetchPatientQueue(): Promise<QueueItem[]> {
  try {
    const branches = await apiFetch<any[]>('/clinic/branches');
    if (!branches || branches.length === 0) return [];
    const branchId = branches[0].id;

    const list = await apiFetch<any[]>(`/appointments/queue/live?branchId=${branchId}`);
    return list.map(apt => {
      const timeStr = new Date(apt.startTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const waitMins = Math.max(5, Math.floor((new Date().getTime() - new Date(apt.startTime).getTime()) / (60 * 1000)));
      return {
        id: apt.id,
        patientName: apt.patientFirstName ? `${apt.patientFirstName} ${apt.patientLastName}` : 'Unknown Patient',
        checkInTime: timeStr,
        waitTime: `${waitMins} mins`,
        triageCategory: (apt.tokenNumber || 1) % 3 === 0 ? 'Urgent' : (apt.tokenNumber || 1) % 2 === 0 ? 'Priority' : 'Normal'
      };
    });
  } catch (error) {
    console.error('Failed to fetch patient queue:', error);
    return [];
  }
}

const triageColors = {
  Urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  Priority: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Normal: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

export function PatientQueueWidget() {
  const { data, isLoading } = useQuery({
    queryKey: dashboardKeys.patientQueue(),
    queryFn: fetchPatientQueue,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-muted/40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-sm text-foreground">Waiting Room Queue</h3>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {data?.length || 0} Waiting
          </span>
        </div>

        <div className="space-y-2">
          {data?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div>
                <div className="text-xs font-medium text-foreground">{item.patientName}</div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Wait: {item.waitTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${triageColors[item.triageCategory]}`}>
                  {item.triageCategory}
                </span>
                <button
                  className="p-1 rounded text-primary hover:bg-primary/10 transition-colors"
                  title="Call Patient"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
