// src/collaborators/collaborators.controller.ts
import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { PaginatedCollaboratorResponseDto } from './dto/paginated-collaborator-response.dto';

@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly service: CollaboratorsService) {}
  @Get('/')
  async getByFilters(
    @Query('page', ParseIntPipe) page = '1',
    @Query('size', ParseIntPipe) pageSize = '10',
    @Query('search') search = '',
    @Query('status') status = '',
    @Query('dateKey') dateKey = '',
    @Query('startDate') startDate = '',
    @Query('endDate') endDate = '',
  ): Promise<PaginatedCollaboratorResponseDto> {
    return this.service.getByFilters(
      Number(page),
      Number(pageSize),
      search,
      status,
      dateKey,
      startDate,
      endDate,
    );
  }
  @Post()
  async create(@Body() dto: CreateCollaboratorDto) {
    return this.service.addCollaborator(dto);
  }
}
