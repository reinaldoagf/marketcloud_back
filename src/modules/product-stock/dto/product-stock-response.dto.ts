// dto/product-stock-response.dto.ts
import { ProductResponseDto } from '../../products/dto/product-response.dto';
import { ProductPresentationDto } from '../../products/dto/product-response.dto';

export class ProductStockResponseDto {
  id: number;
  units: number;
  totalSellingPrice: number;
  purchasePricePerUnit: number;
  profitPercentage: number;
  returnOnInvestment: number;
  productPresentationId?: number | null;
  productPresentation?: ProductPresentationDto | null;
  productId: number | null;
  product: ProductResponseDto | null;
  createdAt: Date;
}
