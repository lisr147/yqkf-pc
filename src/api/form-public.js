import request from '@/utils/request'

/**
 * 获取表单详情(不需要用户认证)
 * @param id
 */
export function getForm({id}){
  return request({
    baseURL: '/vform',
    url: `/public/formMeta/${id}`,
    method: 'get'
  })
}


/**
 * 查看表单实例明细（公开）
 * @param formKey
 * @param id
 */
export function getFormInstanceDetail({formKey, id}){
  return request({
    url: `/public/formDataDetail/${formKey}/${id}`,
    method: 'get'
  })
}


/**
 * 客户端提交表单
 * @param formKey
 * @param clientMobile
 * @param clientMobileCode
 * @param valueMap
 */
export function submitForm(data){
  return request({
    url:`/public/formDataDetail`,
    method: 'post',
    data
  })
}
