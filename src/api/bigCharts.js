import request from "@/utils/request";
import { templateId } from "../config/menuData";
import Store from '@/store/index'
/**
 * 通过code获取图表，本项目中暂时用于疫情防控模块
 * @param data {code:'*'}
 */
export function getPanelItemDataByCode(data) {
  let headers = {}
  if (window.location.href.includes('/medical') || window.location.href.includes('/transferPage')) {
    headers = { 'Authorization' : "Bearer " + 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6IjEiLCJkZXBhcnRtZW50SWQiOiJudWxsIiwidGVuYW50SWQiOiJudWxsIiwiZW50aXR5QXV0aG9yaXR5IjoiU1lTX0FETUlOIn0.gF4EpY_FBLqBEu3wt0TfuVB_XY4AMG7Yz6XQiSqv-666C_HuJ3Iv3FATuqNNvgaTx1fP-bWjtuznGkaKzZiLEQ'}
  }
  return request({
    headers,
    url: `/portal/rest/panelItemData/getPanelItemDataByCode`,
    method: "get",
    params: data,
    showLoading: false
  });
}

// 核酸检测人数 统计
export function getHSTotal() {
  return request({
    url: `/screen/web/nulacid/nulacidStatistics`,
    method: "get",
    params: {}
  });
}

// 酒店相关的接口
export function getJD1() {
  return request({
    url: `/screen/yqfk-jdgl/gljdzl`,
    method: "get",
    params: {}
  });
}
// 酒店相关的接口
export function getJD2() {
  return request({
    url: `/screen/yqfk-jdgl/jrjh`,
    method: "get",
    params: {}
  });
}
// 获取疫苗接种报表更新时间
export function getYMUpdateTime() {
  return request({
    url: `/screen/web/chart/getUpdateTime`,
    method: "get",
    params: {}
  });
}
// 获取核酸检测报表更新时间
export function getHSUpdateTime() {
  return request({
    url: `/screen/web/nulacid/getUpdateTime`,
    method: "get",
    params: {}
  });
}

// 获取重点场所告警信息
export function getAlarmList() {
  return request({
    url: `/screen/web/alarm/list`,
    method: "get",
    params: {sszj:Store.state.common.town,showModal:false}
  });
}

// 获取中高风险来粤统计
export function getRiskAreasMsg() {
  return request({
    url: `/yqfk/riskArea/getRiskAreasMsg`,
    method: "get",
    params: {}
  });
}
// 获取党组织和党员概况
export function getPartyGeneral() {
  return request({
    url: `/yqfk/web/mobileData/partyGeneral`,
    method: "get",
    params:Object.assign({sszj:Store.state.common.town,showModal:false})
  });
}

// 核酸采样点按镇街分布（黄码人员，中高风险来南沙人员）
export function getNucleicAcidStreet(params) {
  return request({
    url: `/yqfk/web/mobileData/nucleicAcidStreet`,
    method: "get",
    params:Object.assign({sszj:Store.state.common.town,showModal:false},params)
  });
}

// 核酸采样点按网格分布
export function getNucleicAcidWg(params) {
  return request({
    url: `/yqfk/web/mobileData/nucleicAcidWg`,
    method: "get",
    params:Object.assign({showModal:false},params)
  });
}

//  核酸采样点获取镇街 详情列表
export function getNucleicAcidStreetMore(data) {
  return request({
    url: `/yqfk/api/template/dataPage/more/${data.templateIds}`,
    method: "post",
    data: Object.assign({
      showModal: false,
    }, data),
  });
}

// 中高风险人员来穗
export function getRiskAreasList(templateId,data){
  return request({
    url: `/yqfk/riskArea/getRiskAreasList/${templateId}`,
    method: "post",
    data
  });
}
//中高风险地区来粤返粤人员核查情况
export function getRiskAreasMsgPc(params){
  return request({
    url: '/yqfk/riskArea/getRiskAreasMsgPC',
    method: "get",
    params:Object.assign({sszj:Store.state.common.town,showModal:false},params)
  });
}
//酒店管理信息
export function getHotelInformationOverview(params){
  return request({
    url: '/yqfk/web/hotel/gdzlxxStreet',
    method: "get",
    params:Object.assign({sszj:Store.state.common.town,showModal:false},params)
  });
}
//冷链仓库工作人员统计
export function getColdWarehouseInfo(params){
  return request({
    url: '/yqfk/web/mobileData/coldWorker',
    method: "get",
    params:Object.assign({sszj:Store.state.common.town,showModal:false},params)
  });
}

// 核酸检测小组采样能力统计
export function getNucleicGroupData(params){
  return request({
    url: '/yqfk/web/mobileData/nucleicGroup',
    method: "get",
    params:Object.assign({sszj:Store.state.common.town,showModal:false},params)
  });
}

// 水产品生产企业产量统计
export function getWaterProductData(params){
  return request({
    url: '/yqfk/web/mobileData/waterProduct',
    method: "get",
    params:Object.assign({sszj:Store.state.common.town,showModal:false},params)
  });
}

// 进口物料企业员工接种情况
export function getJkwlygjz(params){
  return request({
    url: '/screen/web/covid/getJkwlygjz',
    method: "get",
    params:Object.assign({sszj:Store.state.common.town,showModal:false},params)
  });
}

// 医院物资统计
export function getHospitalMaterial(params){
  return request({
    url: '/yqfk/web/mobileData/hospitalMaterial',
    method: "get",
    params:Object.assign({sszj:Store.state.common.town,showModal:false},params)
  });
}

// 获取负压车辆台账
export function getStandBookOfVehical(data) {
  return request({
    url: `/yqfk/web/mobileData/standBook`,
    method: `get`,
    params: data
  })
}


// 获取镇街统计报表接口
export function getStreetStatistics(data) {
  return request({
    url: `/yqfk/web/mobileData/getStreetStatistics`,
    method: `get`,
    params: data
  })
}


// 获取网格统计报表接口
export function getWgStatistics(data) {
  return request({
    url: `/yqfk/web/mobileData/getWgStatistics`,
    method: `get`,
    params: data
  })
}

// 获取封控区域面积统计
export function getControlArea(data) {
  return request({
    url: `/yqfk/web/mobileData/controlArea`,
    method: `get`,
    params: data
  })
}

// 封控区域人口统计
export function getControlPeople(data) {
  return request({
    url: `/yqfk/web/mobileData/controlPeople`,
    method: `get`,
    params: data
  })
}

// 获取封控区域所属网格(用于封控区左侧报表)
export function getControlAreaSswgs(data) {
  return request({
    url: `/yqfk/controlArea/getSswgs`,
    method: `get`,
    params: data
  })
}
