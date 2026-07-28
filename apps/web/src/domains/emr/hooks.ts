import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { emrKeys } from '@/lib/query-keys/emr';

export interface Encounter {
  id: string;
  patientId: string;
  providerId: string;
  patientName?: string;
  providerName?: string;
  date: string;
  type: string;
  status: 'Draft' | 'Final' | 'Signed';
  chiefComplaint: string;
  vitals?: Record<string, any>;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  aiSummary?: string;
}

export interface Prescription {
  id: string;
  encounterId: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  refills: number;
  status: 'Active' | 'Discontinued' | 'Completed';
}

export function useEncounters() {
  return useQuery({
    queryKey: emrKeys.encounters(),
    queryFn: async () => {
      return await apiFetch<Encounter[]>('/emr/encounters');
    },
  });
}

export function usePatientEncounters(patientId: string) {
  return useQuery({
    queryKey: emrKeys.patientEncounters(patientId),
    queryFn: async () => {
      return await apiFetch<Encounter[]>(`/emr/encounters?patientId=${patientId}`);
    },
    enabled: !!patientId,
  });
}

export function useEncounter(id: string) {
  return useQuery({
    queryKey: emrKeys.encounter(id),
    queryFn: async () => {
      return await apiFetch<Encounter>(`/emr/encounters/${id}`);
    },
    enabled: !!id,
  });
}

export function useCreateEncounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Encounter>) => {
      return await apiFetch<Encounter>('/emr/encounters', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: emrKeys.encounters() });
      if (data.patientId) {
        queryClient.invalidateQueries({ queryKey: emrKeys.patientEncounters(data.patientId) });
      }
    },
  });
}

export function useUpdateEncounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Encounter> }) => {
      return await apiFetch<Encounter>(`/emr/encounters/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: emrKeys.encounter(data.id) });
      queryClient.invalidateQueries({ queryKey: emrKeys.encounters() });
      if (data.patientId) {
        queryClient.invalidateQueries({ queryKey: emrKeys.patientEncounters(data.patientId) });
      }
    },
  });
}

export function useFinalizeEncounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch<Encounter>(`/emr/encounters/${id}/finalize`, {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: emrKeys.encounter(data.id) });
      queryClient.invalidateQueries({ queryKey: emrKeys.encounters() });
    },
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Prescription>) => {
      return await apiFetch<Prescription>('/emr/prescriptions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: emrKeys.prescriptions() });
      if (data.patientId) {
        queryClient.invalidateQueries({ queryKey: emrKeys.patientPrescriptions(data.patientId) });
      }
    },
  });
}

// AI Integration Hooks
export function useAiSummary() {
  return useMutation({
    mutationFn: async (encounterId: string) => {
      return await apiFetch<{ summary: string }>(`/emr/encounters/${encounterId}/ai/summarize`, {
        method: 'POST',
      });
    },
  });
}

export function useAiNotes() {
  return useMutation({
    mutationFn: async (audioOrTranscript: any) => {
      return await apiFetch<{ soap: any }>(`/emr/ai/notes`, {
        method: 'POST',
        body: JSON.stringify(audioOrTranscript),
      });
    },
  });
}
