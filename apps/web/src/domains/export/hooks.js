"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequestExport = useRequestExport;
exports.useExportStatus = useExportStatus;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@/lib/api/client");
const export_1 = require("@/lib/query-keys/export");
function useRequestExport() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ format, entity }) => {
            return await (0, client_1.apiFetch)('/export/request', {
                method: 'POST',
                body: JSON.stringify({ format, entity }),
            });
        },
    });
}
function useExportStatus(exportId) {
    return (0, react_query_1.useQuery)({
        queryKey: export_1.exportKeys.status(exportId),
        queryFn: async () => {
            return await (0, client_1.apiFetch)(`/export/${exportId}/status`);
        },
        enabled: !!exportId,
        refetchInterval: (query) => {
            return query.state.data?.status === 'completed' || query.state.data?.status === 'failed' ? false : 2000;
        },
    });
}
