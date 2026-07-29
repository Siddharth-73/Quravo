"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditLogs = useAuditLogs;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@/lib/api/client");
const audit_1 = require("@/lib/query-keys/audit");
function useAuditLogs(filters = {}) {
    return (0, react_query_1.useQuery)({
        queryKey: audit_1.auditKeys.list(filters),
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            if (filters.page)
                searchParams.set('page', filters.page.toString());
            if (filters.limit)
                searchParams.set('limit', filters.limit.toString());
            if (filters.userId)
                searchParams.set('userId', filters.userId);
            if (filters.action)
                searchParams.set('action', filters.action);
            if (filters.startDate)
                searchParams.set('startDate', filters.startDate);
            if (filters.endDate)
                searchParams.set('endDate', filters.endDate);
            const qs = searchParams.toString();
            const url = qs ? `/audit-logs?${qs}` : '/audit-logs';
            return (0, client_1.apiFetch)(url);
        },
    });
}
