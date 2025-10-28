import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getPurchasesByCategory(
    businessId?: string | null,
    branchId?: string | null,
    userId?: string | null,
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
    if (userId?.length) where.businessBranchPurchase.userId = userId;
    if (businessId) where.businessBranchPurchase.businessId = businessId;
    if (branchId?.length) where.businessBranchPurchase.branchId = branchId;

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

      grouped[monthCapitalized][category] += purchase.unitsOrMeasures * purchase.price;
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

  async getInvestmentsByCategory(businessId?: string, branchId?: string) {
    // 1️⃣ Obtener todos los stocks con su producto y categoría
    const stocks = await this.prisma.productStock.findMany({
      where: {
        branch: branchId ? { id: branchId, businessId } : { businessId }, // si hay branchId, filtramos ambos
      },
      select: {
        branchId: true,
        availableQuantity: true,
        priceByUnit: true,
        priceByMeasurement: true,
        quantityPerMeasure: true,
        totalSellingPrice: true,
        purchasePricePerUnit: true,
        product: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            priceCalculation: true,
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    // 2️⃣ Agrupar y calcular la inversión por categoría y sucursal
    const grouped: Record<number, Record<number, number>> = {}; // branchId -> categoryId -> inversión

    for (const stock of stocks) {
      const branchKey = stock.branchId;
      const categoryKey = stock.product?.categoryId ?? 0;

      if (!grouped[branchKey]) grouped[branchKey] = {};
      if (!grouped[branchKey][categoryKey]) grouped[branchKey][categoryKey] = 0;

      const priceCalculation = stock.product?.priceCalculation ?? null;
      if (priceCalculation) {
        let inversion = 0;

        switch (priceCalculation) {
          case 'cantidad':
            inversion = (stock.priceByUnit ?? 0) * (stock.availableQuantity ?? 0);
            break;
          case 'unidadDeMedida':
            inversion = (stock.priceByMeasurement ?? 0) * (stock.quantityPerMeasure ?? 0);
            break;
          case 'presentacion':
            inversion = (stock.totalSellingPrice ?? 0) * (stock.purchasePricePerUnit ?? 0);
            break;
        }

        grouped[branchKey][categoryKey] += inversion;
      }
    }

    // 3️⃣ Convertimos a un formato amigable para el frontend
    const result = await Promise.all(
      Object.entries(grouped).map(async ([branchId, categories]) => {
        const categoryEntries = await Promise.all(
          Object.entries(categories).map(async ([categoryId, totalInvestment]) => {
            const category =
              categoryId === '0'
                ? { id: 0, name: 'Sin categoría' }
                : await this.prisma.productCategory.findUnique({
                    where: { id: categoryId },
                    select: { id: true, name: true },
                  });

            return {
              categoryId: category?.id ?? 0,
              categoryName: category?.name ?? 'Sin categoría',
              totalInvestment,
            };
          }),
        );

        return {
          branchId: branchId,
          categories: categoryEntries,
        };
      }),
    );

    return result[0];
  }
}
