import { VitalsData } from '@quravo/db';

export class CreateEncounterDto {
  patientId!: string;
  appointmentId?: string;
  chiefComplaint!: string;
  subjectiveNotes?: string;
  objectiveNotes?: string;
  assessmentDiagnosis?: string[];
  treatmentPlan?: string;
  vitals?: VitalsData;
}

export class UpdateEncounterDto extends CreateEncounterDto {}
