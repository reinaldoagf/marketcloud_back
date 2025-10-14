// dto/product-stock-response.dto.ts
import { ProductResponseDto } from '../../products/dto/product-response.dto';
import { ProductPresentationDto } from '../../products/dto/product-response.dto';

export class ProductStockResponseDto {
  id: number;
  units: number;
  priceByMeasurement: number;
  quantityPerMeasure: number | null;
  totalSellingPrice: number;
  purchasePricePerUnit: number;
  profitPercentage: number;
  returnOnInvestment: number;
  productPresentationId?: number | null;
  productPresentation?: ProductPresentationDto | null;
  productId: number | null;
  product: ProductResponseDto | null;
  branchId: number;
  branch: {
    id: number;
    country: string;
    state: string;
    city: string;
    address: string;
  };
  createdAt: Date;
}
