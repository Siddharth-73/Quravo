import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { exportKeys } from '@/lib/query-keys/export';

export interface RequestExportResponse {
  status: string;
  exportId: string;
  message: string;
  statusUrl: string;
}

export interface ExportStatusResponse {
  tenantId: string;
  status: 'processing' | 'completed' | 'failed';
  format: string;
  updatedAt: string;
}

export function useRequestExport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ format, entity }: { format: 'csv' | 'pdf'; entity: string }) => {
      return await apiFetch<RequestExportResponse>('/export/request', {
        method: 'POST',
        body: JSON.stringify({ format, entity }),
      });
    },
  });
}

export function useExportStatus(exportId: string | null) {
  return useQuery({
    queryKey: exportKeys.status(exportId as string),
    queryFn: async () => {
      return await apiFetch<ExportStatusResponse | { status: 'pending' }>(`/export/${exportId}/status`);
    },
    enabled: !!exportId,
    refetchInterval: (query) => {
      return query.state.data?.status === 'completed' || query.state.data?.status === 'failed' ? false : 2000;
    },
  });
}
