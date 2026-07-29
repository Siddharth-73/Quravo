import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { auditKeys } from '@/lib/query-keys/audit';

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  payload: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface PaginatedAuditLogs {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery<PaginatedAuditLogs>({
    queryKey: auditKeys.list(filters),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (filters.page) searchParams.set('page', filters.page.toString());
      if (filters.limit) searchParams.set('limit', filters.limit.toString());
      if (filters.userId) searchParams.set('userId', filters.userId);
      if (filters.action) searchParams.set('action', filters.action);
      if (filters.startDate) searchParams.set('startDate', filters.startDate);
      if (filters.endDate) searchParams.set('endDate', filters.endDate);

      const qs = searchParams.toString();
      const url = qs ? `/audit-logs?${qs}` : '/audit-logs';
      return apiFetch(url);
    },
  });
}
