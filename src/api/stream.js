import request from '@/utils/request'

/**
 * 核酸采样点视频直播
 */

// 获取采样点列表
export function getSampPointList(data) {
  return request({
    url: `/yqfk/api/template/dataPage/${data.templateId}`,
    method: 'post',
    data
  })
}

// 发起视频
export function postPlayVideo(data) {
  return request({
    url: `/yqfk/api/video/conference/playVideo`,
    method: 'post',
    data
  })
}

//获取SDKAppID和key
export function getSDKAppID(params) {
  return request({
    url: `/yqfk/api/video/conference/setting/info`,
    method: 'get',
    params
  })
}

//获取UserSig
export function getUserSig(params) {
  return request({
    url: `/yqfk/api/video/conference/userSig`,
    method: 'get',
    params
  })
}

//解散房间
export function dismissRoom(roomId) {
  return request({
    url: `/yqfk/api/video/conference/dismissRoom?roomId=${roomId}`,
    method: 'get',
  })
}
