import { Controller } from 'egg';
import { toNumber } from 'lodash';

class WindController extends Controller {
  public async scatter() {
    const { ctx } = this;

    const {
      elem, level, startX, startY,
      endX, endY, disc, dataTime,
    } = ctx.request.query;

    try {
      const data = await ctx.service.aviationProxy.scatter({
        elem,
        level,
        startX: toNumber(startX),
        startY: toNumber(startY),
        endX: toNumber(endX),
        endY: toNumber(endY),
        disc: toNumber(disc),
        dataTime: toNumber(dataTime),
      });

      this.logger.info('success: 查询成功');

      ctx.body = data;
    } catch (error) {
      this.logger.error(error);
      ctx.status = 500;
      ctx.body = error;
    }
  }
}

export default WindController;
