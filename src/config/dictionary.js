// 通过icon字段确定设备种类，包含了在线，离线，未激活状态的图标，detail为详情页的图片，btn为载体上按钮图标
export const iconDictionary = {
  Camera: { ONLINE: 'Camera_m_1.svg', OFFLINE: 'Camera_m_0.svg', UNACTIVATED: 'Camera_m_2.svg', detail: 'Camera_d.svg', btn: 'Camera_b.svg', name: '摄像头' },
  wifi: { ONLINE: 'WIFI_m_1.svg', OFFLINE: 'WIFI_m_0.svg', UNACTIVATED: 'WIFI_m_2.svg', detail: 'WIFI_d.svg', btn: 'WIFI_b.svg', name: 'wifi' },
  Talkback: { ONLINE: 'Talkback_m_1.svg', OFFLINE: 'Talkback_m_0.svg', UNACTIVATED: 'Talkback_m_2.svg', detail: 'Talkback_d.svg', btn: 'Talkback_b.svg', name: '对讲' },
  Radio: { ONLINE: 'Broadcast_m_1.svg', OFFLINE: 'Broadcast_m_0.svg', UNACTIVATED: 'Broadcast_m_2.svg', detail: 'Broadcast_d.svg', btn: 'Broadcast_b.svg', name: '广播' },
  WeatherStation: { ONLINE: 'WeatherStation_m_1.svg', OFFLINE: 'WeatherStation_m_0.svg', UNACTIVATED: 'WeatherStation_m_2.svg', detail: 'WeatherStation_d.svg', btn: 'WeatherStation_b.svg', name: '气象站' },
  WaterLevelMonitor: { ONLINE: 'WaterLevelMonitor_m_1.svg', OFFLINE: 'WaterLevelMonitor_m_0.svg', UNACTIVATED: 'WaterLevelMonitor_m_2.svg', detail: 'WaterLevelMonitor_d.svg', btn: 'WaterLevelMonitor_b.svg', name: '水位监测器' },
  RainfallDetector: { ONLINE: 'RainfallMonitor_m_1.svg', OFFLINE: 'RainfallMonitor_m_0.svg', UNACTIVATED: 'RainfallMonitor_m_2.svg', detail: 'RainfallMonitor_d.svg', btn: 'RainfallMonitor_b.svg', name: '雨量检测器' },
  Led: { ONLINE: 'ADScreen_m_1.svg', OFFLINE: 'ADScreen_m_0.svg', UNACTIVATED: 'ADScreen_m_2.svg', detail: 'ADScreen_d.svg', btn: 'ADScreen_b.svg', name: '广告屏' },
  NodeController: { ONLINE: 'NodeController_m_1.svg', OFFLINE: 'NodeController_m_0.svg', UNACTIVATED: 'NodeController_m_2.svg', detail: 'NodeController_d.svg', btn: 'NodeController_b.svg', name: '节点控制器' },
  NoiseSensor: { ONLINE: 'NoiseSensor_m_1.svg', OFFLINE: 'NoiseSensor_m_0.svg', UNACTIVATED: 'NoiseSensor_m_2.svg', detail: 'NoiseSensor_d.svg', btn: 'NoiseSensor_b.svg', name: '噪声传感器' },
  IntegratedController: { ONLINE: 'CentralizedController_m_1.svg', OFFLINE: 'CentralizedController_m_0.svg', UNACTIVATED: 'CentralizedController_m_2.svg', detail: 'CentralizedController_d.svg', btn: 'CentralizedController_b.svg', name: '集中控制器' },
  Park: { ONLINE: 'ParkingLot_m_1.svg', OFFLINE: 'ParkingLot_m_0.svg', UNACTIVATED: 'ParkingLot_m_2.svg', detail: 'ParkingLot_d.svg', btn: 'ParkingLot_b.svg', name: '停车场' },
  Bracelet: { ONLINE: 'Bracelet_m_1.svg', OFFLINE: 'Bracelet_m_0.svg', UNACTIVATED: 'Bracelet_m_2.svg', detail: 'Bracelet_d.svg', btn: 'Bracelet_b.svg', name: '手环' },
  WaterNetwork: { ONLINE: 'drain_1_m.svg', OFFLINE: 'drain_0_m.svg', UNACTIVATED: 'drain_2_m.svg', detail: 'Underground Pipes_d.svg', btn: 'drain_b.svg', name: '排水网管' },
  doorControll: { ONLINE: 'DoorControl_m_1.svg', OFFLINE: 'DoorControl_m_1.svg', UNACTIVATED: 'DoorControl_m_1.svg', detail: 'DoorControl.svg', name: '门禁' },

  LightPole: { icon: 'LightPole_c.svg' },
  WaterGate: { icon: 'Sluice_c.svg' }, //  水闸、水库
  MobileDrink: { icon: 'Car_c.svg' }, // 移动餐吧
  sanitation: {ONLINE: 'CleanCar_m_1.svg', OFFLINE: 'CleanCar_m_1.svg', UNACTIVATED: 'CleanCar_m_1.svg', detail: 'CleanCar_d.svg', btn: '', name: '环卫车' }, //环卫车
  "5gTower": {
    icon: 'BaseStationTower_c.svg',
    '2': 'BaseStationTower_c_2.svg',
    '3': 'BaseStationTower_c_3.svg',
    detail: 'BaseStationTower_d.svg'
  },//5G 铁塔

  bengzhan: {ONLINE:'pump.svg',OFFLINE:'pump.svg',UNACTIVATED:'pump.svg',detail:'pump.svg',name:'泵站'},
  wushuichang: {ONLINE:'sewage-factory.svg',OFFLINE:'sewage-factory.svg',UNACTIVATED:'sewage-factory.svg',detail:'sewage-factory.svg',name:'污水厂'},
  nongwuchulisheshi: {ONLINE:'farm-sewage.svg',OFFLINE:'farm-sewage.svg',UNACTIVATED:'farm-sewage.svg',detail:'farm-sewage.svg',name:'农污处理设施'},
  waterquality:{ONLINE: 'Water_quality_m_0.svg', OFFLINE: 'Water_quality_m_0.svg', UNACTIVATED: 'Water_quality_m_0.svg', detail: 'Water_quality_d.svg', name: '水质检测'},

  BaseStation:{ ONLINE:'BaseStation_dx.svg',OFFLINE:'BaseStation_dx.svg',UNACTIVATED:'BaseStation_dx.svg',detail:'BaseStation_dx_d.svg',name:'5G基站'},
  "5gUnicom":{ ONLINE:'BaseStation_lt.svg',OFFLINE:'BaseStation_lt.svg',UNACTIVATED:'BaseStation_lt.svg',detail:'BaseStation_lt_d.svg',name:'联通5G基站'},
  "5gTelecom":{ ONLINE:'BaseStation_dx.svg',OFFLINE:'BaseStation_dx.svg',UNACTIVATED:'BaseStation_dx.svg',detail:'BaseStation_dx_d.svg',name:'电信5G基站'},
  "5gMobile":{ ONLINE:'BaseStation_yd.svg',OFFLINE:'BaseStation_yd.svg',UNACTIVATED:'BaseStation_yd.svg',detail:'BaseStation_yd_d.svg',name:'移动5G基站'},
}

// 物联网设备自定义属性字典 propname：{navname：fn} 作用是获取功能
export const FnNameDictionary = {
  LiveCam: { name: '实时视频', fn: 'Live' },
  HistoryCam: { name: '回放视频', fn: 'Playback' },
  Detail: { name: '设备详情', fn: 'Detail' },
  ScreenShot: { name: '截图', fn: 'ScreenShot' },
  WaterLevelStatistics: { name: '水位过程线', fn: 'WaterLevel' }, // 水位检测仪
  RainfallStatistics: { name: '近24小时降雨', fn: 'RainFall' },
  DailyRainfall: { name: '日降雨', fn: 'DailyRainfall' },
  PredictRain: { name: '未来48小时降雨预测', fn: 'PredictRain' },
  Traffic: { name: '车流量', fn: 'CarFlow' },
  MeteorologicalStatistics: { name: '气象统计', fn: 'WeatherStation' },
  WaterLevelProcessLine: { name: '水位过程线', fn: 'WaterLevelProcessLine' }, // 排水网管
  ImageRecongition: { name: '图像识别', fn: 'ImageRecongition' },
  CarTrackHistory: {name: '行驶轨迹', fn: 'CarTrackHistory'},
  ChartStatistics: {name:'数据记录',fn:'ChartStatistics'}, //水泵、污水站、水质检测 水量记录 门禁
}

// 载体设备，用于确定对话框是哪个载体，获取对应组件
export const carrierDictionary = {
  LightPole: 'LightPole',
  WaterGate: 'Sluice',
  MobileDrink: 'MovingDrinkingBar'
}

// 设备状态说明
export const statusTrans = {
  ONLINE: '在线',
  OFFLINE: '离线',
  UNACTIVATED: '未激活',
  'NO_STATUS':'无状态',
  '': ''
}

// 面板类型
export const panelTypeMap = {
  'List': {label: '数据列表 v1'},
  // 'Histogram': {label: '柱状图 v1'},
  // 'LineChart': {label: '线图 v1'},
  // 'PieChart': {label: '饼图 v1'},
  'Counter': {label: '计数器 v1'},

  'PIE': {label: '饼图'},
  'BAR': {label: '柱状图'},
  'LINE': {label: '折线图'},
  'SCATTER': {label: '散点图'},
  'MAP': {label: '地图'},
  'CANDLESTICK': {label: 'K线图'},
  'RADAR': {label: '雷达图'},
  'HEATMAP': {label: '热力图'},
  'GRAPH': {label: '关系图'},
  'GAUGE': {label: '仪表盘'},
  'FUNNEL': {label: '漏斗图'},
  'TREE': {label: '树形图'},
  'VIDEO': {label: '视频'},
  'Iframe': {label: '小页面'},
}

// 告警事件
export const eventTypeMap = {
  '22' : { name: '交通事件', color: '#de5abf'},
  '23' : { name: '安防事件', color: '#009ad8'},
  '26' : { name: '城管事件', color: '#4bca67'},
  '66' : { name: '设备告警', color: '#ff5251'},
  '99' : { name: '网格化事件',color:'#ffc107'},
  '00' : { name: '未知类型', color: '#052bff'}
}

// 专题图标字典
export const TOPIC_ICON_MAP = {
  camera: {name: '视频监控', type: 'camera', icon: 'monitor.svg'},
  hospital: {name: '医院', type: 'hospital', icon: 'hospital.svg'},
  school: {name: '学校', type: 'school', icon: 'school.svg'},
  training: {name: '培训机构', type: 'training', icon: 'training.svg'},
  tourist: {name: '旅游景点', type: 'tourist', icon: 'travel.svg'},
  culture: {name: '文化体育', type: 'culture', icon: 'sports.svg'},
  enterprise: {name: '产业企业', type: 'industrial', icon: 'enterprise.svg'},
  factory: {name: '化工企业', type: 'factory', icon: 'factory.svg'},
  government: {name: '政府部门', type: 'government', icon: 'government.svg'},
  sanitation: {name: '环卫车', type: 'sanitation', icon: 'CleanCar_m_1.svg'},
  bengzhan: {name: '泵站', type: 'bengzhan', icon: 'pump.svg'},
  nongwuchulisheshi: {name: '农污处理设施', type: 'nongwuchulisheshi', icon: 'farm-sewage.svg'},
  wushuichang: {name: '污水厂', type: 'wushuichang', icon: 'sewage-factory.svg'},
  transportation: {name: '交通站点', type: 'transportation', icon: 'bus-station.svg'},
  airport: {name: '机场', type: 'airport', icon: 'airport.svg'},
  railway: {name: '火车站', type: 'railway', icon: 'train.svg'},
  portmarina: {name: '港口码头', type: 'portmarina', icon: 'dock.svg'},
  coach_station: {name: '长途汽车站', type: 'coach_station', icon: 'coach.svg'},
  subway_station: {name: '地铁站', type: 'subway_station', icon: 'subway.svg'},
  light_rail_station: {name: '轻轨站', type: 'light_rail_station', icon: 'lightrail.svg'},
  bus_station: {name: '公交车站', type: 'bus_station', icon: 'bus-station.svg'},
  commuter_bus_station: {name: '班车站', type: 'commuter_bus_station', icon: 'regular-bus.svg'},
  ferry_station: {name: '轮渡站', type: 'ferry_station', icon: 'ship.svg'},
  gatepass: {name: '门岗', type: 'gatepass', icon: 'gatepass.svg'},
  socialworkstation: {name: '社工服务站', type: 'socialworkstation', icon: 'socialworkstation.svg'},
  doorControll: {name: '门禁', type: 'doorControll', icon: 'doorControll.svg'},
  BaseStation: {name: '5G基站', type: 'BaseStation', icon: 'BaseStation_dx.svg'},
  Park: {name: '停车场', type: 'Park', icon: 'Parking.svg'},

  "5gUnicom": {name: '联通5G基站', type: '5g_unicom', icon: 'BaseStation_lt.svg'},
  "5gTelecom": {name: '电信5G基站', type: '5g_telecom', icon: 'BaseStation_dx.svg'},
  "5gMobile": {name: '移动5G基站', type: '5g_mobile', icon: 'BaseStation_yd.svg'},
  "5gTower": {
    name: '铁塔5G基站',
    type: '5g_tower',
    icon: 'BaseStationTower_c.svg',
    '2': 'BaseStationTower_c_2.svg',
    '3': 'BaseStationTower_c_3.svg'
  }
}

// 基站信号
export const BASE_STATION_SET = {
  "5gUnicom": {color: '#cf372f'},
  "5gTelecom": {color: '#267fb3'},
  "5gMobile": {color: '#2033ab'},
  "5gTower":{color: '#5328C9'}
}
