// src/business-branch-purchase/business-branch-purchase.controller.ts
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  Patch,
} from '@nestjs/common';
import { CreateBusinessBranchPurchaseDto } from './dto/create-business-branch-purchase.dto';
import { PaginatedBusinessBranchPurchaseResponseDto } from './dto/paginated-business-branch-purchase-response.dto';
import { BusinessBranchPurchaseService } from './business-branch-purchase.service';
import { UpdateBusinessBranchPurchaseDto } from './dto/update-business-branch-purchase.dto';

@Controller('business-branch-purchase')
export class BusinessBranchPurchaseController {
  constructor(private readonly service: BusinessBranchPurchaseService) {}

  @Post()
  create(@Body() dto: CreateBusinessBranchPurchaseDto) {
    return this.service.create(dto);
  }

  @Get()
  getByFilters(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('branchId', ParseIntPipe) branchId: number,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('search') search = '',
    @Query('status') status = '',
    @Query('dateKey') dateKey = 'createdAt',
    @Query('startDate') startDate = '',
    @Query('endDate') endDate = '',
  ): Promise<PaginatedBusinessBranchPurchaseResponseDto> {
    return this.service.getByFilters(
      userId,
      branchId,
      +page,
      +pageSize,
      search,
      status,
      dateKey,
      startDate,
      endDate,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteById(id);
  }
  // 📊 Obtener resumen de compras por usuario
  @Get('summary')
  async getPurchaseSummary(@Query('userId', ParseIntPipe) userId: number) {
    return this.service.getPurchaseSummaryByUser(userId);
  }
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBusinessBranchPurchaseDto,
  ) {
    return this.service.update(id, dto);
  }
}
