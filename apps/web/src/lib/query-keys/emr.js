"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emrKeys = void 0;
exports.emrKeys = {
    all: ['emr'],
    encounters: () => [...exports.emrKeys.all, 'encounters'],
    encounter: (id) => [...exports.emrKeys.encounters(), id],
    patientEncounters: (patientId) => [...exports.emrKeys.encounters(), 'patient', patientId],
    prescriptions: () => [...exports.emrKeys.all, 'prescriptions'],
    patientPrescriptions: (patientId) => [...exports.emrKeys.prescriptions(), 'patient', patientId],
    aiResult: (jobId) => [...exports.emrKeys.all, 'ai-result', jobId],
};
