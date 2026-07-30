'use client';

import React, { useState } from 'react';

export function NurseTriage() {
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState('72');
  const [temp, setTemp] = useState('98.6');
  const [spo2, setSpo2] = useState('99');
  const [allergies, setAllergies] = useState('Penicillin');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Nurse Triage & Patient Vitals Entry</h2>
          <p className="text-sm text-slate-500">Record baseline physiological vitals and pre-consultation symptom alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
            ⚠️ Allergy Alert: {allergies || 'None'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500">Blood Pressure (mmHg)</label>
            <input
              type="text"
              value={bp}
              onChange={(e) => setBp(e.target.value)}
              className="w-full text-lg font-bold text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-xs text-emerald-600 font-medium">Normal range (120/80)</span>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500">Heart Rate (bpm)</label>
            <input
              type="text"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              className="w-full text-lg font-bold text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-xs text-emerald-600 font-medium">Normal (60-100 bpm)</span>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500">Temperature (°F)</label>
            <input
              type="text"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full text-lg font-bold text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-xs text-emerald-600 font-medium">Normal (97.8° - 99.1°)</span>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500">Oxygen Saturation (%)</label>
            <input
              type="text"
              value={spo2}
              onChange={(e) => setSpo2(e.target.value)}
              className="w-full text-lg font-bold text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-xs text-emerald-600 font-medium">Normal (95% - 100%)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Pre-Consultation Symptoms & Allergies</label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. Severe headache, allergic to Penicillin & Latex..."
            className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          {saved ? (
            <span className="text-sm font-semibold text-emerald-600">✓ Vitals saved & attached to patient chart!</span>
          ) : (
            <span />
          )}
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700">
            Save Vitals & Transfer to Doctor
          </button>
        </div>
      </form>
    </div>
  );
}
