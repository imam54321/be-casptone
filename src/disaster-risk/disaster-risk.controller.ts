import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { DisasterRiskService } from './disaster-risk.service.js';

@Controller('disaster-risk')
export class DisasterRiskController {
  constructor(
    private readonly disasterRiskService: DisasterRiskService,
  ) {}

  @Get('flood')
  getFloodRisk(@Query('bbox') bbox: string) {
    if (!bbox) {
      throw new BadRequestException(
        'Parameter bbox wajib diisi',
      );
    }

    return this.disasterRiskService.getRiskMap(
      'flood',
      bbox,
    );
  }

  @Get('landslide')
  getLandslideRisk(@Query('bbox') bbox: string) {
    if (!bbox) {
      throw new BadRequestException(
        'Parameter bbox wajib diisi',
      );
    }

    return this.disasterRiskService.getRiskMap(
      'landslide',
      bbox,
    );
  }
}