// prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Ejecuta una transacción segura tipada
   * @param callback Función que recibe el cliente Prisma y retorna un array de PrismaPromise o un Promise<any>
   */
  async executeTransaction<T>(
    callback: (prisma: PrismaClient) => Prisma.PrismaPromise<T>[] | Promise<T>,
  ): Promise<T> {
    const result = callback(this);

    // Si es un array de PrismaPromise, lo pasamos directamente a $transaction
    if (Array.isArray(result)) {
      return this.$transaction(result as Prisma.PrismaPromise<any>[]) as Promise<any>;
    }

    // Si es un solo Promise, lo envolvemos en función
    return this.$transaction(async (prisma) => result);
  }
}
