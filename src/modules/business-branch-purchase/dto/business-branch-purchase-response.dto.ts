// dto/business-branch-purchase-response.dto.ts
import { PurchaseStatus } from '@prisma/client';

export class BusinessBranchPurchaseResponseDto {
  id: string;
  clientName?: string | null;
  clientDNI?: string | null;
  userId?: string | null;
  businessId: string | null;
  branchId: string;
  amountCancelled: number;
  totalAmount: number;
  status: PurchaseStatus;
  createdAt: Date;

  // Relaciones
  branch?: {
    id: string;
    address: string;
  } | null;

  business?: {
    id: string;
    name: string;
  } | null;

  user?: {
    id: string;
    name: string;
    email: string;
  } | null;

  purchases?: {
    id: string;
    productId: string;
    productPresentationId?: string | null;
    unitsOrMeasures: number;
    price: number;
    createdAt: Date;
    product?: { id: string; name: string };
    productPresentation?: { id: string; measurementQuantity: number; packing: string | null; flavor?: string | null } | null;
  }[];
}
