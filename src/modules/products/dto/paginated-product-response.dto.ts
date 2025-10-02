// src/modules/products/dto/paginated-product-response.dto.ts
import { ProductResponseDto } from './product-response.dto';

export class PaginatedProductResponseDto {
  data: ProductResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
