import request from '@/utils/request'
const baseURL = process.env.VUE_APP_PORTAL_API
/**
 * 获取所有应用列表(屏蔽部分系统)
 * @param String appName
 * @param String appCode
 * @param Boolean disabled
 * @param Number departmentId
 * @param Number rp
 * @param Number page
 */
export function getAllApps (data) {
  return request({
    baseURL,
    url: '/rest/auth/appInfo/appinfoList',
    method: 'post',
    data
  })
}
