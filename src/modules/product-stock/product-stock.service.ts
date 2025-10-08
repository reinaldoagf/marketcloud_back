import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductStockDto } from './dto/create-product-stock.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { PaginatedProductStockResponseDto } from './dto/paginated-product-stock-response.dto';

const SELECT_FIELDS = {
  id: true,
  units: true,
  totalSellingPrice: true,
  purchasePricePerUnit: true,
  profitPercentage: true,
  returnOnInvestment: true,
  productPresentationId: true,
  productPresentation: true,
  productId: true,
  product: true,
  createdAt: true,
};

@Injectable()
export class ProductStockService {
  constructor(private prisma: PrismaService) {}

  // ✅ Obtener por filtros
  async getByFilters(
    page = 1,
    pageSize = 10,
    search = '',
    dateKey = 'createdAt',
    startDate = '',
    endDate = '',
  ): Promise<PaginatedProductStockResponseDto> {
    const skip = (page - 1) * pageSize;

    // Construimos los filtros dinámicamente
    const where: Prisma.ProductStockWhereInput = {};

    if (search) {
      where.OR = [
        { product: { name: { contains: search } } },
        { productPresentation: { flavor: { contains: search } } },
      ];
    }

    if (startDate && endDate) {
      where[dateKey] = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where[dateKey] = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where[dateKey] = {
        lte: new Date(endDate),
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.productStock.count({ where }),
      this.prisma.productStock.findMany({
        where,
        select: SELECT_FIELDS,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // ✅ Crear nuevo registro
  async create(dto: CreateProductStockDto) {
    try {
      return await this.prisma.productStock.create({
        data: {
          units: dto.units,
          totalSellingPrice: dto.totalSellingPrice,
          purchasePricePerUnit: dto.purchasePricePerUnit,
          profitPercentage: dto.profitPercentage,
          returnOnInvestment: dto.returnOnInvestment,
          productPresentationId: dto.productPresentationId,
          productId: dto.productId,
        },
        include: {
          productPresentation: true,
          product: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Error creating product stock: ${error.message}`);
    }
  }

  // ✅ Actualizar registro
  async update(id: number, dto: UpdateProductStockDto) {
    const existing = await this.prisma.productStock.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`ProductStock with ID ${id} not found`);

    try {
      return await this.prisma.productStock.update({
        where: { id },
        data: {
          ...dto,
        },
        include: {
          productPresentation: true,
          product: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Error updating product stock: ${error.message}`);
    }
  }

  // ✅ Eliminar registro
  async remove(id: number) {
    const existing = await this.prisma.productStock.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`ProductStock with ID ${id} not found`);

    await this.prisma.productStock.delete({ where: { id } });
    return { message: `ProductStock with ID ${id} deleted successfully` };
  }
}
