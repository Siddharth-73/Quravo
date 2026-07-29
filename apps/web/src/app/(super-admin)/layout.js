"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuperAdminLayout;
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
function SuperAdminLayout({ children }) {
    const pathname = (0, navigation_1.usePathname)();
    return (<div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Super Admin Top Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-sm shadow-sm">
            SA
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
              Quravo Platform Super-Admin
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded">
                ROOT OPS
              </span>
            </span>
            <span className="text-[10px] text-slate-400">SaaS Multi-Tenant Management Console</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <link_1.default href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            <lucide_react_1.ArrowLeft className="w-3.5 h-3.5"/>
            <span>Return to Clinic App</span>
          </link_1.default>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Isolated Super Admin Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-4 space-y-4">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Management
          </div>
          <nav className="space-y-1">
            <link_1.default href="/super-admin" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${pathname === '/super-admin'
            ? 'bg-purple-600 text-white font-semibold shadow-sm'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <lucide_react_1.BarChart3 className="w-4 h-4"/>
              <span>Platform Overview</span>
            </link_1.default>

            <link_1.default href="/super-admin/tenants" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${pathname === '/super-admin/tenants'
            ? 'bg-purple-600 text-white font-semibold shadow-sm'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <lucide_react_1.Building className="w-4 h-4"/>
              <span>Tenants Directory</span>
            </link_1.default>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-8 bg-slate-950 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>);
}
