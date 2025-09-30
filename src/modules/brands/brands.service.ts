// src/modules/brands/brands.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBrandDto } from './dto/create-brand.dto';
import { PaginatedBrandResponseDto } from './dto/paginated-brand-response.dto';

const SELECT_FIELDS = {
  id: true,
  name: true,
  createdAt: true,
};

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async getByFilters(
    page = 1,
    pageSize = 10,
    search = '',
    dateKey = 'createdAt',
    startDate = '',
    endDate = '',
  ): Promise<PaginatedBrandResponseDto> {
    const skip = (page - 1) * pageSize;

    // Construimos los filtros dinámicamente
    const where: Prisma.ProductBrandWhereInput = {};

    if (search) {
      where.OR = [{ name: { contains: search } }];
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
      this.prisma.productBrand.count({ where }),
      this.prisma.productBrand.findMany({
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

  async addBrand(dto: CreateBrandDto) {
    // Crear el colaborador
    return this.prisma.productBrand.create({
      data: {
        name: dto.name,
      },
    });
  }
  async deleteBrand(id: number) {
    // Verificar si existe antes de eliminar
    const brand = await this.prisma.productBrand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return this.prisma.productBrand.delete({
      where: { id },
    });
  }
}
