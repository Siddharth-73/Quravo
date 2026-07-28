import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class ProvisionTenantDto {
  @IsString()
  @IsNotEmpty()
  clinicName!: string;

  @IsString()
  @IsNotEmpty()
  clinicSlug!: string;

  @IsEnum(['starter', 'growth', 'erp'])
  planTier!: 'starter' | 'growth' | 'erp';

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;
}
