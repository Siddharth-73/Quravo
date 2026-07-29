import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  private inMemoryStock: InventoryItem[] = [
    { id: 'stk-1', sku: 'MED-AMX-500', name: 'Amoxicillin Trihydrate 500mg', category: 'Pharmaceuticals', quantity: 450, unitPrice: 12.5, reorderLevel: 100, status: 'In Stock' },
    { id: 'stk-2', sku: 'MED-PAR-650', name: 'Paracetamol 650mg Tablets', category: 'Pharmaceuticals', quantity: 820, unitPrice: 3.0, reorderLevel: 200, status: 'In Stock' },
    { id: 'stk-3', sku: 'SUP-GLV-LAT', name: 'Sterile Latex Examination Gloves (M)', category: 'Medical Supplies', quantity: 45, unitPrice: 15.0, reorderLevel: 50, status: 'Low Stock' },
    { id: 'stk-4', sku: 'SUP-SYR-005', name: 'Disposable Syringes 5ml (Luer Lock)', category: 'Medical Supplies', quantity: 12, unitPrice: 8.0, reorderLevel: 30, status: 'Critical' },
    { id: 'stk-5', sku: 'MED-AZI-250', name: 'Azithromycin 250mg Tablets', category: 'Pharmaceuticals', quantity: 180, unitPrice: 45.0, reorderLevel: 50, status: 'In Stock' },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    return this.inMemoryStock;
  }

  async create(itemDto: { name: string; sku: string; category: string; quantity: number; unitPrice: number; reorderLevel?: number }) {
    const id = `stk-${Date.now()}`;
    const qty = Number(itemDto.quantity) || 0;
    const reorder = Number(itemDto.reorderLevel) || 50;
    const status = qty <= 15 ? 'Critical' : qty <= reorder ? 'Low Stock' : 'In Stock';

    const newItem: InventoryItem = {
      id,
      sku: itemDto.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: itemDto.name,
      category: itemDto.category || 'General Supplies',
      quantity: qty,
      unitPrice: Number(itemDto.unitPrice) || 10,
      reorderLevel: reorder,
      status,
    };

    this.inMemoryStock.unshift(newItem);
    return newItem;
  }

  async updateQuantity(id: string, newQty: number) {
    const item = this.inMemoryStock.find((i) => i.id === id);
    if (item) {
      item.quantity = newQty;
      item.status = newQty <= 15 ? 'Critical' : newQty <= item.reorderLevel ? 'Low Stock' : 'In Stock';
    }
    return item;
  }
}
