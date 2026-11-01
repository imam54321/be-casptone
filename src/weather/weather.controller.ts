
import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { WeatherService } from './weather.service.js';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // Mengambil prakiraan berdasarkan kode ADM4
  @Get()
  getWeather(@Query('adm4') adm4: string) {
    if (!adm4) {
      throw new BadRequestException(
        'Kode wilayah adm4 wajib diisi',
      );
    }

    return this.weatherService.getWeather(adm4);
  }

  // Mencari wilayah berdasarkan nama
  @Get('locations')
  searchLocation(@Query('search') search: string) {
    if (!search) {
      throw new BadRequestException(
        'Nama wilayah wajib diisi',
      );
    }

    return this.weatherService.searchLocation(search);
  }

  // Mengambil cuaca berdasarkan koordinat GPS
  @Get('nearby')
  getWeatherByCoordinates(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
  ) {
    if (!lat || !lon) {
      throw new BadRequestException(
        'Latitude dan longitude wajib diisi',
      );
    }

    const latitude = Number(lat);
    const longitude = Number(lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new BadRequestException(
        'Koordinat latitude atau longitude tidak valid',
      );
    }

    return this.weatherService.getWeatherByCoordinates(
      latitude,
      longitude,
    );
  }
}
