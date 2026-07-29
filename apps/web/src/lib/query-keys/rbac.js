"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbacKeys = void 0;
exports.rbacKeys = {
    all: ['rbac'],
    modules: () => [...exports.rbacKeys.all, 'modules'],
    roles: () => [...exports.rbacKeys.all, 'roles'],
};
