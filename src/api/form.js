import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API
/**
 * 获取所有表单状态
 * @param data
 */
export function getAllFormState(data){
  return request({
    baseURL,
    url: '/formMeta/stateList',
    param: data
  })
}

/**
 * 新增表单
 * @param formName {String} 表单名称
 * @param formKey {String} 表单标识(若为空则自动获取)
 * @param formJson {Object} 表单描述
 * @param state {String} 表单状态
 * @param submitSettings{Object}
 * @param submitSettings.endTime {String} 填单范围 PUBLIC, SELECTION, GOVERNMENT
 * @param submitSettings.submitScope {String} 用户id列表
 * @param permissions {Array} 数据明细查看权限 SELF, SELECTION, GOVERNMENT
 */
export function addForm (data) {
  return request({
    baseURL,
    url: '/formMeta',
    method: 'post',
    data
  })
}
/**
 * 查找表单
 */
export function queryForm (data) {
  return request({
    baseURL,
    url: '/formMeta/pageList',
    method: 'post',
    data
  })
}
/**
 * 删除表单
 * @param String id 或者 ids
 */
export function removeForm ({id}) {
  return request({
    baseURL,
    url: `/formMeta/${id}`,
    method: 'delete'
  })
}

/**
 * 修改表单状态
 * @param id
 * @param state [stop, publish]
 */
export function setFormState({id, state}){
  return request({
    baseURL,
    url: `/formMeta/${id}/${state}`,
    method: 'post'
  })
}

/**
 * 复制表单
 * @param id
 */
export function copyForm({id}){
  return request({
    baseURL,
    url: `/formMeta/copy/${id}`,
    method: 'post'
  })
}

/**
 * 获取表单详情
 * @param id
 */
export function getForm({id}){
  return request({
    baseURL,
    url: `/formMeta/${id}`,
    method: 'get'
  })
}

/**
 * 修改表单详情，参数同 新增表单
 * @param id
 */
export function updateForm(data){
  return request({
    baseURL,
    url: `/formMeta/${data.formKey}`,
    method: 'put',
    data
  })
}


/**
 * 当前用户可见表单名称列表
 */
export function getAccessFormList(data){
  return request({
    baseURL,
    url: `/formMeta/authorizedList`,
    method:  'get',
    params: data
  })
}

/**
 * 查看表单实例明细
 * @param formKey
 * @param id
 */
export function getFormInstanceDetail({formKey, id}){
  return request({
    baseURL,
    url: `/formDataDetail/${formKey}/${id}`,
    method: 'get'
  })
}

/**
 * 删除表单实例
 * @param formKey
 * @param id
 */
export function removeFormInstance({formKey, id}){
  return request({
    baseURL,
    url: `/formDataDetail/${formKey}/${id}`,
    method: 'DELETE',
    headers:{
      'ContentType': 'multipart/form-data'
    }
  })
}
