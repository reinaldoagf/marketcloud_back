import { Test, TestingModule } from '@nestjs/testing';
import { PendingsController } from './pendings.controller';

describe('PendingsController', () => {
  let controller: PendingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendingsController],
    }).compile();

    controller = module.get<PendingsController>(PendingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
