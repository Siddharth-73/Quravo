'use client';

import React, { useState } from 'react';

export function PharmacistWorkspace() {
  const [prescriptions] = useState([
    { id: '1', patient: 'Sarah Jenkins', rxNumber: 'RX-9921', itemsCount: 3, status: 'Ready to Dispense' },
    { id: '2', patient: 'David Miller', rxNumber: 'RX-9922', itemsCount: 2, status: 'Verifying Stock' },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Pharmacy Dispensing Queue</h2>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded uppercase">
              Mock ERP Module
            </span>
          </div>
          <p className="text-sm text-slate-500">Manage e-Prescription fulfillment, inventory stock deduction, and drug interaction alerts.</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="p-3">Rx Number</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Items Count</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {prescriptions.map((rx) => (
              <tr key={rx.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-indigo-600">{rx.rxNumber}</td>
                <td className="p-3 font-semibold text-slate-900">{rx.patient}</td>
                <td className="p-3 text-slate-600">{rx.itemsCount} medicines</td>
                <td className="p-3">
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    {rx.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded font-medium">
                    Dispense & Deduct Stock (Mock)
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
