// create-pending.dto.ts
import { IsString, IsNotEmpty, Length, IsOptional, IsDate } from 'class-validator';
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

  @IsString()
  @Type(() => String)
  businessId: string;

  @IsString()
  @Type(() => String)
  branchId: string;

  @IsString()
  @Type(() => String)
  createdById: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  linkedUserId: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  eventDate?: Date;
}
