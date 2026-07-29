"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetRequestedEvent = exports.UserRegisteredEvent = void 0;
const domain_event_1 = require("./domain-event");
class UserRegisteredEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('user.registered', data.tenantId, data.userId, data, 1, meta);
    }
}
exports.UserRegisteredEvent = UserRegisteredEvent;
class PasswordResetRequestedEvent extends domain_event_1.DomainEvent {
    constructor(tenantId, data, meta) {
        super('user.password_reset_requested', tenantId, data.userId, data, 1, meta);
    }
}
exports.PasswordResetRequestedEvent = PasswordResetRequestedEvent;
