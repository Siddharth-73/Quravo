import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { exportKeys } from '@/lib/query-keys/export';

export function useRequestExport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ format, resource }: { format: 'csv' | 'pdf'; resource: string }) => {
      return await apiFetch<{ jobId: string }>('/export/request', {
        method: 'POST',
        body: JSON.stringify({ format, resource }),
      });
    },
  });
}

export function useExportStatus(jobId: string | null) {
  return useQuery({
    queryKey: exportKeys.status(jobId as string),
    queryFn: async () => {
      return await apiFetch<{ status: 'pending' | 'completed' | 'failed'; url?: string }>(`/export/status/${jobId}`);
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      return query.state.data?.status === 'completed' || query.state.data?.status === 'failed' ? false : 2000;
    },
  });
}
