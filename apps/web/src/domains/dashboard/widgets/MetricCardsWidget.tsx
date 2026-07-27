"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '@/lib/query-keys/dashboard';
import { Calendar, DollarSign, Users, Clock, ArrowUpRight, RefreshCw } from 'lucide-react';

interface MetricItem {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconName: 'Calendar' | 'DollarSign' | 'Users' | 'Clock';
}

async function fetchMetrics(): Promise<MetricItem[]> {
  // Mock API call simulation with delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      id: 'appts',
      label: "Today's Appointments",
      value: '24',
      change: '+12% vs yesterday',
      isPositive: true,
      iconName: 'Calendar',
    },
    {
      id: 'rev',
      label: 'Collected Today',
      value: '$3,480.00',
      change: '+8% vs average',
      isPositive: true,
      iconName: 'DollarSign',
    },
    {
      id: 'queue',
      label: 'Patients in Waiting Room',
      value: '5',
      change: 'Avg wait: 14 mins',
      isPositive: true,
      iconName: 'Clock',
    },
    {
      id: 'encounters',
      label: 'Pending SOAP Notes',
      value: '3',
      change: 'Needs signing',
      isPositive: false,
      iconName: 'Users',
    },
  ];
}

const iconMap = {
  Calendar,
  DollarSign,
  Users,
  Clock,
};

export function MetricCardsWidget() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: dashboardKeys.metrics(),
    queryFn: fetchMetrics,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-card p-4 animate-pulse">
            <div className="h-3 w-24 bg-muted rounded mb-3" />
            <div className="h-6 w-16 bg-muted rounded mb-2" />
            <div className="h-2.5 w-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex items-center justify-between text-xs text-destructive">
        <span>Failed to load metrics widget.</span>
        <button onClick={() => refetch()} className="flex items-center gap-1 font-medium hover:underline">
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.map((metric) => {
        const Icon = iconMap[metric.iconName];
        return (
          <div
            key={metric.id}
            className="rounded-xl border border-border bg-card p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold tracking-tight text-foreground">{metric.value}</div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                <ArrowUpRight className={`w-3 h-3 ${metric.isPositive ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span>{metric.change}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
