import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private service: MetricsService) {}

  @Get('purchases-by-category')
  async getPurchasesByCategory(
    @Query('businessId') businessId: string = '',
    @Query('branchId') branchId: string = '',
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.service.getPurchasesByCategory(
      businessId,
      branchId,
      userId,
      startDate,
      endDate,
    );
  }

  @Get('investments-by-category')
  async getInvestmentsByCategory(
    @Query('businessId') businessId?: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.service.getInvestmentsByCategory(
      businessId ? businessId : '',
      branchId ? branchId : '',
    );
  }
}
