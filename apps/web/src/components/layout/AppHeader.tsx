"use client";

import React, { useState, useRef, useEffect } from 'react';
import { BranchSwitcher } from './BranchSwitcher';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Search, Bell, Sun, Moon, Lock, ChevronDown, Settings, LogOut } from 'lucide-react';
import { usePushSubscriptions } from '@/hooks/use-push-subscriptions';

interface AppHeaderProps {
  onOpenCommandPalette?: () => void;
  tenantName?: string;
  logoUrl?: string;
}

export function AppHeader({ onOpenCommandPalette, tenantName = 'Quravo Health', logoUrl }: AppHeaderProps) {
  const { user } = useAuth();
  const { mode, setMode } = useTheme();
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isSubscribed, subscribeUser } = usePushSubscriptions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {!isSubscribed && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card p-4 shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {isSubscribed && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/20">Active</span>
                )}
              </div>
              
              {!isSubscribed ? (
                <div className="rounded-lg bg-muted/50 border border-border p-4 text-center">
                  <div className="mx-auto h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 px-2">
                    Stay updated with clinic activities. Enable push notifications to get alerts even when closed.
                  </p>
                  <button 
                    onClick={async () => {
                      await subscribeUser();
                    }}
                    className="w-full rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Enable Notifications
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3 border border-border shadow-inner">
                    <Bell className="h-5 w-5 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">You have no new notifications.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-border" />

        {/* User Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
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
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block opacity-70" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-border bg-muted/20">
                <p className="text-sm font-semibold text-foreground">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Dr. Sarah Jenkins'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user?.email || 'sarah.jenkins@example.com'}
                </p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Account Settings
                </button>
              </div>
              <div className="border-t border-border p-1.5">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Implement logout logic here later
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
