import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { appointments, appointmentReminders, patientTimeline, patients, users, eq, and, sql, gte, lte, ne } from '@quravo/db';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateWalkInDto } from './dto/walk-in.dto';
import { UpdateAppointmentStatusDto } from './dto/update-status.dto';
import { AppointmentScheduledEvent, AppointmentStatusChangedEvent, AppointmentCancelledEvent } from '@quravo/common';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly queueService: QueueService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  private async generateAppointmentNumber(tenantId: string): Promise<string> {
    const db = this.dbService.db;
    const year = new Date().getFullYear();
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(appointments)
      .where(eq(appointments.tenantId, tenantId));

    const sequence = (count + 1).toString().padStart(4, '0');
    return `APT-${year}-${sequence}`;
  }

  private async getNextWalkInToken(tenantId: string, branchId: string, dateStr: string): Promise<number> {
    const db = this.dbService.db;
    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(appointments)
      .where(
        and(
          eq(appointments.tenantId, tenantId),
          eq(appointments.branchId, branchId),
          eq(appointments.type, 'walk_in'),
          gte(appointments.createdAt, dayStart),
          lte(appointments.createdAt, dayEnd)
        )
      );

    return count + 1;
  }

  async checkDoctorConflict(
    tenantId: string,
    doctorId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string
  ): Promise<boolean> {
    const db = this.dbService.db;

    let conditions = and(
      eq(appointments.tenantId, tenantId),
      eq(appointments.doctorId, doctorId),
      ne(appointments.status, 'cancelled'),
      sql`${appointments.startTime} < ${endTime.toISOString()}`,
      sql`${appointments.endTime} > ${startTime.toISOString()}`
    );

    if (excludeId) {
      conditions = and(conditions, ne(appointments.id, excludeId))!;
    }

    const [existing] = await db.select().from(appointments).where(conditions).limit(1);
    return !!existing;
  }

  async createAppointment(tenantId: string, createdById: string, dto: CreateAppointmentDto) {
    const db = this.dbService.db;
    const startTime = new Date(dto.startTime);
    const endTime = dto.endTime ? new Date(dto.endTime) : new Date(startTime.getTime() + 30 * 60 * 1000); // 30 mins default

    if (endTime <= startTime) {
      throw new BadRequestException('Appointment end time must be after start time.');
    }

    // Overlap conflict validation
    const isConflicting = await this.checkDoctorConflict(tenantId, dto.doctorId, startTime, endTime);
    if (isConflicting) {
      throw new ConflictException('Doctor is already booked for an overlapping time slot.');
    }

    const appointmentNumber = await this.generateAppointmentNumber(tenantId);

    const [appointment] = await db
      .insert(appointments)
      .values({
        tenantId,
        branchId: dto.branchId,
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        appointmentNumber,
        type: 'scheduled',
        status: 'scheduled',
        startTime,
        endTime,
        chiefComplaint: dto.chiefComplaint,
        notes: dto.notes,
        createdById,
      })
      .returning();

    // Timeline record
    await db.insert(patientTimeline).values({
      tenantId,
      patientId: dto.patientId,
      eventType: 'appointment_scheduled',
      title: 'Appointment Scheduled',
      description: `Appointment ${appointment.appointmentNumber} scheduled for ${startTime.toISOString()}.`,
      createdById,
    });

    // Domain event
    const eventPayload = {
      appointmentId: appointment.id,
      tenantId,
      branchId: dto.branchId,
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      appointmentNumber,
      type: 'scheduled',
      status: 'scheduled',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
    this.eventEmitter.emit('appointment.scheduled', new AppointmentScheduledEvent(eventPayload));

    // Enqueue async queues
    const [patient] = await db
      .select()
      .from(patients)
      .where(and(eq(patients.tenantId, tenantId), eq(patients.id, dto.patientId)))
      .limit(1);

    if (patient?.email) {
      await this.queueService.addJob('notification-queue', {
        tenantId,
        type: 'appointment_confirmed',
        recipientEmail: patient.email,
        title: 'Appointment Confirmation',
        message: `Your appointment ${appointmentNumber} is confirmed for ${startTime.toLocaleString()}`,
      });
    } else {
      this.logger.debug(`Skipping appointment confirmation notification for patient ${dto.patientId}: no email on file.`);
    }

    return appointment;
  }

  async createWalkIn(tenantId: string, createdById: string, dto: CreateWalkInDto) {
    const db = this.dbService.db;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const tokenNumber = await this.getNextWalkInToken(tenantId, dto.branchId, todayStr);
    const appointmentNumber = await this.generateAppointmentNumber(tenantId);

    const startTime = now;
    const endTime = new Date(now.getTime() + 30 * 60 * 1000);

    const [appointment] = await db
      .insert(appointments)
      .values({
        tenantId,
        branchId: dto.branchId,
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        appointmentNumber,
        type: 'walk_in',
        status: 'checked_in', // Walk-ins default to checked_in
        startTime,
        endTime,
        tokenNumber,
        chiefComplaint: dto.chiefComplaint,
        createdById,
      })
      .returning();

    return {
      appointment,
      tokenDisplay: `Token #${tokenNumber}`,
    };
  }

  async getAppointmentsCalendar(
    tenantId: string,
    branchId?: string,
    startDate?: string,
    endDate?: string,
    doctorId?: string
  ) {
    const db = this.dbService.db;

    let conditions = eq(appointments.tenantId, tenantId);

    if (branchId) {
      conditions = and(conditions, eq(appointments.branchId, branchId))!;
    }
    if (doctorId) {
      conditions = and(conditions, eq(appointments.doctorId, doctorId))!;
    }
    if (startDate) {
      conditions = and(conditions, gte(appointments.startTime, new Date(startDate)))!;
    }
    if (endDate) {
      conditions = and(conditions, lte(appointments.startTime, new Date(endDate)))!;
    }

    return db
      .select({
        id: appointments.id,
        appointmentNumber: appointments.appointmentNumber,
        type: appointments.type,
        status: appointments.status,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        tokenNumber: appointments.tokenNumber,
        chiefComplaint: appointments.chiefComplaint,
        notes: appointments.notes,
        patientId: appointments.patientId,
        patientFirstName: patients.firstName,
        patientLastName: patients.lastName,
        doctorId: appointments.doctorId,
        doctorFirstName: users.firstName,
        doctorLastName: users.lastName,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(appointments.doctorId, users.id))
      .where(conditions)
      .orderBy(sql`${appointments.startTime} ASC`);
  }

  async updateStatus(tenantId: string, appointmentId: string, dto: UpdateAppointmentStatusDto) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.tenantId, tenantId), eq(appointments.id, appointmentId)))
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Appointment record not found.');
    }

    const [updated] = await db
      .update(appointments)
      .set({
        status: dto.status as any,
        cancelledReason: dto.cancelledReason || existing.cancelledReason,
        notes: dto.notes ? `${existing.notes || ''}\n${dto.notes}` : existing.notes,
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, appointmentId))
      .returning();

    const eventPayload = {
      appointmentId: updated.id,
      tenantId,
      branchId: updated.branchId,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      appointmentNumber: updated.appointmentNumber,
      type: updated.type,
      status: updated.status,
      startTime: updated.startTime.toISOString(),
      endTime: updated.endTime.toISOString(),
      tokenNumber: updated.tokenNumber || undefined,
    };

    if (dto.status === 'cancelled') {
      this.eventEmitter.emit('appointment.cancelled', new AppointmentCancelledEvent(eventPayload));
    } else {
      this.eventEmitter.emit('appointment.status_changed', new AppointmentStatusChangedEvent(eventPayload));
    }

    return updated;
  }

  async getLiveQueue(tenantId: string, branchId: string) {
    const db = this.dbService.db;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return db
      .select({
        id: appointments.id,
        appointmentNumber: appointments.appointmentNumber,
        type: appointments.type,
        status: appointments.status,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        tokenNumber: appointments.tokenNumber,
        chiefComplaint: appointments.chiefComplaint,
        patientId: appointments.patientId,
        patientFirstName: patients.firstName,
        patientLastName: patients.lastName,
        doctorId: appointments.doctorId,
        doctorFirstName: users.firstName,
        doctorLastName: users.lastName,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(appointments.doctorId, users.id))
      .where(
        and(
          eq(appointments.tenantId, tenantId),
          eq(appointments.branchId, branchId),
          gte(appointments.startTime, todayStart),
          ne(appointments.status, 'completed'),
          ne(appointments.status, 'cancelled')
        )
      )
      .orderBy(sql`${appointments.tokenNumber} ASC NULLS LAST, ${appointments.startTime} ASC`);
  }
}
