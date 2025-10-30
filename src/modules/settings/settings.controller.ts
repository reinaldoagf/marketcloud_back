import { Controller, Get, Query } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingResponseDto } from './dto/setting-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}
  @Get()
  async getByFilters(
    @Query('key') key?: string,
    @Query('userId') userId?: string,
    @Query('businessId') businessId?: string,
    @Query('branchId') branchId?: string,
  ): Promise<SettingResponseDto[]> {
    return this.service.getByFilters(key, userId, businessId, branchId);
  }
}
