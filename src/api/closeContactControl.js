import request from '@/utils/request'

/**
 * 防疫通密接次密接人员
 */

// 防疫通密接次密接人员分页查询
export function getFytMjcmjData (data) {
  return request({
    url: `/yqfk/closeContactControl/pageList`,
    method: 'post',
    data
  })
}

// 获取管控确认状态集
export function getFytControlStatus (data) {
  return request({
    url: `/yqfk/closeContactControl/controlStatus`,
    method: 'get',
    params: data
  })
}

// 单个查询防疫通密接次密接人员详情
export function getFytDetail (data) {
  return request({
    url: `/yqfk/closeContactControl/getDetail/${data.insertId}`,
    method: 'get',
    params: data
  })
}

// 防疫通数据统计
export function getFytStatistic (data) {
  return request({
    url: `/yqfk/closeContactControl/statistic`,
    method: 'get',
    params: data
  })
}

// 统计导出
export function exportFytStatistic (data) {
  return request({
    url: `/yqfk/closeContactControl/exportStatistic`,
    responseType: "blob",
    method: 'post',
    data
  })
}

// 统计详情导出
export function exportFytChildStatistic (data) {
  return request({
    url: `/yqfk/closeContactControl/exportDetail`,
    responseType: "blob",
    method: 'post',
    data
  })
}

// 获取是否核心密接数据集下拉
export function getFytContactRiskType (data) {
  return request({
    url: `/yqfk/closeContactControl/contactRiskType`,
    method: 'get',
    params: data
  })
}
