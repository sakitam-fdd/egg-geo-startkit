import { Controller } from 'egg';

class ImportantWeatherController extends Controller {
  public async scatter() {
    const { ctx } = this;

    const {
      startTime, endTime, _,
    } = ctx.request.query;

    try {
      const data = await ctx.service.aviationProxy.lightScatter({
        start: startTime,
        end: endTime,
        _: _ || Date.now(),
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

export default ImportantWeatherController;
