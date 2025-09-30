// src/business/business.controller.ts
import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessService } from './business.service';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads/logos', // 📂 carpeta donde se guardan
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ) // opcional, si envías archivo "logo"
  async create(@Body() body: CreateBusinessDto, @UploadedFile() file?: Express.Multer.File) {
    const ownerId = Number(body.ownerId);

    let branches: { country: string; state: string; city: string; address: string; phone: string }[] = [];
    if (body.branches) {
      try {
        branches = JSON.parse(body.branches) || [];
      } catch {
        throw new Error('Invalid branches JSON format');
      }
    }

    return this.businessService.create({
      name: body.name,
      rif: body.rif,
      description: body.description ?? '',
      ownerId,
      branches,
      logo: file ? file.filename : null,
    });
  }
}
