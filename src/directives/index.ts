import { DirectiveOptions } from 'vue';
import { getContext } from '@/utils/common';

const directives = getContext(require.context('./', false, /\.ts$/), true, './index.ts');

const install = (Vue: any) => {
  directives.forEach((item: any) => {
    const def = Object.keys(item)[0];
    const name = item.name ? item.name : def;
    Vue.directive(name, item[def] as { [key: string ]: DirectiveOptions });
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
