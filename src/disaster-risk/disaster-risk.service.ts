import { Injectable } from '@nestjs/common';

@Injectable()
export class DisasterRiskService {
  private readonly baseUrl =
    'https://gis.bnpb.go.id/server/rest/services/inarisk/LAYER_KELAS_R_SDK/MapServer/export';

  async getRiskMap(
    type: 'flood' | 'landslide',
    bbox: string,
  ) {
    // Layer ID InaRISK
    const layerId = type === 'flood' ? 0 : 5;

    const params = new URLSearchParams({
      bbox,
      bboxSR: '3857',
      imageSR: '3857',
      size: '800,600',
      format: 'png32',
      transparent: 'true',
      layers: `show:${layerId}`,
      f: 'json',
    });

    const response = await fetch(
      `${this.baseUrl}?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(
        `InaRISK gagal merespons: ${response.status}`,
      );
    }

    const result = await response.json();

    return {
      type,
      layerId,
      imageUrl: result.href,
      width: result.width,
      height: result.height,
      extent: result.extent,
    };
  }
}