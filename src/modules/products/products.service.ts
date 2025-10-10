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
  businessId: true,
  priceCalculation: true,
  unitMeasurement: true,
  brand: {
    select: { id: true, name: true, createdAt: true },
  },
  category: {
    select: { id: true, name: true, createdAt: true },
  },
  business: {
    select: { id: true, name: true, rif: true, createdAt: true },
  },
  stocks: {
    select: {
      id: true,
      units: true,
      totalSellingPrice: true,
      purchasePricePerUnit: true,
      profitPercentage: true,
      returnOnInvestment: true,
      productPresentationId: true,
      createdAt: true,
    },
  },
  tags: {
    select: {
      id: true,
      tag: true,
      createdAt: true,
    },
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

    if (status && status !== 'Todos') {
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

  // ✅ Buscar uno por ID
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: SELECT_FIELDS,
    });

    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async addProduct(dto: CreateProductDto) {
    try {
      // Crear producto junto con presentaciones si vienen
      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          priceCalculation: dto.priceCalculation ?? 'presentation',
          unitMeasurement: dto.unitMeasurement,
          brandId: dto.brandId ?? null,
          categoryId: dto.categoryId ?? null,
          status: dto.status ?? null,
          tags: dto.tags?.length
            ? {
                create: dto.tags.map((p) => ({ tag: p.tag ?? null })),
              }
            : undefined,
          presentations:
            dto.priceCalculation == 'presentation' && dto.presentations?.length
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
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          name: dto.name,
          priceCalculation: dto.priceCalculation ?? 'presentation',
          unitMeasurement: dto.unitMeasurement,
          brandId: dto.brandId ?? null,
          categoryId: dto.categoryId ?? null,
          status: dto.status ?? 'active',
          tags: {
            // Borra las anteriores y crea las nuevas
            deleteMany: {},
            create:
              dto.tags?.map((p) => ({
                tag: p.tag ?? null,
              })) || [],
          },

          // 🔹 Manejo de presentaciones
          presentations: dto.priceCalculation == 'presentation' 
          ? {
                // Borra las anteriores y crea las nuevas
                deleteMany: {},
                create:
                  dto.presentations?.map((p) => ({
                    flavor: p.flavor ?? null,
                    measurementQuantity: p.measurementQuantity ?? null,
                    packing: p.packing ?? null,
                  })) || [],
              }
            : {
                // Si ya no tiene presentaciones, las eliminamos
                deleteMany: {},
              },
        },
        include: {
          presentations: true,
        },
      });

      return product;
    } catch (err: any) {
      throw new BadRequestException(`Error updating product: ${err.message}`);
    }
  }

  async deleteProduct(id: number) {
    // Verificar si existe antes de eliminar
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // 🔹 Buscar todos los branches asociados al negocio
    const tags = await this.prisma.productTag.findMany({
      where: { productId: id },
      select: { id: true },
    });
    const tagsIds = tags.map((b) => b.id);
    // 🔹 Si existen dependencias (ejemplo: pendings ligados a branchId), borrarlas primero
    if (tagsIds.length > 0) {
      await this.prisma.productTag.deleteMany({
        where: { productId: { in: tagsIds } },
      });
    }

    // 🔹 Buscar todos los branches asociados al negocio
    const presentations = await this.prisma.productPresentation.findMany({
      where: { productId: id },
      select: { id: true },
    });

    const presentationsIds = presentations.map((b) => b.id);

    // 🔹 Si existen dependencias (ejemplo: pendings ligados a branchId), borrarlas primero
    if (presentationsIds.length > 0) {
      await this.prisma.productPresentation.deleteMany({
        where: { productId: { in: presentationsIds } },
      });
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
