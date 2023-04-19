import request from '@/utils/request'

/**
 * 获取一线工作人员核酸统计数据
 * @param params
 * @param params.tjsj 统计时间
 * @returns {*}
 */
export function getNucleicStatistics(params) {
  return request({
    url: `/yqfk/hs-check/getNucleicStatistics`,
    method: 'get',
    params
  })
}

/**
 * 获取一线工作人员明细
 * @param data
 * @param data.condition
 * @param data.condition.tjsj 统计时间
 * @param data.condition.dwlx 单位类型 传“合计”时就是查合计的明细
 * @param data.condition.ssdw 所属单位 传“合计”时就是查合计的明细
 * @param data.condition.hsjcqk 核酸检测情况  all为总人数，jcyc为3天内核酸1次明细，jclcjys为3天内核酸2次及以上，wjc为3天内未做核酸明细
 * @param data.page
 * @param data.pageSize
 * @returns {*}
 */
export function getFrontLineStaffList(data) {
  return request({
    url: `/yqfk/hs-check/workerDetailPage`,
    method: 'post',
    data
  })
}

/**
 * 导出一线工作人员明细
 * @param data.condition
 * @returns {*}
 */
export function exportFrontLineList(data) {
  return request({
    url: `/yqfk/hs-check/exportWorkerDetailPage`,
    method: 'post',
    data,
    responseType: "blob",
  })
}

/**
 * 导出一线工作人员统计结果
 * @param data.condition
 * @returns {*}
 */
export function exportFrontLineStatistics(data) {
  return request({
    url: `/yqfk/hs-check/exportWorkerStatistics`,
    method: 'post',
    params: data,
    responseType: "blob",
  })
}

/**
 * 一线工作人员核酸检测阳性告警-告警设置
 * @param  data
 * @param data.workerAlarmConfigDTO
 * @returns {*}
 */
export function setFrontLineAlarmSetting(data) {
  return request({
    url: `/yqfk/alarmTopic/worker/alarm/setting`,
    method: 'post',
    data
  })
}

/**
 * 获取 一线工作人员核酸检测阳性告警-告警设置
 * @param  data
 * @param data.workerAlarmConfigDTO
 * @returns {*}
 */
export function getFrontLineAlarmSetting(params) {
  return request({
    url: `/yqfk/alarmTopic/worker/alarm/setting/detail`,
    method: 'get',
    params
  })
}

/**
 * 更新一线人员核酸检测数据
 */
export function getHSCheckUpdataTbsj(params) {
  return request({
    url: `/yqfk/hs-check/updateTbsj`,
    method: 'get',
    params:Object.assign({showModal:false},params)
  })
}
