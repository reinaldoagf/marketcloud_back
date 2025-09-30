import { Module } from '@nestjs/common';
import { PendingsController } from './pendings.controller';
import { PendingsService } from './pendings.service';

@Module({
  controllers: [PendingsController],
  providers: [PendingsService]
})
export class PendingsModule {}
