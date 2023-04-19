// 图表状态
const state = {
  isEdit: false,
  isSaving: false,
  isCancel: false,

  leftFolder: false, //左侧图表区域折叠状态
  rightFolder: false, //右侧图表区域折叠状态

  showExplain: false, //显示数据来源说明弹窗
}

const getters = {}

const mutations = {
  CHANGE_EDIT (state) {
    state.isEdit = !state.isEdit
  },
  SWITCH_SAVING(state, value){
    state.isSaving = value == undefined ? !state.isSaving : value
  },
  SWITCH_CANCEL(state, value) {
    state.isCancel = value == undefined ? !state.isCancel : value
    state.isEdit =false
  },
  SET_FOLDER_STATE(state, value) {
    state.leftFolder = value.left
    state.rightFolder = value.right
  },
  SET_RIGHT_FOLDER_STATE(state, value) {
    state.rightFolder = value
  },
  RESET(){
    state.isEdit = false
    state.isSaving = false
    state.isCancel = false
    state.leftFolder = false
    state.rightFolder = false
  },
  SET_SHOW_EXPLAIN (state, value) {
    state.showExplain = value
  }
}

const actions = {}

export default {
  namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
}
