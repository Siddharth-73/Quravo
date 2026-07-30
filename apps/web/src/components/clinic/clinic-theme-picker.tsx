'use client';

import React, { useState } from 'react';

const PREDEFINED_PALETTES = [
  { id: 'ocean', name: 'Ocean Blue', primary: '#0284c7', secondary: '#e0f2fe', previewBg: 'bg-sky-600', previewLight: 'bg-sky-100' },
  { id: 'emerald', name: 'Emerald Care', primary: '#059669', secondary: '#d1fae5', previewBg: 'bg-emerald-600', previewLight: 'bg-emerald-100' },
  { id: 'warm', name: 'Warm Wellness', primary: '#d97706', secondary: '#fef3c7', previewBg: 'bg-amber-600', previewLight: 'bg-amber-100' },
  { id: 'purple', name: 'Royal Health', primary: '#7c3aed', secondary: '#ede9fe', previewBg: 'bg-violet-600', previewLight: 'bg-violet-100' },
  { id: 'slate', name: 'Modern Minimal', primary: '#475569', secondary: '#f1f5f9', previewBg: 'bg-slate-600', previewLight: 'bg-slate-100' },
];

export function ClinicThemePicker() {
  const [selectedPalette, setSelectedPalette] = useState('ocean');
  const [saved, setSaved] = useState(false);

  const handleApply = (id: string) => {
    setSelectedPalette(id);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Clinic Visual Theme Customization</h2>
        <p className="text-sm text-slate-500">Select a curated color palette for your clinic's patient portal and portal header.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {PREDEFINED_PALETTES.map((palette) => {
          const isSelected = selectedPalette === palette.id;
          return (
            <div
              key={palette.id}
              onClick={() => handleApply(palette.id)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all space-y-3 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex gap-2">
                <div className={`w-8 h-8 rounded-full ${palette.previewBg}`} />
                <div className={`w-8 h-8 rounded-full ${palette.previewLight}`} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">{palette.name}</p>
                <p className="text-xs text-slate-500">{isSelected ? '✓ Active Theme' : 'Click to Select'}</p>
              </div>
            </div>
          );
        })}
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-lg border border-emerald-200">
          ✓ Theme palette updated successfully for your practice!
        </div>
      )}
    </div>
  );
}
