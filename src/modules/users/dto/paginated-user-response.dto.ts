// src/modules/users/dto/paginated-user-response.dto.ts
import { UserResponseDto } from './user-response.dto';

export class PaginatedUserResponseDto {
  data: UserResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
