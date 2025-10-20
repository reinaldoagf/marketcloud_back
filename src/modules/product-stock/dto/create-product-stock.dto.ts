import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductStockDto {
  @IsInt()
  @Min(0)
  units: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceByUnit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  availableQuantity?: number;

  @IsNumber()
  @Min(0)
  priceByMeasurement: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantityPerMeasure?: number;

  @IsNumber()
  @Min(0)
  totalSellingPrice: number;

  @IsNumber()
  @Min(0)
  purchasePricePerUnit: number;

  @IsNumber()
  @Min(0)
  profitPercentage: number;

  @IsNumber()
  @Min(0)
  returnOnInvestment: number;

  @IsOptional()
  @IsInt()
  productPresentationId?: number;

  @IsInt()
  productId: number;

  @IsInt()
  branchId: number;
}
