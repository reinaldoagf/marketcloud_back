// dto/business-branch-purchase-response.dto.ts
import { PurchaseStatus } from '@prisma/client';

export class BusinessBranchPurchaseResponseDto {
  id: number;
  clientName?: string | null;
  clientDNI?: string | null;
  userId?: number | null;
  businessId: number;
  branchId: number;
  amountCancelled: number;
  totalAmount: number;
  status: PurchaseStatus;
  createdAt: Date;

  // Relaciones
  branch?: {
    id: number;
    address: string;
  };

  business?: {
    id: number;
    name: string;
  };

  user?: {
    id: number;
    name: string;
    email: string;
  } | null;

  purchases?: {
    id: number;
    productId: number;
    productPresentationId?: number | null;
    unitsOrMeasures: number;
    price: number;
    createdAt: Date;
    product?: { id: number; name: string };
    productPresentation?: { id: number; measurementQuantity: number; packing: string | null; flavor?: string | null } | null;
  }[];
}
