import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { notificationKeys } from '@/lib/query-keys/notifications';

export interface AppNotification {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export function useNotifications(filters: { page?: number; limit?: number; unreadOnly?: boolean } = {}) {
  const { page = 1, limit = 20, unreadOnly = false } = filters;
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(unreadOnly && { unreadOnly: 'true' }),
      }).toString();
      return await apiFetch<{ data: AppNotification[]; total: number; page: number; limit: number }>(`/notifications?${params}`);
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      return await apiFetch<{ count: number }>('/notifications/unread-count');
    },
    refetchInterval: 30000, // Poll every 30s for badge updates
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiFetch<{ success: boolean }>(`/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await apiFetch<{ success: boolean }>('/notifications/read-all', {
        method: 'PUT',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
