import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API


/**
 * 新增预约记录
 */
 export function newReserveRequest (data) {
  return request({
    baseURL,
    url: `/api/truckDriver/createAppointmentLog`,
    method: 'post',
    data
  })
}

/**
 * 查询预约记录
 */
 export function queryDataPage (data) {
  return request({
    baseURL,
    url: `/api/truckDriver/dataPage/${data.templateId}`,
    method: 'post',
    data
  })
}

/**
 * 查询预约记录详情
 */
 export function queryDataDetail(data) {
  return request({
    baseURL,
    url: `/api/truckDriver/appointmentLogDetailQuery`,
    method: 'get',
    params: data
  })
}

/**
 * 查询公司
 */
 export function queryCompanyList() {
  return request({
    baseURL,
    url: `/api/truckDriver/getCompanyInfo`,
    method: 'get'
  })
}

/**
 * 货车司机预约和通行告警设置
 */
export function truckDriverAlarmSet (data) {
    return request({
        baseURL,
        url: `/api/truckDriver/alarm/setting`,
        method: 'post',
        data
    })
}


/**
 * 货车司机预约和通行告警详情
 */
export function getTruckDriverAlarmDetail (data) {
    return request({
        baseURL,
        url: `/api/truckDriver/alarm/setting/detail`,
        method: 'get',
        data
    })
}

/**
 * 获取微警认证二维码地址
 */
 export function getLoginCode () {
  return request({
      baseURL,
      url: `/api/wj/loginQrCode`,
      method: 'get'
  })
}

/**
 * 公众号启动微信小程序签名认证
 */
 export function getWXappSign (params) {
  return request({
      baseURL,
      url: `/yqfk/api/asrYy/signature`,
      method: 'get',
      params
  })
}

/**
 * 获取微警认证信息
 */
 export function getWeiJingInfo (params) {
  return request({
      baseURL,
      url: `/api/wj/getUserInfo`,
      method: 'get',
      params
  })
}