// src/modules/categories/dto/paginated-category-response.dto.ts
import { CategoryResponseDto } from './category-response.dto';

export class PaginatedCategoryResponseDto {
  data: CategoryResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
