"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinicKeys = void 0;
exports.clinicKeys = {
    all: ['clinic'],
    branches: () => [...exports.clinicKeys.all, 'branches'],
    branchHours: (branchId) => [...exports.clinicKeys.branches(), branchId, 'hours'],
    staff: () => [...exports.clinicKeys.all, 'staff'],
};
