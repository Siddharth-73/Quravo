'use client';

import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';

export default function SuperAdminNotificationsPage() {
  const [broadcastType, setBroadcastType] = useState('Maintenance');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setMessage('');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Broadcast Notifications</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Dispatch platform-wide Email and In-App broadcast notifications for scheduled maintenance, new features, outages, or security alerts.
        </p>
      </div>

      <form onSubmit={handleSend} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-300">Broadcast Category</label>
          <select
            value={broadcastType}
            onChange={(e) => setBroadcastType(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:outline-none"
          >
            <option value="Maintenance">Scheduled Maintenance</option>
            <option value="New Features">New Feature Release</option>
            <option value="Outages">Service Degradation / Outage</option>
            <option value="Security Alerts">Security Alert</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300">Notification Message</label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type platform announcement message to dispatch to all active clinic tenant admins..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white focus:outline-none"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          {sent ? <span className="text-emerald-400 font-semibold">✓ Broadcast sent via Email & In-App!</span> : <span />}
          <button type="submit" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow">
            Dispatch Broadcast
          </button>
        </div>
      </form>
    </div>
  );
}
