import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, Matches, IsNotEmpty, Length } from 'class-validator';
import { UserStatus } from '@prisma/client'; // importamos el enum de Prisma

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\S+$/, {
    message: 'El username no puede contener espacios en blanco',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'El DNI debe tener entre 6 y 20 caracteres' })
  dni: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: UserStatus })
  @IsEnum(UserStatus)
  status: UserStatus;
}
