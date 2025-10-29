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
    const currentYear = new Date().getFullYear();
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const start = startDate ? new Date(startDate) : new Date(`${currentYear}-01-01`);
    const end = endDate ? new Date(endDate) : new Date(`${currentYear}-12-31`);

    // 🔹 Filtros dinámicos
    const where: any = {
      createdAt: { gte: start, lte: end },
      businessBranchPurchase: {},
    };

    if (userId?.length) where.businessBranchPurchase.userId = userId;
    if (businessId) where.businessBranchPurchase.businessId = businessId;
    if (branchId?.length) where.businessBranchPurchase.branchId = branchId;

    // 🔹 1️⃣ Obtener todas las compras filtradas
    const purchases = await this.prisma.purchase.findMany({
      where,
      select: {
        price: true,
        unitsOrMeasures: true,
        createdAt: true,
        product: {
          select: {
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    // 🔹 2️⃣ Obtener todas las categorías disponibles
    const allCategories = await this.prisma.productCategory.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    // 🔹 3️⃣ Inicializamos estructura: meses x categorías con total 0
    const grouped: Record<string, Record<string, number>> = {};
    for (const month of months) {
      grouped[month] = {};
      for (const cat of allCategories) {
        grouped[month][cat.name] = 0;
      }
    }

    // 🔹 4️⃣ Llenamos los totales reales
    purchases.forEach((purchase) => {
      const monthName = purchase.createdAt.toLocaleString('es-ES', { month: 'long' });
      const monthCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      const category = purchase.product?.category?.name ?? 'Sin categoría';

      // Si la categoría no existe aún (por ejemplo "Sin categoría"), la agregamos
      if (!grouped[monthCapitalized][category]) grouped[monthCapitalized][category] = 0;

      grouped[monthCapitalized][category] += purchase.unitsOrMeasures * purchase.price;
    });

    // 🔹 5️⃣ Formateamos resultado para el frontend
    const result = months.map((month) => ({
      month,
      categories: Object.entries(grouped[month]).map(([category, total]) => ({
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
