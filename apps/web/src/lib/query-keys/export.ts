export const exportKeys = {
  all: ['export'] as const,
  status: (exportId: string) => [...exportKeys.all, 'status', exportId] as const,
};
