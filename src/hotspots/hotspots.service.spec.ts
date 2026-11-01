import { Test, TestingModule } from '@nestjs/testing';
import { HotspotsService } from './hotspots.service.js';

describe('HotspotsService', () => {
  let service: HotspotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotspotsService],
    }).compile();

    service = module.get<HotspotsService>(HotspotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
