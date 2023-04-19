import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import {Message} from 'element-ui'

Vue.use(Vuex)

const STICK_AMOUNT = 4

const moduleFiles = require.context('./modules', true, /\.js$/)

// 将modules中的文件转换为state模块
const modules = moduleFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = moduleFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  state:{
    //浮层面板
    floatingList: [],

    //浮层面板zindex
    floatingZIndex: 1000,
  },
  
  mutations: {
    // 添加浮层面板
    ADD_FLOATING(state, obj) {

      let list = state.floatingList
      let matchIndex = list.findIndex(item => item.id == obj.id)

      if (matchIndex !== -1) {
        Message({
          message: '该浮动面板已存在',
          type: 'warning'
        })
        return
      }

      obj.style.zIndex = state.floatingZIndex
      state.floatingZIndex++

      if (list.length < STICK_AMOUNT) {
        list.splice(0, 0, obj)
      } else {
        Message({
          message: `面板最多数量为${STICK_AMOUNT}，请关闭其他面板`,
          type: 'warning'
        })
      }
    },

    // 删除面板
    REMOVE_FLOATING(state, obj) {

      let list = state.floatingList
      let matchIndex = list.findIndex(item => item.id == obj.id)
      if (matchIndex !== -1) {
        list.splice(matchIndex, 1)
      }
      if(list.length == 0){
        state.floatingZIndex = 1000
      }
    },

    CLEAR_FLOARING(state){
      state.floatingList = []
      state.floatingZIndex = 1000
    },

    // 更新面板
    UPDATE_FLOATING(state,obj){

      let list = state.floatingList
      let matchIndex = list.findIndex(item => item.id == obj.id)

      if (matchIndex > -1) {
        list[matchIndex].style = {
          top: obj.top,
          left: obj.left,
          zIndex: obj.zIndex
        }
      }
    },
  },
})

export default store
