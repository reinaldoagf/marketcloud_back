// src/modules/brands/dto/paginated-brand-response.dto.ts
import { BrandResponseDto } from './brand-response.dto';

export class PaginatedBrandResponseDto {
  data: BrandResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
