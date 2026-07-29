"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!token) {
      setErrorMsg('Invalid or missing reset token');
      return;
    }

    setIsPending(true);
    setErrorMsg('');
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errorMsg}
            </div>
          )}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">New Password</label>
            <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
              <Lock className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-foreground focus:outline-none font-mono"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Confirm Password</label>
            <div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2">
              <Lock className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-foreground focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm mt-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-3 text-xs">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-foreground">Password Reset Successful</h3>
            <p className="text-muted-foreground">
              Your password has been reset. Redirecting to login...
            </p>
          </div>
        </div>
      )}
      <div className="text-center pt-2 border-t border-border text-[11px]">
        <Link href="/login" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg mb-2">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Password</h1>
          <p className="text-xs text-muted-foreground">
            Please enter your new password below
          </p>
        </div>
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
