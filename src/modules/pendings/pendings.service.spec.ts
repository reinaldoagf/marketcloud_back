import { Test, TestingModule } from '@nestjs/testing';
import { PendingsService } from './pendings.service';

describe('PendingsService', () => {
  let service: PendingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingsService],
    }).compile();

    service = module.get<PendingsService>(PendingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
