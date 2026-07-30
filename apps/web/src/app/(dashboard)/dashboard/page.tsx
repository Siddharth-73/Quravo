"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const role = (user.role || '').toLowerCase();
    const email = (user.email || '').toLowerCase();

    if (role === 'super_admin' || role === 'platform super-admin' || email === 'sharmasiddharth7373@gmail.com') {
      router.replace('/super-admin');
    } else if (role === 'doctor' || role === 'lead physician') {
      router.replace('/dashboards/doctor');
    } else if (role === 'nurse' || role === 'triage head nurse') {
      router.replace('/dashboards/nurse');
    } else if (role === 'receptionist' || role === 'front desk receptionist') {
      router.replace('/dashboards/receptionist');
    } else if (role === 'pharmacist' || role === 'chief pharmacist') {
      router.replace('/dashboards/pharmacist');
    } else if (role === 'patient' || role === 'patient user') {
      router.replace('/dashboards/patient');
    } else {
      // Owner or Admin
      router.replace('/dashboards/admin');
    }
  }, [user, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-xs text-muted-foreground font-medium animate-pulse">
        Routing to your role workspace...
      </p>
    </div>
  );
}
