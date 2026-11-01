import { Controller, Get } from '@nestjs/common';
import { HotspotsService } from './hotspots.service.js';

@Controller('hotspots')
export class HotspotsController {
  constructor(private readonly hotspotsService: HotspotsService) {}

  @Get()
  getHotspots() {
    return this.hotspotsService.getHotspots();
  }
}