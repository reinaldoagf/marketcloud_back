import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('purchases-by-category')
  async getPurchasesByCategory(
    @Query('businessId', ParseIntPipe) businessId = null,
    @Query('branchId', ParseIntPipe) branchId = null,
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.metricsService.getPurchasesByCategory(
      businessId,
      branchId,
      Number(userId),
      startDate,
      endDate,
    );
  }
}
