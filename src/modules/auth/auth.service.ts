import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

const SELECT_FIELDS = {
  id: true,
  name: true,
  email: true,
  username: true,
  hasAllPermissions: true,
  status: true,
  dni: true,
  dniFile: true,
  createdAt: true,
  country: true,
  state: true,
  city: true,
  roleId: true,
  role: true,
  businessId: true,
  avatar: true,
  business: { include: { branches: true } },
  collaborations: { include: { branch: { include: { business: true } } } },
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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
      country: dto.country,
      city: dto.city,
      state: dto.state,
      password: hashed,
      status: 'activo', // o venir en dto si lo deseas
    };

    const user = await this.prisma.user.create({ data, select: SELECT_FIELDS });

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

  async updateProfile(userId: number, dto: UpdateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user) throw new BadRequestException('User not found');

    const data: UpdateAuthDto = {};

    // Si se va a cambiar la contraseña, verificar primero
    if (dto.password) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required to change password');
      }

      const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      data.password = await bcrypt.hash(dto.password, 10);
    }

    // Actualizar campos opcionales (solo los permitidos)
    const allowedFields = [
      'name',
      'email',
      'username',
      'dni',
      'country',
      'state',
      'city',
      'avatar',
    ];

    for (const field of allowedFields) {
      if (dto[field] !== undefined) {
        data[field] = dto[field];
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: SELECT_FIELDS,
    });

    return { message: 'Profile updated successfully', user: updated };
  }

  signToken(userId: number, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }
}
