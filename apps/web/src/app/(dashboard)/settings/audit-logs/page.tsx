"use client";

import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, Clock, User, Globe } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  targetResource: string;
  ipAddress: string;
  status: 'Success' | 'Denied';
}

const mockAuditLogs: AuditLogEntry[] = [
  { id: 'log-1', timestamp: '2026-07-28 02:45:12', userName: 'Dr. Sarah Jenkins', userRole: 'Lead Physician', action: 'SOAP Encounter Note Created', targetResource: 'Patient Eleanor Vance (MRN-001)', ipAddress: '192.168.1.45', status: 'Success' },
  { id: 'log-2', timestamp: '2026-07-28 02:30:04', userName: 'Jessica Taylor', userRole: 'Receptionist', action: 'POS Payment Collected ($150.00)', targetResource: 'Invoice INV-2026-001', ipAddress: '192.168.1.12', status: 'Success' },
  { id: 'log-3', timestamp: '2026-07-28 01:15:40', userName: 'Michael Scott', userRole: 'Pharmacist', action: 'Prescription Dispensed (Amoxicillin)', targetResource: 'Rx Order rx-1', ipAddress: '192.168.1.88', status: 'Success' },
  { id: 'log-4', timestamp: '2026-07-27 23:10:19', userName: 'Unknown IP', userRole: 'Anonymous', action: 'Failed Staff Sign In Attempt', targetResource: '/api/v1/auth/login', ipAddress: '45.142.120.9', status: 'Denied' },
];

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockAuditLogs.filter(
    (log) =>
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{log.action}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      log.status === 'Success'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <div className="text-muted-foreground">{log.targetResource}</div>
                <div className="text-muted-foreground flex items-center gap-3 text-[11px] font-mono pt-0.5">
                  <span className="flex items-center gap-1"><User className="w-3 h-3 text-primary" /> {log.userName} ({log.userRole})</span>
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-muted-foreground" /> {log.ipAddress}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-muted-foreground" /> {log.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
