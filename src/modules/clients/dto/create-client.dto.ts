// create-client.dto.ts
import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClientDto {
  @IsString()
  @Type(() => String)
  userId: string;

  @IsString()
  @Type(() => String)
  branchId: string;
}
