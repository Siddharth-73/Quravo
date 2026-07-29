"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PricingPage;
const react_1 = __importDefault(require("react"));
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function PricingPage() {
    return (<div className="space-y-12 max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
          <lucide_react_1.Sparkles className="w-3.5 h-3.5"/>
          <span>Flexible Subscription Plans</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Simple, Transparent Pricing
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Choose the right plan for your practice size. Upgrade or toggle à la carte modules anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starter Plan</span>
            <div className="text-3xl font-extrabold text-foreground">$49 <span className="text-xs text-muted-foreground font-normal">/mo</span></div>
            <p className="text-xs text-muted-foreground">Ideal for individual practitioners and solo clinics.</p>
            <ul className="space-y-2.5 text-xs">
              {['Appointments Calendar', 'Patient EHR Profiles', 'Electronic Prescriptions', 'Basic POS Billing', 'Single Branch'].map((item) => (<li key={item} className="flex items-center gap-2 text-foreground">
                  <lucide_react_1.Check className="w-4 h-4 text-emerald-500 shrink-0"/> {item}
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
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Growth Plan</span>
            <div className="text-3xl font-extrabold text-foreground">$149 <span className="text-xs text-muted-foreground font-normal">/mo</span></div>
            <p className="text-xs text-muted-foreground">Perfect for growing multi-doctor clinics and chains.</p>
            <ul className="space-y-2.5 text-xs">
              {['Everything in Starter', 'Multi-Branch Support', 'Stock Inventory Management', 'AI Clinical Assist', 'Advanced Analytics'].map((item) => (<li key={item} className="flex items-center gap-2 text-foreground">
                  <lucide_react_1.Check className="w-4 h-4 text-primary shrink-0"/> {item}
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
            <ul className="space-y-2.5 text-xs">
              {['Everything in Growth', 'Pharmacy Dispensing Queue', 'Laboratory Diagnostics', 'HR & Staff Management', 'Bed Management', 'Custom Domain Binding'].map((item) => (<li key={item} className="flex items-center gap-2 text-foreground">
                  <lucide_react_1.Check className="w-4 h-4 text-purple-500 shrink-0"/> {item}
                </li>))}
            </ul>
          </div>
          <link_1.default href="/signup?plan=erp" className="w-full py-2.5 rounded-xl border border-border bg-muted/40 text-center font-bold text-xs hover:bg-muted text-foreground">
            Contact Enterprise
          </link_1.default>
        </div>
      </div>
    </div>);
}
