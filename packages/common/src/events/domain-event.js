"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvent = void 0;
const crypto_1 = require("crypto");
class DomainEvent {
    eventName;
    tenantId;
    aggregateId;
    data;
    version;
    eventId;
    occurredAt;
    constructor(eventName, tenantId, aggregateId, data, version = 1, meta) {
        this.eventName = eventName;
        this.tenantId = tenantId;
        this.aggregateId = aggregateId;
        this.data = data;
        this.version = version;
        this.eventId = (0, crypto_1.randomUUID)();
        this.occurredAt = new Date().toISOString();
        this.meta = meta || {};
    }
    meta;
}
exports.DomainEvent = DomainEvent;
