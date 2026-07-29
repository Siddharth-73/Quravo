"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LandingPage;
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
function LandingPage() {
    return (<div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 md:px-12 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-md">
            Q
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Quravo<span className="text-primary font-mono text-xs ml-1">Health</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
          <a href="#services" className="hover:text-foreground transition-colors">Our Services</a>
          <link_1.default href="/features" className="hover:text-foreground transition-colors">Platform Features</link_1.default>
          <link_1.default href="/pricing" className="hover:text-foreground transition-colors">Pricing & Plans</link_1.default>
          <link_1.default href="/book" className="hover:text-foreground transition-colors">Patient Booking</link_1.default>
        </nav>

        <div className="flex items-center gap-3 text-xs">
          <link_1.default href="/login" className="px-4 py-2 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors shadow-xs">
            Sign In
          </link_1.default>

          <link_1.default href="/signup" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-sm">
            <span>Start Free Trial</span>
            <lucide_react_1.ArrowRight className="w-3.5 h-3.5"/>
          </link_1.default>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-6 md:px-12 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold shadow-xs animate-in fade-in duration-300">
          <lucide_react_1.Sparkles className="w-3.5 h-3.5 animate-pulse"/>
          <span>Complete Healthcare SaaS Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          All-in-One Operating System for <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Clinics & Medical Groups</span>
        </h1>

        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Scale effortlessly from individual doctors to multi-branch medical centers. AI clinical SOAP notes, electronic prescriptions, patient booking, pharmacy fulfillment, and POS billing — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 text-xs">
          <link_1.default href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg">
            <span>Register Practice</span>
            <lucide_react_1.ArrowRight className="w-4 h-4"/>
          </link_1.default>

          <link_1.default href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card text-foreground font-bold text-sm hover:bg-muted transition-colors shadow-xs">
            <lucide_react_1.LayoutDashboard className="w-4 h-4 text-primary"/>
            <span>Explore Demo Workspace</span>
          </link_1.default>
        </div>
      </section>

      {/* Detailed Services Section */}
      <section id="services" className="py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-10 border-t border-border">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-primary">Comprehensive Healthcare Solutions</div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">Detailed Services We Provide</h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
            Tailored digital workflows for every healthcare role across your practice operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {/* Service 1 */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <lucide_react_1.Stethoscope className="w-5 h-5"/>
            </div>
            <h3 className="font-bold text-base text-foreground">AI Clinical Encounter & SOAP Notes</h3>
            <p className="text-muted-foreground leading-relaxed">
              Auto-generate Subjective, Objective, ICD-10 Assessment, and Treatment Plans with real-time AI clinical assistance. Save hours on patient charting.
            </p>
          </div>

          {/* Service 2 */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <lucide_react_1.Calendar className="w-5 h-5"/>
            </div>
            <h3 className="font-bold text-base text-foreground">Smart Appointment Scheduling & Booking</h3>
            <p className="text-muted-foreground leading-relaxed">
              Public self-service booking portal for patients, multi-doctor calendar slot picker, walk-in queue management, and automated SMS/email reminders.
            </p>
          </div>

          {/* Service 3 */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <lucide_react_1.CreditCard className="w-5 h-5"/>
            </div>
            <h3 className="font-bold text-base text-foreground">POS Billing & Receipt Collection</h3>
            <p className="text-muted-foreground leading-relaxed">
              Front-desk checkout terminal for instant consultation invoices, payment status tracking (cash, card, gateway), and printable digital receipts.
            </p>
          </div>

          {/* Service 4 */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <lucide_react_1.Pill className="w-5 h-5"/>
            </div>
            <h3 className="font-bold text-base text-foreground">Pharmacy Dispensing & Inventory</h3>
            <p className="text-muted-foreground leading-relaxed">
              Fulfill electronic prescriptions directly from doctor notes, track medication stock balances, manage dosage safety, and set reorder alerts.
            </p>
          </div>

          {/* Service 5 */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <lucide_react_1.TestTube className="w-5 h-5"/>
            </div>
            <h3 className="font-bold text-base text-foreground">Laboratory Diagnostics Management</h3>
            <p className="text-muted-foreground leading-relaxed">
              Log lab test orders, track sample collection, upload diagnostic result PDFs, and notify doctors when lab reports require clinical review.
            </p>
          </div>

          {/* Service 6 */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <lucide_react_1.Building2 className="w-5 h-5"/>
            </div>
            <h3 className="font-bold text-base text-foreground">Multi-Branch Clinic Operations</h3>
            <p className="text-muted-foreground leading-relaxed">
              Seamlessly connect multiple clinic locations under one dashboard. Route staff, assign practitioners, and monitor revenue across all locations.
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
                {['Appointments Calendar', 'Patient EHR Profiles', 'Electronic Prescriptions', 'Basic POS Billing'].map((item) => (<li key={item} className="flex items-center gap-2 text-foreground">
                    <lucide_react_1.Check className="w-4 h-4 text-emerald-500"/> {item}
                  </li>))}
              </ul>
            </div>
            <link_1.default href="/signup?plan=starter" className="w-full py-2.5 rounded-xl border border-border bg-muted/40 text-center font-bold text-xs hover:bg-muted text-foreground">
              Get Started
            </link_1.default>
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
                {['Everything in Starter', 'Multi-Branch Support', 'Stock Inventory Management', 'AI Clinical Assist', 'Advanced Analytics'].map((item) => (<li key={item} className="flex items-center gap-2 text-foreground">
                    <lucide_react_1.Check className="w-4 h-4 text-primary"/> {item}
                  </li>))}
              </ul>
            </div>
            <link_1.default href="/signup?plan=growth" className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-center font-bold text-xs hover:opacity-90 shadow-sm">
              Start Growth Trial
            </link_1.default>
          </div>

          {/* ERP */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-500">ERP Enterprise</span>
              <div className="text-3xl font-extrabold text-foreground">$399 <span className="text-xs text-muted-foreground font-normal">/mo</span></div>
              <p className="text-xs text-muted-foreground">Full hospital operations with à la carte modules.</p>
              <ul className="space-y-2 text-xs">
                {['Everything in Growth', 'Pharmacy Dispensing Queue', 'Laboratory Diagnostics', 'HR & Staff Management', 'Bed Management'].map((item) => (<li key={item} className="flex items-center gap-2 text-foreground">
                    <lucide_react_1.Check className="w-4 h-4 text-purple-500"/> {item}
                  </li>))}
              </ul>
            </div>
            <link_1.default href="/signup?plan=erp" className="w-full py-2.5 rounded-xl border border-border bg-muted/40 text-center font-bold text-xs hover:bg-muted text-foreground">
              Contact Enterprise
            </link_1.default>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-8 px-6 md:px-12 text-center text-xs text-muted-foreground space-y-2">
        <div className="font-bold text-foreground">Quravo Healthcare SaaS Platform</div>
        <div>HIPAA & GDPR Compliant Monolith Architecture • Built with Next.js 15, NestJS & PostgreSQL</div>
      </footer>
    </div>);
}
