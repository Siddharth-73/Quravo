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
exports.default = PharmacyPage;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const mockOrders = [
    { id: 'rx-1', patientName: 'Eleanor Vance', doctorName: 'Dr. Sarah Jenkins', medication: 'Amoxicillin 500mg', dosage: '1 capsule 3x daily (5 days)', quantity: 15, status: 'Pending', date: '2026-07-27' },
    { id: 'rx-2', patientName: 'Marcus Aurelius', doctorName: 'Dr. Sarah Jenkins', medication: 'Lisinopril 10mg', dosage: '1 tablet daily (30 days)', quantity: 30, status: 'Dispensed', date: '2026-07-26' },
    { id: 'rx-3', patientName: 'Sophia Lin', doctorName: 'Dr. Robert Chen', medication: 'Metformin 850mg', dosage: '2 tablets daily (60 days)', quantity: 120, status: 'Pending', date: '2026-07-27' },
];
function PharmacyPage() {
    const [orders, setOrders] = (0, react_1.useState)(mockOrders);
    const handleDispense = (id) => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Dispensed' } : o)));
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pharmacy & Prescription Fulfillment</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dispense prescribed medications, track stock balances, and manage pharmacy queue
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <span>Patient & Doctor</span>
          <span>Prescribed Medication</span>
          <span>Quantity</span>
          <span>Dispense Status</span>
        </div>

        {orders.map((order) => (<div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors gap-4">
            <div>
              <div className="text-xs font-bold text-foreground">{order.patientName}</div>
              <div className="text-[11px] text-muted-foreground">{order.doctorName}</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-primary">{order.medication}</div>
              <div className="text-[11px] text-muted-foreground">{order.dosage}</div>
            </div>

            <div className="text-xs font-mono font-medium text-foreground">
              Qty: {order.quantity} units
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${order.status === 'Dispensed'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
                {order.status}
              </span>

              {order.status === 'Pending' && (<button onClick={() => handleDispense(order.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors shadow-xs">
                  <lucide_react_1.PackageCheck className="w-3.5 h-3.5"/>
                  <span>Dispense</span>
                </button>)}
            </div>
          </div>))}
      </div>
    </div>);
}
