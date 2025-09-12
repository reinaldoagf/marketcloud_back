import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessModule } from './modules/business/business.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BusinessModule,
    CollaboratorsModule,
    PrismaModule, // Aquí importamos el módulo global
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
