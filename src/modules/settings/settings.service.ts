// settings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SettingResponseDto } from './dto/setting-response.dto';

const SELECT_FIELDS = {
  id: true,
  key: true,
  floatValue: true,
  stringValue: true,
  userId: true,
  user: true,
  businessId: true,
  business: true,
  branchId: true,
  branch: true,
  createdAt: true,
};

@Injectable()
export class SettingsService {
  constructor(private service: PrismaService) {}

  async getByFilters(
    key?: string | null,
    userId?: string | null,
    businessId?: string | null,
    branchId?: string | null,
  ): Promise<SettingResponseDto[]> {
    const where: Prisma.SettingWhereInput = {};

    if (key) where.key = key;
    if (userId) where.userId = userId;
    if (businessId) where.businessId = businessId;
    if (branchId) where.branchId = branchId;

    const settings = await this.service.setting.findMany({
      where,
      select: SELECT_FIELDS,
    });

    return settings;
  }
}
