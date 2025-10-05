// src/business/business.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginatedBusinessResponseDto } from './dto/paginated-business-response.dto';

interface CreateBusinessInput {
  name: string;
  rif?: string;
  description?: string;
  ownerId: number;
  branches: { country: string; state: string; city: string; address: string; phone: string }[];
  logo?: string | null;
}

const SELECT_FIELDS = {
  id: true,
  rif: true,
  name: true,
  logo: true,
  description: true,
  branches: true,
  subscriptionPlan: true,
  subscriptionDate: true,
  expirationDate: true,
  createdAt: true,
};

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async getByFilters(
    page = 1,
    pageSize = 10,
    search = '',
    dateKey = 'createdAt',
    startDate = '',
    endDate = '',
  ): Promise<PaginatedBusinessResponseDto> {
    const skip = (page - 1) * pageSize;

    // Construimos los filtros dinámicamente
    const where: Prisma.BusinessWhereInput = {};

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
      this.prisma.business.count({ where }),
      this.prisma.business.findMany({
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

  async create(input: CreateBusinessInput) {
    const owner = await this.prisma.user.findUnique({
      where: { id: input.ownerId },
    });

    if (!owner) {
      throw new NotFoundException(`Owner with id ${input.ownerId} not found`);
    }

    // 🚨 Ajusta estos valores si deseas manejar planes de suscripción por defecto
    const expiredDate = new Date();
    expiredDate.setMonth(expiredDate.getMonth() + 1);

    try {
      return await this.prisma.business.create({
        data: {
          name: input.name,
          rif: input.rif,
          description: input.description || '',
          logo: input.logo,
          ownerId: input.ownerId,
          subscriptionDate: new Date(),
          expirationDate: expiredDate,
          branches: {
            create: input.branches.map((b) => ({
              country: b.country,
              state: b.state,
              city: b.city,
              address: b.address,
              phone: b.phone,
            })),
          },
        },
        include: {
          branches: true,
          owner: true,
        },
      });
    } catch (err: any) {
      throw new BadRequestException(`Error creating business: ${err.message}`);
    }
  }

  async delete(id: number) {
    // Verificar si existe antes de eliminar
    const business = await this.prisma.business.findUnique({ where: { id } });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    // 🔹 Buscar todos los branches asociados al negocio
    const branches = await this.prisma.businessBranch.findMany({
      where: { businessId: id },
      select: { id: true },
    });

    const branchIds = branches.map((b) => b.id);

    // 🔹 Si existen dependencias (ejemplo: pendings ligados a branchId), borrarlas primero
    if (branchIds.length > 0) {
      await this.prisma.pending.deleteMany({
        where: { branchId: { in: branchIds } },
      });
    }

    // 🔹 Luego borrar los branches
    await this.prisma.businessBranch.deleteMany({
      where: { businessId: id },
    });

    // 🔹 Finalmente borrar el business
    return this.prisma.business.delete({
      where: { id },
    });
  }
}
