import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决重复点击导航菜单项报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/ns'
  },
  // {
  //   meta: {title: '问卷表单'},
  //   path: '/client/:id',
  //   name: 'client',
  //   component: () => import('@/views/client/Index'),
  // },
  {
    meta: {title:'南沙地图'},
    path: '/ns',
    name: 'ns',
    component: () => import('@/views/map/NS.vue'),
  }
]

const router = new VueRouter({
  routes
})

export default router
