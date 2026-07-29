"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSidebar = AppSidebar;
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const iconMap = {
    LayoutDashboard: lucide_react_1.LayoutDashboard,
    Calendar: lucide_react_1.Calendar,
    Users: lucide_react_1.Users,
    Stethoscope: lucide_react_1.Stethoscope,
    Pill: lucide_react_1.Pill,
    TestTube: lucide_react_1.TestTube,
    CreditCard: lucide_react_1.CreditCard,
    Package: lucide_react_1.Package,
    Bed: lucide_react_1.Bed,
    UserCheck: lucide_react_1.UserCheck,
    Briefcase: lucide_react_1.Briefcase,
    Settings: lucide_react_1.Settings,
};
function AppSidebar({ navigation, onUpgradeClick }) {
    const pathname = (0, navigation_1.usePathname)();
    return (<aside className="w-64 border-r border-border bg-sidebar-background flex flex-col justify-between min-h-[calc(100vh-4rem)] p-4 transition-colors">
      <div className="space-y-6">
        {navigation.groups.map((group) => (<div key={group.id} className="space-y-2">
            <h3 className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {group.title}
            </h3>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const IconComponent = iconMap[item.iconName] || lucide_react_1.LayoutDashboard;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const isLocked = item.isLocked;
                if (isLocked) {
                    return (<button key={item.id} onClick={() => onUpgradeClick?.(item)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground transition-all group" title={item.lockReason || 'Upgrade to access feature'}>
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground transition-colors"/>
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px]">
                        <lucide_react_1.Lock className="w-2.5 h-2.5"/>
                        <span>UPGRADE</span>
                      </div>
                    </button>);
                }
                return (<link_1.default key={item.id} href={item.href} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive
                        ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}>
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}/>
                      <span>{item.title}</span>
                    </div>
                    {isActive && <lucide_react_1.ChevronRight className="w-3.5 h-3.5 opacity-80"/>}
                  </link_1.default>);
            })}
            </nav>
          </div>))}
      </div>

      {/* Footer Support / Version Widget */}
      <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
        <div className="text-[11px] font-medium text-foreground">Quravo Platform</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">v1.2.0 • Modular SaaS</div>
      </div>
    </aside>);
}
