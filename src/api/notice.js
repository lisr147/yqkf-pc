import request from '@/utils/request'

const baseURL = process.env.VUE_APP_PORTAL_API

/**
 * 发布通知
 * @param msgContent
 * @param msgTitle
 */
export function publicNotice (data) {
  return request({
    baseURL,
    url: `/rest/notice`,
    method: 'post',
    data
  })
}


/**
 * 获取列表
 * @param msgTitle 标题名称
 * @param rp 10
 * @param page 1
 */
export function queryNotices (data) {
  return request({
    baseURL,
    url: `/rest/notice/list`,
    method: 'post',
    data
  })
}


/**
 * 删除通知
 * @param msgTitle 标题名称
 * @param rp 10
 * @param page 1
 */
export function removeNotice ({id}) {
  return request({
    baseURL,
    url: `/rest/notice/${id}`,
    method: 'delete'
  })
}


/**
 * 获取通知详情
 * @param msgTitle 标题名称
 * @param rp 10
 * @param page 1
 */
export function getNotices ({id}) {
  return request({
    baseURL,
    url: `/rest/notice/${id}`,
    method: 'get'
  })
}
