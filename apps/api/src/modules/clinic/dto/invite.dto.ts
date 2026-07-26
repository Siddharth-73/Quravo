export class InviteStaffDto {
  email!: string;
  role!: string;
  branchId?: string;
}

export class AcceptInviteDto {
  token!: string;
  firstName!: string;
  lastName!: string;
  password!: string;
}
