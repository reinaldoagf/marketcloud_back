// src/modules/products/dto/create-product-tag.dto.ts
import { IsString } from 'class-validator';

export class CreateProductTagDto {
  @IsString()
  tag: string;
}
