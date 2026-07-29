"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHeader = AppHeader;
const react_1 = __importStar(require("react"));
const BranchSwitcher_1 = require("./BranchSwitcher");
const AuthProvider_1 = require("@/providers/AuthProvider");
const ThemeProvider_1 = require("@/providers/ThemeProvider");
const lucide_react_1 = require("lucide-react");
const use_push_subscriptions_1 = require("@/hooks/use-push-subscriptions");
const hooks_1 = require("@/domains/notifications/hooks");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    if (diffSec < 60)
        return 'just now';
    if (diffMin < 60)
        return `${diffMin}m ago`;
    if (diffHour < 24)
        return `${diffHour}h ago`;
    if (diffDay < 7)
        return `${diffDay}d ago`;
    return date.toLocaleDateString();
}
function AppHeader({ onOpenCommandPalette, tenantName = 'Quravo Health', logoUrl }) {
    const router = (0, navigation_1.useRouter)();
    const { user, setUser } = (0, AuthProvider_1.useAuth)();
    const { mode, setMode } = (0, ThemeProvider_1.useTheme)();
    const [isNotificationsOpen, setIsNotificationsOpen] = (0, react_1.useState)(false);
    const notificationsRef = (0, react_1.useRef)(null);
    const [isProfileOpen, setIsProfileOpen] = (0, react_1.useState)(false);
    const profileRef = (0, react_1.useRef)(null);
    const { isSubscribed, subscribeUser } = (0, use_push_subscriptions_1.usePushSubscriptions)();
    const { data: unreadCountData } = (0, hooks_1.useUnreadNotificationCount)();
    const { data: notificationsData } = (0, hooks_1.useNotifications)({ limit: 10 });
    const markNotificationRead = (0, hooks_1.useMarkNotificationRead)();
    const markAllNotificationsRead = (0, hooks_1.useMarkAllNotificationsRead)();
    const unreadCount = unreadCountData?.count ?? 0;
    const notifications = notificationsData?.data ?? [];
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
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
    const handleSignOut = () => {
        setUser(null);
        setIsProfileOpen(false);
        router.push('/login');
    };
    return (<header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-4">
        {/* Clinic Brand & Branch Switcher */}
        <div className="flex items-center gap-3">
          {logoUrl ? (<img src={logoUrl} alt={tenantName} className="h-7 w-auto object-contain"/>) : (<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              {tenantName.charAt(0)}
            </div>)}
          <span className="font-semibold text-sm tracking-tight text-foreground hidden sm:inline-block">
            {tenantName}
          </span>
        </div>

        <div className="h-4 w-px bg-border hidden sm:block"/>

        <BranchSwitcher_1.BranchSwitcher />
      </div>

      {/* Global Search Bar & Actions */}
      <div className="flex items-center gap-3">
        <button onClick={onOpenCommandPalette} className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-muted hover:text-foreground w-44 md:w-64 justify-between">
          <div className="flex items-center gap-2">
            <lucide_react_1.Search className="h-3.5 w-3.5 text-muted-foreground"/>
            <span>Search patients, records...</span>
          </div>
          <kbd className="pointer-events-none hidden rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted" title="Toggle Theme">
          {mode === 'dark' ? <lucide_react_1.Sun className="h-4 w-4 text-warning"/> : <lucide_react_1.Moon className="h-4 w-4"/>}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20" title="Notifications">
            <lucide_react_1.Bell className="h-4 w-4"/>
            {unreadCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>)}
          </button>

          {isNotificationsOpen && (<div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card p-4 shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (<button onClick={() => markAllNotificationsRead.mutate()} disabled={markAllNotificationsRead.isPending} className="text-[10px] text-primary hover:underline font-medium disabled:opacity-50">
                    Mark all as read
                  </button>)}
              </div>

              {!isSubscribed && (<div className="rounded-lg bg-muted/50 border border-border p-3 text-center mb-3">
                  <p className="text-xs text-muted-foreground mb-2 px-1">
                    Enable push notifications to get alerts even when this tab is closed.
                  </p>
                  <button onClick={async () => {
                    await subscribeUser();
                }} className="w-full rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                    Enable Notifications
                  </button>
                </div>)}

              {notifications.length === 0 ? (<div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3 border border-border shadow-inner">
                    <lucide_react_1.Bell className="h-5 w-5 text-muted-foreground opacity-50"/>
                  </div>
                  <p className="text-sm font-medium text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">You have no new notifications.</p>
                </div>) : (<div className="max-h-80 overflow-y-auto -mx-1">
                  {notifications.map((notification) => (<button key={notification.id} onClick={() => markNotificationRead.mutate(notification.id)} className="w-full flex items-start gap-2.5 px-2 py-2.5 rounded-lg text-left hover:bg-muted transition-colors">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${notification.isRead ? 'bg-transparent' : 'bg-primary'}`}/>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs truncate ${notification.isRead ? 'font-medium text-foreground' : 'font-semibold text-foreground'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                    </button>))}
                </div>)}
            </div>)}
        </div>

        <div className="h-4 w-px bg-border"/>

        {/* User Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground text-xs ring-1 ring-border">
              {user?.firstName ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}` : 'SJ'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-foreground leading-none">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Dr. Sarah Jenkins'}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize mt-0.5">
                {user?.role || 'Lead Physician'}
              </span>
            </div>
            <lucide_react_1.ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block opacity-70"/>
          </button>

          {isProfileOpen && (<div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-border bg-muted/20">
                <p className="text-sm font-semibold text-foreground">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Dr. Sarah Jenkins'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user?.email || 'sarah.jenkins@apexhealth.com'}
                </p>
              </div>
              <div className="p-1.5 space-y-0.5">
                <link_1.default href="/profile" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors">
                  <lucide_react_1.User className="w-4 h-4 text-muted-foreground"/>
                  My Profile
                </link_1.default>
                <link_1.default href="/settings" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors">
                  <lucide_react_1.Settings className="w-4 h-4 text-muted-foreground"/>
                  Clinic Settings
                </link_1.default>
              </div>
              <div className="border-t border-border p-1.5">
                <button onClick={handleSignOut} className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
                  <lucide_react_1.LogOut className="w-4 h-4"/>
                  Sign out
                </button>
              </div>
            </div>)}
        </div>
      </div>
    </header>);
}
