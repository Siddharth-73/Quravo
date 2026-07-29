"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCanceledEvent = exports.SubscriptionDowngradedEvent = exports.SubscriptionUpgradedEvent = void 0;
const domain_event_1 = require("./domain-event");
class SubscriptionUpgradedEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('subscription.upgraded', data.tenantId, data.tenantId, data, 1, meta);
    }
}
exports.SubscriptionUpgradedEvent = SubscriptionUpgradedEvent;
class SubscriptionDowngradedEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('subscription.downgraded', data.tenantId, data.tenantId, data, 1, meta);
    }
}
exports.SubscriptionDowngradedEvent = SubscriptionDowngradedEvent;
class SubscriptionCanceledEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('subscription.canceled', data.tenantId, data.tenantId, data, 1, meta);
    }
}
exports.SubscriptionCanceledEvent = SubscriptionCanceledEvent;
