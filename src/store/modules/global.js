const state = {
  // 当前皮肤数据
  themeData: {},
  // 当前专题名称
  currentSpecial: null,
  // 用户信息
  userInfo: null,
  menulist: [],
  methodAuth: [],
  // 导入异常信息列表
  unusualUnits: null,
  zIndex: 1
}

const getters = {}

const mutations = {
  SET_THEMEDATA (state, val) {
    state.themeData = val
  },
  SET_CURRENTSPECIAL (state, val) {
    state.currentSpecial = val
  },
  SET_USERINFO (state, val) {
    state.userInfo = val
  },
  SET_MENULIST (state, val) {
    state.menulist = val
  },
  SET_METHODAUTH (state, val) {
    state.methodAuth = val
  },
  SET_UNUSUALUNITS (state, val) {
    state.unusualUnits = val
  },
  SET_ZINDEX (state, val) {
    state.zIndex++
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
