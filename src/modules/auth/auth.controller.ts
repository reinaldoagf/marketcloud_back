import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  UseGuards,
  Get,
  Req,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.service.register(dto); // returns { access_token, user }
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.service.login(dto); // { access_token, user }
  }

  // endpoint protegido de ejemplo
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    // req.user es lo que devuelve JwtStrategy.validate()
    return req.user;
  }

  // ✅ Actualizar datos del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars', // 📂 carpeta donde se guardan
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    })
  ) // opcional, si envías archivo "dniFile"
  async updateProfile(@Req() req: any, @Body() dto: UpdateAuthDto, @UploadedFile() file?: Express.Multer.File) {
    const userId = req.user.sub; // viene del payload del JWT
    if (file) dto.avatar = file.filename; // ruta donde guardas el archivo
    return this.service.updateProfile(userId, dto);
  }
}
