// src/modules/business-branch-purchase/dto/paginated-business-branch-purchase-response.dto.ts
import { BusinessBranchPurchaseResponseDto } from './business-branch-purchase-response.dto';

export class PaginatedBusinessBranchPurchaseResponseDto {
  data: BusinessBranchPurchaseResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
