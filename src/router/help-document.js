import Vue from "vue";
import VueRouter from "vue-router";

// 解决重复点击导航菜单项报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    meta: { title: "帮助文档" },
    name: "helpDocument",
    component: () => import("@/views/helpDocument/index.vue"),
  },
];
console.log('routes', routes)

const router = new VueRouter({
  routes,
});

export default router;
