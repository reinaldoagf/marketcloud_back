// create-pending.dto.ts
import { IsInt, IsString, IsNotEmpty, Length, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePendingDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50, { message: 'El título debe tener entre 3 y 50 caracteres' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50, { message: 'El mensaje debe tener entre 3 y 50 caracteres' })
  message: string;

  @IsInt()
  @Type(() => Number)
  businessId: number;

  @IsInt()
  @Type(() => Number)
  branchId: number;

  @IsInt()
  @Type(() => Number)
  createdById: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  linkedUserId: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  eventDate?: Date;
}
