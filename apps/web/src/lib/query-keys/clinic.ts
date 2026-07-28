export const clinicKeys = {
  all: ['clinic'] as const,
  branches: () => [...clinicKeys.all, 'branches'] as const,
  branchHours: (branchId: string) => [...clinicKeys.branches(), branchId, 'hours'] as const,
  staff: () => [...clinicKeys.all, 'staff'] as const,
};
