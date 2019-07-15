import { getContext } from '@/utils/common';

const filters = getContext(require.context('./', false, /\.js$/), false, './index.js');

const install = (Vue: any) => {
  const lists = filters.reduce((pre, next) => Object.assign(pre, next), {});

  Object.keys(lists).forEach(key => {
    Vue.filter(key, lists[key] as { [key: string ]: Function });
  });
};

// @ts-ignore
if (typeof window !== 'undefined' && window.Vue) {
  // @ts-ignore
  install(window.Vue);
}

export default {
  install,
};
