import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductStockService } from './product-stock.service';
import { CreateProductStockDto } from './dto/create-product-stock.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { PaginatedProductStockResponseDto } from './dto/paginated-product-stock-response.dto';

@Controller('product-stock')
export class ProductStockController {
  constructor(private readonly service: ProductStockService) {}

  @Post()
  create(@Body() dto: CreateProductStockDto) {
    return this.service.create(dto);
  }

  @Get('/')
  async getByFilters(
    @Query('page', ParseIntPipe) page = '1',
    @Query('size', ParseIntPipe) pageSize = '10',
    @Query('search') search = '',
    @Query('dateKey') dateKey = '',
    @Query('startDate') startDate = '',
    @Query('endDate') endDate = '',
  ): Promise<PaginatedProductStockResponseDto> {
    return this.service.getByFilters(
      Number(page),
      Number(pageSize),
      search,
      dateKey,
      startDate,
      endDate,
    );
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductStockDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
