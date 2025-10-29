import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductCategory } from '@prisma/client';

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
    const currentYear = new Date().getFullYear();

    // 🔹 Array con nombres de los meses
    const monthNames = [
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

    // 1️⃣ Obtener todos los stocks con su producto y categoría
    const stocks = await this.prisma.productStock.findMany({
      where: {
        branch: branchId ? { id: branchId, businessId } : { businessId },
      },
      select: {
        branchId: true,
        availableQuantity: true,
        priceByUnit: true,
        priceByMeasurement: true,
        quantityPerMeasure: true,
        totalSellingPrice: true,
        purchasePricePerUnit: true,
        units: true,
        createdAt: true,
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

    // 2️⃣ Obtener todas las categorías (para incluir las sin inversión)
    const allCategories = await this.prisma.productCategory.findMany({
      select: { id: true, name: true },
    });

    // 3️⃣ Agrupar por mes, sucursal y categoría
    const grouped: Record<number, Record<number, Record<number, number>>> = {};
    // Estructura: branchId -> month(1-12) -> categoryId -> inversión

    for (const stock of stocks) {
      const branchKey = stock.branchId;
      const categoryKey = stock.product?.categoryId ?? 0;
      const monthKey = new Date(stock.createdAt).getMonth() + 1; // enero=1, diciembre=12

      if (!grouped[branchKey]) grouped[branchKey] = {};
      if (!grouped[branchKey][monthKey]) grouped[branchKey][monthKey] = {};
      if (!grouped[branchKey][monthKey][categoryKey]) grouped[branchKey][monthKey][categoryKey] = 0;

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
            inversion = (stock.totalSellingPrice ?? 0) * (stock.units ?? 0);
            break;
        }
        grouped[branchKey][monthKey][categoryKey] += inversion;
      }
    }

    // 4️⃣ Asegurar que todos los meses y categorías existan (aunque sea con 0 inversión)
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Si no hay datos en grouped (por ejemplo, no hay stocks), igual creamos una estructura base
    if (Object.keys(grouped).length === 0) {
      grouped[branchId ?? 0] = {};
    }

    const result = await Promise.all(
      Object.entries(grouped).map(async ([branchKey, monthsData]) => {
        const monthEntries = await Promise.all(
          months.map(async (monthNumber) => {
            const monthName = monthNames[monthNumber - 1]; // obtener nombre
            const monthCategories = monthsData[monthNumber] || {};

            const categories = await Promise.all(
              allCategories.map(async (cat: any) => {
                const totalInvestment = monthCategories[cat.id] ?? 0;
                return {
                  categoryId: cat.id,
                  categoryName: cat.name,
                  totalInvestment,
                };
              }),
            );

            // También agregamos “Sin categoría”
            const noCategoryInvestment = monthCategories[0] ?? 0;
            categories.push({
              categoryId: 0,
              categoryName: 'Sin categoría',
              totalInvestment: noCategoryInvestment,
            });

            return {
              month: monthName,
              categories,
            };
          }),
        );

        return {
          branchId: branchKey,
          year: currentYear,
          months: monthEntries,
        };
      }),
    );

    return result[0];
  }
}
