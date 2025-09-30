// create-pending.dto.ts
import { IsInt, IsString, IsNotEmpty, Length } from 'class-validator';
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
  @Type(() => Number) // 🔹 convierte automáticamente a número
  businessId: number;

  @IsInt()
  @Type(() => Number) // 🔹 convierte automáticamente a número
  branchId: number;
}
