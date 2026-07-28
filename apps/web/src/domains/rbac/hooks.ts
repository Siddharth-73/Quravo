import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { rbacKeys } from '@/lib/query-keys/rbac';

export interface ModuleState {
  moduleKey: string;
  enabled: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export function useModules() {
  return useQuery({
    queryKey: rbacKeys.modules(),
    queryFn: async () => {
      return await apiFetch<ModuleState[]>('/rbac/modules');
    },
  });
}

export function useToggleModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { moduleKey: string; enabled: boolean }) => {
      return await apiFetch('/rbac/modules/toggle', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.modules() });
    },
  });
}

export function useRoles() {
  return useQuery({
    queryKey: rbacKeys.roles(),
    queryFn: async () => {
      return await apiFetch<Role[]>('/rbac/roles');
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description: string; permissions: string[] }) => {
      return await apiFetch<Role>('/rbac/roles', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { roleName: string; permissions: string[] }) => {
      return await apiFetch<Role>(`/rbac/roles/${data.roleName}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ permissions: data.permissions }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
    },
  });
}
