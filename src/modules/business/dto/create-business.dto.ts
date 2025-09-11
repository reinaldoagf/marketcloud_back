// src/business/dto/create-business.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  rif?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  ownerId: string; // llega como string, se convierte a number

  @IsOptional()
  @IsString()
  branches?: string; // llega como JSON string
}
