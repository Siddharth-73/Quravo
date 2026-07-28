import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { clinicKeys } from '@/lib/query-keys/clinic';

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  isMain: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHour {
  id: string;
  tenantId: string;
  branchId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
}

export function useBranches() {
  return useQuery({
    queryKey: clinicKeys.branches(),
    queryFn: async () => {
      return await apiFetch<Branch[]>('/clinic/branches');
    },
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; code: string; phone?: string; address?: string }) => {
      return await apiFetch<Branch>('/clinic/branches', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicKeys.branches() });
    },
  });
}

export function useBranchWorkingHours(branchId: string) {
  return useQuery({
    queryKey: clinicKeys.branchHours(branchId),
    queryFn: async () => {
      return await apiFetch<WorkingHour[]>(`/clinic/branches/${branchId}/hours`);
    },
    enabled: !!branchId,
  });
}

export function useUpdateBranchWorkingHours() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ branchId, hours }: { branchId: string; hours: any[] }) => {
      return await apiFetch<WorkingHour[]>(`/clinic/branches/${branchId}/hours`, {
        method: 'PUT',
        body: JSON.stringify({ hours }),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clinicKeys.branchHours(variables.branchId) });
    },
  });
}

export function useStaff() {
  return useQuery({
    queryKey: clinicKeys.staff(),
    queryFn: async () => {
      return await apiFetch<Staff[]>('/clinic/staff');
    },
  });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; role: string; branchId?: string }) => {
      return await apiFetch<{ message: string; invitationId: string }>('/clinic/staff/invite', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // If we had a list of pending invitations, we'd invalidate that here.
    },
  });
}
