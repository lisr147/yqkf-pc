import request from '@/utils/request'

/**
 * 从指定app中获取用户的操作权限
 * @params String appId
 */
export function getUserAuthority (data) {
  return request({
    url: '/vform/system/authority/getUserAuthority',
    method: 'get',
    params: data
  })
}

export function getNavigation(data) {
  return request({
    url: '/vform/system/menu',
    method: 'get',
    params: data
  })
}
