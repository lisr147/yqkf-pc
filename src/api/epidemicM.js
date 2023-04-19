import request from "@/utils/request";
const baseURL = process.env.VUE_APP_SCREEN_API;

/**
 * 疫苗接种情况数字项展示
 */
export function getCountStaticData() {
  return request({
    baseURL,
    url: "/web/topPanel/list/ym",
    method: "get"
  });
}

/**
 * 疫苗接种总览
 */
export function getDayCityRank() {
  let STR = "/yqfk";
  return request({
    baseURL:STR,
    url: "/web/mobileData/dayCityRank",
    method: "get"
  });
}

/**
 * 人员流动情况数字展示
 */
export function get_DataStatistics() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-ryld/dataStatistics",
    method: "get"
  });
}

//核酸检测总览
//web/nulacid/nulacidStatistics
export function get_nulacidStatistics() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/web/nulacid/nulacidStatistics",
    method: "get"
  });
}

export function get_covidInfo() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/web/covid/covidInfo",
    method: "get"
  });
}

export function get_GotoLiwanRC() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-ryld/gotoLiwanRC",
    method: "get"
  });
}

export function get_GotoLwNoHSJC() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-ryld/gotoLwNoHSJC",
    method: "get"
  });
}
//http://develop.iot-cas.com:8081/screen/yqfk-ryld/nsq7Dayhsjc
export function get_nsq7Dayhsjc() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-ryld/nsq7Dayhsjc",
    method: "get"
  });
}
//http://develop.iot-cas.com:8081/screen/web/covid/covidInfo

// 疫情防控-酒店隔离 总览
export function get_JdglGljdzl() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/gljdzl",
    method: "get"
  });
}

// 疫情防控-酒店隔离 酒店分类情况
export function get_JdglJdflqk() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/jdflqk",
    method: "get"
  });
}

// 疫情防控-酒店隔离 隔离人数情况情况
export function get_JdglGlrsqk() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/glrsqk",
    method: "get"
  });
}

// 疫情防控-酒店隔离 酒店总览-今天计划
export function get_JdglJrjh() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/jrjh",
    method: "get"
  });
}

// 疫情防控-酒店隔离 酒店总览-更新时间
export function get_UpdateTime() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/gljdzlUpdateTime",
    method: "get"
  });
}

// 疫情防控-酒店隔离 酒店总览-入境者酒店列表
export function get_JdglRjzjdlb() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/rjzjdlb",
    method: "get"
  });
}

// 疫情防控-酒店隔离 酒店总览-入境者密接人员酒店列表
export function get_JdglRjzmjjdlb() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/rjzmjjdlb",
    method: "get"
  });
}

// 疫情防控-酒店隔离 酒店总览-本土（广州市）密切接触者酒店列表
export function get_JdglBtlb() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/btlb",
    method: "get"
  });
}

// 疫情防控-酒店隔离 隔离酒店列表
export function get_JdList() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/jdList",
    method: "get"
  });
}

// 疫情防控-酒店隔离 隔离酒店信息
export function get_JdInfo(params) {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/yqfk-jdgl/jdxx",
    method: "get",
    params
  });
}

// 疫情防控-酒店隔离 隔离酒店信息
export function get_NulacidGetUpdateTime() {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/web/nulacid/getUpdateTime",
    method: "get"
  });
}

//获取隔离酒店总览
export function get_HotelAmount() {
  let STR = "/yqfk";
  return request({
    baseURL: STR,
    url: "/chart/statistics/hotel/amount",
    method: "get"
  });
}
//获取所有酒店酒店基础数据
export function get_HotelAllBasic() {
  let STR = "/yqfk";
  return request({
    baseURL: STR,
    url: "/chart/hotel/all/basic",
    method: "get"
  });
}

// 获取流调人员信息接口
export function get_ldryMsg() {
  let STR = "/yqfk";
  return request({
    baseURL: STR,
    url: "/web/yqfkry/getldryMsg",
    method: "get"
  });
}
//获取人员详情表头信息
export function get_TemplateConfig() {
  let STR = "/yqfk";
  return request({
    baseURL: STR,
    url: "/api/template/config/10001?show=true",
    method: "get"
  });
}

//次/密接列表查询
export function searchDataByInfo(data) {
  let STR = "/yqfk";
  return request({
    baseURL: STR,
    url: "/web/isolation/searchDataByInfo",
    method: "post",
    data
  });
}

// 截至6月30日应接种第二针疫苗人数报表数据
export function get_SecondTotalNum(data) {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: "/web/chart/getSecondTotalNum",
    method: "get",
    data
  });
}

//昨日核酸检测数据概览
export function get_overview() {
  let STR = "/yqfk";
  return request({
    baseURL: STR,
    url: "/web/zdhy/hs/overview",
    method: "get"
  });
}
//昨日未做核酸详单
export function post_detail(data) {
  let STR = "/yqfk";
  return request({
    baseURL: STR,
    url: "/web/zdhy/hs/detail",
    method: "post",
    data
  });
}
// 导出重点行业人员核酸数据
export function exportHsData(data) {
  let STR = "/yqfk";
  return request({
    baseURL: STR,
    url: `/web/zdhy/hs/export`,
    method: 'post',
    data,
    responseType: "blob",
  })
}
// 一图总览---常态化防疫监控---下钻列表
export function getPageCodeScanDetail(data) {
  return request({
    url: `/yqfk/normalizedEpm/pageCodeScanDetail`,
    method: 'post',
    data,
  })
}
