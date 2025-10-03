import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UnitMeasurement } from '@prisma/client';
import { CreateProductPresentationDto } from './create-product-presentation.dto';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  itHasPresentations: boolean;

  @ApiProperty({ enum: UnitMeasurement })
  @IsEnum(UnitMeasurement)
  unitMeasurement: UnitMeasurement;

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

  @ApiPropertyOptional({ type: [CreateProductPresentationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductPresentationDto)
  presentations?: CreateProductPresentationDto[];
}
