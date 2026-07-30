'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export default function SuperAdminPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<'Owner' | 'Platform Admin' | 'Customer Success'>('Platform Admin');

  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({
    'Tenant.Create': true,
    'Tenant.Delete': false,
    'Tenant.Suspend': true,
    'Billing.Edit': true,
    'Plans.Edit': true,
    'Logs.View': true,
    'Support.Impersonate': false,
    'FeatureFlags.Edit': true,
    'Emails.Send': true,
  });

  const togglePermission = (key: string) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Granular Permission Builder (RBAC)</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure exact permission scopes for Platform Roles (<span className="font-semibold text-purple-400">Owner, Platform Admin, Customer Success</span>). No single role receives unrestricted wildcards.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        {(['Owner', 'Platform Admin', 'Customer Success'] as const).map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`pb-3 border-b-2 transition-colors ${
              selectedRole === role
                ? 'border-purple-500 text-purple-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="font-bold text-sm text-white">Active Scopes for {selectedRole}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {Object.entries(permissions).map(([key, enabled]) => (
            <div
              key={key}
              onClick={() => togglePermission(key)}
              className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                enabled
                  ? 'border-purple-500/30 bg-purple-500/10 text-white'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <code className="font-mono text-purple-300 font-bold">{key}</code>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                enabled ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {enabled ? 'GRANTED ✓' : 'DENIED ✕'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
