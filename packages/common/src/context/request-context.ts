import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextStore {
  requestId: string;
  tenantId?: string;
  userId?: string;
  correlationId?: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContextStore>();

export class RequestContext {
  static run<T>(store: RequestContextStore, callback: () => T): T {
    return asyncLocalStorage.run(store, callback);
  }

  static getStore(): RequestContextStore | undefined {
    return asyncLocalStorage.getStore();
  }

  static get requestId(): string | undefined {
    return this.getStore()?.requestId;
  }

  static get tenantId(): string | undefined {
    return this.getStore()?.tenantId;
  }

  static get userId(): string | undefined {
    return this.getStore()?.userId;
  }

  static setTenantId(tenantId: string): void {
    const store = this.getStore();
    if (store) {
      store.tenantId = tenantId;
    }
  }

  static setUserId(userId: string): void {
    const store = this.getStore();
    if (store) {
      store.userId = userId;
    }
  }
}
