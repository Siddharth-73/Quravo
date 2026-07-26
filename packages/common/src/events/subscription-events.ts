import { DomainEvent } from './domain-event';

export interface SubscriptionChangedData {
  tenantId: string;
  previousPlanTier: string;
  newPlanTier: string;
  status: string;
  billingProvider: string;
  externalSubscriptionId?: string;
}

export class SubscriptionUpgradedEvent extends DomainEvent<SubscriptionChangedData> {
  constructor(data: SubscriptionChangedData, meta?: { requestId?: string; userId?: string }) {
    super('subscription.upgraded', data.tenantId, data.tenantId, data, 1, meta);
  }
}

export class SubscriptionDowngradedEvent extends DomainEvent<SubscriptionChangedData> {
  constructor(data: SubscriptionChangedData, meta?: { requestId?: string; userId?: string }) {
    super('subscription.downgraded', data.tenantId, data.tenantId, data, 1, meta);
  }
}

export class SubscriptionCanceledEvent extends DomainEvent<SubscriptionChangedData> {
  constructor(data: SubscriptionChangedData, meta?: { requestId?: string; userId?: string }) {
    super('subscription.canceled', data.tenantId, data.tenantId, data, 1, meta);
  }
}
