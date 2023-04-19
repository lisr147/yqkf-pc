import request from "@/utils/request";
import Store from '@/store/index'
/**
 * 将当前镇街接入到data里面
 */
// function extendData(data){

//   if(!data.condition){
//     data.condition = {}
//   }

//   const town = getCurrTown()
//   if (town !== null && !data.condition.sszj) {
//     data.condition.sszj = town
//   }

//   return data
// }

export function getCurrTown(){
  return Store.state.common.town
}
export function getCurrGrid(){
  return Store.state.common.grid
}
/**
 * 通过code获取图表，本项目中暂时用于疫情防控模块
 * @param data {code:'*'}
 */
// 所有酒店（含坐标）
export function getHotelData(data) {
  return request({
    url: `/yqfk/chart/hotel/all/basic3`,
    method: "get",
    params: data
  });
}
// 无用
export function getHotelSyjdlb() {
  return request({
    url: process.env.VUE_APP_SCREEN_API + `/yqfk-jdgl/syjdlb`,
    method: "get"
  });
}
// 密接次密接人员 热力图数据
export function getHeatMapData(data) {
  return request({
    url: `/yqfk/personnel/findAll`,
    method: "get",
    params: data
  });
}
// 酒店详情
export function getHotalDetail(data) {
  return request({
    url: `/yqfk/chart/hotel/detail3/` + data,
    method: "get"
  });
}
// 密接次密接人员详情
export function getPersonDetail(data) {
  return request({
    url: `/yqfk/personnel/query/` + data,
    method: "get"
  });
}
// 密接次密接人员关系图谱
export function getRelative(id) {
  return request({
    url: `/yqfk/personGraph/query/` + id,
    method: "get"
  });
}

// 隔离酒店楼栋概况
export function getBuildingSummary(params) {
  return request({
    url: `/yqfk/api/examinePeople/places/buildingSummary`,
    method: "get",
    params
  });
}

// 整个小区的概况统计
export function getSummaryOfCommunity() {
  return request({
    url: `/yqfk/api/examinePeople/places/summary`,
    method: "get"
  });
}

// 隔离酒店楼栋房间
export function getRoomStatistics(params) {
  return request({
    url: `/yqfk/chart/room/statistics`,
    method: "get",
    params
  });
}

// 隔离酒店房间详情
export function getRoomStaff(params) {
  return request({
    url: `/yqfk/chart/room/staff`,
    method: "get",
    params
  });
}

// 重点人群
export function searchJahyzdrqPageList(data) {
  return request({
    url: `/yqfk/mobile/searchJahyzdrqPageList`,
    method: "post",
    data
  });
}
// 嘉安花园台账
export function jaList(data) {
  return request({
    url: `/yqfk/api/examinePeople/places/people/list`,
    method: "get",
    params: data
  });
}

// 获取人员详情时间轴
export function getStaffTimeline(data) {
  return request({
    url: `/yqfk/api/examinePeople/places/people/traceEvent`,
    method: "get",
    params: data
  });
}

/**
 * 获取地图摄像头列表-疫情防控
 */
 export function getVideoLayerList(){
  return request({
    url: '/yqfk/api/device/all',
    headers: {
      ContentType: 'multipart/form-data'
    },
    method: 'get'
  })
}


/**
 * 获取高点摄像头
 */
export function getHDVideoLayerList(){
  return request({
    url: '/yqfk/api/device/hk',
    headers: {
      ContentType: 'multipart/form-data'
    },
    method: 'get'
  })
}

/**
 *  获取镇街红黄码统计分布
 */
export function getStreetHealthCode(data){
  return request({
    url: '/yqfk/web/healthCode/getStreetHealthCode',
    method: 'get',
    params: Object.assign({showModal: false}, data)
  })
}

/**
 * 获取按镇街统计的黄码数量
 * @param params
 */
export function getStreetYellowCodeStatistics(params){
  return request({
    url:`/yqfk/web/healthCode/getYellowCode`,
    method: 'get',
    params
  })
}

/**
 * 获取黄码热力图数据
 * @param params
 */
export function getYellowCodeCluster(params){
  return request({
    url: `/yqfk/web/healthCode/getVillageCode`,
    method: 'get',
    params
  })
}

/**
 *  镇街红黄码筛选
 */
export function getHealthCodeScreen(data){
  return request({
    url: '/yqfk/web/healthCode/getHealthCodeScreen',
    method: `post`,
    data
  })
}
/**
 *  镇街红黄码详情
 */
export function getHealthCodeDetail(params){
  return request({
    url: '/yqfk/web/healthCode/getHealthCodeDetail',
    method: `get`,
    params
  })
}

/**
 * 获取黄码人员列表
 */
export function getYellowList(data){
  return request({
    url: `/yqfk/web/healthCode/yellowCode/pageList`,
    method: 'post',
    data
  })
}

/**
 * 导出黄码人员列表
 */
export function exportYellowList(data){
  return request({
    url: `/yqfk/web/healthCode/yellowCodeBatchExport`,
    method: `post`,
    responseType: "blob",
    data
  })
}

/**
 *  获取指定人的核酸检测信息通过开始时间和身份证
 */
export function getHSById(params){
  return request({
    url: '/yqfk/hs-check/query-by-time',
    method: `get`,
    params
  })
}

/**
 * 高点摄像头移动
 * @param data
 * @param data.pan 左右
 * @param data.tilt 上下
 */
export  function operateHdDirection(deviceId, data){
  data.showModal = false
  return request({
    url:`/yqfk/api/device/PTZCtrl/${deviceId}/move`,
    method: 'post',
    data
  })
}

/**
 * 高点摄像头远近缩放
 * @param data
 * @param data.zoom
 */
export  function operateHdZoom(deviceId, data){
  data.showModal = false
  return request({
    url:`/yqfk/api/device/PTZCtrl/${deviceId}/zoom`,
    method: 'post',
    data
  })
}

/**
 * 高点摄像头旋转
 * @param data
 * @param data.zoom
 */
export  function operateHdRotate(deviceId, data){
  data.showModal = false
  return request({
    url:`/yqfk/api/device/PTZCtrl/${deviceId}/autopan`,
    method: 'post',
    data
  })
}
/**
 *  获取门磁数据
 */
export function getDoorList(data){
  return request({
    url: '/yqfk/web/door/doorList',
    method: `post`,
    headers:{
      'ContentType': 'multipart/form-data'
    },
    data
  })
}
/**
 *  获取产生开门告警的门磁信息列表
 */
export function getDoorListByAlarm(data){
  return request({
    url: '/yqfk/web/door/doorListByAlarm',
    method: `post`,
    headers:{
      'ContentType': 'multipart/form-data'
    },
    data
  })
}
/**
 *  获取门磁今日设备报警
 */
export function getDoorAlarm(data){
  return request({
    url: '/yqfk/web/door/getAlarm',
    method: `post`,
    headers:{
      'ContentType': 'multipart/form-data'
    },
    data
  })
}
/**
 *  获取告警统计
 */
export function getDoorAlarmChart(data){
  return request({
    url: '/yqfk/web/door/getAlarmChart',
    method: `post`,
    headers:{
      'ContentType': 'multipart/form-data'
    },
    data
  })
}
/**
 *  获取产生开门告警的数量
 */
export function getDoorAlarmCount(data){
  return request({
    url: '/yqfk/web/door/doorAlarmCount',
    method: `post`,
    headers:{
      'ContentType': 'multipart/form-data'
    },
    data
  })
}

/**
 * 获取网格地图数据
 * @param data
 */
export function getGridMapData(data) {
  return request({
    url: '/yqfk/geojson/layers/grid',
    method: `get`,
    showLoading: false,
    params: {...data, sszj: getCurrTown()}
  })
}


/**
 * 获取网格地图数据 - 城运监控
 * @param data
 */
export function getGridMapData2(data) {
  return request({
    url: '/cyjk/web/grid/griddata',
    method: `get`,
    params: data
  })
}

/**
 * 通过id获取图层数据
 * @param datalayers/grid
 */
export function getMapLayerData(data) {

  return request({
    url: `/yqfk/api/template/dataPage/${data.templateId}`,
    method: 'post',
    data: Object.assign({
      page: 1,
      pageSize: 99999,
      showModal: false,
    }, data)
  })
}

/**
 * 获取学校图层数据
 * @param data
 * @returns {*}
 */
export function getSchoolLayerData(data) {
  return request({
    url: `/yqfk/api/school/dataPage/${data.templateId}`,
    method: 'post',
    data: Object.assign({
      page: 1,
      pageSize: 99999,
      showModal: false,
    }, data)
  })
}
/**
 * 根据模板id, 加载模板配置
 */
export function getTemplateConfig(data) {
  return request({
    url: `/yqfk/api/template/config/${data.id}`,
    method: 'get'
  })
}
/**
 * 获取重点场所今日通行人员统计
 */
export function getPersonList(data) {
  return request({
    url: `/screen/web/alarm/personStatistics`,
    method: 'get',
    params: data
  });
}

/**
 * 获取重点场所今日通行人员活动轨迹统计
 */
export function getPersonTrackList(data) {
  return request({
    url: `/screen/web/alarm/personalTrack`,
    method: 'get',
    params: data
  });
}

/**
 * 获取重点场所图层数据
 */
export function getKeyPlaceLayerData(data){
  return request({
    url: `/screen/web/alarm/statistics`,
    method: 'get',
    params: data
  })
}

/**
 * 获取特殊人员列表
 * @param belongTown String 所属镇街
 * @params peopleCategory 人员类型：孕产妇...
 */
export function getSpecialPeopleList(data){
  return request({
    url: `/yqfk/web/mobileData/specialPeopleDetail/page`,
    method: 'post',
    data: data
  })
}

/**
 * 按镇街获取特殊人员统计
 */
export function getSpecialPeopleCount(data){
  return request({
    url: `/yqfk/web/mobileData/specialPeopleTown`,
    method: 'get',
    params: data
  })
}

/**
 * 获取三人小组 按镇街网格查询分类
 * @param category 类别，sszj 是所属镇街， sswj 是所属网格
 */
export function getThreeGroupLayerData(data){
  return request({
    url: `/yqfk/web/mobileData/threeGroup`,
    method: 'get',
    params: data,
    showLoading: false
  })
}

/**
 * 获取三人小组分页列表
 *
 * "condition": {
    "address": "string",
    "belongArea": "string",
    "belongGrid": "string",
    "belongTown": "string",
    "belongVillage": "string",
    "dateSource": "string",
    "groupName": "string",
    "groupNature": "string",
    "name": "string",
    "peopleCategory": "string",
    "phoneNumber": "string",
    "serviceTotal": 0,
    "sex": "string",
    "updateTime": "2022-01-22T09:55:09.356Z"
  },
 "page": 1,
 "pageSize": 10
 */
export function getThreeGroupList(data){
  return request({
    url: `/yqfk/web/mobileData/threeGroupDetail/page`,
    method: 'post',
    data
  })
}
//公共的人员明细分页列表（模板Id，冷链仓库-工作人员明细（10035），跨境司机明细数据（10056），物流中转仓库-派送人员（10050），志愿者明细（10041））
export function getCommonPeopleList(data){
  return request({
    url: `/yqfk/web/mobileData/commonPeopleDetail/page`,
    method: 'post',
    data
  })
}

//获取镇街中高风险统计分布
export function getRiskAreaPeopleByTown(data){
  return request({
    url: `/yqfk/riskArea/getStreetRiskAreas`,
    method: 'get',
    params: data
  })
}


//获取镇街快递分布
export function getDeliveryByTown(data){
  return request({
    url: `/yqfk/api/address/getZjwlry`,
    method: 'get',
    params: data
  })
}

//所属单位视频统计(冷链10032, )
export function getLayerDataByUnit(data){
  return request({
    url: `/yqfk/api/address/getSswdsp/${data.templateId}`,
    method: 'get',
    showLoading: false,
    params: data
  })
}

// 密接人员统计
export function getCloseContactData(data){
  return request({
    url: '/yqfk/chart/statistics/closeContact',
    method: 'get',
    params: Object.assign({showModal: false}, data)
  })
}
// 次密接人员统计
export function getSecondCloseContactData(data){
  return request({
    url: '/yqfk/chart/statistics/secondContact',
    method: 'get',
    params: data
  })
}

//密接次密接落图接口
//type:  closeContact密接，secondContact 次密接
export function getContactDataByLoca(data){
  return request({
    url: `/yqfk/web/mobileData/${data.type}`,
    method: 'get',
    params: data
  })
}

//告警事件列表-防疫酒店
export function getAlarmEventFormHotel(data){
  return request({
    url: `/yqfk/ext/hotel/custalarm`,
    method: 'post',
    data
  })
}

// 获取重点场所告警信息
export function getAlarmEventFromPublic(data) {
  return request({
    url: `/screen/web/alarm/pageList`,
    method: "post",
    data
  })
}

// 获取网格流动人口
export function getGridFlowPeople(data) {
  return request({
    url: `/yqfk/web/peoplefolw/gridFlowPeople`,
    method: "post",
    data
  })
}

// 获取网格人口,总计人口
export function getPeopleSum(data) {
  return request({
    url: `/yqfk/web/peoplefolw/getPeopleSum`,
    method: "post",
    data
  })
}

// 获取扫码场景类型
export function getSceneTypeName(data) {
  return request({
    url: `/yqfk/web/peoplefolw/commonPlace/sceneTypeName`,
    method: "get",
    data
  })
}

//导出-xx场所扫码统计
export function exportSceneDetailStat(data){
  return request({
    url: `/yqfk/commonPlace/statistics/detail/export`,
    method: 'get',
    responseType: "blob",
    params: data
  })
}

//导出总扫码量
export function exportSceneDayMoreStat(data){
  return request({
    url: `/yqfk/commonPlace/statistics/day/more/export`,
    method: 'get',
    responseType: "blob",
    params: data
  })
}

//导出各场景类型扫码统计
export function exportSceneDayStat(data){
  return request({
    url: `/yqfk/commonPlace/statistics/day/scene/export`,
    method: 'get',
    responseType: "blob",
    params: data
  })
}

//导出各场所统计明细
export function exportSceneDetialMoreStat(data){
  return request({
    url: `/yqfk/commonPlace/statistics/detail/more/export`,
    method: 'get',
    responseType: "blob",
    params: data
  })
}

// 台账，车辆图层接口
export function getStandBookCar(data) {
  return request({
    url: `/yqfk/web/mobileData/standBookCar`,
    method: "get",
    params: data
  })
}

// 台账，医院图层接口
export function getStandBookHospital(data) {
  return request({
    url: `/yqfk/web/mobileData/standBookHospital`,
    method: "get",
    params: data
  })
}

/**
 * 获取视频地址
 * @param templateId 模板id
 * @param deviceUid 设备id
 * @param isRecord 是否回放
 */
export function getVideoFromUid(data) {

  const {templateId, deviceUid} = data
  let path, params = {}

  if (data.isRecord) {
    params.endDate = data.endDate
    params.startDate = data.startDate
    path = 'record'
  } else {
    path = 'live'
  }

  return request({
    url: `/yqfk/video/${path}/play/${templateId}/${deviceUid}`,
    method: "get",
    params
  })
}

/**
 * 获取可回放的时间范围列表
 * @param templateId 模板id
 * @param deviceUid 设备id
 * @param data
 */
export function getRecordTimeRangeList(data){

  const {templateId, deviceUid, startDate, endDate} = data

  return request({
    url: `/yqfk/video/record/list/${templateId}/${deviceUid}`,
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}


/**
 * 获取常规核酸采样点和大规模核酸采样点的统计数
 */
 export function getNucleicCount(params){
  return request({
    url: `/yqfk/api/nucleicAcid/nucleicCount`,
    method: 'get',
    params
  })
}

/**
 * 导出推荐核酸采样点
 * @param date {String} 2022-03-30
 */
export function exportCheckPoints(params) {
  return request({
    url: `/yqfk/chart/statistics/nucleicAcidExport`,
    method: 'get',
    responseType: "blob",
    params: Object.assign({
      contact: 1,
      hm: 1,
      person: 1,
    }, params)
  })
}

/**
 * 分页获取推荐核酸采样点
 */
export function getCheckPoints(data){
  return request({
    url: `/yqfk/api/nucleicAcid/areaAdvicePageList`,
    method: 'post',
    data
  })
}

//获取视频分组聚合
export function getVideoGroups(data){
  return request({
    url: `/yqfk/video/groups`,
    method: 'get',
    showLoading: false,
    params: data
  })
}

// gz2000搜索地址
// http://dn.product.iot-cas.com:8081/yqfk/coordinate/gz2000?szxxdz=碧桂园天玺湾
export function gz2000SearchLocation(szxxdz){
    return request({
        url:`/yqfk/coordinate/gz2000`,
        method:'get',
        showLoading:false,
        params:{
            szxxdz
        }
    })
}


/**
 * 疑似病例热力图
 */
 export function getDiagnoseHeatMapData(data){
  return request({
    url: '/yqfk/api/es/yxblcsrlt',
    method: 'post',
    data
  })
}

/**
 * 扫码记录图层
 */
 export function getScanRecordData(data){
  return request({
    url: '/yqfk/api/es/yxblsmrlt',
    method: 'post',
    data
  })
}
