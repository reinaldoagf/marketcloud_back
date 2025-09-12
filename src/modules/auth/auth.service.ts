import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private userSelect = {
    id: true,
    name: true,
    email: true,
    status: true,
    createdAt: true,
    roleId: true,
    businessId: true,
    avatar: true,
  };

  async register(dto: RegisterDto) {
    // verificar email duplicado
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);

    const data: Prisma.UserCreateInput = {
      email: dto.email,
      name: dto.name,
      username: dto.username,
      dni: dto.dni,
      password: hashed,
      status: 'active', // o venir en dto si lo deseas
    };

    const user = await this.prisma.user.create({ data, select: this.userSelect });

    const token = this.signToken(user.id, user.email);
    return { access_token: token, user };
  }

  async validateUserByEmail(email: string, plainPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) return null;

    // devolver sin password
    const { ...userSafe } = user;
    return userSafe;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        business: {
          include: {
            branches: true, // Trae todos los branches del business
          },
        },
        collaborations: {
          include: {
            branch: {
              include: {
                business: true,
              },
            },
          },
        },
      },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const userSafe = (({ ...rest }) => rest)(user);

    const token = this.signToken(user.id, user.email);
    return { access_token: token, user: userSafe };
  }

  signToken(userId: number, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }
}
