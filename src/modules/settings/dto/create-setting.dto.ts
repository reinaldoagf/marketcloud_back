import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSettingDto {
  @ApiProperty()
  @IsString()
  key: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  floatValue?: number;

  @IsOptional()
  @IsString()
  @Min(0)
  stringValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Type(() => String)
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Type(() => String)
  businessId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Type(() => String)
  branchId?: string;
}
