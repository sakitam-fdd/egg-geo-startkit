import get from 'lodash/get';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import service from './http';

dayjs.extend(isSameOrAfter);

export function queryRadarStatic(params: any) {
  return service.get('/radar/splice/img_url', {
    // return axios.get('/radar/splice/ext_img_url', {
    params,
    baseURL: '',
  })
    .then((res: any) => res.data)
    // @ts-ignore
    .then((res: any) => {
      console.log(res);
      const baseUrl = get(res, 'host', '');
      const values = get(res, 'values', {});
      const bbox = get(res, 'bbox');
      const keys = Object.keys(values);

      if (keys.length > 0) {
        const sorts = keys.sort((a, b) => {
          const flag = dayjs(a).isSameOrAfter(dayjs(b));
          return flag ? 1 : -1;
        });

        const images = sorts.map(key => ({
          bbox,
          id: key,
          url: `${baseUrl}${values[key]}`,
          localUrl: '',
          time: dayjs(key).format('HH:mm'),
          fullTime: key,
          formatTime: dayjs(key).format('YYYY.MM.DD HH:mm'),
        }));

        return images;
      }
      return Promise.reject();
    });
}

export function queryCloudTiles(params: any) {
  return service.get('/satellite/tile', {
    params,
    baseURL: '',
  })
    .then((res: any) => res.data)
    // @ts-ignore
    .then((res: any) => {
      const baseUrl = get(res, 'host', '');
      const values = get(res, 'values', {});
      const keys = Object.keys(values);

      if (keys.length > 0) {
        const sorts = keys.sort((a, b) => {
          const flag = dayjs(a).isSameOrAfter(dayjs(b));
          return flag ? 1 : -1;
        });

        return sorts.map(key => ({
          id: key,
          url: `${baseUrl}${values[key]}`,
          localUrl: '',
          time: dayjs(key).format('HH:mm'),
          fullTime: key,
          formatTime: dayjs(key).format('YYYY.MM.DD HH:mm'),
        }));
      }
      return Promise.reject();
    });
}
