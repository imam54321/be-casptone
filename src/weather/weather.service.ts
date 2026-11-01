
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { WeatherForecast } from './weather_interfces.js';

@Injectable()
export class WeatherService {
  // Mencari wilayah berdasarkan nama
  async searchLocation(search: string) {
    if (!search || search.trim().length < 2) {
      throw new HttpException(
        'Pencarian wilayah minimal 2 karakter',
        HttpStatus.BAD_REQUEST,
      );
    }

    const url = `https://bmkg-api.dhanypedia.com/v1/wilayah/search?q=${encodeURIComponent(search)}&limit=20`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new HttpException(
        'Gagal mencari wilayah',
        response.status,
      );
    }

    return response.json();
  }

  // Mengambil prakiraan berdasarkan kode ADM4
  async getWeather(adm4: string) {
    try {
      const url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new HttpException(
          'Gagal mengambil data cuaca dari BMKG',
          response.status,
        );
      }

      const result = await response.json();

      const location = result.lokasi;

      const forecasts = result.data.flatMap((item: any) =>
        item.cuaca.flat(),
      );

      const weatherData: WeatherForecast[] = forecasts.map(
        (item: any) => ({
          datetime: item.datetime,
          temperature: item.t,
          humidity: item.hu,
          weather: item.weather_desc,
          weatherCode: item.weather,
          windSpeed: item.ws,
          windDirection: item.wd,
        }),
      );

      return {
        source: 'BMKG',
        location: {
          province: location.provinsi,
          city: location.kotkab,
          district: location.kecamatan,
          village: location.desa,
          latitude: location.lat,
          longitude: location.lon,
        },
        forecasts: weatherData,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Terjadi kesalahan saat mengambil data cuaca',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Mengambil cuaca berdasarkan koordinat GPS pengguna
 async getWeatherByCoordinates(
  latitude: number,
  longitude: number,
) {
  // 1. Reverse geocoding koordinat GPS
  const reverseUrl =
    `https://nominatim.openstreetmap.org/reverse` +
    `?format=jsonv2&lat=${latitude}&lon=${longitude}` +
    `&zoom=18&addressdetails=1`;

  const reverseResponse = await fetch(reverseUrl, {
    headers: {
      'User-Agent': 'EcoRisk/1.0',
    },
  });

  if (!reverseResponse.ok) {
    throw new HttpException(
      'Gagal mencari wilayah dari koordinat GPS',
      HttpStatus.BAD_GATEWAY,
    );
  }

  const reverseData = await reverseResponse.json();
  const address = reverseData.address;

  // 2. Ambil nama desa/kelurahan
  const village =
    address.village ||
    address.suburb ||
    address.neighbourhood;

  if (!village) {
    throw new HttpException(
      'Wilayah desa atau kelurahan tidak ditemukan',
      HttpStatus.NOT_FOUND,
    );
  }

  // 3. Cari kode wilayah berdasarkan nama desa
  const locationResults = await this.searchLocation(village);

  const locations = locationResults.data ?? [];

  // 4. Cocokkan nama desa dan kabupaten/kota
  const matchedLocation = locations.find((item: any) => {
    const path = item.full_path.toLowerCase();

    return (
      item.name.toLowerCase() === village.toLowerCase() &&
      path.includes(
        (address.city || address.county || '').toLowerCase(),
      )
    );
  });

  if (!matchedLocation) {
    throw new HttpException(
      `Kode wilayah untuk ${village} tidak ditemukan`,
      HttpStatus.NOT_FOUND,
    );
  }

  // 5. Ambil prakiraan BMKG menggunakan kode adm4
  return this.getWeather(matchedLocation.code);
}
  
}
