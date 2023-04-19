import request from "@/utils/request"

/**
 * 重点行业统计接口（公用）
 */

// 获取所属重点行业数据（带模板ID）
export function getIndustryTypes() {
  return request({
    url: '/yqfk/api/qyxxcj',
    method: 'get'
  })
}

// 获取告警配置下的主体类型
export function getAlarmZtlx() {
  return request({
    url: '/yqfk/api/qyxxcj/loadAlarmZtlx',
    method: 'get'
  })
}


/**
 * 统计配置
 */
// 保存重点人群统计配置
export function saveKeyIndustries(data) {
  return request({
    url: `/yqfk/zdRqStatisticConfig/save`,
    method: 'post',
    data
  })
}
// 根据templateId获取人员列表
export function getRyTypes(templateId) {
  return request({
    url: `/yqfk/zdRqStatisticConfig/findRylbByTemplateId?templateId=${templateId}`,
    method: 'get',
  })
}
// 根据id修改监测状态
export function changeStatus({ id, status }) {
  return request({
    url: `/yqfk/zdRqStatisticConfig/statusSetting/${id}?status=${status}`,
    method: 'get',
  })
}

// 根据id删除数据
export function deleteData(id) {
  return request({
    url: `/yqfk/zdRqStatisticConfig/delete/${id}`,
    method: 'post',
  })
}

// 导出统计数据
export function exportStatisticData(data) {
  return request({
    url: "/yqfk/zdRqStatisticConfig/export",
    method: "post",
    responseType: "blob",
    data,
  });
}


/**
 * 疫苗接种
 */
// 疫苗接种统计数据
export function getYmsStatistic(data) {
  return request({
    url: '/yqfk/ymStatistics/findStatistics',
    method: 'post',
    data
  })
}
// 疫苗接种统计-下钻详情
export function getYmDetailPage (data) {
  return request({
    url: '/yqfk/ymStatistics/ymDetailPage',
    method: 'post',
    data
  })
}
// 疫苗统计-导出统计数据
export function exportYmStatistic (data) {
  return request({
    url: '/yqfk/ymStatistics/export-statistic-ym',
    method: 'post',
    responseType: "blob",
    data
  })
}
// 疫苗统计-导出统计详情数据
export function exportYmDetailStatistic (data) {
  return request({
    url: '/yqfk/ymStatistics/export-statistic-detail-ym',
    method: 'post',
    responseType: "blob",
    data
  })
}

/**
 * 核酸检测
 */
// 核酸检测统计数据
export function getHsStatistic(data) {
  return request({
    url: '/yqfk/hsStatistic/pageList',
    method: 'post',
    data
  })
}
// 核酸检测统计-下钻详情
export function getHsDetailPage (data) {
  return request({
    url: '/yqfk/hsStatistic/detailPageList',
    method: 'post',
    data
  })
}
// 一图总览-核酸检测统计-下钻列表
export function getHsFullScreenDetail (data) {
  return request({
    url: '/yqfk/hsStatistic/fullScreenDetail',
    method: 'post',
    data
  })
}
// 核酸检测统计-导出统计数据
export function exportHsStatistic (data) {
  return request({
    url: '/yqfk/hsStatistic/export/statistic',
    method: 'post',
    responseType: "blob",
    data
  })
}
// 核酸检测统计-导出统计详情数据
export function exportHsDetailStatistic (data) {
  return request({
    url: '/yqfk/hsStatistic/export/statisticDetail',
    method: 'post',
    responseType: "blob",
    data
  })
}



/**
 * 核酸预警
 */
// 核酸预警统计
export function getHsyjStatistic(data) {
  return request({
    url: '/yqfk/zdrqHsYjStatistics/statisticsPage',
    method: 'post',
    data
  })
}
// 核酸预警统计--查看人员详情
export function getYjRyDetail(data){
  return request({
    url: '/yqfk/zdrqHsYjStatistics/ryPage',
    method: 'post',
    data
  })
}
// 核酸预警统计--查看更多
export function getHsYjMore(data){
  return request({
    url: '/yqfk/zdrqHsYjStatistics/detailPage',
    method: 'post',
    data
  })
}
// 核酸预警---导出统计数据
export function exportHsYjStatistic(data) {
  return request({
    url: '/yqfk/zdrqHsYjStatistics/export',
    method: 'post',
    responseType: "blob",
    data
  })
}
// 核酸预警---导出统计详情数据
export function exportHsYjDetailStatistic(data) {
  return request({
    url: '/yqfk/zdrqHsYjStatistics/export/detail',
    method: 'post',
    responseType: "blob",
    data
  })
}

/**
 * 核酸合规
 */
// 核酸合规统计分页
export function getHsHgStatistic(data) {
  return request({
    url: '/yqfk/zdrqHsHgStatistics/statisticsPage',
    method: 'post',
    data
  })
}

// 核酸合规查看人员详情
export function getHsHgRyDetail(data) {
  return request({
    url: '/yqfk/zdrqHsHgStatistics/ryPage',
    method: 'post',
    data
  })
}
// 核酸合规查看更多
export function getHsHgMore(data) {
  return request({
    url: '/yqfk/zdrqHsHgStatistics/detailPage',
    method: 'post',
    data
  })
}
// 核酸合规-导出统计数据
export function exportHsHgStatistic (data) {
  return request({
    url: '/yqfk/zdrqHsHgStatistics/export',
    method: 'post',
    responseType: "blob",
    data
  })
}
// 核酸合规-导出统计详情数据
export function exportHsHgDetailStatistic (data) {
  return request({
    url: '/yqfk/zdrqHsHgStatistics/export/detail',
    method: 'post',
    responseType: "blob",
    data
  })
}


