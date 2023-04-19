import request from '@/utils/request'

const baseURL = location.origin + process.env.VUE_APP_PORTAL_API
const host = process.env.VUE_APP_PORTAL_HOST
/**
 * 获取当前dashboard的布局
 * @param appCode 所属应用id
 * @param dashboarCode 所属专题id
 */
export function getDashboardLayout (data) {
  return request({
    baseURL,
    url: `/rest/dashboard/getDashBoard`,
    headers: { hideLoading: true },
    method: 'get',
    params: data
  })
}

/**
 * 保存当前dashboard的布局
 */
export function saveDashboardLayout (data) {
  return request({
    baseURL,
    url: `/rest/dashboard/saveOrUpdateDashBoard`,
    method: 'post',
    data,
    headers: { hideNotify: true }
  })
}

/**
 * 获取图表数据
 * @param data
 * @param data.id 图表id
 */
export function getChartData (data) {
  return request({
    baseURL,
    url: `/rest/panelItemData/getPanelItemData`,
    headers: { hideLoading: true },
    method: 'get',
    params: data
  })
}

/**
 * 获取所有可选的图表
 * @param appInfoId {String} 所属应用
 * @param departmentIds {Array} 所属部门
 * @param panelItemDomainIds {Array} 领域id
 * @param page
 * @param rp
 */
export function getAllChartBoards ({ title, appInfoId, departmentIds, panelItemDomainIds, itemType, page = 1, rp = 10 } = {}) {
  return request({
    baseURL,
    url: `/rest/panelItem/queryPanel`,
    method: 'post',
    data: { title, appInfoId, departmentIds, panelItemDomainIds, itemType, page, rp },
    headers: {
      hideNotify: true
    }
  })
}

/**
 * 获取所有领域
 */
export function getPanelItemDomain () {
  return request({
    baseURL,
    url: `/rest/panelItem/getPanelItemDomain`,
    method: 'get'
  })
}
/**
 * 获取缩略图
 */
export function thumbnail (panelId) {
  return host + baseURL + `/rest/panelItem/thumbnail?panelId=${panelId}`
}
