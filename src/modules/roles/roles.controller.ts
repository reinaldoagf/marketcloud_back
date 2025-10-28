import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginatedRoleResponseDto } from './dto/paginated-role-response.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get('/')
  async getByFilters(
    @Query('page', ParseIntPipe) page = 1,
    @Query('size', ParseIntPipe) size = 10,
    @Query('search') search = '',
  ): Promise<PaginatedRoleResponseDto> {
    return this.service.getByFilters(page, size, search);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  // 🔹 Asignar / actualizar permisos
  @Post(':id/permissions')
  async updatePermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.service.updatePermissions(id, permissionIds);
  }

  // 🔹 Asignar / actualizar páginas
  @Post(':id/pages')
  async updatePages(
    @Param('id') id: string,
    @Body('pages') pages: string[],
  ) {
    return this.service.updatePages(id, pages);
  }
}
