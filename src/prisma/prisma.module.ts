// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Hace que el módulo sea global, no necesitas importarlo en cada módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta el servicio para que pueda inyectarse en otros módulos
})
export class PrismaModule {}
