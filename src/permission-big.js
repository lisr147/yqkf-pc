import router from './router/big'
import store from './store'
import getPageTitle from '@/utils/get-page-title'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getTheme from '@/config/theme.js'
const whiteList = ['/login.do', '/401', '/404', '/call', '/medical','/transferPage']

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
    // console.log("router", to, from, next);

    // start progress bar
    NProgress.start()

    // 调整页面title
    document.title = getPageTitle(to.meta.title)
    // 是否已有用户信息
    const hasInfo = store.getters.username !== null
    await getTheme()
   console.log('当前路由是否在白名单中',whiteList.includes(to.path))
    if (whiteList.includes(to.path)) {
        // 页面在白名单中
        next()
    } else if (hasInfo) {
        let accessPaths = await store.dispatch('authority/getAuthority')
        await store.dispatch('authority/getAccessMenu')
        if (accessPaths.includes('big')) {
            next()
            return
        }
        next({ path: '/401', replace: true })

    } else {
        try {
            // 没有用户信息，则请求
            await store.dispatch('user/getInfo')
            // hack方法，确保addRoutes动态挂载路由后仍能正常运行
            // 当replace为true时，会向 history 添加新记录，而是替换当前history记录
            next({ ...to, replace: true })
        } catch (error) {
            // 跳转到登录页面,如果在debug模式,则不跳转
            if (/debug=/.test(location.search) === false && process.env.NODE_ENV !== 'development') {
                console.log('location2', location)
                // document.location.href = document.location.origin + '/yqfk/cas_login?targetUrl=' + location.href
                // document.location.href = document.location.origin + '/yqfk/cas_login?targetUrl=' + location.href+'#url=' + encodeURIComponent(document.location.href)
                document.location.href = `${document.location.origin}/yqfk/cas_login?targetUrl=${encodeURIComponent(document.location.href)}#url=${encodeURIComponent(document.location.href) }`
            }
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
