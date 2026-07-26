import { DomainEvent } from './domain-event';

export interface TenantCreatedData {
  tenantId: string;
  name: string;
  slug: string;
  planTier: string;
  ownerUserId: string;
  ownerEmail: string;
}

export class TenantCreatedEvent extends DomainEvent<TenantCreatedData> {
  constructor(data: TenantCreatedData, meta?: { requestId?: string; userId?: string }) {
    super('tenant.created', data.tenantId, data.tenantId, data, 1, meta);
  }
}
