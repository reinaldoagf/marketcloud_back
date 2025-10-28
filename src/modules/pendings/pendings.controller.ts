// src/pendings/pendings.controller.ts
import { Controller, Get, Post, Body, Query, ParseIntPipe, Delete, Param } from '@nestjs/common';
import { PendingsService } from './pendings.service';
import { CreatePendingDto } from './dto/create-pending.dto';
import { PaginatedPendingResponseDto } from './dto/paginated-pending-response.dto';

@Controller('pendings')
export class PendingsController {
  constructor(private readonly service: PendingsService) {}
  @Get('/')
  async getByFilters(
    @Query('businessId') businessId: string = '',
    @Query('branchId') branchId: string = '',
    @Query('page', ParseIntPipe) page = '1',
    @Query('size', ParseIntPipe) pageSize = '10',
    @Query('search') search = '',
    @Query('status') status = '',
    @Query('dateKey') dateKey = '',
    @Query('startDate') startDate = '',
    @Query('endDate') endDate = '',
  ): Promise<PaginatedPendingResponseDto> {
    return this.service.getByFilters(
      businessId,
      branchId,
      Number(page),
      Number(pageSize),
      search,
      status,
      dateKey,
      startDate,
      endDate,
    );
  }
  @Post()
  async create(@Body() dto: CreatePendingDto) {
    return this.service.addPending(dto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.deletePending(id);
  }
}
