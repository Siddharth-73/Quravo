"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBranches = useBranches;
exports.useCreateBranch = useCreateBranch;
exports.useBranchWorkingHours = useBranchWorkingHours;
exports.useUpdateBranchWorkingHours = useUpdateBranchWorkingHours;
exports.useStaff = useStaff;
exports.useInviteStaff = useInviteStaff;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@/lib/api/client");
const clinic_1 = require("@/lib/query-keys/clinic");
function useBranches() {
    return (0, react_query_1.useQuery)({
        queryKey: clinic_1.clinicKeys.branches(),
        queryFn: async () => {
            return await (0, client_1.apiFetch)('/clinic/branches');
        },
    });
}
function useCreateBranch() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            return await (0, client_1.apiFetch)('/clinic/branches', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clinic_1.clinicKeys.branches() });
        },
    });
}
function useBranchWorkingHours(branchId) {
    return (0, react_query_1.useQuery)({
        queryKey: clinic_1.clinicKeys.branchHours(branchId),
        queryFn: async () => {
            return await (0, client_1.apiFetch)(`/clinic/branches/${branchId}/hours`);
        },
        enabled: !!branchId,
    });
}
function useUpdateBranchWorkingHours() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ branchId, hours }) => {
            return await (0, client_1.apiFetch)(`/clinic/branches/${branchId}/hours`, {
                method: 'PUT',
                body: JSON.stringify({ hours }),
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: clinic_1.clinicKeys.branchHours(variables.branchId) });
        },
    });
}
function useStaff() {
    return (0, react_query_1.useQuery)({
        queryKey: clinic_1.clinicKeys.staff(),
        queryFn: async () => {
            return await (0, client_1.apiFetch)('/clinic/staff');
        },
    });
}
function useInviteStaff() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            return await (0, client_1.apiFetch)('/clinic/staff/invite', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            // If we had a list of pending invitations, we'd invalidate that here.
        },
    });
}
