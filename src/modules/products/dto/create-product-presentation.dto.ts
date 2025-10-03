// src/modules/products/dto/create-product-presentation.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductPacking } from '@prisma/client';

export class CreateProductPresentationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  flavor?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  measurementQuantity: number;

  @ApiProperty({ enum: ProductPacking })
  @IsEnum(ProductPacking)
  packing: ProductPacking;
}
