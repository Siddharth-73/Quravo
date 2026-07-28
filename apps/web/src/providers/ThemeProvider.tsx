"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TenantThemeConfig, defaultThemeTokens } from '@/lib/theme/tokens';

interface ThemeContextType {
  theme: TenantThemeConfig;
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  updateCustomTheme: (tokens: Partial<TenantThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme = defaultThemeTokens,
}: {
  children: React.ReactNode;
  initialTheme?: TenantThemeConfig;
}) {
  const [theme, setTheme] = useState<TenantThemeConfig>(initialTheme);
  const [mode, setModeState] = useState<'light' | 'dark' | 'system'>('light');

  // Load saved theme on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | 'system';
    if (savedMode) {
      setModeState(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setModeState('dark');
    }
  }, []);

  const setMode = (newMode: 'light' | 'dark' | 'system') => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  // Inject CSS Variables dynamically into DOM root
  useEffect(() => {
    const root = document.documentElement;
    if (theme.primary) root.style.setProperty('--primary', theme.primary);
    if (theme.accent) root.style.setProperty('--accent', theme.accent);
    if (theme.radius) root.style.setProperty('--radius', theme.radius);
    if (theme.success) root.style.setProperty('--success', theme.success);
    if (theme.warning) root.style.setProperty('--warning', theme.warning);
    if (theme.danger) root.style.setProperty('--destructive', theme.danger);

    // Apply Chart palette
    theme.chartPalette?.forEach((color, idx) => {
      root.style.setProperty(`--chart-${idx + 1}`, color);
    });
  }, [theme]);

  // Dark/Light mode class handler
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(mode);
  }, [mode]);

  const updateCustomTheme = (tokens: Partial<TenantThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...tokens }));
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, updateCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
