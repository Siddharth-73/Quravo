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

function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useAppointments(date?: string) {
  return useQuery({
    queryKey: dashboardKeys.todaySchedule(date),
    queryFn: async () => {
      try {
        const targetDate = date || getLocalDateString();
        const startIso = new Date(`${targetDate}T00:00:00`).toISOString();
        const endIso = new Date(`${targetDate}T23:59:59`).toISOString();
        const list = await apiFetch<any[]>(`/appointments?startDate=${startIso}&endDate=${endIso}`);
        return list.map(apt => {
          const timeStr = new Date(apt.startTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          const mappedStatus = apt.status === 'checked_in' ? 'Checked-In' :
                               apt.status === 'completed' ? 'Completed' :
                               apt.status === 'cancelled' ? 'Cancelled' : 'Scheduled';
          return {
            id: apt.id,
            time: timeStr,
            patientName: apt.patientFirstName ? `${apt.patientFirstName} ${apt.patientLastName}` : 'Unknown Patient',
            doctorName: apt.doctorFirstName ? `Dr. ${apt.doctorFirstName} ${apt.doctorLastName}` : 'Unknown Practitioner',
            type: apt.chiefComplaint || 'Consultation',
            status: mappedStatus
          } as Appointment;
        });
      } catch (err) {
        console.warn('Appointments fetch failed:', err);
        return [] as Appointment[];
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
