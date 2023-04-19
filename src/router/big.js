import Vue from "vue";
import VueRouter from "vue-router";

// 解决重复点击导航菜单项报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

let routes = [
  {
    path: "/",
        component: () => import("@/layout/screen"),
        name:'big',
        meta: { title: "大屏展示" },
        redirect: "/gz2000",
        children:[
            {
                path: "gz2000",
                name: "gz2000",
                meta: { title: "大屏" },
                component: () => import("@/views/big/indexGz2000"),
            },
        ]
  },
  {
    path:'/medical',
    name:'medical',
    meta: { title: '医疗信息' },
    component: () => import('@/views/mobile/medical.vue')
  },
  {
    path: '/transferPage',
    name: 'transferPage',
    meta: { title: '中转页面' },
    component: () => import('@/views/mobile/transferPage.vue')
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "*",
    redirect: "/",
    hidden: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
