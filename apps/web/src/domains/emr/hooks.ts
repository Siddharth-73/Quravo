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
      try {
        const res = await apiFetch<any[]>('/emr/encounters');
        return res.map(enc => ({
          ...enc,
          date: enc.encounterDate || enc.createdAt,
          patientName: enc.patientFirstName ? `${enc.patientFirstName} ${enc.patientLastName}` : 'Unknown Patient',
          status: enc.status === 'finalized' ? 'Final' : enc.status === 'draft' ? 'Draft' : 'Signed'
        })) as Encounter[];
      } catch (err) {
        console.warn('Encounters fetch failed:', err);
        return [];
      }
    },
  });
}

export function usePatientEncounters(patientId: string) {
  return useQuery({
    queryKey: emrKeys.patientEncounters(patientId),
    queryFn: async () => {
      try {
        const res = await apiFetch<any[]>(`/emr/encounters?patientId=${patientId}`);
        return res.map(enc => ({
          ...enc,
          date: enc.encounterDate || enc.createdAt,
          patientName: enc.patientFirstName ? `${enc.patientFirstName} ${enc.patientLastName}` : 'Unknown Patient',
          status: enc.status === 'finalized' ? 'Final' : enc.status === 'draft' ? 'Draft' : 'Signed'
        })) as Encounter[];
      } catch (err) {
        console.warn('Patient encounters fetch failed, returning empty:', err);
        return [];
      }
    },
    enabled: !!patientId,
  });
}

export function useEncounter(id: string) {
  return useQuery({
    queryKey: emrKeys.encounter(id),
    queryFn: async () => {
      const enc = await apiFetch<any>(`/emr/encounters/${id}`);
      return {
        ...enc,
        date: enc.encounterDate || enc.createdAt,
        subjective: enc.subjectiveNotes || '',
        objective: enc.objectiveNotes || '',
        assessment: Array.isArray(enc.assessmentDiagnosis) ? enc.assessmentDiagnosis.join(', ') : enc.assessmentDiagnosis || '',
        plan: enc.treatmentPlan || '',
        status: enc.status === 'finalized' ? 'Final' : enc.status === 'draft' ? 'Draft' : 'Signed'
      } as Encounter;
    },
    enabled: !!id,
  });
}

export function useCreateEncounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Encounter>) => {
      const mappedData = {
        patientId: data.patientId,
        appointmentId: (data as any).appointmentId,
        chiefComplaint: data.chiefComplaint || 'Clinical Consultation',
        subjectiveNotes: data.subjective,
        objectiveNotes: data.objective,
        assessmentDiagnosis: data.assessment ? data.assessment.split(',').map(s => s.trim()) : [],
        treatmentPlan: data.plan,
        vitals: data.vitals || {}
      };
      return await apiFetch<Encounter>('/emr/encounters', {
        method: 'POST',
        body: JSON.stringify(mappedData),
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
      const mappedData = {
        chiefComplaint: data.chiefComplaint,
        subjectiveNotes: data.subjective,
        objectiveNotes: data.objective,
        assessmentDiagnosis: data.assessment ? data.assessment.split(',').map(s => s.trim()) : [],
        treatmentPlan: data.plan,
        vitals: data.vitals
      };
      return await apiFetch<Encounter>(`/emr/encounters/${id}`, {
        method: 'PUT',
        body: JSON.stringify(mappedData),
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
        method: 'PUT',
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
export interface AiJobQueuedResponse {
  status: string;
  jobId: string;
  message: string;
}

export interface AiResultResponse {
  status: 'pending' | 'completed' | 'failed';
  result?: string;
  error?: string;
}

export function useAiSummary() {
  return useMutation({
    mutationFn: async (patientId: string) => {
      return await apiFetch<AiJobQueuedResponse>(`/ai/patient-summary`, {
        method: 'POST',
        body: JSON.stringify({ patientId }),
      });
    },
  });
}

export function useAiNotes() {
  return useMutation({
    mutationFn: async ({ appointmentId, rawNotes }: { appointmentId: string; rawNotes: string }) => {
      return await apiFetch<AiJobQueuedResponse>(`/ai/consultation-notes`, {
        method: 'POST',
        body: JSON.stringify({ appointmentId, rawNotes }),
      });
    },
  });
}

export function useAiResult(jobId: string | null) {
  return useQuery({
    queryKey: emrKeys.aiResult(jobId as string),
    queryFn: async () => {
      return await apiFetch<AiResultResponse>(`/ai/result/${jobId}`);
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      return query.state.data?.status === 'completed' || query.state.data?.status === 'failed' ? false : 2000;
    },
  });
}
