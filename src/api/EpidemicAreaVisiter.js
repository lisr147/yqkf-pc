import request from "@/utils/request";
/**
 * 风险地区流入趋势
 * @param {} data 
 * @returns 
 */
export function getPanelItemDataByCode(params) {
  return request({
    url: `/portal/rest/panelItemData/getPanelItemDataByCode`,
    method: "get",
    params
  });
}
/**
 * （高、中、低）风险地区流入总数
 * @param {*} data 
 * @returns 
 */
export function epidemicAreaCount(params) {
  return request({
    baseURL: "/yqfk",
    url: `/chart/web/epidemicAreaPeople/epidemicAreaCount`,
    method: "get",
    params
  });
}
/**
 * 查询高风险地区流入人口排行
 * @param {*} data 
 * @returns 
 */
 export function highRiskAreaPeopleRanking(params) {
  return request({
    baseURL: "/yqfk",
    url: `/chart/web/epidemicAreaPeople/highRiskAreaPeopleRanking`,
    method: "get",
    params
  });
}