import request from '@/utils/request'
const baseURL = process.env.VUE_APP_PORTAL_API
const moduleName = '/rest/org/user/'
/**
 * 新增用户
 * @param String userName
 * @param String password
 * @param String mobile
 * @param String exmail
 * @param String position
 * @param Boolean enabled // true启用 false禁用
 * @param String status  // 0 正常 1 删除
 * @param String fullName
 * @param Number departmentId
 */
export function createUser (data) {
  return request({
    baseURL,
    url: moduleName + 'saveOrUpdateUser',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 * @param String id
 * @param String password
 * @param String mobile
 * @param String exmail
 * @param String position
 * @param Boolean enabled // true启用 false禁用
 * @param String status  // 0 正常 1 删除
 * @param String fullName
 * @param Number departmentId
 */
export function updateUser (data) {
  return request({
    baseURL,
    url: moduleName + 'saveOrUpdateUser',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param String userIds
 */
export function removeUser (data) {
  return request({
    baseURL,
    url: moduleName + 'deleteUsers',
    method: 'get',
    params: data
  })
}

/**
 * 搜索用户列表
 * @param String keyword  用户fullname关键字
 * @param Boolean enabled
 * @param String departmentName
 * @param String username
 * @param String status
 * @param Number departmentId
 * @param Number rp
 * @param Number page
 */
export function queryUser (data) {
  return request({
    baseURL,
    url: moduleName + 'queryUsers',
    method: 'post',
    data
  })
}

/**
 * 获取用户详情
 * @param Number userId
 */
export function getUser (data) {
  return request({
    baseURL,
    url: moduleName + 'getUser',
    method: 'get',
    params: data
  })
}

/**
 * 重置密码
 * @param Number id
 * @param String password
 */
export function resetPassword (data) {
  return request({
    baseURL,
    url: moduleName + 'resetPassword',
    method: 'post',
    data
  })
}

/**
 * 解锁账号
 * @param data
 * @param data.userId
 */
export function unlockAccount(data){
  return request({
    baseURL: process.env.VUE_APP_ESSO_API,
    url: 'user/unlock',
    method: 'get',
    headers: { 'Content-Type': 'multipart/form-data' },
    params: data
  })
}
