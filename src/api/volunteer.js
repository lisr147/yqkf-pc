import request from '@/utils/request'

/**
 * 志愿者统计
 */

// 总览
export function getCountData (params) {
  return request({
    url: `/yqfk/zyztj/overview`,
    method: 'get',
    params
  })
}
// 志愿者社区分布
export function getClubData (data) {
  return request({
    url: `/yqfk/zyztj/zyzSssq`,
    method: 'post',
    data
  })
}
// 志愿者网格分布
export function getGridData (data) {
  return request({
    url: `/yqfk/zyztj/zyzSswg`,
    method: 'post',
    data
  })
}
// 志愿者明细
export function getDetailList (data) {
  return request({
    url: `/yqfk/zyztj/zyzDetails`,
    method: 'post',
    data
  })
}
// 导出志愿者明细
export function exportDetailData(data) {
  return request({
    url: `/yqfk/zyztj/zyzExport`,
    method: 'post',
    data,
    responseType: "blob",
  })
}
