"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditKeys = void 0;
exports.auditKeys = {
    all: ['audit'],
    lists: () => [...exports.auditKeys.all, 'list'],
    list: (filters) => [...exports.auditKeys.lists(), filters],
};
