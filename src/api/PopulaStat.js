import request from "@/utils/request"

/**
 * 疫苗接种
 */
// 疫苗接种统计数据
export function getYmStatistic(data) {
  return request({
    url: '/yqfk/peopleYmStatistics/findStatistics',
    method: 'post',
    data
  })
}
// 疫苗接种统计-下钻详情
export function getYmDetailPage (data) {
  return request({
    url: '/yqfk/peopleYmStatistics/ymDetailPage',
    method: 'post',
    data
  })
}
// 疫苗统计-导出统计数据
export function exportYmStatistic (data) {
  return request({
    url: '/yqfk/peopleYmStatistics/export-statistic-ym',
    method: 'post',
    responseType: "blob",
    data
  })
}
// 疫苗统计-导出统计详情数据
export function exportYmDetailStatistic (data) {
  return request({
    url: '/yqfk/peopleYmStatistics/export-statistic-detail-ym',
    method: 'post',
    responseType: "blob",
    data
  })
}



/**
 * 人口核查数据管理
 */
//核查数据列表
export function getPopulaStatPage (data) {
  return request({
    url: '/yqfk/population/verification/page',
    method: 'post',
    data
  })
}
//核查数据详情
export function getPopulaStatDetail (data) {
  return request({
    url: `/yqfk/population/verification/detail`,
    method: 'get',
    params:data
  })
}

//核查数据导出
export function exportPopulaStat (data) {
  return request({
    url: `/yqfk/population/verification/export?token=${data}`,
    method: 'post',
    responseType: "blob",
  })
}
/**
 * 人口核查人员管理
 */
//列表
export function getInspectorPage (data) {
  return request({
    url: '/yqfk/population/verification/inspectorPage',
    method: 'post',
    data
  })
}
//新增核查人员
export function addInspector (data) {
  return request({
    url: '/yqfk/population/verification/inspectorAdd',
    method: 'post',
    data
  })
}
//修改核查人员
export function updateInspector (data) {
  return request({
    url: '/yqfk/population/verification/inspectorUpdate',
    method: 'put',
    data
  })
}
//删除核查人员
export function deleteInspector (data) {
  return request({
    url: `/yqfk/population/verification/inspectorDelete?inspectorId=${data.inspectorId}`,
    method: 'delete',
    data
  })
}
//核查人员数据导入
export function importInspector (data) {
  return request({
    url: '/yqfk/population/verification/inspectorImport',
    method: 'post',
    data
  })
}
//核查人员数据导出
export function exportInspectorExport (data) {
  return request({
    url: `/yqfk/population/verification/inspectorExport`,
    method: 'post',
    responseType: "blob",
    data
  })
}
//导入核查结果
export function importCheckResult (data) {
  return request({
    url: '/yqfk/population/verification/importCheckResult',
    method: 'post',
    responseType: "blob",
    data
  })
}
//核查详情
export function getTaskDetail (data) {
  return request({
    url: `/yqfk/population/verification/task`,
    method: 'get',
    params: data
  })
}
