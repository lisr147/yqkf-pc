import request from "@/utils/request";

/**
 * 自动统计
 */
/**
 * @param
 */

// 获取镇街用户注册总数
export function getUserTotalZj(data) {
  return request({
    url: `/yqfk/autoCount/userTotal/zj`,
    method: `get`,
    params: data
  })
}

// 获取镇街开通账号情况
export function getUserOpenZj(data) {
  return request({
    url: `/yqfk/autoCount/userOpen/zj`,
    method: `get`,
    params: data
  })
}

// 获取镇街账号使用情况
export function getUserUseZj(data) {
  return request({
    url: `/yqfk/autoCount/userUse/zj`,
    method: `get`,
    params: data
  })
}


// 获取委办局用户注册总数
export function getUserTotalWbj(data) {
  return request({
    url: `/yqfk/autoCount/userTotal/wbj`,
    method: `get`,
    params: data
  })
}

// 获取委办局开通账号情况
export function getUserOpenWbj(data) {
  return request({
    url: `/yqfk/autoCount/userOpen/wbj`,
    method: `get`,
    params: data
  })
}

// 获取委办局账号使用情况
export function getUserUseWbj(data) {
  return request({
    url: `/yqfk/autoCount/userUse/wbj`,
    method: `get`,
    params: data
  })
}

export function getPastTime(data) {
  return request({
    url: `/yqfk/usage/getPastTime`,
    method: `get`,
    params: data
  })
}

// 镇街近12个月平台使用总量表格
export function getMonthsUseZj(data) {
  return request({
    url: `/yqfk/usage/monthsUsageTrend/zj/gird`,
    method: `get`,
    params: data
  })
}


// 委办局近12个月平台使用总量表格
export function getMonthsUseWbj(data) {
  return request({
    url: `/yqfk/usage/monthsUsageTrend/wbj/grid`,
    method: `get`,
    params: data
  })
}

// 镇街委办局近30天平台使用总量表格
export function getDayUseZj(data) {
  return request({
    url: `/yqfk/usage/datesUsageTrend/zj/gird`,
    method: `get`,
    params: data
  })
}

// 委办局近30天平台使用总量表格
export function getDayUseWbj(data) {
  return request({
    url: `/yqfk/usage/datesUsageTrend/wbj/gird`,
    method: `get`,
    params: data
  })
}


// 委办局使用率前三的功能模块表格
export function getRankWbj(data) {
  return request({
    url: `/yqfk/usage/frequencyRank/wbj/gird`,
    method: `get`,
    params: data
  })
}


// 导出镇街账号使用情况
// export function exportUseZj(data) {
//   return request({
//     url: `/yqfk/autoCount/export/use/zj`,
//     method: `get`,
//     responseType: "blob",
//     params: data
//   })
// }

// 镇街使用情况-（包括工作人员下钻）
export function exportUseZj(data) {
  return request({
    url: `/yqfk/autoCount/userUse/zj/export`,
    method: `post`,
    responseType: "blob",
    data
  })
}
// 镇街使用情况-工作人员下钻详情
export function getUseZjDetail(data) {
  return request({
    url: `/yqfk/autoCount/userUse/zj/detail`,
    method: `post`,
    data
  })
}

// 导出委办局账号使用情况
export function exportUseWbj(data) {
  return request({
    url: `/yqfk/autoCount/export/use/wbj`,
    method: `get`,
    responseType: "blob",
    params: data
  })
}
// 镇街近12个月平台使用总量导出
export function exportMonthsUseZj(data) {
  return request({
    url: `/yqfk/usage/monthsUsageTrend/zj/export`,
    method: `get`,
    responseType: "blob",
    params: data
  })
}
// 委办局12个月平台使用总量导出
export function exportMonthsUseWbj(data) {
  return request({
    url: `/yqfk/usage/monthsUsageTrend/wbj/export`,
    method: `get`,
    responseType: "blob",
    params: data
  })
}

// 导出镇街委办局近30天平台使用总量表格
export function exportDayUseZj(data) {
  return request({
    url: `/yqfk/usage/datesUsageTrend/zj/export`,
    method: `get`,
    responseType: "blob",
    params: data
  })
}

// 导出委办局近30天平台使用总量表格
export function exportDayUseWbj(data) {
  return request({
    url: `/yqfk/usage/datesUsageTrend/wbj/export`,
    method: `get`,
    responseType: "blob",
    params: data
  })
}

// 导出委办局使用率前三的功能模块表格
export function exportRankWbj(data) {
  return request({
    url: `/yqfk/usage/frequencyRank/wbj/export`,
    method: `get`,
    responseType: "blob",
    params: data
  })
}

// 报告模板接口
export function getAutoTemplateAll(data) {
  return request({
    url: `/yqfk/autoTemplate/findAll`,
    method: `get`,
    params: data
  })
}

//根据token，获取统计相关数据
export function getBaseInfo(data) {
  return request({
    url: `/yqfk/autoTemplate/baseInfo`,
    method: `get`,
    params: data
  })
}

//生成报告获取图表固定长期有效请求头
export function getPanelItemDataByCode(data) {
  return request({
    headers: { 'Authorization' : "Bearer " + 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6IjEiLCJkZXBhcnRtZW50SWQiOiJudWxsIiwidGVuYW50SWQiOiJudWxsIiwiZW50aXR5QXV0aG9yaXR5IjoiU1lTX0FETUlOIn0.gF4EpY_FBLqBEu3wt0TfuVB_XY4AMG7Yz6XQiSqv-666C_HuJ3Iv3FATuqNNvgaTx1fP-bWjtuznGkaKzZiLEQ'},
    url: `/portal/rest/panelItemData/getPanelItemDataByCode`,
    method: "get",
    params: data
  });
}


