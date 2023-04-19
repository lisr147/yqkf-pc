import router from './router/sealarea'
import store from './store'
import getPageTitle from '@/utils/get-page-title'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login.do', '/401', '/404',]

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 调整页面title
  document.title = getPageTitle(to.meta.title)
  // 是否已有用户信息
  const hasInfo = store.getters.username !== null

  if (whiteList.includes(to.path)) {
    // 页面在白名单中
    next()
  } else if (hasInfo) {
    let accessPaths = await store.dispatch('authority/getAuthority')
    await store.dispatch('authority/getAccessMenu')
    // const modelPath = to.path.split('/')[1]
    // 判断是否有封控页面访问权限
    if (accessPaths.indexOf('sealareaIndex') >= 0) {
      next()
    } else {
      next({ path: '/401', replace: true })
    }
  } else {
    try {
      // 没有用户信息，则请求
      await store.dispatch('user/getInfo')
      next({ ...to, replace: true })
    } catch (error) {
      // 跳转到登录页面,如果在debug模式,则不跳转
      if (/debug=/.test(location.search) === false && process.env.NODE_ENV !== 'development') {
        console.log('location2',location)
        // document.location.href = document.location.origin + '/yqfk/cas_login?targetUrl=' +  location.href
          document.location.href = document.location.origin + '/yqfk/tenant_logout#url=' + encodeURIComponent(document.location.href)
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
