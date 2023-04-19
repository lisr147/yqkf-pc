import request from "@/utils/request";
/**
 * 流调信息接口
 */

/**
 * 流调信息发送短信
 * @param {Number} id
 * @returns
 */
export function sendMessage(id) {
  return request({
    url: `/yqfk/api/es/sendMsg/${id}`,
    method: "post",
  });
}

/**
 * 流调信息-获取语音基本信息接口
 * @param id
 * @returns {*}
 */
export function getBaseInfo(id) {
  return request({
    url: `/yqfk/api/es/yy/baseInfo/${id}`,
    method: "get",
  });
}

/**
 * 流调信息-获取近14日核酸情况信息接口
 * @param id
 * @returns {*}
 */
export function getNucleicAcidResult(id) {
  return request({
    url: `/yqfk/api/es/yy/getHsInfo/${id}`,
    method: "get",
  });
}

/**
 * 流调信息-获取疫情接种情况信息接口
 * @param id
 * @returns {*}
 */
export function getEpidemicVaccinationResult(id) {
  return request({
    url: `/yqfk/api/es/yy/getYmInfo/${id}`,
    method: "get",
  });
}

/**
 * 流调信息-获取核心轨迹信息接口
 * @param id
 * @returns {*}
 */
export function getTrackInfo(id) {
  return request({
    url: `/yqfk/api/es/yy/locus/${id}`,
    method: "get",
  });
}

/**
 * 流调信息-获取图片信息接口
 * @param id
 * @returns {*}
 */
export function getLivePicturesList(id) {
  return request({
    url: `/yqfk/api/es/yy/qt/${id}`,
    method: "get",
  });
}

/**
 * 流调信息-获取近7日核酸情况信息接口
 * @param {Number} id
 * @returns
 */
export function getNucleicAcid(id) {
  return request({
    url: `/yqfk/api/es/yy/hs/${id}`,
    method: "get",
  });
}

/**
 * 流调信息-获取核心轨迹信息接口
 * @param {Number} id
 * @returns
 */
export function getCoreLocus(id) {
  return request({
    url: `/yqfk/api/es/yy/locus/${id}`,
    method: "get",
  });
}

/**
 * 流调信息-获取图片信息接口
 * @param {Number} id
 * @returns
 */
export function getImageInfo(id) {
  return request({
    url: `/yqfk/api/es/yy/qt/${id}`,
    method: "get",
  });
}

/**
 * 流调信息-获取疫情接种情况信息接口
 * @param {Number} id
 * @returns
 */
export function getVaccinationStatus(id) {
  return request({
    url: `/yqfk/api/es/yy/ym/${id}`,
    method: "get",
  });
}
/**
 * 流调信息-获取各个状态流调人员数量
 * @returns
 */
export function getNumByType() {
  return request({
    url: "/yqfk/api/es/yy/numByType",
    method: "get",
  });
}
/**
 * 流调信息-新增疫情接种情况信息接口
 * @returns
 */
export function addVaccinationStatus(data) {
  return request({
    url: "/yqfk/api/es/yy/ym/add",
    method: "post",
    data,
  });
}
/**
 * 流调-完成任务
 * @returns
 */
export function finshEpidemiologicalSurvey(id) {
  return request({
    url: `/yqfk/api/es/finish/${id}`,
    method: "post",
    data: {
      selectEsId: id,
    },
  });
}
/**
 * 流调-新增近7日核酸情况信息接口
 * @returns
 */
export function saveNucleicAcidStatus(id, data) {
  return request({
    url: "/yqfk/api/es/yy/saveHs?id=" + id,
    method: "post",
    data: data.data,
  });
}

/**
 * 流调信息-修改流调轨迹信息
 * @returns
 */
export function saveCoreLocus(id, data) {
  return request({
    url: "/yqfk/api/es/yy/locus",
    method: "put",
    data: data,
  });
}

/**
 * 流调-新增疫苗接种情况信息接口
 * @returns
 */
export function saveVaccinationStatus(id, data) {
  return request({
    url: "/yqfk/api/es/yy/saveYm?id=" + id,
    method: "post",
    data: data.data,
  });
}

/**
 * 获取阳性人员的文件资料
 * @param id
 * @returns {*}
 */
export function downloadById(id) {
  return request({
    url: `/yqfk/api/es/download/${id}`,
    method: "get",
    responseType: "blob",
  });
}

/**
 * 流调信息-新增重点场所
 * @param data
 * @return Promise
 */
export function addKeyPlace(data) {
  return request({
    url: `/yqfk/api/es/zdcs`,
    method: "post",
    data,
  });
}

/**
 * 流调信息-获取所有阳性人员关联事件
 * @param glsj 关联事件,传空就查所有的
 * @return Promise
 */
export function getAllGlsj() {
  return request({
    url: "/yqfk/api/es/yy/qt/getAllGlsj",
    method: "get",
  });
}

/**
 * 流调信息-获取所有阳性人员关联病例
 * @param glsj 关联事件,传空就查所有的
 * @return Promise
 */
export function getAllGlbl(glsj) {
  return request({
    url: `/yqfk/api/es/yy/qt/getAllGlbl?glsj=${glsj}`,
    method: "get",
  });
}

/**
 * 流调信息-获取所有阳性人员关联重点场所
 * @param glsj 关联事件,传空就查所有的
 * @return Promise
 */
export function getAllZdcs(glsj) {
  return request({
    url: `/yqfk/api/es/yy/qt/getAllZdcs?glsj=${glsj}`,
    method: "get",
  });
}

/**
 * 流调信息-获取所有阳性人员轨迹
 * @returns {*}
 */
export function getPositiveTrend() {
  return request({
    url: `/yqfk/api/es/yy/qt/getYxryTrend`,
    method: "get",
  });
}

/**
 * 流调信息-获取近14日扫码记录
 * @returns {*}
 */
export function getCodeScanning(id,params){
  return request({
    url: `/yqfk/api/es/getCodeScanning/${id}`,
    method: "get",
    params
  });
}

/**
 * 流调信息-获取关联人员信息
 * @returns {*}
 */
 export function getRelatedPersonnel(id,params){
  return request({
    url: `/yqfk/api/es/getRelatedPersonnel/${id}`,
    method: "get",
    params
  });
}

/**
 * 流调信息事件管理-修改事件状态
 * @returns {*}
 */
export function changeEventStatus(id,params){
  return request({
    url: `/yqfk/api/es/updateStatus/${id}`,
    method: "get",
    params
  });
}

/**
 * 流调信息管理-导出关联人员信息
 * @returns {*}
 */
export function exportRelatePersonMessage(data){
  return request({
    url: "/yqfk/api/es/exportRelatedPersonnel",
    method: "post",
    responseType: "blob",
    data
  });
}

/**
 * 流调信息-获取流调配置信息
 * @returns {*}
 */
 export function getBaseConfig(id,params){
  return request({
    url: `/yqfk/api/es/config/${id}`,
    method: "get",
    params
  });
}

/**
 * 流调信息-下载核心信息报告
 * @returns {*}
 */
 export function downloadCoreReport(id,params){
  return request({
    url: `/yqfk/api/es/download/coreReport/${id}`,
    method: "get",
    responseType: "blob",
    params
  });
}

/**
 * 阳性人员列表置顶
 * @param {身份证号码} zfzhm 
 * @returns 
 */
export function getTop(zfzhm){
  return request({
    url: `/yqfk/api/es/yy/qt/top/${zfzhm}`,
    method: "put",
  })
}

/**
 * 阳性人员取消置顶
 * @param {身份证号码} zfzhm 
 * @returns 
 */
export function cancelTop(zfzhm){
  return request({
    url: `/yqfk/api/es/yy/qt/undoTop/${zfzhm}`,
    method: "put",
  })
}

