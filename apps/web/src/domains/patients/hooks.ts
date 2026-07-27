import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { patientKeys } from '@/lib/query-keys/patients';

export interface Patient {
  id: string;
  mrn: string;
  fullName: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export function usePatients(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: patientKeys.list(filters),
    queryFn: async () => {
      // API call with fallback mock data for smooth offline dev
      try {
        return await apiFetch<Patient[]>('/patients');
      } catch {
        return [
          { id: 'p-101', mrn: 'MRN-2026-001', fullName: 'Eleanor Vance', gender: 'Female', age: 34, phone: '+1 (555) 234-5678', email: 'eleanor.vance@example.com', status: 'Active' },
          { id: 'p-102', mrn: 'MRN-2026-002', fullName: 'Marcus Aurelius', gender: 'Male', age: 52, phone: '+1 (555) 876-5432', email: 'marcus.aurelius@example.com', status: 'Active' },
          { id: 'p-103', mrn: 'MRN-2026-003', fullName: 'Sophia Lin', gender: 'Female', age: 28, phone: '+1 (555) 345-6789', email: 'sophia.lin@example.com', status: 'Active' },
        ];
      }
    },
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPatient: Partial<Patient>) => {
      return apiFetch<Patient>('/patients', {
        method: 'POST',
        body: JSON.stringify(newPatient),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}
