// src/business/business.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateBusinessInput {
  name: string;
  rif?: string;
  description?: string;
  ownerId: number;
  branches: { country: string; state: string; city: string; address: string; phone: string }[];
  logo?: string | null;
}

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateBusinessInput) {
    const owner = await this.prisma.user.findUnique({
      where: { id: input.ownerId },
    });

    if (!owner) {
      throw new NotFoundException(`Owner with id ${input.ownerId} not found`);
    }

    // 🚨 Ajusta estos valores si deseas manejar planes de suscripción por defecto
    const subscriptionPlanId = 1;
    const expiredDate = new Date();
    expiredDate.setMonth(expiredDate.getMonth() + 1);

    try {
      return await this.prisma.business.create({
        data: {
          name: input.name,
          rif: input.rif,
          description: input.description || '',
          logo: input.logo,
          ownerId: input.ownerId,
          subscriptionDate: new Date(),
          expirationDate: expiredDate,
          branches: {
            create: input.branches.map((b) => ({
              country: b.country,
              state: b.state,
              city: b.city,
              address: b.address,
              phone: b.phone,
            })),
          },
        },
        include: {
          branches: true,
          owner: true,
        },
      });
    } catch (err: any) {
      throw new BadRequestException(`Error creating business: ${err.message}`);
    }
  }
}
