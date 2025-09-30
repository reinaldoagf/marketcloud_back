import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessModule } from './modules/business/business.module';
import { ClientsModule } from './modules/clients/clients.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { PendingsModule } from './modules/pendings/pendings.module';
import { BrandsModule } from './modules/brands/brands.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BusinessModule,
    ClientsModule,
    CollaboratorsModule,
    SuppliersModule,
    PendingsModule,
    BrandsModule,
    PrismaModule, // Aquí importamos el módulo global
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
