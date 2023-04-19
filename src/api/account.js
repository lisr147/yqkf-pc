import request from '@/utils/request'

const moduleName = '/rest/org/user/'

/**
 * 获取我的基本信息
 */
export function getMyInfo() {
  return request({
    url: '/vform/web/getUserInfo',
    method: 'get'
  })
}


/**
 * 发送验证码
 * @param String identifyType 验证方式（mobile为手机，email为邮箱）
 * @param String newMobile  新手机号码（输入新手机时为必填）
 */
export function sendVerifyCode(data) {
  return request({
    url: moduleName + 'sendVerifyCode',
    method: 'post',
    data
  })
}

/**
 * 账号信息中保存我的基本信息
 * @param Number id
 * @param String fullName
 * @param String email
 * @param String mobile
 * @param String password
 */
export function saveMyInfo(data) {
  return request({
    url: '/portal' + moduleName + 'saveOrUpdateUserBaseInfo',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param String userId
 * @param String oldPassword
 * @param String newPassword
 */
export function updatePassword(data) {
  return request({
    url: '/portal' + moduleName + 'updateUserPassword',
    method: 'post',
    data
  })
}