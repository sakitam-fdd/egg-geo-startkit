import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

// app special config scheme
export interface OwnConfig {
  m: number[];
  extent: number[];
  proxyService: string;
}

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig> & OwnConfig;
  // const config = {} as any;

  // 栅格图片空间范围
  config.extent = [ 66.68402763165123, 12.77002268658371, 143.5424729859214, 56.38334307775602 ];
  // 灰度值区间
  config.m = [ 0, 36, 54, 72, 90, 108, 126, 144, 162, 180, 198, 216, 234, 252 ];
  config.proxyService = 'http://47.105.164.53:8281';
  // @ts-ignore
  // config.m = Array.apply(null, Array(256)).map((item, i) => i);

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = `${appInfo.name}_1562642258154_9476`;

  // add your egg config in here
  config.middleware = [];

  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // config.security = {
  //   domainWhiteList: [],
  // };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
