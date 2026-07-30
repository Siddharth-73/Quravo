'use client';

import React from 'react';
import { Settings, ShieldCheck, Database, Mail, Cpu } from 'lucide-react';

export default function SuperAdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Global Infrastructure Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage system-wide authentication policies, storage configurations (S3/Cloudflare R2), email gateways (Resend/SendGrid), and Gemini AI engines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Authentication Policies</span>
          </div>
          <p className="text-slate-400">JWT Expiry: 7d • MFA Policy: Mandatory for Admin • Session Timeout: 30m</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Database className="w-4 h-4 text-sky-400" />
            <span>Cloud Storage Buckets</span>
          </div>
          <p className="text-slate-400">Cloudflare R2 Bucket: <code className="font-mono text-purple-300">quravo-medical-files</code> • S3 Fallback active</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>Email Gateway</span>
          </div>
          <p className="text-slate-400">Resend API Provider connected • Rate limit guard active</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>AI Gateway</span>
          </div>
          <p className="text-slate-400">Google Gemini API (<code className="font-mono text-amber-300">gemini-2.5-flash</code>) active</p>
        </div>
      </div>
    </div>
  );
}
