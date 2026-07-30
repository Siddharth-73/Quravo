'use client';

import React, { useState } from 'react';

export function ReceptionistDesk() {
  const [appointments, setAppointments] = useState([
    { id: '1', time: '09:00 AM', patient: 'Sarah Jenkins', doctor: 'Dr. Robert Smith', status: 'Checked In', token: 'T-101' },
    { id: '2', time: '09:30 AM', patient: 'David Miller', doctor: 'Dr. Alice Wong', status: 'Waiting', token: 'T-102' },
    { id: '3', time: '10:00 AM', patient: 'Emily Davis', doctor: 'Dr. Robert Smith', status: 'Scheduled', token: 'T-103' },
  ]);

  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState('');

  const handleRegisterWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName) return;
    setAppointments([
      ...appointments,
      {
        id: String(Date.now()),
        time: 'Now (Walk-in)',
        patient: walkinName,
        doctor: 'Dr. Robert Smith',
        status: 'Checked In',
        token: `T-${100 + appointments.length + 1}`,
      },
    ]);
    setWalkinName('');
    setShowWalkinModal(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Front Desk Queue & Patient Check-In</h2>
          <p className="text-sm text-slate-500">Manage daily appointment schedules, walk-in registrations, and token queue numbers.</p>
        </div>
        <button
          onClick={() => setShowWalkinModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Register Walk-In Patient
        </button>
      </div>

      {/* Live Queue Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-xs font-semibold uppercase text-slate-500">Total Today</span>
          <p className="text-2xl font-bold text-slate-900">24</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <span className="text-xs font-semibold uppercase text-emerald-600">Checked In</span>
          <p className="text-2xl font-bold text-emerald-900">8</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <span className="text-xs font-semibold uppercase text-amber-600">Waiting Room</span>
          <p className="text-2xl font-bold text-amber-900">5</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <span className="text-xs font-semibold uppercase text-indigo-600">Current Token</span>
          <p className="text-2xl font-bold text-indigo-900">T-102</p>
        </div>
      </div>

      {/* Appointments & Token Queue Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="p-3">Token</th>
              <th className="p-3">Time</th>
              <th className="p-3">Patient Name</th>
              <th className="p-3">Assigned Doctor</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-indigo-600">{apt.token}</td>
                <td className="p-3 text-slate-600">{apt.time}</td>
                <td className="p-3 font-semibold text-slate-900">{apt.patient}</td>
                <td className="p-3 text-slate-600">{apt.doctor}</td>
                <td className="p-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      apt.status === 'Checked In'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'Waiting'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {apt.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium">
                    Collect Fee
                  </button>
                  <button className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs rounded font-medium">
                    Print Slip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Walk-in Modal */}
      {showWalkinModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRegisterWalkin} className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Register Walk-In Patient</h3>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                placeholder="e.g. Michael Scott"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowWalkinModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Confirm & Issue Token
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
