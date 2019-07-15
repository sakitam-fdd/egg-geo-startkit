import axios from 'axios';
import toNumber from 'lodash/toNumber';
import { Message, MessageBox } from 'element-ui';

axios.defaults.headers.post['Content-Type'] = 'application/json';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  // baseURL: BASE_URL, // api的base_url
  timeout: 30000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => config,
  error =>
     Promise.reject(error),
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (toNumber(res.code) !== 200) {
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 401 || res.code === 403) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          console.log('401 - 403');
        });
      } else if (res.code === 500) {
        if (response.config) {
          Message({
            message: res.msg || res.message || '数据异常，请重试',
            type: 'error',
            duration: 5 * 1000,
          });
        }
      } else if (response.config) {
        Message({
          message: res.msg || res.message || '数据异常，请重试',
          type: 'error',
          duration: 5 * 1000,
        });
      }
      return Promise.reject(res);
    }
    return res;
  },
  error => {
    if (!error || !error.response) {
      Message({
        message: '当前网络不佳，请稍后重试',
        type: 'error',
        duration: 5 * 1000,
      });
      return;
    }
    Message({
      message: '当前网络不佳，请稍后重试',
      type: 'error',
      duration: 5 * 1000,
    });
    // eslint-disable-next-line consistent-return
    return Promise.reject(error);
  },
);

export default service;
