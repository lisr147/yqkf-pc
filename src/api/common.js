import request from "@/utils/request";
/**
 * 通用接口
 */

/**
 * 通过id获取模板数据
 */
export function getTemplateData(data) {
  return request({
    url: `/yqfk/api/template/dataPage/${data.templateId}`,
    method: "post",
    data: Object.assign(
      {
        page: 1,
        pageSize: 10,
      },
      data
    ),
  });
}

/**
 * 根据模板id, 加载模板配置
 */
export function getTemplateConfig(data) {
  return request({
    url: `/yqfk/api/template/config/${data.id}`,
    method: "get",
  });
}

/**
 *根据模板id,新增数据
 */
export function addTemplateData(data) {
  return request({
    url: `/yqfk/api/template/data/${data.templateId}`,
    method: 'post',
    data
  })
}

/**
 *根据数据id,修改数据
 */
export function putTemplateData(id, data) {
  delete data.createTime;
  delete data.updateTime; // ?
  return request({
    url: `/yqfk/api/template/data/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除数据
 */
export function deleteDataByIds(ids) {
  return request({
    url: `/yqfk/api/template/data/${ids}`,
    method: 'delete'
  })
}

/**
 * 根据模板id,导出数据
 */
export function exportData(data) {
  return request({
    url: `/yqfk/api/template/exportData/${data.templateId}`,
    method: 'post',
    responseType: "blob",
    data
  })
}
/**
 * 下载导入失败数据
 */
export function exportFailData(fileId) {
  return request({
    url: `/yqfk/api/template/checkData/fail/${fileId}`,
    method: 'post',
    responseType: "blob",
  })
}

