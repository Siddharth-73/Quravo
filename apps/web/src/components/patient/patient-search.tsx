'use client';

import React, { useState, useMemo } from 'react';

export interface DoctorHospitalData {
  id: string;
  name: string;
  type: 'doctor' | 'hospital';
  specialty: string;
  symptoms: string[];
  hospitalName: string;
  city: string;
  rating: number;
  consultationFee: number;
}

const SAMPLE_DIRECTORY: DoctorHospitalData[] = [
  {
    id: '1',
    name: 'Dr. Robert Smith',
    type: 'doctor',
    specialty: 'Cardiologist',
    symptoms: ['Chest Pain', 'High Blood Pressure', 'Shortness of Breath', 'Palpitations', 'Fever'],
    hospitalName: 'Apollo City Hospital',
    city: 'New York',
    rating: 4.9,
    consultationFee: 100,
  },
  {
    id: '2',
    name: 'Dr. Alice Wong',
    type: 'doctor',
    specialty: 'Dermatologist',
    symptoms: ['Skin Rash', 'Acne', 'Eczema', 'Hair Loss', 'Itchiness'],
    hospitalName: 'St. Jude Specialty Center',
    city: 'San Francisco',
    rating: 4.8,
    consultationFee: 85,
  },
  {
    id: '3',
    name: 'Dr. Michael Chang',
    type: 'doctor',
    specialty: 'Neurologist',
    symptoms: ['Migraine', 'Headache', 'Dizziness', 'Memory Loss', 'Seizures'],
    hospitalName: 'Mayo General Hospital',
    city: 'Chicago',
    rating: 4.95,
    consultationFee: 120,
  },
  {
    id: '4',
    name: 'Apollo City Hospital',
    type: 'hospital',
    specialty: 'Multi-Specialty Healthcare',
    symptoms: ['Emergency Care', 'ICU', 'Cardiology', 'Surgery', 'Pediatrics'],
    hospitalName: 'Apollo City Hospital',
    city: 'New York',
    rating: 4.7,
    consultationFee: 150,
  },
  {
    id: '5',
    name: 'St. Jude Specialty Center',
    type: 'hospital',
    specialty: 'Dermatology & Diagnostics',
    symptoms: ['Dermatology', 'Blood Tests', 'MRI', 'CT Scan'],
    hospitalName: 'St. Jude Specialty Center',
    city: 'San Francisco',
    rating: 4.85,
    consultationFee: 90,
  },
];

// Lightweight fuzzy string match algorithm
function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  const cleanQuery = query.toLowerCase().trim();
  const cleanTarget = target.toLowerCase();
  
  if (cleanTarget.includes(cleanQuery)) return true;
  
  let targetIdx = 0;
  for (let qIdx = 0; qIdx < cleanQuery.length; qIdx++) {
    const char = cleanQuery[qIdx];
    targetIdx = cleanTarget.indexOf(char, targetIdx);
    if (targetIdx === -1) return false;
    targetIdx++;
  }
  return true;
}

export function PatientSearch({ onSelect }: { onSelect?: (item: DoctorHospitalData) => void }) {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'doctor' | 'hospital'>('all');

  const filteredResults = useMemo(() => {
    return SAMPLE_DIRECTORY.filter((item) => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (!query.trim()) return true;

      const matchName = fuzzyMatch(query, item.name);
      const matchSpecialty = fuzzyMatch(query, item.specialty);
      const matchHospital = fuzzyMatch(query, item.hospitalName);
      const matchSymptom = item.symptoms.some((s) => fuzzyMatch(query, s));

      return matchName || matchSpecialty || matchHospital || matchSymptom;
    });
  }, [query, filterType]);

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Doctor, Hospital, or Symptoms (e.g. Chest pain, Fever, Dermatology)..."
            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
          />
          <span className="absolute left-4 top-3.5 text-slate-400 text-base">🔍</span>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            All Registered Directory
          </button>
          <button
            onClick={() => setFilterType('doctor')}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              filterType === 'doctor'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Doctors Only
          </button>
          <button
            onClick={() => setFilterType('hospital')}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              filterType === 'hospital'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Registered Hospitals
          </button>
        </div>
      </div>

      {/* Directory Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResults.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect?.(item)}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {item.type === 'doctor' ? '👨‍⚕️ Specialist' : '🏥 Registered Hospital'}
                </span>
                <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                <p className="text-xs text-slate-500">{item.specialty} • {item.city}</p>
              </div>
              <span className="px-2 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded border border-amber-200">
                ★ {item.rating}
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {item.symptoms.map((sym) => (
                <span key={sym} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded font-medium">
                  {sym}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-900">${item.consultationFee} Consultation</span>
              <span className="font-semibold text-indigo-600 hover:underline">Select & Book Slot →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
