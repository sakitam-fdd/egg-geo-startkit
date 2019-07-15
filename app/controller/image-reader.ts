import { Controller } from 'egg';
// @ts-ignore
import * as sharp from 'sharp';
import { resolve } from '../utils/common';

class ImageReaderController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = 'start';
  }

  public async readerSharp() {
    const { ctx } = this;

    const width = parseInt(String(720 / 2), 10);
    const height = parseInt(String(360 / 2), 10);
    console.time('math');

    const data = await sharp(resolve('public/rardar/worad_srazky_dbz_20190715_1120.jpg'))
      .resize(width, height, {
        kernel: sharp.kernel.lanczos2,
      })
      .blur()
      .raw()
      .toBuffer();
    console.timeEnd('math');

    console.time('grid');
    const grid = ctx.service.image.getGridPoints(data, {
      width,
      height,
    });

    console.timeEnd('grid');

    console.time('polygon');

    const ploygons = ctx.service.image.d3Contour(grid, {
      width,
      height,
    });

    console.timeEnd('polygon');

    ctx.body = ploygons;
  }
}

export default ImageReaderController;
