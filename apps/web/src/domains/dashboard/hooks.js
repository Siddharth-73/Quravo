"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTodayAppointments = useTodayAppointments;
exports.useLiveQueue = useLiveQueue;
exports.useLivePatients = useLivePatients;
exports.useTenantDirectory = useTenantDirectory;
exports.formatAppointmentTime = formatAppointmentTime;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@/lib/api/client");
const hooks_1 = require("@/domains/clinic/hooks");
function todayRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return { start: start.toISOString(), end: end.toISOString() };
}
function appointmentLabel(appointment) {
    const firstName = typeof appointment.patientFirstName === 'string' ? appointment.patientFirstName : '';
    const lastName = typeof appointment.patientLastName === 'string' ? appointment.patientLastName : '';
    const name = `${firstName} ${lastName}`.trim();
    const patientId = typeof appointment.patientId === 'string' ? appointment.patientId : undefined;
    return name || (patientId ? `Patient ${patientId}` : `Appointment ${String(appointment.id)}`);
}
function mapAppointment(appointment) {
    return {
        id: String(appointment.id),
        patientId: typeof appointment.patientId === 'string' ? appointment.patientId : undefined,
        patientLabel: appointmentLabel(appointment),
        startTime: typeof appointment.startTime === 'string' ? appointment.startTime : undefined,
        status: typeof appointment.status === 'string' ? appointment.status : 'scheduled',
        reason: typeof appointment.chiefComplaint === 'string' ? appointment.chiefComplaint : undefined,
    };
}
function useTodayAppointments() {
    const { start, end } = todayRange();
    return (0, react_query_1.useQuery)({
        queryKey: ['live-dashboard', 'appointments', start],
        queryFn: async () => {
            const data = await (0, client_1.apiFetch)(`/appointments?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`);
            return data.map(mapAppointment);
        },
    });
}
function useLiveQueue() {
    const branchesQuery = (0, hooks_1.useBranches)();
    const branchId = branchesQuery.data?.[0]?.id;
    const queueQuery = (0, react_query_1.useQuery)({
        queryKey: ['live-dashboard', 'queue', branchId],
        queryFn: async () => {
            const data = await (0, client_1.apiFetch)(`/appointments/queue/live?branchId=${encodeURIComponent(branchId)}`);
            return data.map(mapAppointment);
        },
        enabled: Boolean(branchId),
    });
    return {
        ...queueQuery,
        isLoading: branchesQuery.isLoading || queueQuery.isLoading,
        isError: branchesQuery.isError || queueQuery.isError,
        error: branchesQuery.error ?? queueQuery.error,
        isUnavailable: !branchesQuery.isLoading && !branchesQuery.isError && !branchId,
    };
}
function useLivePatients() {
    return (0, react_query_1.useQuery)({
        queryKey: ['live-dashboard', 'patients'],
        queryFn: async () => {
            const response = await (0, client_1.apiFetch)('/patients');
            const data = Array.isArray(response) ? response : response.items ?? [];
            return data.map((patient) => {
                const firstName = typeof patient.firstName === 'string' ? patient.firstName : '';
                const lastName = typeof patient.lastName === 'string' ? patient.lastName : '';
                return {
                    id: String(patient.id),
                    fullName: typeof patient.fullName === 'string' ? patient.fullName : `${firstName} ${lastName}`.trim() || `Patient ${String(patient.id)}`,
                    mrn: typeof patient.mrn === 'string' ? patient.mrn : typeof patient.patientNumber === 'string' ? patient.patientNumber : undefined,
                };
            });
        },
    });
}
function useTenantDirectory() {
    return (0, react_query_1.useQuery)({
        queryKey: ['live-dashboard', 'super-admin-tenants'],
        queryFn: () => (0, client_1.apiFetch)('/super-admin/tenants'),
    });
}
function formatAppointmentTime(startTime) {
    if (!startTime)
        return 'Time not provided';
    const date = new Date(startTime);
    return Number.isNaN(date.getTime())
        ? 'Time not provided'
        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
