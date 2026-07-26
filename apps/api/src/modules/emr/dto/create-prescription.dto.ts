export class PrescriptionItemDto {
  medicationName!: string;
  dosage!: string;
  frequency!: string;
  duration!: string;
  route?: string;
  specialInstructions?: string;
}

export class CreatePrescriptionDto {
  patientId!: string;
  encounterId?: string;
  instructions?: string;
  items!: PrescriptionItemDto[];
}
