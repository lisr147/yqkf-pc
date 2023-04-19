import { setToken, removeToken } from '@/utils/auth'
// import { getMyInfo } from '@/api/account'
import chartSkinDark from '@/config/chartTheme/ChartSkinDark.json'
import ChartSkinLight from '@/config/chartTheme/ChartSkinLight.json'

import Api from '@/api/api'
const state = {
  id: null,
  fullName: null,
  username: null,
  roles: [],
  departmentName: '',
  departmentId: '',
  mobile: '',
  email: '',
  isLoaded: false,
  themeData: {
    chartSkin: chartSkinDark,
    id: 'dark',
    mapStyle: 'amap://styles/8f6e4fd8e511a83e01e44eb560fa30c5'
  }
}

var mutations = {

  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.fullName = name
  },
  SET_MOBILE: (state, phone) => {
    state.mobile = phone
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_DEPARTMENT: (state, department) => {
    state.departmentName = department
  },
  SET_DEPARTMENTID: (state,departmentId) => {
    state.departmentId = departmentId
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_LOADED: (state, value) => {
    state.isLoaded = value
  }
}

var actions = {

  getInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      if (process.env.NODE_ENV === 'production') {
        removeToken()
      }
      if (state.isLoaded) {
        resolve(state)
      } else {

        let response = await Api().LoginController.get_getUserInfo.request()
        if (!response) {
          reject('Vertification failed, login again')
        }

        const { username, fullName, departmentName, mobile, email, id, jwt,userId, departmentId } = response
        setToken(jwt)
        commit('SET_ID', id || userId)
        commit('SET_NAME', fullName)
        commit('SET_USERNAME', username)
        commit('SET_DEPARTMENT', departmentName)
        commit('SET_DEPARTMENTID', departmentId)
        commit('SET_MOBILE', mobile)
        commit('SET_EMAIL', email)
        commit('SET_LOADED', true)
        resolve(response)

      }
    })
  },

  setFullName({ commit, state }, value) {
    commit('SET_NAME', value)
  },

  setMobile({ commit, state }, value) {
    commit('SET_MOBILE', value)
  },

  setEmail({ commit, state }, value) {
    commit('SET_EMAIL', value)
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
