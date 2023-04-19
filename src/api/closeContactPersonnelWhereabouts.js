import request from '@/utils/request'
/**
 * 密接/次密接去向核实接口
 */
// 按照批次号分页查询
 export function getStatisticsByBatchNum(data){
     return request({
         url:'/yqfk/chart/statistics/pageList',
         method:'post',
         data
     })
 }
 // 各镇街待认领和待核查人数(人员核查环节)
  export function getToClaimToCheckNumber(params){
      return request({
          url:'/yqfk/chart/statistics/personnelCheckLink',
          method:'get',
          params
      })
  }
// 核查流程
  export function getProcessHistory(analysisId){
    return request({
        url:`/yqfk/chart/statistics/processHistory/${analysisId}`,
        method:'post'
    })
}
  