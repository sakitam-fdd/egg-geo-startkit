import { Service } from 'egg';
import axios from 'axios';

/**
 * 国网气象服务相关 service
 */
class AviationProxy extends Service {
  /**
   * 风向格点查询（每一级对应粒度不同）
   * @param params
   */
  public async scatter(params: {
    elem: string;
    level: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    disc: number;
    dataTime: number;
  }) {
    try {
      return await axios.get('/meteo/nummdl/scatter', {
        params,
        baseURL: this.config.proxyService,
      }).then(res => res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * 闪电接口查询
   * @param params
   */
  public async lightScatter(params: {
    start: string | number;
    end: string | number;
    [key: string]: any;
  }) {
    try {
      return await axios.get('/light/scatter', {
        params,
        baseURL: this.config.proxyService,
      }).then(res => res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default AviationProxy;
