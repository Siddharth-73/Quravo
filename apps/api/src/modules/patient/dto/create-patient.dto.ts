export class CreatePatientDto {
  firstName!: string;
  lastName!: string;
  dateOfBirth!: string;
  gender!: string;
  email?: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  allergies?: string[];
  medicalHistory?: Record<string, any>;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export class UpdatePatientDto extends CreatePatientDto {}
