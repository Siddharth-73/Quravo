'use client';

import React, { useState } from 'react';

export function LabTechWorkspace() {
  const [labTests, setLabTests] = useState([
    { id: '1', patient: 'John Doe', testName: 'Complete Blood Count (CBC)', status: 'Pending Sample', orderedBy: 'Dr. Robert Smith' },
    { id: '2', patient: 'Alice Johnson', testName: 'Lipid Profile', status: 'In Progress', orderedBy: 'Dr. Alice Wong' },
    { id: '3', patient: 'Michael Brown', testName: 'Thyroid Panel (TSH)', status: 'Completed', orderedBy: 'Dr. Robert Smith' },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Lab Technician Worklist</h2>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded uppercase">
              Mock ERP Module
            </span>
          </div>
          <p className="text-sm text-slate-500">Manage sample collection, test processing, and reference range auto-verification.</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="p-3">Patient</th>
              <th className="p-3">Test Requested</th>
              <th className="p-3">Ordering Doctor</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {labTests.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">{t.patient}</td>
                <td className="p-3 font-medium text-indigo-600">{t.testName}</td>
                <td className="p-3 text-slate-600">{t.orderedBy}</td>
                <td className="p-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'In Progress'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded font-medium">
                    Enter Results (Mock)
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
