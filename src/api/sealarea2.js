import request from '@/utils/request'

// 封控管理 -  获取封控管理列表
export function getSealArea(data) {
  return request({
    url: `/yqfk/sealManage/findByMapType`,
    params: { ...data, showModal: false },
  });
}

// 封控管理-创建
export function addSealArea(data) {
  return request({
    url: `/yqfk/sealManage`,
    method: 'post',
    data
  })
}

// 封控管理-修改
export function editSealArea(data) {
  return request({
    url: `/yqfk/sealManage`,
    method: 'put',
    data
  })
}


// 封控管理-删除
export function deleteSealArea(data) {
  return request({
    url: `/yqfk/sealManage/${data.ids}`,
    method: 'delete',
    data
  })
}

// 解析WKT格式数据为数组
export function parsePolygon(value) {
  let arr = value.replace(/(\(\()|(\)\))/ig, '').split('),(')
  let res = arr.map(v => {
    let lngLats = v.split(',')
    return lngLats.map(v2 => {
      let [lng, lat] = v2.split(' ')
      return [parseFloat(lng), parseFloat(lat)]
    })
  })
  return res
}

// 格式化数组为WKT格式数据
export function stringfyPolygon(data) {
  const arr = []

  data.forEach(item => {

    //校验并保证数据为闭合多边形
    const len = item.length
    if (item[0].toString() !== item[len - 1].toString()) {
      item.push([...item[0]])
    }

    let subArr = item.map(v => {
      return `${v[0]} ${v[1]}`
    })
    arr.push(`(${subArr.join(',')})`)
  })

  return `(${arr.join(',')})`
}

// 封控管理 -  根据Id获取封控/管控区
export function getSealAreaById(id, showLoading = false) {
  return request({
    url: `/yqfk/sealManage/${id}`,
    showLoading
  })
}

// 封控管理 -  获取封控/管控区人口数据
export function getSealAreaPopulation(areaId) {
  return request({
    url: `/yqfk/population/${areaId}`,
    showLoading: false
  })
}

// 封控管理 -  获取封控/管控区红码黄码数据
export function getHealthCode(areaId) {
  return request({
    url: `/yqfk/population/healthCode/${areaId}`,
    showLoading: false
  })
}

// 封控管理 -  获取封控/管控区物资数据
export function getMaterial(areaId) {
  return request({
    url: `/yqfk/population/material/${areaId}`,
    showLoading: false
  })
}

// 封控管理 -  获取封控/管控区物资配送数据
export function getMaterialDistribution(areaId) {
  return request({
    url: `/yqfk/population/materialDistribution/${areaId}`,
    showLoading: false
  })
}

// 封控管理 -  获取封控/管控区密接/次密接数据
export function getSealAreaContact(areaId) {
  return request({
    url: `/yqfk/population/sealAreaContact/${areaId}`,
    showLoading: false
  })
}

// 封控管理 -  获取封控/管控区特殊人群数据
export function getSealAreaSpecial(areaId) {
  return request({
    url: `/yqfk/population/sealAreaSpecial/${areaId}`,
    showLoading: false
  })
}

// 封控管理 -  获取封控/管控区特殊人群服务情况
export function getSealAreaSpecialService(areaId) {
  return request({
    url: `/yqfk/population/sealAreaSpecialService/${areaId}`,
    showLoading: false
  })
}

// 封控管理 -  获取封控/管控区三人小组数据
export function getSealAreaThreeGroup(areaId, filters) {
  return request({
    url: `/yqfk/population/sealAreaThreeGroup/${areaId}`,
    method: 'post',
    data: {
      condition: {},
      page: 1,
      pageSize: 10,
      ...filters
    },
    showLoading: false
  })
}

// 封控管理 -  获取封控/管控区核酸采样点数
export function getSealAreaHsPoint(areaId) {
  return request({
    url: `/yqfk/population/sealAreaHsPoint/${areaId}`,
    showLoading: false
  })
}

// 封控管理 -  获取封控区群众需求反馈需求明细列表，参数 xqlx 需求类型（多个时英文逗号分割）
export function getSealAreaFeedbackList(demandType) {
  return request({
    url: `/yqfk/population/feedbackList?xqlx=${demandType}`,
    showLoading: false
  })
}

// 封控管理 -  获取封控/管控区密接次密接人员下钻
export function getContactDetail(areaId, data) {
  return request({
    url: `/yqfk/population/getContactDetail/${areaId}`,
    method: 'post',
    data,
    showLoading: false
  })
}

// 封控管理 -  获取封控 / 管控区红码黄码人员下钻;
export function getHealthCodeDetail(areaId, data) {
  return request({
    url: `/yqfk/population/getHealthCodeDetail/${areaId}`,
    method: "post",
    data,
    showLoading: false,
  });
}

// 封控管理 -  推送物资储备/物资配送消息
export function pushMaterialInfo(areaId, type) {
  return request({
    url: `/yqfk/population/pushMaterialInfo/${areaId}?type=${type}`,
  })
}

// 封控管理 -  获取封控/管控区核酸采样点下钻
export function getSealAreaHsPointList(areaId, templateId, data) {
  return request({
    url: `/yqfk/population/getSealAreaHsPointList/${areaId}?templateId=${templateId}`,
    method: 'post',
    data,
    showLoading: false
  })
}

// 城中村治理
export function cityVillageManageTotal(areaId) {
  return request({
    url: `/yqfk/population/cityVillageManageTotal/${areaId}`,
    method: 'get',
    showLoading: false
  })
}

// 封控区防疫密接、次密接统计数据
export function getConcatStatistics(data) {
  return request({
    url: '/yqfk/web/epidemic/statistics',
    method: 'post',
    showLoading: false,
    data
  })
}

// 封控区防疫密接、次密接明细数据
export function queryConnection(data){
  return request({
    url: '/yqfk/web/epidemic/queryConnection',
    method: 'post',
    data,
    showLoading: false
  })
}

//  封控区防疫关联场所明细数据
export function queryCorrelateSite(data){
  return request({
    url: '/yqfk/web/epidemic/querySite',
    method: 'post',
    data,
    showLoading: false
  })
}

// 扫码记录图层下钻详情数据
export function queryScanRecordDetail(data){
  return request({
    url: '/yqfk/api/es/yxblsmrltDetails',
    method: 'post',
    data,
    showLoading: false
  })
}