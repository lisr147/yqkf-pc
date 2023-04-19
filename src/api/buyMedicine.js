import request from '@/utils/request'
//购药核查接口

/**
 * 获取购药核查统计
 * @param params
 */
export function getStatisticsBuyMedicine(params) {
  return request({
    url: '/yqfk/drug/personnelCheckLink',
    method: 'get',
    params
  })
}


/**
 * 按照批次号分页查询
 * @param params
 */
export function getBuyMedicineList(data) {
  return request({
    url: '/yqfk/drug/analysisIdPageList',
    method: 'post',
    data
  })
}

/**
 * 获取核查流程
 * @param data
 */
export function getBuyProcessHistory(data) {
  return request({
    url: `/yqfk/drug/processHistory/${data.id}`,
    method: 'post',
    data
  })
}

