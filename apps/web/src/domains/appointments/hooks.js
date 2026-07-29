"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppointments = useAppointments;
exports.useCreateAppointment = useCreateAppointment;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@/lib/api/client");
const dashboard_1 = require("@/lib/query-keys/dashboard");
function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function useAppointments(date) {
    return (0, react_query_1.useQuery)({
        queryKey: dashboard_1.dashboardKeys.todaySchedule(date),
        queryFn: async () => {
            try {
                const targetDate = date || getLocalDateString();
                const startIso = new Date(`${targetDate}T00:00:00`).toISOString();
                const endIso = new Date(`${targetDate}T23:59:59`).toISOString();
                const list = await (0, client_1.apiFetch)(`/appointments?startDate=${startIso}&endDate=${endIso}`);
                return list.map(apt => {
                    const timeStr = new Date(apt.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                    const mappedStatus = apt.status === 'checked_in' ? 'Checked-In' :
                        apt.status === 'completed' ? 'Completed' :
                            apt.status === 'cancelled' ? 'Cancelled' : 'Scheduled';
                    return {
                        id: apt.id,
                        time: timeStr,
                        patientName: apt.patientFirstName ? `${apt.patientFirstName} ${apt.patientLastName}` : 'Unknown Patient',
                        doctorName: apt.doctorFirstName ? `Dr. ${apt.doctorFirstName} ${apt.doctorLastName}` : 'Unknown Practitioner',
                        type: apt.chiefComplaint || 'Consultation',
                        status: mappedStatus
                    };
                });
            }
            catch (err) {
                console.warn('Appointments fetch failed:', err);
                return [];
            }
        },
    });
}
function useCreateAppointment() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (newAppt) => {
            return (0, client_1.apiFetch)('/appointments', {
                method: 'POST',
                body: JSON.stringify(newAppt),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dashboard_1.dashboardKeys.all });
        },
    });
}
