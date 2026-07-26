import { DomainEvent } from './domain-event';

export interface AppointmentEventData {
  appointmentId: string;
  tenantId: string;
  branchId: string;
  patientId: string;
  doctorId: string;
  appointmentNumber: string;
  type: string;
  status: string;
  startTime: string;
  endTime: string;
  tokenNumber?: number;
}

export class AppointmentScheduledEvent extends DomainEvent<AppointmentEventData> {
  constructor(data: AppointmentEventData, meta?: { requestId?: string; userId?: string }) {
    super('appointment.scheduled', data.tenantId, data.appointmentId, data, 1, meta);
  }
}

export class AppointmentStatusChangedEvent extends DomainEvent<AppointmentEventData> {
  constructor(data: AppointmentEventData, meta?: { requestId?: string; userId?: string }) {
    super('appointment.status_changed', data.tenantId, data.appointmentId, data, 1, meta);
  }
}

export class AppointmentCancelledEvent extends DomainEvent<AppointmentEventData> {
  constructor(data: AppointmentEventData, meta?: { requestId?: string; userId?: string }) {
    super('appointment.cancelled', data.tenantId, data.appointmentId, data, 1, meta);
  }
}
