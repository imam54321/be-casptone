import { Test, TestingModule } from '@nestjs/testing';
import { DisasterRiskController } from './disaster-risk.controller.js';

describe('DisasterRiskController', () => {
  let controller: DisasterRiskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisasterRiskController],
    }).compile();

    controller = module.get<DisasterRiskController>(DisasterRiskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
