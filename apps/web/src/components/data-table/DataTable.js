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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = DataTable;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
function DataTable({ data, columns, searchPlaceholder = 'Search records...', onRowClick, isLoading = false, pageSize = 5, }) {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [sortKey, setSortKey] = (0, react_1.useState)(null);
    const [sortOrder, setSortOrder] = (0, react_1.useState)('asc');
    // Filter Data
    const filteredData = data.filter((item) => Object.values(item).some((val) => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())));
    // Sort Data
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortKey)
            return 0;
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB)
            return 0;
        if (valA === undefined || valA === null)
            return 1;
        if (valB === undefined || valB === null)
            return -1;
        const result = String(valA).localeCompare(String(valB));
        return sortOrder === 'asc' ? result : -result;
    });
    // Paginate Data
    const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
    const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };
    return (<div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden space-y-4 p-4">
      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <lucide_react_1.Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground"/>
          <input type="text" value={searchTerm} onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
        }} placeholder={searchPlaceholder} className="w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"/>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <lucide_react_1.SlidersHorizontal className="w-3.5 h-3.5"/>
          <span>Filters</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
            <tr>
              {columns.map((col) => (<th key={col.key} className="px-4 py-3">
                  {col.sortable ? (<button onClick={() => handleSort(col.key)} className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <span>{col.header}</span>
                      <lucide_react_1.ArrowUpDown className="w-3 h-3"/>
                    </button>) : (<span>{col.header}</span>)}
                </th>))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading ? ([1, 2, 3].map((i) => (<tr key={i} className="animate-pulse">
                  {columns.map((col) => (<td key={col.key} className="px-4 py-3">
                      <div className="h-4 w-24 bg-muted rounded"/>
                    </td>))}
                </tr>))) : paginatedData.length === 0 ? (<tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground text-xs">
                  No records found.
                </td>
              </tr>) : (paginatedData.map((row) => (<tr key={row.id} onClick={() => onRowClick?.(row)} className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-muted/40' : 'hover:bg-muted/20'}`}>
                  {columns.map((col) => (<td key={col.key} className="px-4 py-3 text-foreground font-medium">
                      {col.accessor ? col.accessor(row) : String(row[col.key] ?? '')}
                    </td>))}
                </tr>)))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
        <span>
          Showing {paginatedData.length} of {sortedData.length} results
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1 rounded hover:bg-muted disabled:opacity-40">
            <lucide_react_1.ChevronsLeft className="w-4 h-4"/>
          </button>
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-muted disabled:opacity-40">
            <lucide_react_1.ChevronLeft className="w-4 h-4"/>
          </button>
          <span className="px-2 font-medium text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-muted disabled:opacity-40">
            <lucide_react_1.ChevronRight className="w-4 h-4"/>
          </button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-muted disabled:opacity-40">
            <lucide_react_1.ChevronsRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>);
}
