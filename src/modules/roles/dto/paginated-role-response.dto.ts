import { RoleResponseDto } from './role-response.dto';

export class PaginatedRoleResponseDto {
  data: RoleResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
