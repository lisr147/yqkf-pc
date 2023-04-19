// import { getCurrAppId } from '@/api/apps'
// import { getUserAuthority, getNavigation } from '@/api/authority'
import Api from '@/api/api'

const state = {
    authMap: {},
    menuData: [],
    accessPaths: ['preview'], //当前用户可访问模块
    isLoaded: false,
    methAuthority: {},
    templateList: [],//登录用户采集模板列表权限
}

var mutations = {

    SET_AUTHMAP: (state, value) => {
        state.authMap = value
    },
    SET_MENUDATA: (state, value) => {
        state.menuData = value
    },
    SET_ACCESS_PATH: (state, value) => {
        state.accessPaths = value
    },
    ADD_ACCESS_PATH: (state, value) => {
        state.accessPaths.push(value)
    },
    SET_LOAD_STATE: (state, value) => {
        state.isLoaded = value
    },
    SET_TEMPLATELIST: (state, value) => {
        state.templateList = value
    },
}

var actions = {

    // 获取用户操作权限
    getAuthority({ commit, state }, force) {
        return new Promise(async (resolve, reject) => {
            // 已经加载过
            if (state.accessPaths.length > 1 && !force) {
                resolve(state.accessPaths)
            } else {
                // 获取用户权限
                let res = await Api().AuthorityControllerApi.get_getUserAuthority.request()
                // .then(res => {
                // console.log(res)
                let index = ['/import', '/hotel', '/room', '/target', '/dataList', '/ldry', '/community']
                res.urlAuthority.sort((a, b) => {
                    return index.indexOf(a.authorityIdentity) - index.indexOf(b.authorityIdentity)
                })
                res.urlAuthority.forEach(item => {
                    let temp = item.authorityIdentity.split('#')
                    commit('ADD_ACCESS_PATH', temp[temp.length - 1].split('/')[1])
                })

                res.methAuthority.forEach(v => {
                    state.methAuthority[v.authorityIdentity] = v
                })
                // console.log(state.methAuthority)
                resolve(state.accessPaths)

                // }).catch(error => {
                //   reject(error)
                // })

            }
        })
    },

    // 获取用户导航菜单权限
    getAccessMenu({ commit, state }) {

        return new Promise(async (resolve, reject) => {
            const accessMenuData = await import('@/config/accessMenu.js')
            let menuData = accessMenuData.default

            menuData.forEach((v) => {
                // 没有权限的菜单，去掉
                if (!state.accessPaths.includes(v.id)) {
                    v.remove = true;
                } else {
                    // 没有子菜单的去掉？
                    if (!v.children) {
                        return;
                    }
                    v.children.forEach((v2) => {
                        if (!state.accessPaths.includes(v2.id)) {
                            // console.log(v2)
                            v2.remove = true;
                        }
                    });
                }
                if (!v.children) {
                    return;
                }
                // 过滤没有权限的子菜单
                v.children = v.children.filter((v2) => !v2.remove);
            });

            const blockList = [];
            // 过滤没有权限的1级菜单
            menuData = menuData.filter((v) => !v.remove && !blockList.includes(v.id))

            // 赋值数据给菜单
            commit("SET_MENUDATA", menuData);
            commit("SET_LOAD_STATE", true);

            resolve();
        })

    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
