// create-client.dto.ts
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClientDto {
  @IsInt()
  @Type(() => Number) // 🔹 convierte automáticamente a número
  userId: number;

  @IsInt()
  @Type(() => Number) // 🔹 convierte automáticamente a número
  branchId: number;
}
