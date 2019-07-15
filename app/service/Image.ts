import { Service } from 'egg';
// @ts-ignore
import * as d3contours from 'd3-contour';

class Image extends Service {
  /**
   * 获取格点数据（从灰度图中读取）
   * @param data
   * @param size
   */
  public getGridPoints(data: any, size: {
    width: number;
    height: number;
  }) {
    let i = 0;
    const res: number[] = [];
    // const png: number[] = [];
    const { width, height } = size;
    // https://github.com/mapbox/webgl-wind/blob/master/data/prepare.js#L19

    // for (let y = 0; y < height; y++) {
    //   for (let x = 0; x < width; x++) {
    //     const i = (y * width + x) * 4;
    //     const k = y * width + (x + width / 2) % width;
        // png[i + 0] = Math.floor(255 * (u.values[k] - u.minimum) / (u.maximum - u.minimum));
        // png[i + 1] = Math.floor(255 * (v.values[k] - v.minimum) / (v.maximum - v.minimum));
        // png[i + 2] = 0;
        // png[i + 3] = 255;
      // }
    // }

    for (; i < height; i++) {
      let j = 0;
      for (; j < width; j++) {
        const k = i * width + j;
        res[k] = data[k * 3];
      }
    }
    this.logger.info('success：格点数据生成成功。');
    return res;
  }

  /**
   * 对从灰度图中读取的源数据进行插值生成等值面
   * @param data
   * @param size
   */
  public d3Contour(data: any, size: {
    width: number;
    height: number;
  }) {
    const extent = this.config.extent;
    const { width, height } = size;
    const mercatorExtent: any[] = this.ctx
      .service.projection
      .transformExtent(extent, 'EPSG:4326', 'EPSG:3857');

    this.logger.info(mercatorExtent);

    // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
    const contours = d3contours.contours()
      .size([ width, height ])
      .thresholds(this.config.m)(data);

    const features: any = {
      type: 'FeatureCollection',
      features: [],
    };

    let i = 0;
    const length = contours.length;
    for (; i < length; i++) {
      const item = contours[i];
      if (item && item.coordinates.length > 0) {
        const coordinates = this.ctx
          .service.projection
          .transform(item.coordinates, size, mercatorExtent, 'EPSG:3857', 'EPSG:4326', false);
        features.features.push({
          type: 'Feature',
          properties: {
            value: item.value,
          },
          geometry: {
            type: item.type,
            coordinates,
          },
        });
      }
    }

    this.logger.info('success：面状数据读取成功。');

    return features;
  }
}

export default Image;
