"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentDto = void 0;
class CreateAppointmentDto {
    branchId;
    patientId;
    doctorId;
    startTime; // ISO 8601 String
    endTime; // ISO 8601 String (Optional, defaults to +30 min)
    chiefComplaint;
    notes;
}
exports.CreateAppointmentDto = CreateAppointmentDto;
