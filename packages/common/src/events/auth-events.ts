import { DomainEvent } from './domain-event';

export interface UserRegisteredData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  clinicSlug: string;
  verificationToken: string;
}

export class UserRegisteredEvent extends DomainEvent<UserRegisteredData> {
  constructor(data: UserRegisteredData, meta?: { requestId?: string; userId?: string }) {
    super('user.registered', data.tenantId, data.userId, data, 1, meta);
  }
}

export interface PasswordResetRequestedData {
  userId: string;
  email: string;
  firstName: string;
  resetToken: string;
}

export class PasswordResetRequestedEvent extends DomainEvent<PasswordResetRequestedData> {
  constructor(tenantId: string, data: PasswordResetRequestedData, meta?: { requestId?: string; userId?: string }) {
    super('user.password_reset_requested', tenantId, data.userId, data, 1, meta);
  }
}
