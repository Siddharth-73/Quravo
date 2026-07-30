'use client';

import React, { useState } from 'react';

export function DoctorWorkspace() {
  const [activeTab, setActiveTab] = useState<'consultation' | 'eprescription' | 'telemedicine' | 'history' | 'lab_orders'>('consultation');
  const [voiceNotes, setVoiceNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setVoiceNotes('Patient presents with mild fever, dry cough, and sinus congestion for 3 days. No history of drug allergies.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Doctor Consultation Workspace</h2>
          <p className="text-sm text-slate-500">Manage clinical encounters, voice-to-text notes, e-Prescriptions, and lab orders.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            Active Encounter: Patient #P-8492
          </span>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-sm font-medium gap-6">
        <button
          onClick={() => setActiveTab('consultation')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'consultation'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Clinical Notes & Voice Draft
        </button>
        <button
          onClick={() => setActiveTab('eprescription')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'eprescription'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          e-Prescription Templates
        </button>
        <button
          onClick={() => setActiveTab('telemedicine')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'telemedicine'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Telemedicine Video Room
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Medical History & Timeline
        </button>
        <button
          onClick={() => setActiveTab('lab_orders')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'lab_orders'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Lab & Radiology Orders
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'consultation' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Voice-to-Text Clinical Assistant</h4>
              <p className="text-xs text-slate-500">Dictate your clinical assessment; draft will be auto-formatted into SOAP notes.</p>
            </div>
            <button
              onClick={toggleRecording}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isRecording ? '🔴 Listening...' : '🎙️ Start Voice Dictation'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes (SOAP Format)</label>
            <textarea
              rows={6}
              value={voiceNotes}
              onChange={(e) => setVoiceNotes(e.target.value)}
              placeholder="Subjective complaints, Objective findings, Assessment, and Plan..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {activeTab === 'eprescription' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-slate-800">Quick Rx Prescription Generator</h4>
            <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-200">
              + Load Common Template (Upper Respiratory)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">Medicine</span>
              <p className="font-medium text-sm text-slate-800">Amoxicillin 500mg</p>
              <p className="text-xs text-slate-500">1 capsule 3x daily after meals (5 Days)</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">Medicine</span>
              <p className="font-medium text-sm text-slate-800">Paracetamol 650mg</p>
              <p className="text-xs text-slate-500">1 tablet as needed for fever (Max 3/day)</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">Medicine</span>
              <p className="font-medium text-sm text-slate-800">Cetirizine 10mg</p>
              <p className="text-xs text-slate-500">1 tablet at bedtime (7 Days)</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'telemedicine' && (
        <div className="bg-slate-900 rounded-xl p-8 text-center text-white space-y-4">
          <div className="inline-block p-4 bg-slate-800 rounded-full text-3xl">📹</div>
          <h4 className="text-lg font-semibold">HD Telemedicine Consultation Room</h4>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Patient John Doe is waiting in room. End-to-end encrypted video link is active.</p>
          <button className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors">
            Launch Video Call
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-800">Patient Medical Timeline</h4>
          <div className="space-y-2 border-l-2 border-slate-200 pl-4">
            <div className="relative">
              <span className="text-xs text-slate-400">June 12, 2026</span>
              <p className="text-sm font-medium text-slate-800">Routine Health Checkup - Normal Vitals</p>
            </div>
            <div className="relative pt-2">
              <span className="text-xs text-slate-400">January 04, 2026</span>
              <p className="text-sm font-medium text-slate-800">Seasonal Influenza - Prescribed Rest & Hydration</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lab_orders' && (
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800">Order Diagnostic Tests</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Complete Blood Count (CBC)', 'Lipid Profile', 'Thyroid Panel (T3/T4/TSH)', 'Chest X-Ray'].map((test) => (
              <label key={test} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" className="rounded text-indigo-600" />
                {test}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
