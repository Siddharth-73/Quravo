import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateClinicListingDto {
  @IsString()
  @IsNotEmpty()
  clinicName!: string;

  @IsString()
  @IsNotEmpty()
  ownerName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsString()
  @IsOptional()
  estimatedMonthlyPatients?: string;

  @IsString()
  @IsOptional()
  additionalNotes?: string;
}
