import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export class UpdateTenantConfigDto {
  @IsOptional()
  @IsEnum(['starter', 'growth', 'erp'])
  planTier?: 'starter' | 'growth' | 'erp';

  @IsOptional()
  @IsEnum(['active', 'suspended'])
  status?: 'active' | 'suspended';

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  accentColor?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  customDomain?: string;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
