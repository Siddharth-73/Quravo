export const exportKeys = {
  all: ['export'] as const,
  status: (jobId: string) => [...exportKeys.all, 'status', jobId] as const,
};
