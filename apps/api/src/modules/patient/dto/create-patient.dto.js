"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePatientDto = exports.CreatePatientDto = void 0;
class CreatePatientDto {
    firstName;
    lastName;
    dateOfBirth;
    gender;
    email;
    phone;
    emergencyContactName;
    emergencyContactPhone;
    bloodGroup;
    allergies;
    medicalHistory;
    address;
    city;
    state;
    postalCode;
}
exports.CreatePatientDto = CreatePatientDto;
class UpdatePatientDto extends CreatePatientDto {
}
exports.UpdatePatientDto = UpdatePatientDto;
