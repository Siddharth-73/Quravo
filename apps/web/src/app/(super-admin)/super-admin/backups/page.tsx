'use client';

import React, { useState } from 'react';
import { HardDrive, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SuperAdminBackupsPage() {
  const [backups, setBackups] = useState([
    { id: '1', name: 'snapshot-20260730-0000.sql.gz', size: '4.2 GB', type: 'Scheduled', status: 'Completed', timestamp: '2026-07-30 00:00:00' },
    { id: '2', name: 'snapshot-20260729-0000.sql.gz', size: '4.1 GB', type: 'Scheduled', status: 'Completed', timestamp: '2026-07-29 00:00:00' },
    { id: '3', name: 'manual-pre-migration-snap.sql.gz', size: '4.0 GB', type: 'Manual', status: 'Completed', timestamp: '2026-07-28 14:22:10' },
  ]);

  const [triggering, setTriggering] = useState(false);

  const handleManualBackup = () => {
    setTriggering(true);
    setTimeout(() => {
      setBackups([
        {
          id: String(Date.now()),
          name: `manual-snapshot-${Date.now()}.sql.gz`,
          size: '4.2 GB',
          type: 'Manual',
          status: 'Completed',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
        ...backups,
      ]);
      setTriggering(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Database Backup Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Trigger manual database backups, configure automated schedules, download snapshots, or initiate point-in-time restores.
          </p>
        </div>
        <button
          onClick={handleManualBackup}
          disabled={triggering}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow transition-colors"
        >
          {triggering ? '⚡ Creating Snapshot...' : '+ Trigger Manual Backup'}
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 border-b border-slate-800 uppercase font-semibold text-slate-400">
            <tr>
              <th className="p-3.5">Snapshot File</th>
              <th className="p-3.5">Size</th>
              <th className="p-3.5">Backup Type</th>
              <th className="p-3.5">Created At</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
            {backups.map((b) => (
              <tr key={b.id} className="hover:bg-slate-900/40">
                <td className="p-3.5 font-bold text-white font-sans">{b.name}</td>
                <td className="p-3.5 text-slate-400">{b.size}</td>
                <td className="p-3.5 font-sans text-purple-400">{b.type}</td>
                <td className="p-3.5 text-slate-400">{b.timestamp}</td>
                <td className="p-3.5 font-sans">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                    {b.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2 font-sans">
                  <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded">
                    Download
                  </button>
                  <button className="px-2.5 py-1 bg-amber-600/20 text-amber-300 border border-amber-500/30 text-xs rounded hover:bg-amber-600/30">
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
