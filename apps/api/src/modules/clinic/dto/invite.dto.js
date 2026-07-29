"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptInviteDto = exports.InviteStaffDto = void 0;
class InviteStaffDto {
    email;
    role;
    branchId;
}
exports.InviteStaffDto = InviteStaffDto;
class AcceptInviteDto {
    token;
    firstName;
    lastName;
    password;
}
exports.AcceptInviteDto = AcceptInviteDto;
