'use client';

import React, { useState } from 'react';
import { Flag, ShieldCheck } from 'lucide-react';

export default function SuperAdminFeatureFlagsPage() {
  const [flags, setFlags] = useState([
    { key: 'telemedicine', name: 'Telemedicine Video Calls', enabled: true, category: 'Core' },
    { key: 'ai', name: 'AI Clinical Assistant (Gemini)', enabled: true, category: 'AI' },
    { key: 'lab_module', name: 'Lab Module (Mock ERP)', enabled: true, isMock: true, category: 'ERP' },
    { key: 'pharmacy_module', name: 'Pharmacy Module (Mock ERP)', enabled: true, isMock: true, category: 'ERP' },
    { key: 'inventory_module', name: 'Inventory Module (Mock ERP)', enabled: true, isMock: true, category: 'ERP' },
    { key: 'whatsapp', name: 'WhatsApp Notifications', enabled: false, category: 'Messaging' },
    { key: 'sms', name: 'SMS Notifications', enabled: false, category: 'Messaging' },
    { key: 'voice_calls', name: 'Voice Calls', enabled: false, category: 'Messaging' },
    { key: 'online_payments', name: 'Online Payments (Razorpay/Stripe)', enabled: true, category: 'Billing' },
    { key: 'custom_branding', name: 'Custom Branding', enabled: true, category: 'White Label' },
    { key: 'white_label', name: 'White Label Domain Binding', enabled: true, category: 'White Label' },
    { key: 'api_access', name: 'Developer API Access', enabled: true, category: 'Platform' },
    { key: 'patient_portal', name: 'Patient Portal', enabled: true, category: 'Portal' },
    { key: 'staff_portal', name: 'Staff Portal', enabled: true, category: 'Portal' },
  ]);

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Feature Flag Management</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Toggle platform-wide capabilities. Note: ERP modules (Lab, Pharmacy, Inventory) strictly operate as <span className="font-bold text-amber-400">MOCK</span> implementations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flags.map((flag) => (
          <div
            key={flag.key}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{flag.name}</span>
                {flag.isMock && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded">
                    MOCK ERP
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Key: <code className="font-mono text-purple-400">{flag.key}</code> • Category: {flag.category}</p>
            </div>

            <button
              onClick={() => toggleFlag(flag.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                flag.enabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {flag.enabled ? 'Enabled ✓' : 'Disabled ✕'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
