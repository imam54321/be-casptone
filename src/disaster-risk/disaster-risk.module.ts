import { Module } from '@nestjs/common';
import { DisasterRiskController } from './disaster-risk.controller.js';
import { DisasterRiskService } from './disaster-risk.service.js';

@Module({
  controllers: [DisasterRiskController],
  providers: [DisasterRiskService]
})
export class DisasterRiskModule {}
