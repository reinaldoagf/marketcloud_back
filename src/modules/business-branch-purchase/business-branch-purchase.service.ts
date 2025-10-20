import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBusinessBranchPurchaseDto } from './dto/create-business-branch-purchase.dto';
import { PaginatedBusinessBranchPurchaseResponseDto } from './dto/paginated-business-branch-purchase-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BusinessBranchPurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly SELECT_FIELDS = {
    id: true,
    clientName: true,
    clientDNI: true,
    userId: true,
    businessId: true,
    branchId: true,
    amountCancelled: true,
    totalAmount: true,
    status: true,
    createdAt: true,
    branch: { select: { id: true, address: true } },
    business: { select: { id: true, name: true } },
    user: { select: { id: true, name: true, email: true, avatar: true } },
    purchases: {
      select: {
        id: true,
        productId: true,
        productPresentationId: true,
        unitsOrMeasures: true,
        price: true,
        createdAt: true,
        product: { select: { id: true, name: true } },
        productPresentation: { select: { id: true, measurementQuantity: true, flavor: true, packing: true } },
      },
    },
  };

  async create(dto: CreateBusinessBranchPurchaseDto) {
    const branch = await this.prisma.businessBranch.findUnique({ where: { id: dto.branchId } });
    if (!branch) throw new NotFoundException(`Branch with ID ${dto.branchId} not found`);

    const business = await this.prisma.business.findUnique({ where: { id: dto.businessId } });
    if (!business) throw new NotFoundException(`Business with ID ${dto.businessId} not found`);

    if (!dto.purchases || dto.purchases.length === 0) {
      throw new BadRequestException('At least one purchase item is required.');
    }

    // Crear la compra con sus detalles
    return this.prisma.businessBranchPurchase.create({
      data: {
        clientName: dto.clientName,
        clientDNI: dto.clientDNI,
        userId: dto.userId,
        businessId: dto.businessId,
        branchId: dto.branchId,
        amountCancelled: dto.amountCancelled,
        totalAmount: dto.totalAmount,
        status: dto.amountCancelled === dto.totalAmount ? 'pagado' : dto.status,
        purchases: {
          create: dto.purchases.map((item) => ({
            productId: item.productId,
            productPresentationId: item.productPresentationId ?? null,
            unitsOrMeasures: item.unitsOrMeasures,
            price: item.price,
          })),
        },
      },
      select: this.SELECT_FIELDS,
    });
  }

  async getByFilters(
    branchId: number,
    page = 1,
    pageSize = 10,
    search = '',
    status = '',
    dateKey = 'createdAt',
    startDate = '',
    endDate = '',
  ): Promise<PaginatedBusinessBranchPurchaseResponseDto> {
    const skip = (page - 1) * pageSize;
    const where: Prisma.BusinessBranchPurchaseWhereInput = {};

    if (branchId) {
      const branch = await this.prisma.businessBranch.findUnique({ where: { id: branchId } });
      if (!branch) throw new NotFoundException(`Branch with ID ${branchId} not found`);
      where.branchId = branchId;
    }

    if (search) {
      where.OR = [
        { clientName: { contains: search } },
        { clientDNI: { contains: search } },
      ];
    }

    if (status && status !== 'Todos') {
      where.status = status as any; // casteamos porque viene como string
    }

    if (startDate && endDate) {
      where[dateKey] = { gte: new Date(startDate), lte: new Date(endDate) };
    } else if (startDate) {
      where[dateKey] = { gte: new Date(startDate) };
    } else if (endDate) {
      where[dateKey] = { lte: new Date(endDate) };
    }

    const [total, data] = await Promise.all([
      this.prisma.businessBranchPurchase.count({ where }),
      this.prisma.businessBranchPurchase.findMany({
        where,
        select: this.SELECT_FIELDS,
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

  async deleteById(id: number) {
    const existing = await this.prisma.businessBranchPurchase.findUnique({
      where: { id },
      include: { purchases: true },
    });

    if (!existing) throw new NotFoundException(`Purchase with ID ${id} not found`);

    // Eliminar primero los registros hijos (purchases)
    await this.prisma.purchase.deleteMany({ where: { businessBranchPurchaseId: id } });

    await this.prisma.businessBranchPurchase.delete({ where: { id } });

    return { message: `Purchase ${id} and its items were deleted successfully.` };
  }
}
