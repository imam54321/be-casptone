import { Test, TestingModule } from '@nestjs/testing';
import { HotspotsController } from './hotspots.controller.js';

describe('HotspotsController', () => {
  let controller: HotspotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotspotsController],
    }).compile();

    controller = module.get<HotspotsController>(HotspotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
