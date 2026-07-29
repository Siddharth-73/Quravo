"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchSwitcher = BranchSwitcher;
const react_1 = __importDefault(require("react"));
const BranchProvider_1 = require("@/providers/BranchProvider");
const lucide_react_1 = require("lucide-react");
function BranchSwitcher() {
    const { branches, currentBranch, setCurrentBranch } = (0, BranchProvider_1.useBranch)();
    if (!branches || branches.length === 0) {
        return (<div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 rounded-md border border-border">
        <lucide_react_1.Building2 className="w-3.5 h-3.5"/>
        <span>Main Clinic</span>
      </div>);
    }
    return (<div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/50 text-xs font-medium text-foreground transition-colors shadow-sm">
        <lucide_react_1.Building2 className="w-3.5 h-3.5 text-primary"/>
        <span className="max-w-[120px] truncate">{currentBranch?.name || 'Select Branch'}</span>
        <lucide_react_1.ChevronDown className="w-3 h-3 text-muted-foreground ml-1"/>
      </button>

      <div className="absolute left-0 mt-1 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
        <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Clinic Branches
        </div>
        {branches.map((branch) => (<button key={branch.id} onClick={() => setCurrentBranch(branch)} className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${currentBranch?.id === branch.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-popover-foreground hover:bg-muted'}`}>
            <span>{branch.name}</span>
            {branch.isMain && (<span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                Main
              </span>)}
          </button>))}
      </div>
    </div>);
}
