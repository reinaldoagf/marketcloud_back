import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getPurchasesByCategory(
    businessId?: number | null,
    branchId?: number | null,
    userId?: number | null,
    startDate?: string,
    endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    // 🔹 Construimos filtros dinámicos para mayor flexibilidad
    const where: any = {
      createdAt: {},
      businessBranchPurchase: {},
    };

    // Filtro por fechas
    if (start) where.createdAt.gte = start;
    if (end) where.createdAt.lte = end;

    // Filtros opcionales
    if (userId) where.businessBranchPurchase.userId = userId;
    if (businessId) where.businessBranchPurchase.businessId = businessId;
    if (branchId) where.businessBranchPurchase.branchId = branchId;

    // Eliminamos propiedades vacías si no se usaron
    if (!Object.keys(where.createdAt).length) delete where.createdAt;
    if (!Object.keys(where.businessBranchPurchase).length) delete where.businessBranchPurchase;

    // 1️⃣ Obtener todas las compras del usuario (con filtros aplicados)
    const purchases = await this.prisma.purchase.findMany({
      where,
      select: {
        price: true,
        unitsOrMeasures: true,
        createdAt: true,
        product: {
          select: {
            category: { select: { name: true } },
          },
        },
      },
    });

    // 2️⃣ Agrupamos por mes y categoría
    const grouped: Record<string, Record<string, number>> = {};

    purchases.forEach((purchase) => {
      const month = purchase.createdAt.toLocaleString('es-ES', { month: 'long' });
      const category = purchase.product?.category?.name ?? 'Sin categoría';
      const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

      if (!grouped[monthCapitalized]) grouped[monthCapitalized] = {};
      if (!grouped[monthCapitalized][category]) grouped[monthCapitalized][category] = 0;

      grouped[monthCapitalized][category] += (purchase.unitsOrMeasures * purchase.price);
    });

    // 3️⃣ Formateamos el resultado para el frontend
    const result = Object.entries(grouped).map(([month, categories]) => ({
      month,
      categories: Object.entries(categories).map(([category, total]) => ({
        category,
        total,
      })),
    }));

    return result;
  }
}
