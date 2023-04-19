import request from "@/utils/request";
import Store from '@/store/index'

/**
 * 告警接口
 */
/**
 * @param data {code:'*'}
 */

// 获取高风险岗位人员字典
export function getHighRiskDictionary(data) {
    return request({
        url: `/yqfk/riskArea/getHighRiskDictionary`,
        method: `get`,
        params: data
    })
}
// 获取高风险-告警规则列表
export function getHighRiskAlarmList(data) {
    return request({
        url: `/yqfk/riskArea/getHighRiskAlarm`,
        method: `get`,
        params: data
    })
}

// 获取高风险-告警规则列表的新增与编辑
export function saveHighRiskAlarm(data) {
    return request({
        url: `/yqfk/riskArea/saveHighRiskAlarm`,
        method: `post`,
        data
    })
}
// 获取高风险-告警规则的删除
export function deleteHighRiskAlarm(data) {
    return request({
        url: `/yqfk/riskArea/deleteHighRiskAlarm`,
        method: `get`,
        params: data
    })
}
/**
 * 高风险岗位人员（后端暂无接口，先模拟，后续替换）
 */
//高风险岗位人员-获取任务数据--传token
export function getHighRiskDetail(data) {
    return request({
        url: `/yqfk/riskArea/detail`,
        method: 'get',
        params: data
    })
}

// 高风险岗位人员-导出数据
export function exportHighRiskData(data) {
    return request({
        url: `/yqfk/riskArea/exportData?token=${data}`,
        method: 'post',
        responseType: "blob",
    })
}

// 告警-服务情况查询
export function getServiceReport(id) {
    return request({
        url: `/yqfk/alarmTopic/queryService?id=${id}`,
        method: 'get'
    })
}

// 告警-服务情况上报
export function submitServiceReport(ids, data) {
    return request({
        url: `/yqfk/alarmTopic/reportService?ids=${ids}`,
        method: 'post',
        data
    })
}

// 购药记录明细-获取告警设置信息
export function getDrugSetDetail(data) {
    return request({
        url: `/yqfk/drug/alarm/setting/detail`,
        method: 'get',
        params: data
    })
}

// 购药记录明细-告警设置
export function setDrugDetail(data) {
    return request({
        url: `/yqfk/drug/alarm/setting`,
        method: 'post',
        data
    })
}

// 购药记录明细-获取任务数据--传token
export function getDrugDetail(data) {
    return request({
        url: `/yqfk/drug/detail`,
        method: 'get',
        params: data
    })
}
// 购药记录明细-认领任务
export function getDrugClaim(data) {
    return request({
        url: `/yqfk/drug/claim`,
        method: 'get',
        params: data
    })
}
// 购药记录明细-进度反馈
export function drugHanding(datas,token) {
    return request({
        url: `/yqfk/drug/handing?token=${token}`,
        method: 'put',
        data:datas
    })
}

// 购药记录明细-导出数据
export function drugExportData(data) {
    return request({
        url: `/yqfk/drug/exportData?token=${data}`,
        method: 'post',
        responseType: "blob",
    })
}
// 特殊人群服务告警-告警设置
export function setSpecialPopulationAlarm(data) {
    return request({
        url: '/yqfk/alarmTopic/specialPeople/alarm/setting',
        method: 'post',
        data
    })
}
// 特殊人群服务告警-获取告警设置信息
export function getSpecialPopulationAlarm() {
    return request({
        url: '/yqfk/alarmTopic/specialPeople/alarm/setting/detail',
        method: 'get'
    })
}
// 重点场所扫码告警-告警设置
export function setKeyPlaceAlarm(data) {
    return request({
        url: '/yqfk/alarmTopic/keyPlace/alarm/setting',
        method: 'post',
        data
    })
}
// 重点场所扫码告警-获取告警设置信息
export function getKeyPlaceAlarm() {
    return request({
        url: '/yqfk/alarmTopic/keyPlace/alarm/setting/detail',
        method: 'get'
    })
}

// 获取告警图层最初数据
export function getAlarmLayerData(){
    return request({
      url: `/yqfk/alarmTopic/todayCounts`,
      method: `post`,
      showLoading: false
    })
}

// 模拟告警事件
export function mockAlarmEvent(data = {templateId: 5001}) {
  return request({
    url: `/yqfk/api/template/data/${data.templateId}`,
    method: `post`,
    data: {
      "sszj": "黄阁镇",
      "szxxdz": "麒麟广场",
      "csmc": "麒麟广场",
      "alarmDate": "2022-03-09",
      "alarmTime": "2022-03-09 09:32:00",
      "zrsmcs": 5,
      "qyzpjsmcs": 2,
      "gjjsry": "黄阁人员"
    }
  })
}

// 黄码人员聚集告警-告警设置
export function setYellowCodeAlarm(data) {
    return request({
        url: '/yqfk/alarmTopic/yellowCode/alarm/setting',
        method: 'post',
        data
    })
}
// 黄码人员聚集告警-获取告警设置信息
export function getYellowCodeAlarm() {
    return request({
        url: '/yqfk/alarmTopic/yellowCode/alarm/setting/detail',
        method: 'get'
    })
}

//获取最新的10条告警推送信息
export function getNewestAlarmList(){
    return request({
      url: `/yqfk/web/alarm/getNewestAlarmList`,
      method: 'get'
    })
}


//获取哨点工作人员告警详情
export function getSentinelWorkerAlarmDetail(data){
    return request({
        url: `/yqfk/hs-check/alarm/setting/detail`,
        method: 'get',
        params:data

    })
}

//设置哨点工作人员告警详情
export function setSentinelWorkerAlarm(data,templateId){
    return request({
        url: `/yqfk/hs-check/alarm/setting?templateId=${templateId}`,
        method: 'post',
        data
    })
}