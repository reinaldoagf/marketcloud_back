// src/pendings/pendings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginatedPendingResponseDto } from './dto/paginated-pending-response.dto';
import { CreatePendingDto } from './dto/create-pending.dto';

@Injectable()
export class PendingsService {
  constructor(private prisma: PrismaService) {}
  async getByFilters(
    businessId?: number | null,
    branchId?: number | null,
    page = 1,
    pageSize = 10,
    search = '',
    status = '',
    dateKey = 'createdAt',
    startDate = '',
    endDate = '',
  ): Promise<PaginatedPendingResponseDto> {
    const skip = (page - 1) * pageSize;

    const where: Prisma.PendingWhereInput = {};

    // 🔹 Filtro por businessId si existe
    if (businessId) {
      const branchFilter: Prisma.BusinessBranchWhereInput = {
        businessId: { equals: businessId },
      };
      where.branch = branchFilter;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { message: { contains: search } },
        { createdBy: { name: { contains: search } } },
        { createdBy: { email: { contains: search } } },
        { createdBy: { username: { contains: search } } },
        { createdBy: { dni: { contains: search } } },
        { linkedUser: { name: { contains: search } } },
        { linkedUser: { email: { contains: search } } },
        { linkedUser: { username: { contains: search } } },
        { linkedUser: { dni: { contains: search } } },
        { branch: { country: { contains: search } } },
        { branch: { state: { contains: search } } },
        { branch: { city: { contains: search } } },
        { branch: { address: { contains: search } } },
      ];
    }

    if (startDate && endDate) {
      where[dateKey] = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where[dateKey] = { gte: new Date(startDate) };
    } else if (endDate) {
      where[dateKey] = { lte: new Date(endDate) };
    }

    const [total, pendings] = await Promise.all([
      this.prisma.pending.count({ where }),
      this.prisma.pending.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
              avatar: true,
              createdAt: true,
              roleId: true,
              country: true,
              state: true,
              city: true,
              businessId: true,
            },
          },
          linkedUser: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
              avatar: true,
              createdAt: true,
              roleId: true,
              country: true,
              state: true,
              city: true,
              businessId: true,
            },
          },
          branch: {
            select: {
              id: true,
              country: true,
              state: true,
              city: true,
              address: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    // 🔹 Mapear resultados al DTO esperado
    const data = pendings.map((c) => ({
      id: c.id,
      title: c.title,
      message: c.message,
      eventDate: c.eventDate,
      createdBy: c.createdBy,
      linkedUser: c.linkedUser,
      branch: c.branch,
      createdAt: c.createdAt,
    }));

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async addPending(dto: CreatePendingDto) {
    // Crear el pendiente
    return this.prisma.pending.create({
      data: {
        title: dto.title,
        message: dto.message,
        createdById: dto.createdById,
        linkedUserId: dto.linkedUserId,
        businessId: dto.businessId,
        branchId: dto.branchId,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : null,
      },
    });
  }

  async deletePending(id: number) {
    // Verificar si existe antes de eliminar
    const client = await this.prisma.pending.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return this.prisma.pending.delete({
      where: { id },
    });
  }
}
