import request from '@/utils/request'

/**
 * 穗货运接口
 */

// 穗货运统计数据
export function getShyStatistic (params) {
  return request({
    url: `/yqfk/shyAppointForm/statistic`,
    method: 'get',
    params
  })
}
// 下钻货车总数详情
export function getTruckNumData (data) {
  return request({
    url: `/yqfk/shyAppointForm/pageList`,
    method: 'post',
    data
  })
}
// 下钻未做核酸统计详情分页查询
export function getWzhsData (data) {
  return request({
    url: `/yqfk/shyAppointForm/statisticPage`,
    method: 'post',
    data
  })
}
// 设置统计参数
export function setTruckConfig (data) {
  return request({
    url: `/yqfk/shyAppointForm/setConfig?value=${data.value}`,
    method: 'put',
    data
  })
}

// 获取设置统计参数
export function getTruckConfig (data) {
  return request({
    url: `/yqfk/shyAppointForm/getConfig`,
    method: 'get',
    params:data
  })
}
// 数据统计导出(合计)
export function exportAllTruck (data) {
  return request({
    url: `/yqfk/shyAppointForm/export/statistic`,
    responseType: "blob",
    method:'get',
    params:data
  })
}
// 穗货运驾乘人员分页查询
export function getShyDriver (data) {
  return request({
    url: `/yqfk/shyDriver/pageList`,
    method:'post',
    data
  })
}

 // 查询驾乘人员详情
export function getShyDriverDetail (data) {
  return request({
    url: `/yqfk/shyDriver/detail/${data.id}`,
    responseType: "blob",
    method:'get',
    params:data
  })
}

// 货车总数导出
export function exportChildTruck (data) {
  return request({
    url: `/yqfk/shyAppointForm/export/truck`,
    responseType: "blob",
    method:'post',
    data
  })
}

// 未做核酸总数导出
export function exportChildTruckHs (data) {
  return request({
    url: `/yqfk/shyAppointForm/export/truckHs`,
    responseType: "blob",
    method:'post',
    data
  })
}
// 穗货运驾乘人员数据导出
export function exporShyDriver (data) {
  return request({
    url: `/yqfk/shyDriver/export`,
    responseType: "blob",
    method:'post',
    data
  })
}

