"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientKeys = void 0;
exports.patientKeys = {
    all: ['patients'],
    lists: () => [...exports.patientKeys.all, 'list'],
    list: (filters) => [...exports.patientKeys.lists(), filters],
    details: () => [...exports.patientKeys.all, 'detail'],
    detail: (id) => [...exports.patientKeys.details(), id],
    search: (query) => [...exports.patientKeys.all, 'search', query],
    timeline: (id) => [...exports.patientKeys.all, 'timeline', id],
    attachments: (id) => [...exports.patientKeys.all, 'attachments', id],
};
