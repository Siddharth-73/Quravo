import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { StorageProvider } from '../../common/providers/storage.provider';
import { patients, patientTimeline, patientAttachments, eq, and, sql, or } from '@quravo/db';
import { CreatePatientDto, UpdatePatientDto } from './dto/create-patient.dto';
import { SearchPatientDto } from './dto/search-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly storageProvider: StorageProvider
  ) {}

  private async generatePatientNumber(tenantId: string): Promise<string> {
    const db = this.dbService.db;
    const year = new Date().getFullYear();

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(patients)
      .where(eq(patients.tenantId, tenantId));

    const sequence = (count + 1).toString().padStart(4, '0');
    return `PAT-${year}-${sequence}`;
  }

  async createPatient(tenantId: string, createdById: string, dto: CreatePatientDto) {
    const db = this.dbService.db;
    const patientNumber = await this.generatePatientNumber(tenantId);

    const [patient] = await db
      .insert(patients)
      .values({
        tenantId,
        patientNumber,
        ...dto,
      })
      .returning();

    // Create Initial Care Timeline Entry
    await db.insert(patientTimeline).values({
      tenantId,
      patientId: patient.id,
      eventType: 'registered',
      title: 'Patient Account Registered',
      description: `Patient ${patient.firstName} ${patient.lastName} registered with number ${patient.patientNumber}.`,
      createdById,
    });

    return patient;
  }

  async searchPatients(tenantId: string, dto: SearchPatientDto) {
    const db = this.dbService.db;
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const offset = (page - 1) * limit;

    let whereClause = eq(patients.tenantId, tenantId);

    if (dto.query && dto.query.trim() !== '') {
      const q = `%${dto.query.trim()}%`;
      const searchMatch = or(
        sql`${patients.firstName} ILIKE ${q}`,
        sql`${patients.lastName} ILIKE ${q}`,
        sql`${patients.patientNumber} ILIKE ${q}`,
        sql`${patients.phone} ILIKE ${q}`,
        sql`${patients.email} ILIKE ${q}`
      );
      whereClause = and(whereClause, searchMatch)!;
    }

    const items = await db.select().from(patients).where(whereClause).limit(limit).offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(patients)
      .where(whereClause);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPatientById(tenantId: string, patientId: string) {
    const db = this.dbService.db;
    const [patient] = await db
      .select()
      .from(patients)
      .where(and(eq(patients.tenantId, tenantId), eq(patients.id, patientId)))
      .limit(1);

    if (!patient) {
      throw new NotFoundException('Patient record not found.');
    }

    return patient;
  }

  async updatePatient(tenantId: string, patientId: string, dto: UpdatePatientDto) {
    const db = this.dbService.db;
    await this.getPatientById(tenantId, patientId);

    const [updated] = await db
      .update(patients)
      .set({ ...dto, updatedAt: new Date() })
      .where(and(eq(patients.tenantId, tenantId), eq(patients.id, patientId)))
      .returning();

    return updated;
  }

  async getPatientTimeline(tenantId: string, patientId: string) {
    const db = this.dbService.db;
    await this.getPatientById(tenantId, patientId);

    return db
      .select()
      .from(patientTimeline)
      .where(and(eq(patientTimeline.tenantId, tenantId), eq(patientTimeline.patientId, patientId)))
      .orderBy(sql`${patientTimeline.createdAt} DESC`);
  }

  async uploadAttachment(
    tenantId: string,
    patientId: string,
    uploadedById: string,
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    category: string = 'general'
  ) {
    const db = this.dbService.db;
    const patient = await this.getPatientById(tenantId, patientId);

    const uploadResult = await this.storageProvider.uploadFile({
      buffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
      folder: `patients/${patientId}`,
    });

    const [attachment] = await db
      .insert(patientAttachments)
      .values({
        tenantId,
        patientId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        storageKey: uploadResult.storageKey,
        storageUrl: uploadResult.storageUrl,
        category,
        uploadedById,
      })
      .returning();

    // Append to Patient Timeline
    await db.insert(patientTimeline).values({
      tenantId,
      patientId,
      eventType: 'attachment_added',
      title: 'Medical Attachment Uploaded',
      description: `Document '${file.originalname}' (${category}) added to patient chart.`,
      metadata: { attachmentId: attachment.id, fileName: file.originalname, category },
      createdById: uploadedById,
    });

    return attachment;
  }

  async getPatientAttachments(tenantId: string, patientId: string) {
    const db = this.dbService.db;
    await this.getPatientById(tenantId, patientId);

    return db
      .select()
      .from(patientAttachments)
      .where(and(eq(patientAttachments.tenantId, tenantId), eq(patientAttachments.patientId, patientId)));
  }
}
