// dto/product-response.dto.ts
import { ProductStatus } from '@prisma/client';

export class ProductResponseDto {
  id: number;
  name: string;
  status: ProductStatus;
  createdAt: Date;
}
