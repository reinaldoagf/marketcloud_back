// src/business-branch-purchase/business-branch-purchase.module.ts
import { Module } from '@nestjs/common';
import { BusinessBranchPurchaseController } from './business-branch-purchase.controller';
import { BusinessBranchPurchaseService } from './business-branch-purchase.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BusinessBranchPurchaseController],
  providers: [BusinessBranchPurchaseService, PrismaService],
})
export class BusinessBranchPurchaseModule {}
