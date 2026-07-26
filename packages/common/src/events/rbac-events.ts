import { DomainEvent } from './domain-event';

export interface ModuleToggledData {
  tenantId: string;
  moduleKey: string;
  enabled: boolean;
}

export class ModuleToggledEvent extends DomainEvent<ModuleToggledData> {
  constructor(data: ModuleToggledData, meta?: { requestId?: string; userId?: string }) {
    super('tenant.module_toggled', data.tenantId, data.moduleKey, data, 1, meta);
  }
}

export interface RoleUpdatedData {
  tenantId: string;
  roleName: string;
  permissions: string[];
}

export class RoleUpdatedEvent extends DomainEvent<RoleUpdatedData> {
  constructor(data: RoleUpdatedData, meta?: { requestId?: string; userId?: string }) {
    super('tenant.role_updated', data.tenantId, data.roleName, data, 1, meta);
  }
}
