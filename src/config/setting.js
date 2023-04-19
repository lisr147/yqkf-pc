/**
   * 系统名称
   */
export const title = '疫情防控'

/**
   * @type  {string | array} 'production' | ['production','development]
   * @description 在什么模式下打印错误日志，默认值为production
   */
export const errorLog = 'production'

/**
   * 分页规则
   */
export const pageRange = [10, 50, 100, 200]

/**
 * 表单状态
 * @type {*[]}
 */
export const statusList = [
  {label: '草稿', value: 'SAVE'},
  {label: '停止', value: 'STOP'},
  {label: '已发布', value: 'PUBLISH'},
]

// 督查督办事项 任务状态
export const supervisionStatusList = [
  {label: '进行中', value: '0'},
  {label: '已结束', value: '1'},
]
// 督查督办事项 任务类型
export const supervisionTypeList = [
  {label: '市下发', value: 'city'},
  {label: '区下发', value: 'area'},
  {label: '其他', value: 'other'},
]
/**
 * 常用正则式
 */
export const reg = {
  // 邮箱
  email: /^[_a-z0-9-\.]+@([-a-z0-9]+\.)+[a-z]{2,}$/,

  // 手机
  mobile: /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/,

  // 姓名
  fullName: /^([a-zA-Z0-9\u4e00-\u9fa5\·]{2,20})$/,

  // 密码
  password: /^[A-Za-z\d@$!%*#?\/<>&]+$/

}

export const APP = {
  CODE: 'CYJK',
  TOPIC: {
    CITY: {code: 'city', text: '城市运行实时监控'},
    YHTZ: {code: 'yhtz', text: '风险隐患监测'},
    EVENT: {code: 'event', text: '告警事件'},
    ZHTZ: {code: 'zhtz', text: '综合体征'},
    PUBLIC: {code: 'public', text: '公共服务'},
    INDUSTRY: {code: 'industry', text: '产业经济'},
    SECURITY: {code: 'security', text: '安全监管'},
    URBAN: {code: 'urban', text: '城市治理'},
    GOVERNMENT: {code: 'government', text: '政务服务'},
    ECOLOGY: {code: 'ecology', text: '生态宜居'},
    FTA: {code: 'fta', text: '自贸区创新'},
    VIDEO: {code: 'video', text: '实时视频'},
  }
}

/**
 * 移动端配色迁过来的图表配色方案
 */
export const chartColors = [
  { id: 'default', name: '默认', data: ['#2a7af5', '#06c0cd', '#7ac425', '#f9bb0e', '#f76c0d', '#fd4d62', '#8843f6', '#362ab2'] },
  { id: 'fade blue', name: '渐变蓝', data: ['#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9'] }
]

export const chartSetting = {
  color: [
    '#51cd85',
    '#5883d6',
    '#ffc437',
    '#eb5c45',
    '#fdff10',
    '#62c55c',
    '#1072ec',
    '#00ddff',

  ],
  color2: [
    '#1072ec',
    '#00ddff',
    '#fad600',
  ],
  colorAcc: [
    '#5e6ef9',
    '#00cdae',
    '#4eb04b',
    '#e9a230',
  ]
}

//设备
export const DeviceMap = {
  // "waterlevelmonitor": {name: '水位监测',key: 'waterlevelmonitor',icon: 'waterlevelmonitor', fn: 'WaterLevelMonitor'},
  // "rainfalldetector": {name: '雨量监测',key: 'rainfalldetector',icon: 'rainfalldetector', fn: 'RainfallDetector'},
  // "weatherstation": {name: '天气站',key: 'weatherstation',icon: 'weatherstation', fn:'WeatherStation'},
  // "park": {name: '停车场',key: 'park',icon: 'park', fn: 'Park'},
  // "doorcontroll": {name: '门禁',key: 'doorcontroll',icon: 'doorcontroll', fn: 'Gate'},
  // "waterquality": {name: '水质检测',key: 'waterquality',icon: 'waterquality',fn: 'WaterQuality'},
  "camera": {name: '摄像头',key: 'camera',icon: 'camera', fn: 'Camera'},
  "hcamera": {name: '高点摄像头',key: 'hcamera',icon: 'hcamera', fn: 'HCamera'},
  // "scamera": {name: '视频分析摄像头',key: 'scamera',icon: 'scamera', fn: 'SCamera'},
  // "gcamera": {name: '区政务服务中心摄像头', key: 'gcamera', icon: 'gcamera', fn: 'GCamera'}
}

//风险点 图标声明
export const RiskMap = {
  "A0001":  {key:"A0001", icon:"A0001", name: "山洪地灾风险点", },
  "A0002":  {key:"A0002", icon:"A0002", name: "危房", },
  "A0003":  {key:"A0003", icon:"A0003", name: "削坡建房风险点", },
  "A0004":  {key:"A0004", icon:"A0004", name: "低洼易浸点", },
  "A0005":  {key:"A0005", icon:"A0005", name: "涵洞隧道", },
  "A0006":  {key:"A0006", icon:"A0006", name: "灾害易发区建筑工地", },
  "A0007":  {key:"A0007", icon:"A0007", name: "灾害易发区简易建筑", },
  "A0008":  {key:"A0008", icon:"A0008", name: "堤防", },
  "A0009":  {key:"A0009", icon:"A0009", name: "水闸（泵站）", },
  "A0010":  {key:"A0010", icon:"A0010", name: "危化品、高温金属熔炼、燃气罐储企业", },
  "A0011":  {key:"A0011", icon:"A0011", name: "避难场所", },
  "A0012":  {key:"A0012", icon:"A0012", name: "重要场所", },
  "A0013":  {key:"A0013", icon:"A0013", name: "山塘水库", },
  "A0014":  {key:"A0014", icon:"A0014", name: "广告牌、悬挂物",},
  "A0015":  {key:"A0015", icon:"A0015", name: "井盖",},
  "A0016":  {key:"A0016", icon:"A0016", name: "危险路段", },
  "A0017":  {key:"A0017", icon:"A0017", name: "供电风险点", },
  "A0018":  {key:"A0018", icon:"A0018", name: "供水风险点", },
  "A0019":  {key:"A0019", icon:"A0019", name: "供气风险点", },
  "ONDUTY": {
    key: "ONDUTY",
    icons: [
      {key: "ONDUTY_0", icon: "ONDUTY"}, //未转移
      {key: "ONDUTY_1", icon: "ONDUTY"}, //已转移
      {key: "ONDUTY_2", icon: "ONDUTY_SA"}, //已转移
    ],
    name: "转移责任人"
  },
  "MIGRATE":{
    key:"MIGRATE",
    icons: [
      {key: "MIGRATE_0", icon: "MIGRATE"}, //未转移
      {key: "MIGRATE_1", icon: "MIGRATE_SA"}, //已转移
    ],
    name:"转移人员"
  },
}

//时间点定义
export const TimeDefineMap = {
  "smsReadTime": {label: "短信已读时间"},
  "transferTime": {label: "已转移时间"},
  "voiceTime": {label: "语音发送时间"},
  "smsTime": {label: "短信发送时间"},
  "voiceReadTime": {label: "语音已接听时间"}
}

// 南沙镇街
export const StreetList = [
  "南沙街",
  "黄阁镇",
  "东涌镇",
  "大岗镇",
  "榄核镇",
  "横沥镇",
  "万顷沙镇",
  "珠江街",
  "龙穴街"
]
export const DylbList = ['A类党员', 'B类党员','C类党员','D类党员','E类党员']
// 核查人员状态
export const PeopleStatusList = [
  {
    label: "无需管控",
    value: '0',
  },
  {
  label: "待确认",
    value: '1',
  },
  {
    label: "已确认非本市",
    value: '2',
  },
  {
    label: "已确认待转运",
    value: '3',
  },
  {
    label: "已确认管控中",
    value: '4',
  },
  {
    label: "已确认结束转运",
    value: '5',
  },
  {
    label: "无法落地",
    value: '6',
  },
]
/**
 * 获取UniqueValue声明
 * @param  book 可以是'DeviceMap'、'RiskMap'
 */
export function getUniqueValueInfos (book){

  const BOOK = book == 'DeviceMap' ? DeviceMap : (book == 'RiskMap' ? RiskMap : {})

  const uniqueValueInfos = []
  const RiskMapList = Object.values(BOOK)
  for (let i = 0; i < RiskMapList.length; i++) {
    const {key, icon, icons} = RiskMapList[i]

    if(icons){
      icons.forEach(item => {
        uniqueValueInfos.push({
          value: item.key,
          symbol: {
            type: "picture-marker",
            url: `${BASE_URL}/static/images/svg/${item.icon}.svg`,
          }
        })
      })
    } else if(icon) {
      uniqueValueInfos.push({
        value: key,
        symbol: {
          type: "picture-marker",
          url: `${BASE_URL}/static/images/svg/${icon}.svg`,
        }
      })
    }
  }

  return uniqueValueInfos

}


export const mediaHost = '139.9.202.58:8080'

export const BASE_URL = process.env.NODE_ENV === 'production' ? '/yqfk' : process.env.BASE_URL
