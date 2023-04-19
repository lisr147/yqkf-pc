import request from '@/utils/request'

/**
 * 获取基础设施分类
 */
export function getPublicBaseTypes (data) {
  return request({
    url: `/web/publicsvc/infrastructure/types`,
    method: 'get',
    params: data
  })
}

/**
 * 根据基础设施分类过滤
 */
export function getPublicBaseData(data) {
  return request({
    url: `/web/publicsvc/infrastructure/filter`,
    method: `post`,
    data
  })
}

/**
 * 获取人口热力图
 */
export function getPeopleHeatData(data) {
  return request({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.BASE_URL : '',
    url: `/static/data/nansha_people_heatmap.json`,
    method: `get`,
    params: data
  })
}

/**
 * 获取所有视频标签种类
 * @param data
 * @param data.type
 * 类型：
 * 0: 全部（默认值）
 * 1：产业经济
 * 2：安全监管
 * 3：城市治理
 * 4：政务服务
 * 5：生态宜居
 * 6：自贸区创新
 */
export function getVideoTags(data) {
  return request({
    url: `/deviceTag`,
    method: 'get',
    params: data
  })
}

/**
 * 获取规上企业的坐标数据
 * @param data
 * @param data.industryTypeId {Array}
 */
export function getIndustrialData(data){
  return request({
    url: `/web/statistic/v2/industrial/all`,
    method: `post`,
    data
  })
}

/**
 * 获取规上企业描述
 */
export function getEnterpriseDetail(data) {
  return request({
    url: `/web/statistic/v2/industrial/${data.id}`,
    method: `get`
  })
}

/**
 * 获取化工企业
 * @param data
 */
export function getChemicalCompanies(data) {
  return request({
    url: `/web/safetysupervision/metallurgys`,
    method: `get`,
    params: data
  })
}

/**
 * 获取环卫车辆过滤列表
 * @param data
 */
export function getSanitationCarTypes(data) {
  return request({
    url: `/web/citymanage/getSanitationCarDeviceType`,
    method: `get`,
    params: data
  })
}

/**
 * 获取水务领域过滤列表
 * @param data
 */
export function getWaterTypes(data) {
  return request({
    url: `/web/citymanage/getWaterDeviceType`,
    method: `get`,
    params: data
  })
}

// 获取政务服务机关团体数据
export function getGovermentBuild(data) {
  return request({
    url: `/web/governmentsvc/governments`,
    method: 'get',
    params: data
  })
}

// 获取公交路线信息
export function getBuslines(data) {
  return request({
    url: `/web/publicsvc/infrastructure/buslines`,
    method: 'get',
    params: data
  })
}

// 城市治理-获取交通设施服务类型
export function getUrbanFilterData(data) {
  return request({
    url: `/web/citymanage/transportation/types`,
    method: 'get',
    params: data
  })
}

// 获取自贸区板块数据
export function getFTAZoneData(data) {
  return request({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.BASE_URL : '',
    url: `/static/data/freeTradeArea.json`,
    method: 'get',
    params: data
  })
}

/**
 * 门禁人流的热力图
 * @param data
 * @param data.deviceUid 设备uid
 */
export function getDoorControllHeatmapData(data) {
  return request({
    url: `/web/statistic/v2/entranceGuardThermodynamic`,
    method: 'get',
    params: data
  })
}

/**
 * 获取通信领域5G基站过滤条件
 * @param data
 */
export function getBaseStationFilterData(data) {
  return request({
    url: `/web/publicsvc/getCommunicationDeviceType`,
    method: 'get',
    params: data
  })
}


