// src/clients/clients.controller.ts
import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PaginatedClientResponseDto } from './dto/paginated-client-response.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}
  @Get('/')
  async getByFilters(
    @Query('businessId', ParseIntPipe) businessId = null,
    @Query('page', ParseIntPipe) page = '1',
    @Query('size', ParseIntPipe) pageSize = '10',
    @Query('search') search = '',
    @Query('status') status = '',
    @Query('dateKey') dateKey = '',
    @Query('startDate') startDate = '',
    @Query('endDate') endDate = '',
  ): Promise<PaginatedClientResponseDto> {
    return this.service.getByFilters(
      businessId,
      Number(page),
      Number(pageSize),
      search,
      status,
      dateKey,
      startDate,
      endDate,
    );
  }
}
