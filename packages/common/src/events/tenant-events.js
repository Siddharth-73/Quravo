"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantCreatedEvent = void 0;
const domain_event_1 = require("./domain-event");
class TenantCreatedEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('tenant.created', data.tenantId, data.tenantId, data, 1, meta);
    }
}
exports.TenantCreatedEvent = TenantCreatedEvent;
