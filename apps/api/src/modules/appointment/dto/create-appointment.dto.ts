export class CreateAppointmentDto {
  branchId!: string;
  patientId!: string;
  doctorId!: string;
  startTime!: string; // ISO 8601 String
  endTime?: string;   // ISO 8601 String (Optional, defaults to +30 min)
  chiefComplaint?: string;
  notes?: string;
}
