"use client";

import React from 'react';
import { Package, AlertTriangle, Plus, ArrowUpRight } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  reorderPoint: number;
  unitPrice: string;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

const mockStock: StockItem[] = [
  { id: '1', name: 'Surgical Gloves (Size M)', category: 'Consumables', stockLevel: 450, reorderPoint: 100, unitPrice: '$0.85', status: 'In Stock' },
  { id: '2', name: 'Disposable Syringes (5ml)', category: 'Consumables', stockLevel: 42, reorderPoint: 50, unitPrice: '$0.40', status: 'Low Stock' },
  { id: '3', name: 'N95 Respirator Masks', category: 'PPE', stockLevel: 180, reorderPoint: 50, unitPrice: '$2.10', status: 'In Stock' },
  { id: '4', name: 'Sterile Gauze Bandages', category: 'Wound Care', stockLevel: 12, reorderPoint: 30, unitPrice: '$1.50', status: 'Critical' },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory & Supply Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor clinic stock levels, reorder thresholds, and medical supply inventory
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stock Item</span>
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <span>Supply Item Name</span>
          <span>Category</span>
          <span>Stock Level</span>
          <span>Unit Price</span>
          <span>Stock Status</span>
        </div>

        {mockStock.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors gap-4"
          >
            <div>
              <div className="text-xs font-bold text-foreground">{item.name}</div>
              <div className="text-[11px] text-muted-foreground">Reorder at: {item.reorderPoint} units</div>
            </div>

            <div className="text-xs text-muted-foreground font-medium">
              {item.category}
            </div>

            <div className="text-xs font-mono font-bold text-foreground">
              {item.stockLevel} units
            </div>

            <div className="text-xs font-mono font-medium text-foreground">
              {item.unitPrice}
            </div>

            <div>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                  item.status === 'In Stock'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : item.status === 'Low Stock'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
