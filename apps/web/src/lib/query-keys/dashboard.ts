export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: () => [...dashboardKeys.all, 'metrics'] as const,
  todaySchedule: (date?: string) => [...dashboardKeys.all, 'schedule', date || 'today'] as const,
  patientQueue: () => [...dashboardKeys.all, 'queue'] as const,
  revenueChart: (period?: string) => [...dashboardKeys.all, 'revenue', period || 'monthly'] as const,
};
