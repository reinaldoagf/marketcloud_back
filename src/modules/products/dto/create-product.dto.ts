import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UnitMeasurement, ProductStatus, PriceCalculation } from '@prisma/client';
import { CreateProductTagDto } from './create-product-tag.dto';
import { CreateProductPresentationDto } from './create-product-presentation.dto';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  priceCalculation: PriceCalculation;

  @ApiProperty({ enum: UnitMeasurement })
  @IsEnum(UnitMeasurement)
  unitMeasurement: UnitMeasurement;

  @ApiProperty({ enum: ProductStatus })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  brandId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  branchId?: number;

  @ApiPropertyOptional({ type: [CreateProductTagDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductTagDto)
  tags?: CreateProductTagDto[];

  @ApiPropertyOptional({ type: [CreateProductPresentationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductPresentationDto)
  presentations?: CreateProductPresentationDto[];
}
