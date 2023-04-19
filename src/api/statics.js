import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API
/**
 * 统计数据_明细数据_列表
 * @param pageNum  {String}
 * @param pageSize {String}
 * @param formKey  {String}
 * @param submitIp  {String}
 * @param startTime  {String}
 * @param endTime  {String}
 */
export function getFormInstanceList(data){
  return request({
    baseURL,
    url: `/formDataDetail`,
    method:  'get',
    params: data
  })
}

/**
 * 统计数据_明细数据_列表_统计
 * @param formKey  {String}
 */
export function getFormInstanceStatics(formKey) {
  return request({
    baseURL,
    url: `/formDataDetail/${formKey}/statics`,
    method: 'get',
  })
}

/**
 * 统计数据_明细数据_导出
 * @param formKey {String}
 * @param submitIp {String}
 * @param startTime {String}
 * @param endTime {String}
 */
export function exportData(data){
  return  request({
    baseURL,
    url:`/formDataDetail/export`,
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

/**
 * 统计数据_明细数据_导出附件
 * @param formKey {String}
 * @param submitIp {String}
 * @param startTime {String}
 * @param endTime {String}
 */
export function exportAttachment(data){
  return request({
    baseURL,
    url: `/formDataDetail/exportFile`,
    method: 'get',
    params:data,
    headers:{
      'ContentType': 'multipart/form-data'
    },
    responseType: 'blob'
  })
}

/**
 * 统计数据_填写情况(饼图)
 * @param formKey {String}
 */
export function getFillingStatus(data){
  return request({
    baseURL,
    url: `/statistics/formData/fillingStatus`,
    params: data
  })
}

/**
 * 统计数据_填写情况_未填写人员_导出
 * @param formKey {String}
 */
export function exportUnCompleteData(data){
  return request({
    baseURL,
    url: `/submitUser/unComplete/export`,
    params: data,
    method: 'get',
    responseType: 'blob',
  })
}

/**
 *统计数据_填写情况_未填写人员_列表
 * @param pageNum  {String}
 * @param pageSize {String}
 * @param formKey  {String}
 */
export function getUnCompleteList(data) {
  return request({
    baseURL,
    url: `/submitUser/unComplete`,
    params: data
  })
}

/**
 * 相同IP统计
 * @param formKey  {String}
 */
export function topIp(data) {
  return request({
    baseURL,
    url: `/statistics/formData/topIp`,
    params: data
  })
}
