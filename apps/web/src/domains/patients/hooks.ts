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
  tenantId?: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  type: 'encounter' | 'prescription' | 'lab' | 'note';
  title: string;
  description: string;
  date: string;
}

export interface Attachment {
  id: string;
  patientId: string;
  fileName: string;
  fileType: string;
  url: string;
  uploadedAt: string;
}

export function usePatients(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: patientKeys.list(filters),
    queryFn: async () => {
      try {
        const res = await apiFetch<any>('/patients');
        if (res && Array.isArray(res.data)) return res.data as Patient[];
        if (Array.isArray(res)) return res as Patient[];
        return [];
      } catch (err) {
        return [];
      }
    },
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: async () => apiFetch<Patient>(`/patients/${id}`),
    enabled: !!id,
  });
}

export function usePatientTimeline(patientId: string) {
  return useQuery({
    queryKey: patientKeys.timeline(patientId),
    queryFn: async () => apiFetch<TimelineEvent[]>(`/patients/${patientId}/timeline`),
    enabled: !!patientId,
  });
}

export function usePatientAttachments(patientId: string) {
  return useQuery({
    queryKey: patientKeys.attachments(patientId),
    queryFn: async () => apiFetch<Attachment[]>(`/patients/${patientId}/attachments`),
    enabled: !!patientId,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Patient>) => {
      return await apiFetch<Patient>('/patients', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ patientId, file }: { patientId: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      return await apiFetch<Attachment>(`/patients/${patientId}/attachments`, {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.attachments(variables.patientId) });
    },
  });
}
