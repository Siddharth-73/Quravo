"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSULTATION_NOTES_PROMPT = void 0;
const patient_summary_prompt_1 = require("./patient-summary.prompt");
exports.CONSULTATION_NOTES_PROMPT = `
You are tasked with structuring rough doctor's notes from a recent consultation into standard SOAP format (Subjective, Objective, Assessment, Plan).
Only use the information provided in the raw notes. Do not hallucinate findings.

${patient_summary_prompt_1.AI_GUARDRAILS}
`;
