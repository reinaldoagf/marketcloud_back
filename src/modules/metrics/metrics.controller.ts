import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private service: MetricsService) {}

  @Get('purchases-by-category')
  async getPurchasesByCategory(
    @Query('businessId', ParseIntPipe) businessId = null,
    @Query('branchId', ParseIntPipe) branchId = null,
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.service.getPurchasesByCategory(
      businessId,
      branchId,
      Number(userId),
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
      businessId ? Number(businessId) : undefined,
      branchId ? Number(branchId) : undefined,
    );
  }
}
