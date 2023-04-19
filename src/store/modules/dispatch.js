import {
  getBaseInfo,
  getTrackInfo,
  getEpidemicVaccinationResult,
  getNucleicAcidResult,
  getLivePicturesList,
  getCodeScanning,
  getRelatedPersonnel
} from '@/api/epidemiologicalSurvey'

//流调信息详情
const state = {
  //基本信息
  baseInfo: {},
  //核心轨迹
  trackInfo: {},
  //疫苗接种情况
  vaccinationInfo: {},
  //近14日核酸情况
  detectionInfo: {},
  //近14日扫码记录
  recordInfo: {},
  //关联人员
  relationMembers:{},
  //其他情况
  otherInfo: {},

}

var mutations = {

  //设置整个信息段
  SET_INFO: (state, {infoName, infoValue}) => {
    state[infoName] = infoValue
  },

  //设置某个信息段中的单个字段
  SET_INFO_ITEM: (state, {infoName, fieldName, value, index, opt}) => {
    if (!state[infoName][fieldName]) {
      return
    }
    if (state[infoName][fieldName] instanceof Array && opt) {
      //如果字段值为数组且指定了索引值，则更新索引值成员
      if(opt == 'add'){
        const arr = state[infoName][fieldName].concat()
        arr.push(value)
        arr.sort((a, b) => {return a.order - b.order})
        state[infoName][fieldName] = arr
      } else if (opt == 'update') {
        state[infoName][fieldName].splice(index, 1, value)
      }

    } else {
      //否则更新字段
      state[infoName][fieldName] = value
    }
  }
}

var actions = {

  getData({commit, state}, {id}){

    getBaseInfo(id).then(res=>{
      commit('SET_INFO', {infoName: 'baseInfo', infoValue: res})
    })

    getTrackInfo(id).then(res=>{
      commit('SET_INFO', {infoName: 'trackInfo', infoValue: res})
    })

    getEpidemicVaccinationResult(id).then(res=>{
      commit('SET_INFO', {infoName: 'vaccinationInfo', infoValue: res})
    })

    getNucleicAcidResult(id).then(res=>{
      commit('SET_INFO', {infoName: 'detectionInfo', infoValue: res})
    })

    getLivePicturesList(id).then(res=>{
      commit('SET_INFO', {infoName: 'otherInfo', infoValue: res})
    })

    getCodeScanning(id,{ pageNum: 1, pageSize: 10}).then(res=>{
      commit('SET_INFO', {infoName: 'recordInfo', infoValue: res})
    })

    getRelatedPersonnel(id,{ pageNum: 1, pageSize: 10}).then(res=>{
      commit('SET_INFO', {infoName: 'relationMembers', infoValue: res})
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
