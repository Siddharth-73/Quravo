'use client';

import React, { useState } from 'react';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

export function BookingCalendar({
  providerName,
  fee,
  onProceedToPayment,
}: {
  providerName: string;
  fee: number;
  onProceedToPayment: (details: { date: string; timeSlot: string }) => void;
}) {
  const [selectedDate, setSelectedDate] = useState('2026-08-01');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Select Date & Appointment Time Slot</h3>
        <p className="text-xs text-slate-500">Booking consultation with <span className="font-semibold text-indigo-600">{providerName}</span></p>
      </div>

      {/* Date Picker */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase text-slate-500">Appointment Date</label>
        <input
          type="date"
          value={selectedDate}
          min="2026-07-30"
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Time Slot Selector Grid */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase text-slate-500">Available Time Slots</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-500">Total Consultation Fee</span>
          <p className="text-xl font-bold text-slate-900">${fee}</p>
        </div>
        <button
          onClick={() => onProceedToPayment({ date: selectedDate, timeSlot: selectedSlot })}
          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
        >
          Proceed to Checkout & Online Payment →
        </button>
      </div>
    </div>
  );
}
