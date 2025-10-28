// src/modules/brands/brands.controller.ts
import { Controller, Get, Post, Put, Body, Query, ParseIntPipe, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginatedBrandResponseDto } from './dto/paginated-brand-response.dto';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly service: BrandsService) {}

  @Get('/')
  async getByFilters(
    @Query('page', ParseIntPipe) page = '1',
    @Query('size', ParseIntPipe) pageSize = '10',
    @Query('search') search = '',
    @Query('dateKey') dateKey = '',
    @Query('startDate') startDate = '',
    @Query('endDate') endDate = '',
  ): Promise<PaginatedBrandResponseDto> {
    return this.service.getByFilters(
      Number(page),
      Number(pageSize),
      search,
      dateKey,
      startDate,
      endDate,
    );
  }
  @Post()
  async create(@Body() dto: CreateBrandDto) {
    return this.service.addBrand(dto);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.service.updateBrand(id, dto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.deleteBrand(id);
  }
}
