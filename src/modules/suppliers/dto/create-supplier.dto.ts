// create-supplier.dto.ts
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSupplierDto {
  @IsString()
  @Type(() => String)
  userId: string;

  @IsString()
  @Type(() => String)
  branchId: string;
}
