"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Users, Settings, X, ChevronRight, Stethoscope } from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Patients' | 'Encounters';
  icon: React.ElementType;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands: CommandItem[] = [
    {
      id: 'nav-dashboard',
      title: 'Go to Command Center Dashboard',
      category: 'Navigation',
      icon: Search,
      action: () => {
        router.push('/');
        onClose();
      },
    },
    {
      id: 'nav-patients',
      title: 'View All Patients',
      category: 'Navigation',
      icon: Users,
      action: () => {
        router.push('/patients');
        onClose();
      },
    },
    {
      id: 'nav-appts',
      title: 'Open Appointments Calendar',
      category: 'Navigation',
      icon: Calendar,
      action: () => {
        router.push('/appointments');
        onClose();
      },
    },
    {
      id: 'act-new-soap',
      title: 'Create New SOAP Encounter Note',
      category: 'Actions',
      icon: Stethoscope,
      action: () => {
        router.push('/encounters/new');
        onClose();
      },
    },
    {
      id: 'act-settings',
      title: 'Open Clinic Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => {
        router.push('/settings');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-border bg-muted/20">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search patients, records..."
            className="w-full bg-transparent px-3 py-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No matching commands or records found.
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>{cmd.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      {cmd.category}
                    </span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground opacity-50 group-hover:opacity-100" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-border bg-muted/40 flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border bg-card px-1 py-0.5 font-mono">↵</kbd> Select
            </span>
            <span>
              <kbd className="rounded border bg-card px-1 py-0.5 font-mono">↑↓</kbd> Navigate
            </span>
          </div>
          <span>
            <kbd className="rounded border bg-card px-1 py-0.5 font-mono">ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
