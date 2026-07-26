export class CreateBranchDto {
  name!: string;
  code?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isMain?: boolean;
}

export class UpdateWorkingHoursDto {
  hours!: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
}
