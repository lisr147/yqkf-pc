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
    redirect: '/progress'
  },
  // {
  //   meta: {title: '问卷表单'},
  //   path: '/client/:id',
  //   name: 'client',
  //   component: () => import('@/views/client/Index'),
  // },
  {
    meta: {title:'督查督办事项进度更新'},
    path: '/progress',
    name: 'progress',
    component: () => import('@/views/supervision/progress.vue'),
  },
  // 密接、次密人员去向定位
  {
    path:'/mjcmryqx',
    name:'mjcmryqx',
    meta: { title: '密接、次密接人员去向定位' },
    component: () => import('@/views/mobile/mjcmryqx.vue')
  },
  // 药店的购药记录
  {
    path:'/yddgyjl',
    name:'yddgyjl',
    meta: { title: '药店的购药记录' },
    component: () => import('@/views/mobile/yddgyjl.vue')
  },
  // 高风险岗位人员
  {
    path:'/gfxgwry',
    name:'gfxgwry',
    meta: { title: '高风险岗位人员' },
    component: () => import('@/views/mobile/gfxgwry.vue')
  },
  // 黄码人员核查
  {
    path:'/hmryhc',
    name:'hmryhc',
    meta: { title: '黄码人员核查' },
    component: () => import('@/views/mobile/hmryhc.vue')
  },
  // 平台使用分析报告
  {
    path:'/generateReport',
    name:'generateReport',
    meta: { title: '平台使用分析报告' },
    component: () => import('@/views/analysis/generateReport.vue')
  },
  // 人口核查
  {
    path:'/populationVerify',
    name:'populationVerify',
    meta: { title: '人口核查' },
    component: () => import('@/views/mobile/populationVerify.vue')
  },
  // 中转页面
  {
    path:'/transferPage',
    name:'transferPage',
    meta: { title: '中转页面' },
    component: () => import('@/views/mobile/transferPage.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
