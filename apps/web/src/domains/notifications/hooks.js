"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotifications = useNotifications;
exports.useUnreadNotificationCount = useUnreadNotificationCount;
exports.useMarkNotificationRead = useMarkNotificationRead;
exports.useMarkAllNotificationsRead = useMarkAllNotificationsRead;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@/lib/api/client");
const notifications_1 = require("@/lib/query-keys/notifications");
function useNotifications(filters = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = filters;
    return (0, react_query_1.useQuery)({
        queryKey: notifications_1.notificationKeys.list(filters),
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                ...(unreadOnly && { unreadOnly: 'true' }),
            }).toString();
            return await (0, client_1.apiFetch)(`/notifications?${params}`);
        },
    });
}
function useUnreadNotificationCount() {
    return (0, react_query_1.useQuery)({
        queryKey: notifications_1.notificationKeys.unreadCount(),
        queryFn: async () => {
            return await (0, client_1.apiFetch)('/notifications/unread-count');
        },
        refetchInterval: 30000, // Poll every 30s for badge updates
    });
}
function useMarkNotificationRead() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (notificationId) => {
            return await (0, client_1.apiFetch)(`/notifications/${notificationId}/read`, {
                method: 'PUT',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notifications_1.notificationKeys.all });
        },
    });
}
function useMarkAllNotificationsRead() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async () => {
            return await (0, client_1.apiFetch)('/notifications/read-all', {
                method: 'PUT',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notifications_1.notificationKeys.all });
        },
    });
}
