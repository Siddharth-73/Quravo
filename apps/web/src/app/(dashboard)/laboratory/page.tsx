"use client";

import React, { useState } from 'react';
import { TestTube, FileCheck, Clock, Download, Upload, AlertCircle } from 'lucide-react';

interface LabOrder {
  id: string;
  patientName: string;
  testName: string;
  category: string;
  orderedBy: string;
  status: 'Sample Collected' | 'Processing' | 'Report Ready';
  date: string;
}

const mockLabOrders: LabOrder[] = [
  { id: 'lab-1', patientName: 'Sophia Lin', testName: 'Complete Blood Count (CBC)', category: 'Hematology', orderedBy: 'Dr. Sarah Jenkins', status: 'Report Ready', date: '2026-07-26' },
  { id: 'lab-2', patientName: 'Marcus Aurelius', testName: 'Lipid Panel & Fasting Glucose', category: 'Biochemistry', orderedBy: 'Dr. Sarah Jenkins', status: 'Processing', date: '2026-07-27' },
  { id: 'lab-3', patientName: 'Eleanor Vance', testName: 'Thyroid Stimulating Hormone (TSH)', category: 'Endocrinology', orderedBy: 'Dr. Robert Chen', status: 'Sample Collected', date: '2026-07-27' },
];

export default function LaboratoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Laboratory & Diagnostic Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track diagnostic requests, sample collections, and upload lab test reports
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <span>Patient & Test Name</span>
          <span>Category</span>
          <span>Ordered By</span>
          <span>Status & Report</span>
        </div>

        {mockLabOrders.map((lab) => (
          <div
            key={lab.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors gap-4"
          >
            <div>
              <div className="text-xs font-bold text-foreground">{lab.patientName}</div>
              <div className="text-xs font-semibold text-primary mt-0.5">{lab.testName}</div>
            </div>

            <div className="text-xs text-muted-foreground font-medium">
              {lab.category}
            </div>

            <div className="text-xs text-muted-foreground font-medium">
              {lab.orderedBy}
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                  lab.status === 'Report Ready'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}
              >
                {lab.status}
              </span>

              {lab.status === 'Report Ready' ? (
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors">
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>Download PDF</span>
                </button>
              ) : (
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Results</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
