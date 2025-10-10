// dto/product-response.dto.ts
import { ProductStatus, ProductPacking, UnitMeasurement, PriceCalculation } from '@prisma/client';
import { BrandResponseDto } from '../../brands/dto/brand-response.dto';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
import { BusinessResponseDto } from '../../business/dto/business-response.dto';

export class ProductTagDto {
  id: number;
  tag: string;
  createdAt: Date;
}

export class ProductPresentationDto {
  id: number;
  flavor?: string | null;
  measurementQuantity: number;
  packing: ProductPacking;
  createdAt: Date;
}

export class ProductResponseDto {
  id: number;
  name: string;
  status: ProductStatus;
  priceCalculation: PriceCalculation | null;
  unitMeasurement: UnitMeasurement | null;
  brandId?: number | null;
  brand?: BrandResponseDto | null;
  categoryId?: number | null;
  category?: CategoryResponseDto | null;
  businessId?: number | null;
  business?: BusinessResponseDto | null;
  tags?: ProductTagDto[];
  presentations?: ProductPresentationDto[];
  createdAt: Date;
}
