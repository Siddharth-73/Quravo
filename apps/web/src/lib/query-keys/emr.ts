export const emrKeys = {
  all: ['emr'] as const,
  encounters: () => [...emrKeys.all, 'encounters'] as const,
  encounter: (id: string) => [...emrKeys.encounters(), id] as const,
  patientEncounters: (patientId: string) => [...emrKeys.encounters(), 'patient', patientId] as const,
  prescriptions: () => [...emrKeys.all, 'prescriptions'] as const,
  patientPrescriptions: (patientId: string) => [...emrKeys.prescriptions(), 'patient', patientId] as const,
  aiResult: (jobId: string) => [...emrKeys.all, 'ai-result', jobId] as const,
};
