import request from '@/utils/request'
const baseURL = process.env.VUE_APP_PORTAL_API
/**
 * 根据部门id获取人员信息
 * @param departmentId {String} 部门id
 */
export function queryUsersByDepartment(data) {
  return request({
    baseURL,
    url: `/system/user/queryUsersByDepartment`,
    method: 'post',
    data
  })
}
/**
 * 获取部门详情
 *  @param Number departmentId
 */
export function getDepartment (data) {
  return request({
    baseURL,
    url: '/rest/org/department/getDepartment',
    method: 'get',
    params: data
  })
}
/**
 * 获取部门树
 */
export function getTree (data) {
  return request({
    baseURL,
    url: '/rest/org/department/getOrgTreeNodes',
    method: 'get',
    params: data
  })
}

/**
 * 获取下级树列表
 * @param Number departmentId
 * @param Number limit
 */
export function getSubTree (data) {
  return request({
    baseURL,
    url: '/rest/org/department/findSubDepartment',
    method: 'post',
    data
  })
}
