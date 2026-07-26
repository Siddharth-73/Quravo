export class UpdateAppointmentStatusDto {
  status!: 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  cancelledReason?: string;
  notes?: string;
}
