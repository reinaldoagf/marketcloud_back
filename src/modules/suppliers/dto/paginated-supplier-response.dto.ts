// src/modules/suppliers/dto/paginated-supplier-response.dto.ts
import { SupplierResponseDto } from './supplier-response.dto';

export class PaginatedSupplierResponseDto {
  data: SupplierResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
