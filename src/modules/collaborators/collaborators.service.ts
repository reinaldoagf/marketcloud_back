// src/collaborators/collaborators.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';

@Injectable()
export class CollaboratorsService {
  constructor(private prisma: PrismaService) {}

  async addCollaborator(dto: CreateCollaboratorDto) {
    const branch = await this.prisma.businessBranch.findUnique({
      where: { id: dto.branchId },
      include: { business: true },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    // Validar que el colaborador no sea el owner
    if (branch.business?.ownerId === dto.userId) {
      throw new BadRequestException('Owner cannot be added as collaborator');
    }

    // Validar si ya existe
    const existing = await this.prisma.businessBranchCollaborator.findFirst({
      where: { branchId: dto.branchId, userId: dto.userId },
    });

    if (existing) {
      throw new BadRequestException('User is already a collaborator of this branch');
    }

    // Crear el colaborador
    return this.prisma.businessBranchCollaborator.create({
      data: {
        branchId: dto.branchId,
        userId: dto.userId,
        isAdmin: dto.isAdmin ?? false,
      },
    });
  }
}
