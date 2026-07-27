import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { dashboardKeys } from '@/lib/query-keys/dashboard';

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  doctorName: string;
  type: string;
  status: 'Scheduled' | 'Checked-In' | 'Completed' | 'Cancelled';
}

export function useAppointments(date?: string) {
  return useQuery({
    queryKey: dashboardKeys.todaySchedule(date),
    queryFn: async () => {
      try {
        return await apiFetch<Appointment[]>(`/appointments?date=${date || 'today'}`);
      } catch {
        return [
          { id: '1', time: '09:00 AM', patientName: 'Eleanor Vance', doctorName: 'Dr. Sarah Jenkins', type: 'General Checkup', status: 'Checked-In' },
          { id: '2', time: '10:00 AM', patientName: 'Marcus Aurelius', doctorName: 'Dr. Sarah Jenkins', type: 'Cardiology Review', status: 'Scheduled' },
          { id: '3', time: '11:30 AM', patientName: 'Sophia Lin', doctorName: 'Dr. Robert Chen', type: 'Blood Test Follow-up', status: 'Completed' },
        ];
      }
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAppt: Partial<Appointment>) => {
      return apiFetch<Appointment>('/appointments', {
        method: 'POST',
        body: JSON.stringify(newAppt),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
