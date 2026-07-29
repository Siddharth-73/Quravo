"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardKeys = void 0;
exports.dashboardKeys = {
    all: ['dashboard'],
    metrics: () => [...exports.dashboardKeys.all, 'metrics'],
    todaySchedule: (date) => [...exports.dashboardKeys.all, 'schedule', date || 'today'],
    patientQueue: () => [...exports.dashboardKeys.all, 'queue'],
    revenueChart: (period) => [...exports.dashboardKeys.all, 'revenue', period || 'monthly'],
};
