'use client';

import React, { useState } from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export default function SuperAdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState([
    { name: 'Stripe Billing', category: 'Payment Gateway', status: 'Connected', key: 'pk_live_...' },
    { name: 'Razorpay Online', category: 'Payment Gateway', status: 'Connected', key: 'rzp_test_SwUFweahnIDY4u' },
    { name: 'Twilio SMS & Voice', category: 'Communications', status: 'Connected', key: 'AC_twilio_...' },
    { name: 'MSG91 SMS Gateway', category: 'Communications', status: 'Connected', key: 'msg91_key_...' },
    { name: 'SendGrid Email API', category: 'Email Service', status: 'Connected', key: 'SG._...' },
    { name: 'Resend Email API', category: 'Email Service', status: 'Active Provider', key: 're_GSW3rxdy_...' },
    { name: 'Google Calendar Sync', category: 'Scheduling', status: 'Connected', key: 'gcal_oauth_...' },
    { name: 'Zoom Video API', category: 'Telemedicine', status: 'Connected', key: 'zoom_jwt_...' },
    { name: 'AWS S3 Storage', category: 'Cloud Storage', status: 'Fallback Ready', key: 's3_bucket_...' },
    { name: 'Cloudflare R2 Storage', category: 'Cloud Storage', status: 'Active Provider', key: 'quravo-medical-files' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Integrations Hub</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage third-party connectors: Stripe, Razorpay, Twilio, MSG91, SendGrid, Resend, Google Calendar, Zoom, AWS S3, Cloudflare R2.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div key={item.name} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{item.name}</span>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-semibold rounded">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Credentials Key: <code className="font-mono text-slate-300">{item.key}</code></p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
