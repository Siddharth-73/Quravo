"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModules = useModules;
exports.useToggleModule = useToggleModule;
exports.useRoles = useRoles;
exports.useCreateRole = useCreateRole;
exports.useUpdateRolePermissions = useUpdateRolePermissions;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@/lib/api/client");
const rbac_1 = require("@/lib/query-keys/rbac");
function useModules() {
    return (0, react_query_1.useQuery)({
        queryKey: rbac_1.rbacKeys.modules(),
        queryFn: async () => {
            return await (0, client_1.apiFetch)('/rbac/modules');
        },
    });
}
function useToggleModule() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            return await (0, client_1.apiFetch)('/rbac/modules/toggle', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.modules() });
        },
    });
}
function useRoles() {
    return (0, react_query_1.useQuery)({
        queryKey: rbac_1.rbacKeys.roles(),
        queryFn: async () => {
            return await (0, client_1.apiFetch)('/rbac/roles');
        },
    });
}
function useCreateRole() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            return await (0, client_1.apiFetch)('/rbac/roles', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.roles() });
        },
    });
}
function useUpdateRolePermissions() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            return await (0, client_1.apiFetch)(`/rbac/roles/${data.roleName}/permissions`, {
                method: 'PUT',
                body: JSON.stringify({ permissions: data.permissions }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: rbac_1.rbacKeys.roles() });
        },
    });
}
