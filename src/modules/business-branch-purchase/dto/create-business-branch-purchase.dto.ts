// src/business-branch-purchase/dto/create-business-branch-purchase.dto.ts

import {
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseStatus } from '@prisma/client';

class PurchaseItemDto {
  @IsInt()
  productId: number;

  @IsOptional()
  @IsInt()
  productPresentationId?: number | null;

  @IsInt()
  units: number;

  @IsNumber()
  price: number;
}

export class CreateBusinessBranchPurchaseDto {
  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  clientCi?: string;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsInt()
  businessId: number;

  @IsInt()
  branchId: number;

  @IsNumber()
  amount: number;

  @IsEnum(PurchaseStatus)
  status: PurchaseStatus;

  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  @ArrayMinSize(1)
  purchases: PurchaseItemDto[];
}
