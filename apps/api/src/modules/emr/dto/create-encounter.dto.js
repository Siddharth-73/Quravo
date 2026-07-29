"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEncounterDto = exports.CreateEncounterDto = void 0;
class CreateEncounterDto {
    patientId;
    appointmentId;
    chiefComplaint;
    subjectiveNotes;
    objectiveNotes;
    assessmentDiagnosis;
    treatmentPlan;
    vitals;
}
exports.CreateEncounterDto = CreateEncounterDto;
class UpdateEncounterDto extends CreateEncounterDto {
}
exports.UpdateEncounterDto = UpdateEncounterDto;
