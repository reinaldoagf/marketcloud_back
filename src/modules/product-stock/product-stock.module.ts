import { Module } from '@nestjs/common';
import { ProductStockService } from './product-stock.service';
import { ProductStockController } from './product-stock.controller';

@Module({
  controllers: [ProductStockController],
  providers: [ProductStockService],
})
export class ProductStockModule {}
