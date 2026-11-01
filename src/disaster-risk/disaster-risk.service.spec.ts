import { Test, TestingModule } from '@nestjs/testing';
import { DisasterRiskService } from './disaster-risk.service.js';

describe('DisasterRiskService', () => {
  let service: DisasterRiskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisasterRiskService],
    }).compile();

    service = module.get<DisasterRiskService>(DisasterRiskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
