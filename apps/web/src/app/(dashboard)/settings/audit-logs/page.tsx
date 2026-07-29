"use client";

import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, Clock, User, Globe } from 'lucide-react';

import { Loader2 } from 'lucide-react';
import { useAuditLogs } from '@/domains/audit/hooks';

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useAuditLogs({ action: searchQuery });
  
  const logs = data?.data || [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Security Audit & Activity Ledger</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Searchable HIPAA & GDPR compliant security ledger tracking all user actions, patient access, and IP logs
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">System Audit Events</h3>
          </div>

          <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-muted-foreground mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by staff name, action, or patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {isLoading ? (
            <div className="py-8 flex justify-center items-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-rose-500">
              Failed to load audit logs. Please try again.
            </div>
          ) : logs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No audit logs found.
            </div>
          ) : (
            logs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{log.action}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20`}
                  >
                    Success
                  </span>
                </div>
                <div className="text-muted-foreground">{log.resource} {log.resourceId ? `(${log.resourceId})` : ''}</div>
                <div className="text-muted-foreground flex items-center gap-3 text-[11px] font-mono pt-0.5">
                  <span className="flex items-center gap-1"><User className="w-3 h-3 text-primary" /> {log.userId || 'System'}</span>
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-muted-foreground" /> {log.ipAddress || 'N/A'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-muted-foreground" /> {new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
