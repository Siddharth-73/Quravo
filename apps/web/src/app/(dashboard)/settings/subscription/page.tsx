"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Sparkles, Shield, ArrowUpRight, Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import Link from 'next/link';

interface SubscriptionData {
  planTier: string;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export default function SubscriptionSettingsPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<SubscriptionData>('/subscriptions/me');
      setSubscription(data);
    } catch (err: any) {
      console.error('Failed to load subscription status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newPlanTier: string) => {
    setUpgrading(newPlanTier);
    setMessage('');
    try {
      const res = await apiFetch<{ message: string }>('/subscriptions/change-plan', {
        method: 'POST',
        body: JSON.stringify({ newPlanTier }),
      });
      setMessage(res.message || `Successfully changed plan to ${newPlanTier}`);
      await fetchSubscription();
    } catch (err: any) {
      setMessage(err.message || 'Failed to update subscription tier.');
    } finally {
      setUpgrading(null);
    }
  };

  const currentPlan = subscription?.planTier?.toLowerCase() || 'starter';

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Subscription & Billing Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your clinic plan tier, feature flags, and billing upgrades
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
          >
            Branding Settings
          </Link>
          <Link
            href="/settings/roles"
            className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
          >
            RBAC & Roles
          </Link>
        </div>
      </div>

      {/* Current Active Plan Status Banner */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Current Practice Plan</span>
          </div>
          <div className="text-2xl font-extrabold text-foreground capitalize">
            {loading ? 'Loading...' : `${currentPlan} Tier`}
          </div>
          <p className="text-xs text-muted-foreground">
            Status: <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{subscription?.status || 'Active'}</span> • Renewal Date: {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'Auto-renewing monthly'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          {message && (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className={`rounded-2xl border bg-card p-6 flex flex-col justify-between space-y-6 shadow-xs ${currentPlan === 'starter' ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starter Tier</span>
              {currentPlan === 'starter' && (
                <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">Current</span>
              )}
            </div>
            <div className="text-3xl font-extrabold text-foreground">₹1,499 <span className="text-xs text-muted-foreground font-normal">/mo</span></div>
            <p className="text-xs text-muted-foreground">Essential EHR & appointment tools for solo practitioners.</p>

            <ul className="space-y-2 text-xs">
              {['Appointments Calendar', 'Patient EHR Profiles', 'Electronic Prescriptions', 'GST-Ready POS Invoicing'].map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-foreground">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('starter')}
            disabled={currentPlan === 'starter' || upgrading !== null}
            className="w-full py-2.5 rounded-xl border border-border bg-muted/40 font-semibold text-xs text-foreground hover:bg-muted disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {upgrading === 'starter' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{currentPlan === 'starter' ? 'Active Plan' : 'Downgrade to Starter'}</span>
          </button>
        </div>

        {/* Growth Plan */}
        <div className={`rounded-2xl border bg-card p-6 flex flex-col justify-between space-y-6 shadow-md relative ${currentPlan === 'growth' ? 'border-primary ring-2 ring-primary/20' : 'border-primary/50'}`}>
          <span className="absolute -top-3 right-6 bg-primary text-primary-foreground text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            Most Popular
          </span>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Growth Tier</span>
              {currentPlan === 'growth' && (
                <span className="bg-primary text-primary-foreground text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">Current</span>
              )}
            </div>
            <div className="text-3xl font-extrabold text-foreground">₹3,999 <span className="text-xs text-muted-foreground font-normal">/mo</span></div>
            <p className="text-xs text-muted-foreground">Multi-branch scheduling & Gemini AI clinical charting.</p>

            <ul className="space-y-2 text-xs">
              {['Everything in Starter', 'Multi-Branch Operations', 'Gemini AI SOAP Scribe', 'Pharmacy & Lab Queues', 'Realtime Analytics'].map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('growth')}
            disabled={currentPlan === 'growth' || upgrading !== null}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {upgrading === 'growth' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{currentPlan === 'growth' ? 'Active Plan' : 'Upgrade to Growth Plan'}</span>
          </button>
        </div>

        {/* ERP Enterprise */}
        <div className={`rounded-2xl border bg-card p-6 flex flex-col justify-between space-y-6 shadow-xs ${currentPlan === 'erp' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-border'}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-500">ERP Enterprise</span>
              {currentPlan === 'erp' && (
                <span className="bg-purple-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">Current</span>
              )}
            </div>
            <div className="text-3xl font-extrabold text-foreground">₹9,999 <span className="text-xs text-muted-foreground font-normal">/mo</span></div>
            <p className="text-xs text-muted-foreground">Full hospital operations with complete custom white-label.</p>

            <ul className="space-y-2 text-xs">
              {['Everything in Growth', 'Dedicated Custom Domain', 'Unlimited Staff Accounts', '24/7 Priority Support SLA', 'Full Custom Telemetry'].map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-foreground">
                  <Check className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('erp')}
            disabled={currentPlan === 'erp' || upgrading !== null}
            className="w-full py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold text-xs hover:bg-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {upgrading === 'erp' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{currentPlan === 'erp' ? 'Active Plan' : 'Switch to Enterprise ERP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
