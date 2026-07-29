"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleUpdatedEvent = exports.ModuleToggledEvent = void 0;
const domain_event_1 = require("./domain-event");
class ModuleToggledEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('tenant.module_toggled', data.tenantId, data.moduleKey, data, 1, meta);
    }
}
exports.ModuleToggledEvent = ModuleToggledEvent;
class RoleUpdatedEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('tenant.role_updated', data.tenantId, data.roleName, data, 1, meta);
    }
}
exports.RoleUpdatedEvent = RoleUpdatedEvent;
