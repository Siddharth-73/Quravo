import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { paymentMethodEnum } from '@quravo/db';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'online_gateway'])
  @IsNotEmpty()
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'online_gateway';

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
