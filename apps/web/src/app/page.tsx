"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap, ArrowRight, Building2, Stethoscope, Users, Check, Globe, LayoutDashboard, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 md:px-12 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-md">
            Q
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Quravo<span className="text-primary font-mono text-xs ml-1">SaaS</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing Tiers</a>
          <a href="#white-label" className="hover:text-foreground transition-colors">White-Labeling</a>
          <Link href="/book" className="hover:text-foreground transition-colors">Patient Portal</Link>
        </nav>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors shadow-xs"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-6 md:px-12 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold shadow-xs animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>The "Shopify & Odoo" Monolith Monorepo for Healthcare</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          White-Label Operating System for <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Clinics & Hospital Chains</span>
        </h1>

        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Scale effortlessly from individual practitioners to multi-branch hospital chains. Custom white-label branding, AI SOAP scribe, electronic prescriptions, pharmacy, and laboratory — all without code changes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 text-xs">
          <Link
            href="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            <span>Provision Clinic Tenant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card text-foreground font-bold text-sm hover:bg-muted transition-colors shadow-xs"
          >
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span>Explore Demo Workspace</span>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 border-t border-border">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Modular Monolith Built for Scale</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Every tenant gets their own subdomains, RBAC roles, and modular à la carte capabilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">AI Clinical SOAP Scribe</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Auto-generate Subjective, Objective, Assessment (ICD-10), and Plan notes with built-in AI assistance.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Multi-Branch Architecture</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seamlessly manage practitioner schedules, patient transfers, and stock balances across multiple clinic locations.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Strict RBAC & Audit Ledger</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Granular permission guards ensure doctors, receptionists, and pharmacists only access authorized data.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 border-t border-border">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Transparent Pricing Tiers</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Config-driven plan features that scale with your clinic size</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starter Tier</span>
              <div className="text-3xl font-extrabold text-foreground">$49 <span className="text-xs text-muted-foreground font-normal">/mo</span></div>
              <p className="text-xs text-muted-foreground">Ideal for individual practitioners and solo clinics.</p>
              <ul className="space-y-2 text-xs">
                {['Appointments Calendar', 'Patient EHR Profiles', 'Electronic Prescriptions', 'Basic POS Billing'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-foreground">
                    <Check className="w-4 h-4 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/signup?plan=starter" className="w-full py-2.5 rounded-xl border border-border bg-muted/40 text-center font-bold text-xs hover:bg-muted text-foreground">
              Get Started
            </Link>
          </div>

          {/* Growth */}
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-lg space-y-6 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 bg-primary text-primary-foreground text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Most Popular
            </span>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Growth Tier</span>
              <div className="text-3xl font-extrabold text-foreground">$149 <span className="text-xs text-muted-foreground font-normal">/mo</span></div>
              <p className="text-xs text-muted-foreground">Perfect for growing multi-doctor clinics and chains.</p>
              <ul className="space-y-2 text-xs">
                {['Everything in Starter', 'Multi-Branch Support', 'Stock Inventory Management', 'AI Clinical Assist', 'Advanced Analytics'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-foreground">
                    <Check className="w-4 h-4 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/signup?plan=growth" className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-center font-bold text-xs hover:opacity-90 shadow-sm">
              Start Growth Trial
            </Link>
          </div>

          {/* ERP */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-500">ERP Enterprise</span>
              <div className="text-3xl font-extrabold text-foreground">$399 <span className="text-xs text-muted-foreground font-normal">/mo</span></div>
              <p className="text-xs text-muted-foreground">Full hospital operations with à la carte modules.</p>
              <ul className="space-y-2 text-xs">
                {['Everything in Growth', 'Pharmacy Dispensing Queue', 'Laboratory Diagnostics', 'HR & Staff Management', 'Custom Domain Binding'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-foreground">
                    <Check className="w-4 h-4 text-purple-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/signup?plan=erp" className="w-full py-2.5 rounded-xl border border-border bg-muted/40 text-center font-bold text-xs hover:bg-muted text-foreground">
              Contact Enterprise
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-8 px-6 md:px-12 text-center text-xs text-muted-foreground space-y-2">
        <div className="font-bold text-foreground">Quravo Healthcare SaaS Platform</div>
        <div>HIPAA & GDPR Compliant Monolith Architecture • Built with Next.js 15, NestJS & PostgreSQL</div>
      </footer>
    </div>
  );
}
