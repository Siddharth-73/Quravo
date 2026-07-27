import { AI_GUARDRAILS } from './patient-summary.prompt';

export const CONSULTATION_NOTES_PROMPT = `
You are tasked with structuring rough doctor's notes from a recent consultation into standard SOAP format (Subjective, Objective, Assessment, Plan).
Only use the information provided in the raw notes. Do not hallucinate findings.

${AI_GUARDRAILS}
`;
