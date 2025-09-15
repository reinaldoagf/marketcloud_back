// src/modules/clients/dto/paginated-client-response.dto.ts
import { ClientResponseDto } from './client-response.dto';

export class PaginatedClientResponseDto {
  data: ClientResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
