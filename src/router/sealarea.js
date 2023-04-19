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
        redirect: '/gz2000'
  },
  {
    meta: {title:'高德地图封控管控区'},
    path: '/sealareaIndex',
    name: 'sealareaIndex',
    component: () => import('@/views/sealArea2/SealAreaIndex.vue')
  },
  {
    meta: {title:'GZ2000地图封控管控区'},
    path: '/gz2000',
    name: 'sealareaIndexGz2000',
    component: () => import('@/views/sealArea2/SealAreaIndexGz2000.vue')
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
