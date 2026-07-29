import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface LabOrder {
  id: string;
  patientName: string;
  mrn: string;
  testName: string;
  category: string;
  orderedBy: string;
  status: 'Sample Collected' | 'Report Ready';
  reportDate?: string;
  resultSummary?: string;
}

@Injectable()
export class LaboratoryService {
  private readonly logger = new Logger(LaboratoryService.name);

  private inMemoryLabOrders: LabOrder[] = [
    { id: 'lab-101', patientName: 'Priya Patel', mrn: 'MRN-2026-001', testName: 'Complete Blood Count (CBC)', category: 'Hematology', orderedBy: 'Dr. Siddharth Sharma', status: 'Report Ready', reportDate: '2026-07-29', resultSummary: 'Hb: 13.8 g/dL, WBC: 7,200/mcL, Platelets: 2.5L/mcL (Normal)' },
    { id: 'lab-102', patientName: 'Rahul Verma', mrn: 'MRN-2026-002', testName: 'HbA1c & Fasting Blood Sugar', category: 'Biochemistry', orderedBy: 'Dr. Siddharth Sharma', status: 'Sample Collected', reportDate: undefined, resultSummary: undefined },
    { id: 'lab-103', patientName: 'Aarav Mehta', mrn: 'MRN-2026-003', testName: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', orderedBy: 'Dr. Ananya Iyer', status: 'Report Ready', reportDate: '2026-07-28', resultSummary: 'TSH: 2.45 mIU/L, Free T4: 1.2 ng/dL (Normal)' },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    return this.inMemoryLabOrders;
  }

  async uploadResult(id: string, dto: { resultSummary?: string }) {
    const order = this.inMemoryLabOrders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Lab order ${id} not found.`);
    }

    order.status = 'Report Ready';
    order.reportDate = new Date().toISOString().split('T')[0];
    order.resultSummary = dto.resultSummary || 'Laboratory analysis completed. All parameters within reference ranges.';
    
    this.logger.log(`Lab report uploaded for order ${id}`);
    return { success: true, message: 'Lab results uploaded successfully.', order };
  }

  async generatePdfReport(id: string) {
    const order = this.inMemoryLabOrders.find((o) => o.id === id);
    return {
      orderId: id,
      patientName: order?.patientName || 'Patient',
      mrn: order?.mrn || 'MRN-2026',
      testName: order?.testName || 'Laboratory Test',
      reportDate: order?.reportDate || '2026-07-29',
      resultSummary: order?.resultSummary || 'Normal limits',
      clinicName: 'Apex Health India Diagnostic Lab',
    };
  }
}
