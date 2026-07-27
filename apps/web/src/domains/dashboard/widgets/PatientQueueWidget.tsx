"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '@/lib/query-keys/dashboard';
import { UserCheck, Clock, ArrowRight } from 'lucide-react';

interface QueueItem {
  id: string;
  patientName: string;
  checkInTime: string;
  waitTime: string;
  triageCategory: 'Normal' | 'Urgent' | 'Priority';
}

async function fetchPatientQueue(): Promise<QueueItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return [
    {
      id: 'q-1',
      patientName: 'Marcus Aurelius',
      checkInTime: '09:12 AM',
      waitTime: '18 mins',
      triageCategory: 'Urgent',
    },
    {
      id: 'q-2',
      patientName: 'Hannah Abbott',
      checkInTime: '09:20 AM',
      waitTime: '10 mins',
      triageCategory: 'Normal',
    },
    {
      id: 'q-3',
      patientName: 'Robert Vance',
      checkInTime: '09:25 AM',
      waitTime: '5 mins',
      triageCategory: 'Priority',
    },
  ];
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
