"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportKeys = void 0;
exports.exportKeys = {
    all: ['export'],
    status: (exportId) => [...exports.exportKeys.all, 'status', exportId],
};
