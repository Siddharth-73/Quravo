"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEncounters = useEncounters;
exports.usePatientEncounters = usePatientEncounters;
exports.useEncounter = useEncounter;
exports.useCreateEncounter = useCreateEncounter;
exports.useUpdateEncounter = useUpdateEncounter;
exports.useFinalizeEncounter = useFinalizeEncounter;
exports.useCreatePrescription = useCreatePrescription;
exports.useAiSummary = useAiSummary;
exports.useAiNotes = useAiNotes;
exports.useAiResult = useAiResult;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@/lib/api/client");
const emr_1 = require("@/lib/query-keys/emr");
function useEncounters() {
    return (0, react_query_1.useQuery)({
        queryKey: emr_1.emrKeys.encounters(),
        queryFn: async () => {
            try {
                const res = await (0, client_1.apiFetch)('/emr/encounters');
                return res.map(enc => ({
                    ...enc,
                    date: enc.encounterDate || enc.createdAt,
                    patientName: enc.patientFirstName ? `${enc.patientFirstName} ${enc.patientLastName}` : 'Unknown Patient',
                    status: enc.status === 'finalized' ? 'Final' : enc.status === 'draft' ? 'Draft' : 'Signed'
                }));
            }
            catch (err) {
                console.warn('Encounters fetch failed, using mock fallback:', err);
                return [];
            }
        },
    });
}
function usePatientEncounters(patientId) {
    return (0, react_query_1.useQuery)({
        queryKey: emr_1.emrKeys.patientEncounters(patientId),
        queryFn: async () => {
            try {
                const res = await (0, client_1.apiFetch)(`/emr/encounters?patientId=${patientId}`);
                return res.map(enc => ({
                    ...enc,
                    date: enc.encounterDate || enc.createdAt,
                    patientName: enc.patientFirstName ? `${enc.patientFirstName} ${enc.patientLastName}` : 'Unknown Patient',
                    status: enc.status === 'finalized' ? 'Final' : enc.status === 'draft' ? 'Draft' : 'Signed'
                }));
            }
            catch (err) {
                console.warn('Patient encounters fetch failed, returning empty:', err);
                return [];
            }
        },
        enabled: !!patientId,
    });
}
function useEncounter(id) {
    return (0, react_query_1.useQuery)({
        queryKey: emr_1.emrKeys.encounter(id),
        queryFn: async () => {
            const enc = await (0, client_1.apiFetch)(`/emr/encounters/${id}`);
            return {
                ...enc,
                date: enc.encounterDate || enc.createdAt,
                subjective: enc.subjectiveNotes || '',
                objective: enc.objectiveNotes || '',
                assessment: Array.isArray(enc.assessmentDiagnosis) ? enc.assessmentDiagnosis.join(', ') : enc.assessmentDiagnosis || '',
                plan: enc.treatmentPlan || '',
                status: enc.status === 'finalized' ? 'Final' : enc.status === 'draft' ? 'Draft' : 'Signed'
            };
        },
        enabled: !!id,
    });
}
function useCreateEncounter() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            const mappedData = {
                patientId: data.patientId,
                appointmentId: data.appointmentId,
                chiefComplaint: data.chiefComplaint || 'Clinical Consultation',
                subjectiveNotes: data.subjective,
                objectiveNotes: data.objective,
                assessmentDiagnosis: data.assessment ? data.assessment.split(',').map(s => s.trim()) : [],
                treatmentPlan: data.plan,
                vitals: data.vitals || {}
            };
            return await (0, client_1.apiFetch)('/emr/encounters', {
                method: 'POST',
                body: JSON.stringify(mappedData),
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: emr_1.emrKeys.encounters() });
            if (data.patientId) {
                queryClient.invalidateQueries({ queryKey: emr_1.emrKeys.patientEncounters(data.patientId) });
            }
        },
    });
}
function useUpdateEncounter() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ id, data }) => {
            const mappedData = {
                chiefComplaint: data.chiefComplaint,
                subjectiveNotes: data.subjective,
                objectiveNotes: data.objective,
                assessmentDiagnosis: data.assessment ? data.assessment.split(',').map(s => s.trim()) : [],
                treatmentPlan: data.plan,
                vitals: data.vitals
            };
            return await (0, client_1.apiFetch)(`/emr/encounters/${id}`, {
                method: 'PUT',
                body: JSON.stringify(mappedData),
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: emr_1.emrKeys.encounter(data.id) });
            queryClient.invalidateQueries({ queryKey: emr_1.emrKeys.encounters() });
            if (data.patientId) {
                queryClient.invalidateQueries({ queryKey: emr_1.emrKeys.patientEncounters(data.patientId) });
            }
        },
    });
}
function useFinalizeEncounter() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (id) => {
            return await (0, client_1.apiFetch)(`/emr/encounters/${id}/finalize`, {
                method: 'PUT',
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: emr_1.emrKeys.encounter(data.id) });
            queryClient.invalidateQueries({ queryKey: emr_1.emrKeys.encounters() });
        },
    });
}
function useCreatePrescription() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            return await (0, client_1.apiFetch)('/emr/prescriptions', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: emr_1.emrKeys.prescriptions() });
            if (data.patientId) {
                queryClient.invalidateQueries({ queryKey: emr_1.emrKeys.patientPrescriptions(data.patientId) });
            }
        },
    });
}
function useAiSummary() {
    return (0, react_query_1.useMutation)({
        mutationFn: async (patientId) => {
            return await (0, client_1.apiFetch)(`/ai/patient-summary`, {
                method: 'POST',
                body: JSON.stringify({ patientId }),
            });
        },
    });
}
function useAiNotes() {
    return (0, react_query_1.useMutation)({
        mutationFn: async ({ appointmentId, rawNotes }) => {
            return await (0, client_1.apiFetch)(`/ai/consultation-notes`, {
                method: 'POST',
                body: JSON.stringify({ appointmentId, rawNotes }),
            });
        },
    });
}
function useAiResult(jobId) {
    return (0, react_query_1.useQuery)({
        queryKey: emr_1.emrKeys.aiResult(jobId),
        queryFn: async () => {
            return await (0, client_1.apiFetch)(`/ai/result/${jobId}`);
        },
        enabled: !!jobId,
        refetchInterval: (query) => {
            return query.state.data?.status === 'completed' || query.state.data?.status === 'failed' ? false : 2000;
        },
    });
}
