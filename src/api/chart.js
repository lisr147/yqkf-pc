import request from "@/utils/request";

/**
 * 查询所有仪表盘面板
 * @params Array departmentIds
 * @params Number rp
 * @params Number page
 */
export function queryAllPanelItem(data) {
  return request({
    headers: { "content-type": "application/json" },
    url: "/rest/dashboard/app/queryPanelItem",
    method: "post",
    data
  });
}

/**
 * 添加仪表盘面板
 * @param data
 */
export function addPanel(data) {
  return request({
    url: "/rest/dashboard/addDashBoard",
    method: "post",
    data
  });
}

/**
 * 删除仪表盘面板
 * @param data [id,...]
 */
export function removePanel(data) {
  return request({
    url: "/rest/dashboard/deleteDashBoard",
    method: "post",
    data
  });
}

/**
 * 获取我关注的仪表盘面板
 * @param data
 */
export function getMyPanel(data) {
  return request({
    url: "/rest/dashboard/getDashBoardByPage",
    method: "get",
    params: data
  });
}

/**
 * 获取我关注的所有仪表盘面板id集合
 * @param data
 */
export function getMyPanelIds(data) {
  return request({
    url: "/rest/dashboard/getFollowedDashBoardId",
    method: "get",
    params: data
  });
}

//todo: 1.已添加的面板不再添加 2.面板置顶功能

/**
 * 通过panelItemId加载panelItemData
 * @params String id 面板id
 */
export function getPanelData({ url, method = "get", id }) {
  return request({
    url: "/portal/rest/panelItemData/getPanelItemData",
    method,
    params: { id }
  });
}

/**
 * 置顶仪表盘面板
 * @param panelItemId String
 */
export function pullPanel(data) {
  return request({
    url: "/rest/dashboard/setMaximumSortOrder",
    method: "get",
    params: data
  });
}

/**
 * 获取图表详情，仅适用于v2版本的图表
 * @param data
 */
export function getChartData(data) {
  return request({
    url: `/rest/panelItemData/getPanelItemData`,
    method: "get",
    params: data
  });
}

/**
 * 通过code获取图表，本项目中暂时用于疫情防控模块
 * @param data {code:'*'}
 */
export function getPanelItemDataByCode(data) {
  return request({
    url: `/portal/rest/panelItemData/getPanelItemDataByCode`,
    method: "get",
    params: data
  });
}


export function getRjPanelItemDataByCode(data) {
  let STR = "/screen";
  return request({
    baseURL: STR,
    url: `/web/chart/`+data.code,
    method: "get",
    params: data
  });
}