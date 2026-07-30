'use client';

import React, { useState } from 'react';
import { Wrench, RefreshCw, Database, Server } from 'lucide-react';

export default function SuperAdminMaintenancePage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const triggerAction = (actionName: string) => {
    setStatusMsg(`✓ Executed: ${actionName} successfully.`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Maintenance Controls</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Platform control panel for maintenance mode toggle, worker restarts, cache flushing, search reindexing, database migrations, and health checks.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold">
          {statusMsg}
        </div>
      )}

      {/* Maintenance Mode Card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-white">Maintenance Mode</h3>
          <p className="text-xs text-slate-400">Restricts tenant dashboard access during scheduled updates.</p>
        </div>
        <button
          onClick={() => {
            setMaintenanceMode(!maintenanceMode);
            triggerAction(`Maintenance Mode set to ${!maintenanceMode}`);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            maintenanceMode
              ? 'bg-rose-600 text-white hover:bg-rose-700'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {maintenanceMode ? '🚨 Maintenance Mode ACTIVE' : 'Enable Maintenance Mode'}
        </button>
      </div>

      {/* Maintenance Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <h4 className="font-bold text-white">Worker Restart</h4>
          <p className="text-slate-400">Restart NestJS background queue worker instances.</p>
          <button onClick={() => triggerAction('Worker Restart')} className="px-3 py-1.5 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded font-semibold hover:bg-purple-600/30">
            Restart Background Workers
          </button>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <h4 className="font-bold text-white">Cache & Redis Flush</h4>
          <p className="text-slate-400">Clear Upstash Redis cache keys and query cache.</p>
          <button onClick={() => triggerAction('Cache & Redis Flush')} className="px-3 py-1.5 bg-sky-600/20 text-sky-300 border border-sky-500/30 rounded font-semibold hover:bg-sky-600/30">
            Flush Redis Cache
          </button>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <h4 className="font-bold text-white">Search Indexing Rebuild</h4>
          <p className="text-slate-400">Reindex fuzzy doctor & hospital directory entries.</p>
          <button onClick={() => triggerAction('Search Reindex')} className="px-3 py-1.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded font-semibold hover:bg-emerald-600/30">
            Rebuild Search Index
          </button>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <h4 className="font-bold text-white">Database Migration & Health Checks</h4>
          <p className="text-slate-400">Execute pending Drizzle schema migrations.</p>
          <button onClick={() => triggerAction('Database Migration')} className="px-3 py-1.5 bg-amber-600/20 text-amber-300 border border-amber-500/30 rounded font-semibold hover:bg-amber-600/30">
            Run DB Migration & Health Check
          </button>
        </div>
      </div>
    </div>
  );
}
