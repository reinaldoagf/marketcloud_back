// src/modules/business/dto/paginated-business-response.dto.ts
import { BusinessResponseDto } from './business-response.dto';

export class PaginatedBusinessResponseDto {
  data: BusinessResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
