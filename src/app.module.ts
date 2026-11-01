import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HotspotsModule } from './hotspots/hotspots.module.js';
import { DisasterRiskModule } from './disaster-risk/disaster-risk.module.js';
import { WeatherModule } from './weather/weather.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HotspotsModule,
    DisasterRiskModule,
    WeatherModule,
  ],
})
export class AppModule {}