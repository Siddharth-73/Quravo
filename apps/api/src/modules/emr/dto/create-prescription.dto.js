"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePrescriptionDto = exports.PrescriptionItemDto = void 0;
class PrescriptionItemDto {
    medicationName;
    dosage;
    frequency;
    duration;
    route;
    specialInstructions;
}
exports.PrescriptionItemDto = PrescriptionItemDto;
class CreatePrescriptionDto {
    patientId;
    encounterId;
    instructions;
    items;
}
exports.CreatePrescriptionDto = CreatePrescriptionDto;
