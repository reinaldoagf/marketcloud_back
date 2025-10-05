import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';
import { PermissionType } from '@prisma/client';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pages?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(PermissionType, { each: true })
  permissions?: PermissionType[];
}
