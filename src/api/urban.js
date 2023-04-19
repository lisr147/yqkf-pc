import request from '@/utils/request'


/**
 * 城中村治理统计
 */
// 概览数据
export function getOverviewData(data) {
  return request({
    url: `/yqfk/web/urban/overview`,
    method: 'get',
    params: data
  })
}
// 概览数据
export function getUpdateTime() {
  return request({
    url: `/yqfk/web/urban/updateTime`,
    method: 'get',
  })
}

