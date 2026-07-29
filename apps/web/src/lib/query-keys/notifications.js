"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationKeys = void 0;
exports.notificationKeys = {
    all: ['notifications'],
    list: (filters) => [...exports.notificationKeys.all, 'list', filters],
    unreadCount: () => [...exports.notificationKeys.all, 'unread-count'],
};
