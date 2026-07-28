export const rbacKeys = {
  all: ['rbac'] as const,
  modules: () => [...rbacKeys.all, 'modules'] as const,
  roles: () => [...rbacKeys.all, 'roles'] as const,
};
