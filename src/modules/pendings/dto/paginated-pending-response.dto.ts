// src/modules/pendings/dto/paginated-pending-response.dto.ts
import { PendingResponseDto } from './pending-response.dto';

export class PaginatedPendingResponseDto {
  data: PendingResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
