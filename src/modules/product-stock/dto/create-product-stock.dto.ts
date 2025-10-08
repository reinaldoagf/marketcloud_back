import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductStockDto {
  @IsInt()
  @Min(0)
  units: number;

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

  @IsOptional()
  @IsInt()
  productId?: number;
}
