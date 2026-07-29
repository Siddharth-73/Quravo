"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentCancelledEvent = exports.AppointmentStatusChangedEvent = exports.AppointmentScheduledEvent = void 0;
const domain_event_1 = require("./domain-event");
class AppointmentScheduledEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('appointment.scheduled', data.tenantId, data.appointmentId, data, 1, meta);
    }
}
exports.AppointmentScheduledEvent = AppointmentScheduledEvent;
class AppointmentStatusChangedEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('appointment.status_changed', data.tenantId, data.appointmentId, data, 1, meta);
    }
}
exports.AppointmentStatusChangedEvent = AppointmentStatusChangedEvent;
class AppointmentCancelledEvent extends domain_event_1.DomainEvent {
    constructor(data, meta) {
        super('appointment.cancelled', data.tenantId, data.appointmentId, data, 1, meta);
    }
}
exports.AppointmentCancelledEvent = AppointmentCancelledEvent;
