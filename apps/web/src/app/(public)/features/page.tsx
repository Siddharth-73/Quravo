"use client";

import React from 'react';
import { Stethoscope, Building2, ShieldCheck, Pill, TestTube, CreditCard, Sparkles, Layers, Activity, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Enterprise Healthcare Platform Features</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Everything Your Clinic Needs to Scale
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          From solo practitioners to hospital chains — custom branding, AI clinical assistance, pharmacy fulfillment, and multi-branch operations.
        </p>
      </div>

      {/* Grid of Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">AI Clinical SOAP Scribe</h3>
          <p className="text-muted-foreground leading-relaxed">
            Record clinical encounter notes with AI assistance. Auto-fill Subjective, Objective, ICD-10 Assessment, and Plan instructions.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Multi-Branch Operations</h3>
          <p className="text-muted-foreground leading-relaxed">
            Manage multiple clinic locations, assign practitioners to branches, and route patients across your practice network.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">POS Billing & Invoicing</h3>
          <p className="text-muted-foreground leading-relaxed">
            Process patient consultation invoices, record payments (cash, card, gateway), and generate digital receipt tickets.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Pill className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Pharmacy & Stock Fulfillment</h3>
          <p className="text-muted-foreground leading-relaxed">
            Fulfill doctor prescriptions, track medication inventory, monitor reorder thresholds, and dispense orders safely.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <TestTube className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Laboratory Diagnostics</h3>
          <p className="text-muted-foreground leading-relaxed">
            Track diagnostic test requests, sample collections, and upload lab test PDF reports for doctor sign-off.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Granular RBAC & Security Audit</h3>
          <p className="text-muted-foreground leading-relaxed">
            Role-based access control ensures doctors, nurses, and receptionists only see authorized data with HIPAA audit logs.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-foreground">Ready to Transform Your Clinic Operations?</h2>
        <div className="flex items-center justify-center gap-3 text-xs">
          <Link href="/signup" className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 shadow-sm">
            <span>Register Practice</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/pricing" className="px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted">
            View Plans & Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
