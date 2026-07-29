import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface PrescriptionOrder {
  id: string;
  patientName: string;
  mrn: string;
  medication: string;
  dosage: string;
  prescribedBy: string;
  issuedAt: string;
  status: 'Pending' | 'Dispensed';
}

@Injectable()
export class PharmacyService {
  private readonly logger = new Logger(PharmacyService.name);

  private inMemoryOrders: PrescriptionOrder[] = [
    { id: 'rx-101', patientName: 'Priya Patel', mrn: 'MRN-2026-001', medication: 'Amoxicillin 500mg Capsules', dosage: '1 cap TDS x 5 days (15 caps)', prescribedBy: 'Dr. Siddharth Sharma', issuedAt: '2026-07-29', status: 'Pending' },
    { id: 'rx-102', patientName: 'Rahul Verma', mrn: 'MRN-2026-002', medication: 'Telmisartan 40mg Tablets', dosage: '1 tab OD x 30 days (30 tabs)', prescribedBy: 'Dr. Siddharth Sharma', issuedAt: '2026-07-29', status: 'Pending' },
    { id: 'rx-103', patientName: 'Aarav Mehta', mrn: 'MRN-2026-003', medication: 'Paracetamol Syrup 125mg/5ml', dosage: '5ml BD x 3 days (1 bottle)', prescribedBy: 'Dr. Ananya Iyer', issuedAt: '2026-07-28', status: 'Dispensed' },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    return this.inMemoryOrders;
  }

  async dispense(id: string) {
    const order = this.inMemoryOrders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Prescription order ${id} not found.`);
    }

    order.status = 'Dispensed';
    this.logger.log(`Prescription ${id} successfully dispensed.`);
    return { success: true, message: `Medication ${order.medication} dispensed to ${order.patientName}.`, order };
  }
}
