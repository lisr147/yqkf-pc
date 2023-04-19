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
    redirect: '/driversReserve'
  },
  {
    meta: {title:'司机预约'},
    path: '/driversReserve',
    name: 'driversReserve',
    component: () => import('@/views/driversReserve/index.vue')
  },
  {
    mata: {title:'司机自查'},
    path: '/searchPages',
    name: 'searchPages',
    component: () => import('@/views/driversReserve/searchPages.vue')
  },
  {
    mata: {title:'新增预约'},
    path: '/reserve',
    name: 'reserve',
    component: () => import('@/views/driversReserve/reserve.vue')
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const router = new VueRouter({
  routes
})

export default router
