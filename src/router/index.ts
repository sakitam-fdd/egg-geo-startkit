import Vue from 'vue';

import Router, { RouteConfig } from 'vue-router';

Vue.use(Router);

const routers: RouteConfig[] = [
  {
    path: '/index',
    name: 'index',
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "index" */ '../pages/Index.vue'),
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
    //     name: 'Dashboard',
    //     meta: {
    //       title: 'dashboard',
    //     },
    //   },
    // ],
  },
  {
    path: '*',
    redirect: '/index',
    meta: { hidden: true },
  },
];

const router = new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  routes: [
    ...routers,
  ],
  mode: 'hash', // 后端支持可开
});

// @ts-ignore
router.beforeEach((to: string, from: string, next: () => void) => {
  next();
});

router.afterEach(() => {
  // console.log()
});

export default router;
