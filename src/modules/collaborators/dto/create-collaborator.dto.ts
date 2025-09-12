// create-collaborator.dto.ts
import { IsInt, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCollaboratorDto {
  @IsInt()
  @Type(() => Number) // 🔹 convierte automáticamente a número
  userId: number;

  @IsInt()
  @Type(() => Number) // 🔹 convierte automáticamente a número
  branchId: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean) // 🔹 convierte automáticamente a boolean
  isAdmin?: boolean;
}
