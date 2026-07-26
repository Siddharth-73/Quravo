export type EmailJobType = 'verify-email' | 'password-reset' | 'welcome-clinic' | 'staff-invite';

export interface BaseEmailJob {
  type: EmailJobType;
  to: string;
  subject: string;
}

export interface VerifyEmailJobPayload extends BaseEmailJob {
  type: 'verify-email';
  firstName: string;
  verificationUrl: string;
}

export interface PasswordResetJobPayload extends BaseEmailJob {
  type: 'password-reset';
  firstName: string;
  resetUrl: string;
}

export interface StaffInviteJobPayload extends BaseEmailJob {
  type: 'staff-invite';
  clinicName: string;
  role: string;
  inviteUrl: string;
}

export type EmailJobPayload = VerifyEmailJobPayload | PasswordResetJobPayload | StaffInviteJobPayload;
