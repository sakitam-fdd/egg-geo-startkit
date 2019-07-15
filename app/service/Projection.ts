import { Service } from 'egg';
import { get } from 'lodash';
// @ts-ignore
import * as proj4 from 'proj4';
// @ts-ignore
import * as simplify from 'simplify-js';
// @ts-ignore
import * as SphericalMercator from '@mapbox/sphericalmercator';

/**
 * 投影转换
 */
class Projection extends Service {
  public transform(data: any, size: {
    width: number;
    height: number;
    // tslint:disable-next-line:no-multi-spaces
  },               extent: any, source: string, destination: string, simple?: boolean, samplifyOpt?: {
    tolerance?: number; // 抽稀粒度
    highQuality?: number; // 开启高质量
  }) {
    const res: any[] = [];
    let i = 0;
    const length = data.length;
    const { width, height } = size;
    for (; i < length; i++) {
      let j = 0;
      const item = data[i];
      const projCoords: any[] = [];
      for (; j < item.length; j++) {
        let rings = item[j];
        if (rings.length >= 4) {
          let k = 0;
          const rings_: any[] = [];

          if (simple) { // 对坐标进行抽稀
            rings = simplify(rings, get(samplifyOpt, 'tolerance', 1), get(samplifyOpt, 'highQuality', false));
          }

          for (; k < rings.length; k++) {
            const point = proj4(source, destination, [
              extent[0] + (extent[2] - extent[0]) * (rings[k][0] / width),
              extent[3] - (extent[3] - extent[1]) * (rings[k][1] / height),
            ]);
            rings_.push(point);
          }
          projCoords.push(rings_);
        }
      }
      res.push(projCoords);
    }

    this.logger.info('success：坐标转换成功。');
    return res;
  }

  /**
   * 转换空间范围
   * @param extent
   * @param source
   * @param destination
   */
  public transformExtent(extent: number[], source: string, destination: string) {
    return [
      ...proj4(source, destination, [ extent[0], extent[1] ]),
      ...proj4(source, destination, [ extent[2], extent[3] ]),
    ];
  }

  // public forwards(data: any, simplify: boolean) {
  //
  // }
  //
  // public inverses(data: any, simplify: boolean) {
  //
  // }
}

export default Projection;
