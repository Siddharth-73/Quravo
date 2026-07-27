"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarNavigation, NavItem } from '@/lib/navigation/sidebar-schema';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  Pill,
  TestTube,
  CreditCard,
  Package,
  Bed,
  UserCheck,
  Briefcase,
  Settings,
  Lock,
  ChevronRight,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  Pill,
  TestTube,
  CreditCard,
  Package,
  Bed,
  UserCheck,
  Briefcase,
  Settings,
};

interface AppSidebarProps {
  navigation: SidebarNavigation;
  onUpgradeClick?: (item: NavItem) => void;
}

export function AppSidebar({ navigation, onUpgradeClick }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-sidebar-background flex flex-col justify-between min-h-[calc(100vh-4rem)] p-4 transition-colors">
      <div className="space-y-6">
        {navigation.groups.map((group) => (
          <div key={group.id} className="space-y-2">
            <h3 className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {group.title}
            </h3>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const IconComponent = iconMap[item.iconName] || LayoutDashboard;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const isLocked = item.isLocked;

                if (isLocked) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => onUpgradeClick?.(item)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground transition-all group"
                      title={item.lockReason || 'Upgrade to access feature'}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px]">
                        <Lock className="w-2.5 h-2.5" />
                        <span>UPGRADE</span>
                      </div>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`w-4 h-4 ${
                          isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Support / Version Widget */}
      <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
        <div className="text-[11px] font-medium text-foreground">Quravo Platform</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">v1.2.0 • Modular SaaS</div>
      </div>
    </aside>
  );
}
