"use client";

import React from 'react';
import { BranchSwitcher } from './BranchSwitcher';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Search, Bell, Sun, Moon, Lock } from 'lucide-react';

interface AppHeaderProps {
  onOpenCommandPalette?: () => void;
  tenantName?: string;
  logoUrl?: string;
}

export function AppHeader({ onOpenCommandPalette, tenantName = 'Quravo Health', logoUrl }: AppHeaderProps) {
  const { user } = useAuth();
  const { mode, setMode } = useTheme();

  const toggleTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-4">
        {/* Clinic Brand & Branch Switcher */}
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={tenantName} className="h-7 w-auto object-contain" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              {tenantName.charAt(0)}
            </div>
          )}
          <span className="font-semibold text-sm tracking-tight text-foreground hidden sm:inline-block">
            {tenantName}
          </span>
        </div>

        <div className="h-4 w-px bg-border hidden sm:block" />

        <BranchSwitcher />
      </div>

      {/* Global Search Bar & Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-muted hover:text-foreground w-44 md:w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Search patients, records...</span>
          </div>
          <kbd className="pointer-events-none hidden rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
          title="Toggle Theme"
        >
          {mode === 'dark' ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="h-4 w-px bg-border" />

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground text-xs ring-1 ring-border">
            {user?.firstName ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}` : 'DR'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-medium text-foreground leading-none">
              {user?.firstName ? `Dr. ${user.firstName} ${user.lastName}` : 'Dr. Sarah Jenkins'}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize mt-0.5">
              {user?.role || 'Lead Physician'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
