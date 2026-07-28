import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditService } from '../../common/services/audit.service';
import { emrEncounters, prescriptions, prescriptionItems, emrReports, patientTimeline, patients, eq, and, sql } from '@quravo/db';
import { CreateEncounterDto, UpdateEncounterDto } from './dto/create-encounter.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class EmrService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly auditService: AuditService
  ) {}

  private async generateEncounterNumber(tenantId: string): Promise<string> {
    const db = this.dbService.db;
    const year = new Date().getFullYear();
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(emrEncounters)
      .where(eq(emrEncounters.tenantId, tenantId));

    const sequence = (count + 1).toString().padStart(4, '0');
    return `ENC-${year}-${sequence}`;
  }

  private async generatePrescriptionNumber(tenantId: string): Promise<string> {
    const db = this.dbService.db;
    const year = new Date().getFullYear();
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(prescriptions)
      .where(eq(prescriptions.tenantId, tenantId));

    const sequence = (count + 1).toString().padStart(4, '0');
    return `RX-${year}-${sequence}`;
  }

  async createEncounter(tenantId: string, doctorId: string, dto: CreateEncounterDto) {
    const db = this.dbService.db;
    const encounterNumber = await this.generateEncounterNumber(tenantId);

    const [encounter] = await db
      .insert(emrEncounters)
      .values({
        tenantId,
        patientId: dto.patientId,
        doctorId,
        appointmentId: dto.appointmentId,
        encounterNumber,
        chiefComplaint: dto.chiefComplaint,
        subjectiveNotes: dto.subjectiveNotes,
        objectiveNotes: dto.objectiveNotes,
        assessmentDiagnosis: dto.assessmentDiagnosis || [],
        treatmentPlan: dto.treatmentPlan,
        vitals: dto.vitals || {},
        status: 'draft',
      })
      .returning();

    // Care Timeline entry
    await db.insert(patientTimeline).values({
      tenantId,
      patientId: dto.patientId,
      eventType: 'consultation_completed',
      title: 'Clinical Consultation Encounter Recorded',
      description: `Encounter ${encounter.encounterNumber} recorded for complaint '${dto.chiefComplaint}'.`,
      createdById: doctorId,
    });

    // Security Audit Log
    await this.auditService.log({
      tenantId,
      userId: doctorId,
      action: 'emr.encounter_created',
      resource: 'emr_encounter',
      resourceId: encounter.id,
    });

    return encounter;
  }

  async getEncounterById(tenantId: string, userId: string, encounterId: string) {
    const db = this.dbService.db;
    const [encounter] = await db
      .select()
      .from(emrEncounters)
      .where(and(eq(emrEncounters.tenantId, tenantId), eq(emrEncounters.id, encounterId)))
      .limit(1);

    if (!encounter) {
      throw new NotFoundException('EMR Encounter record not found.');
    }

    // Security Audit Log
    await this.auditService.log({
      tenantId,
      userId,
      action: 'emr.encounter_viewed',
      resource: 'emr_encounter',
      resourceId: encounter.id,
    });

    return encounter;
  }

  async updateEncounter(tenantId: string, userId: string, encounterId: string, dto: UpdateEncounterDto) {
    const db = this.dbService.db;
    const encounter = await this.getEncounterById(tenantId, userId, encounterId);

    if (encounter.status === 'finalized') {
      throw new BadRequestException('Finalized EMR encounters cannot be modified. Only amendments are permitted.');
    }

    const [updated] = await db
      .update(emrEncounters)
      .set({
        chiefComplaint: dto.chiefComplaint,
        subjectiveNotes: dto.subjectiveNotes,
        objectiveNotes: dto.objectiveNotes,
        assessmentDiagnosis: dto.assessmentDiagnosis || [],
        treatmentPlan: dto.treatmentPlan,
        vitals: dto.vitals || {},
        updatedAt: new Date(),
      })
      .where(eq(emrEncounters.id, encounterId))
      .returning();

    await this.auditService.log({
      tenantId,
      userId,
      action: 'emr.encounter_updated',
      resource: 'emr_encounter',
      resourceId: encounterId,
    });

    return updated;
  }

  async finalizeEncounter(tenantId: string, userId: string, encounterId: string) {
    const db = this.dbService.db;
    await this.getEncounterById(tenantId, userId, encounterId);

    const [finalized] = await db
      .update(emrEncounters)
      .set({
        status: 'finalized',
        finalizedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(emrEncounters.tenantId, tenantId), eq(emrEncounters.id, encounterId)))
      .returning();

    await this.auditService.log({
      tenantId,
      userId,
      action: 'emr.encounter_finalized',
      resource: 'emr_encounter',
      resourceId: encounterId,
    });

    return finalized;
  }

  async createPrescription(tenantId: string, doctorId: string, dto: CreatePrescriptionDto) {
    const db = this.dbService.db;
    const prescriptionNumber = await this.generatePrescriptionNumber(tenantId);

    const [prescription] = await db
      .insert(prescriptions)
      .values({
        tenantId,
        patientId: dto.patientId,
        doctorId,
        encounterId: dto.encounterId,
        prescriptionNumber,
        instructions: dto.instructions,
        status: 'active',
      })
      .returning();

    const itemsToInsert = dto.items.map((item) => ({
      tenantId,
      prescriptionId: prescription.id,
      medicationName: item.medicationName,
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      route: item.route || 'oral',
      specialInstructions: item.specialInstructions,
    }));

    const insertedItems = await db.insert(prescriptionItems).values(itemsToInsert).returning();

    // Care Timeline record
    await db.insert(patientTimeline).values({
      tenantId,
      patientId: dto.patientId,
      eventType: 'prescription_issued',
      title: 'Prescription Issued',
      description: `Prescription ${prescriptionNumber} (${insertedItems.length} items) issued by physician.`,
      createdById: doctorId,
    });

    await this.auditService.log({
      tenantId,
      userId: doctorId,
      action: 'emr.prescription_created',
      resource: 'prescription',
      resourceId: prescription.id,
    });

    return {
      prescription,
      items: insertedItems,
    };
  }

  async getPatientEncounters(tenantId: string, userId: string, patientId: string) {
    const db = this.dbService.db;

    const items = await db
      .select({
        id: emrEncounters.id,
        encounterNumber: emrEncounters.encounterNumber,
        encounterDate: emrEncounters.encounterDate,
        chiefComplaint: emrEncounters.chiefComplaint,
        subjectiveNotes: emrEncounters.subjectiveNotes,
        objectiveNotes: emrEncounters.objectiveNotes,
        assessmentDiagnosis: emrEncounters.assessmentDiagnosis,
        treatmentPlan: emrEncounters.treatmentPlan,
        vitals: emrEncounters.vitals,
        status: emrEncounters.status,
        patientId: emrEncounters.patientId,
        patientFirstName: patients.firstName,
        patientLastName: patients.lastName,
      })
      .from(emrEncounters)
      .leftJoin(patients, eq(emrEncounters.patientId, patients.id))
      .where(and(eq(emrEncounters.tenantId, tenantId), eq(emrEncounters.patientId, patientId)))
      .orderBy(sql`${emrEncounters.createdAt} DESC`);

    await this.auditService.log({
      tenantId,
      userId,
      action: 'emr.chart_viewed',
      resource: 'patient_chart',
      resourceId: patientId,
    });

    return items;
  }

  async getAllEncounters(tenantId: string) {
    const db = this.dbService.db;

    return db
      .select({
        id: emrEncounters.id,
        encounterNumber: emrEncounters.encounterNumber,
        encounterDate: emrEncounters.encounterDate,
        chiefComplaint: emrEncounters.chiefComplaint,
        subjectiveNotes: emrEncounters.subjectiveNotes,
        objectiveNotes: emrEncounters.objectiveNotes,
        assessmentDiagnosis: emrEncounters.assessmentDiagnosis,
        treatmentPlan: emrEncounters.treatmentPlan,
        vitals: emrEncounters.vitals,
        status: emrEncounters.status,
        patientId: emrEncounters.patientId,
        patientFirstName: patients.firstName,
        patientLastName: patients.lastName,
      })
      .from(emrEncounters)
      .leftJoin(patients, eq(emrEncounters.patientId, patients.id))
      .where(eq(emrEncounters.tenantId, tenantId))
      .orderBy(sql`${emrEncounters.createdAt} DESC`);
  }
}
