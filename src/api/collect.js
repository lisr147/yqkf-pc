import request from '@/utils/request'

/**
 * 人员采集接口（重点人群）
 */

// 统计数据
export function getCountData(templateId, params) {
    return request({
        url: `/yqfk/hs-check/statistic-ym/${templateId}`,
        method: 'get',
        params
    })
}

export function getBatchListData(params){
    return request({
        url: `/yqfk/hs-check/getAnalysisIdList/${params.templateId}`,
        method: 'get',
        params
    })
}

// 获取主体列表
export function getZTListData(params) {
    return request({
        url: `/yqfk/hs-check/getZtmcList/${params.templateId}?templateId=${params.templateId}`,
        method: 'get',
        params
    })
}
export function getProgress(templateId, params) {
    return request({
        url: `/yqfk/hs-check/syn-hs/${templateId}`,
        method: 'get',
        params
    })
}

//统计非星级酒店从业人员和在住旅客的核酸检测情况
export function getsSatisticHsData(data) {
    return request({
        url: `/yqfk/hs-check/statistic-hs/${data.templateId}`,
        method: 'get',
        params:data
    })
}
//统计非星级酒店从业人员和在住旅客的核酸检测情况
export function getsSatisticHsDataViaHour(data) {
    return request({
        url: `/yqfk/hs-check/statistic-hs/hour/${data.templateId}`,
        method: 'get',
        params:data
    })
}
// 查看核酸记录
export function getNuclein(data) {
    return request({
        url: `/yqfk/hs-check/query/${data.idcard}?dayNum=7`,
        method: 'get',
    })
}

// 查看疫苗接种记录
export function getVacc(data) {
    return request({
        url: `/yqfk/hs-check/query-ym/${data.idcard}`,
        method: 'get'
    })
}

// 核酸统计数据(一线工作人员)
export function getNucleicStatistics(data) {
    return request({
        url: `/yqfk/hs-check/getNucleicStatistics`,
        method: 'get',
        params:data
    })
}

//疫苗接种情况详情（下钻人员明细）
export function getPeoData(data) {
    return request({
        url: `/yqfk/hs-check/peopleDetailPage`,
        method: 'post',
        data
    })
}


// 导出疫苗接种数据（核酸下钻人员）
export function exportFile(data) {
    return request({
        url: `/yqfk/hs-check/exportPeopleDetailPage`,
        method: 'post',
        responseType: "blob",
        data
    })
}

//核酸情况详情（下钻人员明细）
export function getHsPeople(data) {
    return request({
        url: `/yqfk/hs-check/hsPeopleDetailPage`,
        method: 'post',
        data
    })
}
// 导出核酸检测数据（核酸下钻人员）
export function exportFileByHs(data) {
    return request({
        url: `/yqfk/hs-check/exportHsPeopleDetailPage`,
        method: 'post',
        responseType: "blob",
        data
    })
}

//企业信息采集相关（获取主体类型模板）
export function getQyTemplate (data) {
    return request({
        url:`/yqfk/api/qyxxcj`,
        method:'get',
        data
    })
}


// 导出统计企业核酸检测情况
export function exportStatisticHs (data) {
    return request({
        url:`/yqfk/hs-check/export-statistic-hs/${data.templateId}`,
        responseType: "blob",
        method:'get',
        params:data
    })
}

// 导出统计企业疫苗接种情况
export function exportStatisticYm (data) {
    return request({
        url:`/yqfk/hs-check/export-statistic-ym/${data.templateId}`,
        responseType: "blob",
        method:'get',
        params:data
    })
}

//根据主体类型与主体名称获取id
export function getIdListByZt (data) {
  return request({
    url:`/yqfk/api/template/getIdListByZt`,
    method:'get',
    params:data
  })
}

//按最后一次核酸地址分类
export function getHsLastArr (data) {
  return request({
    url:`/yqfk/hs-check/statistic-hs/addr/${data.templateId}`,
    method:'get',
    params:data
  })
}

//核酸下钻人员明细-按最近一次核酸地址详情
export function getHsLastDetailArr(data) {
  return request({
    url:`/yqfk/hs-check/hsPeopleDetailPage/addr`,
    method:'post',
    data
  })
}

//导出核酸下钻人员明细-按最近一次核酸地址
export function exportHsLastArr (data) {
  return request({
    url:`/yqfk/hs-check/exportHsPeopleDetailPageAddr`,
    method:'post',
    responseType: "blob",
    data
  })
}

//导出合计-按最近一次核酸地址
export function exportHsLastArrAll (data) {
  return request({
    url:`/yqfk/hs-check/export-statistic-hs/addr/${data.templateId}`,
    method:'get',
    responseType: "blob",
    params:data
  })
}
