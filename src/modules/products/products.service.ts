// src/modules/products/products.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedProductResponseDto } from './dto/paginated-product-response.dto';

const SELECT_FIELDS = {
  id: true,
  name: true,
  status: true,
  createdAt: true,
  brandId: true,
  categoryId: true,
  priceCalculation: true,
  itHasPresentations: true,
  unitMeasurement: true,
  brand: {
    select: { id: true, name: true, createdAt: true },
  },
  category: {
    select: { id: true, name: true, createdAt: true },
  },
  presentations: {
    select: {
      id: true,
      flavor: true,
      measurementQuantity: true,
      packing: true,
      createdAt: true,
    },
  },
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getByFilters(
    page = 1,
    pageSize = 10,
    search = '',
    status = '',
    dateKey = 'createdAt',
    startDate = '',
    endDate = '',
  ): Promise<PaginatedProductResponseDto> {
    const skip = (page - 1) * pageSize;

    // Construimos los filtros dinámicamente
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [{ name: { contains: search } }];
    }

    if (status) {
      where.status = status as any; // casteamos porque viene como string
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
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
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

  async addProduct(dto: CreateProductDto) {
    try {
      // Crear producto junto con presentaciones si vienen
      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          itHasPresentations: dto.itHasPresentations,
          unitMeasurement: dto.unitMeasurement,
          brandId: dto.brandId ?? null,
          categoryId: dto.categoryId ?? null,
          presentations:
            dto.itHasPresentations && dto.presentations?.length
              ? {
                  create: dto.presentations.map((p) => ({
                    flavor: p.flavor ?? null,
                    measurementQuantity: p.measurementQuantity ?? null,
                    packing: p.packing ?? null,
                  })),
                }
              : undefined,
        },
        include: {
          presentations: true,
        },
      });

      return product;
    } catch (err: any) {
      throw new BadRequestException(`Error creating product: ${err.message}`);
    }
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name ?? product.name,
        brandId: dto.brandId ?? product.brandId,
        categoryId: dto.categoryId ?? product.categoryId,
      },
    });
  }
  async deleteProduct(id: number) {
    // Verificar si existe antes de eliminar
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
