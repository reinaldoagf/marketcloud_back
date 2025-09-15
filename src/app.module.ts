import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessModule } from './modules/business/business.module';
import { ClientsModule } from './modules/clients/clients.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BusinessModule,
    ClientsModule,
    CollaboratorsModule,
    PrismaModule, // Aquí importamos el módulo global
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
