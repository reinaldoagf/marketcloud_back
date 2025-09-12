// src/modules/users/dto/paginated-user-response.dto.ts
import { CollaboratorResponseDto } from './collaborator-response.dto';

export class PaginatedCollaboratorResponseDto {
  data: CollaboratorResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
