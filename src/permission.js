import router from './router'
import store from './store'
import getPageTitle from '@/utils/get-page-title'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getTheme from '@/config/theme.js'

const whiteList = ['/login.do', '/401', '/404', '/call']

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()

    // 调整页面title
    document.title = getPageTitle(to.meta.title)
    // 是否已有用户信息
    const hasInfo = store.getters.username !== null
    await getTheme()

    if (whiteList.includes(to.path)) {
        // 页面在白名单中
        next()
    } else if (hasInfo) {
        let accessPaths = await store.dispatch('authority/getAuthority')
        await store.dispatch('authority/getAccessMenu')
        // 判断是否有页面访问权限
        const modelPath = to.path.split('/')[1]
        // console.log('getAccessMenu', modelPath, accessPaths)
        if (accessPaths.indexOf(modelPath) >= 0) {
            next()
        } else {

            // 首个进入的页面
            let target
            let menuData = store.state.authority.menuData
            console.log('menuData3', menuData)
            menuData.forEach(v => {
                if (target) {
                    return
                }
                // 不自定进入大屏
                if (v.id === 'big') {
                    return
                }
                v.children = v.children || []
                if (v.children.length) {
                    v.children.forEach(v2 => {
                        if (!target) {
                            target = v2.path
                        }
                    })
                }
                else if (v.path) {
                    target = v.path
                }
            })
            if (target) {
                next({ path: target, replace: true })
            }
            else {
                next({ path: '/401', replace: true })
            }

        }
    } else {
        try {
            // 没有用户信息，则请求
            await store.dispatch('user/getInfo')
            console.log('user getinfo', localStorage.token)
            // hack方法，确保addRoutes动态挂载路由后仍能正常运行
            // 当replace为true时，会向 history 添加新记录，而是替换当前history记录
            next({ ...to, replace: true })
        } catch (error) {
            // 手机端不跳转到登录页面
            if (location.href.includes('mjcmryqx.html')) {
                return
            }
            if (location.href.includes('supervision.html')) {
                return
            }
            if (location.href.includes('yddgyjl.html')) {
                return
            }
            if (location.href.includes('hmryhc.html')) {
                return
            }
            if (location.href.includes('generateReport.html')) {
                return
            }
            // 跳转到登录页面,如果在debug模式,则不跳转
            if (/debug=/.test(location.search) === false && process.env.NODE_ENV !== 'development') {
                console.log('location2', location)
                // document.location.href = document.location.origin + '/yqfk/cas_login?targetUrl=' + location.href
                document.location.href = document.location.origin + '/yqfk/tenant_logout#url=' + encodeURIComponent(document.location.href)
            }
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
