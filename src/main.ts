import 'normalize.css';
import 'maptalks/dist/maptalks.css';
import 'element-ui/packages/theme-chalk/lib/index.css';

import Vue from 'vue';
import ElementUI from 'element-ui';

import App from './App.vue';
import * as $http from './apis';
import router from './router';
import store from './store';
import filters from './filters';
import directives from './directives';

Vue.config.productionTip = false;

Vue.use(ElementUI);
// @ts-ignore
Vue.use(filters);
// @ts-ignore
Vue.use(directives);

Vue.prototype.$http = $http;

const app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

export default app;
