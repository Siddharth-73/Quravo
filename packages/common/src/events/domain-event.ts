import { randomUUID } from 'crypto';

export interface DomainEventPayload<T = unknown> {
  eventId: string;
  eventName: string;
  tenantId: string;
  occurredAt: string; // ISO String
  aggregateId: string;
  version: number;
  data: T;
  meta: {
    requestId?: string;
    userId?: string;
  };
}

export abstract class DomainEvent<T = unknown> implements DomainEventPayload<T> {
  public readonly eventId: string;
  public readonly occurredAt: string;

  constructor(
    public readonly eventName: string,
    public readonly tenantId: string,
    public readonly aggregateId: string,
    public readonly data: T,
    public readonly version: number = 1,
    meta?: { requestId?: string; userId?: string }
  ) {
    this.eventId = randomUUID();
    this.occurredAt = new Date().toISOString();
    this.meta = meta || {};
  }

  public readonly meta: {
    requestId?: string;
    userId?: string;
  };
}
