import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HotspotsService {
  constructor(private readonly configService: ConfigService) {}

  async getHotspots() {
    const apiKey = this.configService.get<string>('NASA_FIRMS_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'NASA FIRMS API key belum diatur di file .env',
      );
    }

    // Bounding box sekitar Guci, Kabupaten Tegal
    const area = '105.0,-10.0,115.0,-5.0';

    // VIIRS Suomi-NPP Near Real-Time, data 5 hari terakhir
    const source = 'VIIRS_SNPP_NRT';
    const dayRange = 5;

    const url =
      `https://firms.modaps.eosdis.nasa.gov/api/area/csv/` +
      `${apiKey}/${source}/${area}/${dayRange}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new InternalServerErrorException(
          'Gagal mengambil data dari NASA FIRMS',
        );
      }

      const csv = await response.text();
      const lines = csv.trim().split('\n');

      if (lines.length < 2) {
        return {
          source: 'NASA FIRMS',
          total: 0,
          data: [],
        };
      }

      const headers = lines[0].split(',');

      const data = lines.slice(1).map((line) => {
        const values = line.split(',');
        const row: Record<string, string> = {};

        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() ?? '';
        });

        return {
          latitude: Number(row['latitude']),
          longitude: Number(row['longitude']),
          brightness: Number(row['bright_ti4']),
          confidence: row['confidence'],
          satellite: row['satellite'],
          acquisitionDate: row['acq_date'],
          acquisitionTime: row['acq_time'],
          fireRadiativePower: Number(row['frp']),
          daynight: row['daynight'],
        };
      });

      return {
        source: 'NASA FIRMS',
        satellite: source,
        total: data.length,
        data,
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Terjadi kesalahan saat mengambil data hotspot',
      );
    }
  }
}
