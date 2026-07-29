import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRazorpayOrderDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId!: string;
}

export class VerifyRazorpayPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayOrderId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayPaymentId!: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature!: string;
}
