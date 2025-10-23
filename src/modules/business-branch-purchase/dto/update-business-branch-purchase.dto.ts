// src/auth/dto/update-auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateBusinessBranchPurchaseDto {
  @ApiProperty({ required: false })
  @IsNumber()
  amountCancelled: number;
}
