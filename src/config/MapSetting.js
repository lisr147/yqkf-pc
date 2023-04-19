import mapLayers from './mapLayers.js'
import LAYER_DICT from './LayerDict'
import DISTRICTS from '@/components/MapLayer/districts.json'


export default {

  //图层过滤区域和网格导航菜单 数据
  getLayerMenu: function () {

    return [{
      label: '重点人群',
      expand: false,
      width: 280,
      children: [{
        label: '中高风险地区来粤返粤人员',
        id: 'dangerPeople',
        checked: false,
        order: 2,
        isLink: true,
        chart: 'block'
      },
        {
          label: '中高风险地区来粤返粤人员热力图',
          id: 'dangerPeopleHeatmap',
          checked: false,
          order: 1,
          chart: 'block'
        },
        {
          label: '密接人员',
          id: 'mjPeople',
          checked: false,
          order: 2,
          isLink: true
        },
        {
          label: '密接人员热力图',
          id: 'mjHeatmap',
          checked: false,
          order: 1,
          isLink: false
        },
        {
          label: '次密接人员',
          id: 'cmjPeople',
          checked: false,
          order: 2,
          isLink: true
        },
        {
          label: '次密接人员热力图',
          id: 'cmjHeatmap',
          checked: false,
          order: 1,
          isLink: false
        },
        {
          label: '红黄码人员',
          id: 'redYellow',
          checked: false,
          order: 2,
          isLink: true
        },
        {
          label: '黄码人员热力图',
          id: 'yellowHeatmap',
          checked: false,
          order: 2,
          isLink: true
        },
        {
          label: '特殊人群',
          id: 'specialMen',
          checked: false,
          order: 2,
          isLink: true
        },
        // {label: '户籍人员', id: 'householdRegisterPersonnel', checked: true, order: 2, isLink: true},
        // {label: '来穗人员', id: 'toGuangzhouPersonnel', checked: true, order: 2, isLink: true},
        // {label:'跨境司机',id:'driver', checked: false, order:2},
        // {label: '封控管理区', id: 'seal-area', checked: true, order: 2}
      ]
    }, {
      label: '重点场所',
      expand: false,
      width: 280,
      children: [{
        label: '隔离酒店',
        id: 'hotel',
        checked: false,
        order: 2,
        isLink: true,
        chart: 'block'
      },
        {
          label: '核酸采样点',
          id: 'detectionPoint',
          checked: false,
          order: 2,
          isLink: true
        },
        {
          label: '道路出入口',
          id: 'roadgate',
          checked: false,
          order: 2,
          isLink: false
        },
        {
          label: '公共场所',
          id: 'keyPlaces',
          checked: false,
          order: 2,
          isLink: true
        },
        {
          label: '冷链仓库',
          id: 'coldWarehouse',
          checked: false,
          order: 2,
          isLink: true,
          chart: 'block'
        },
        // {label: '出入境口岸', id: 'inout', checked: false, order: 2, isLink: false},
        {
          label: '跨境司机作业点',
          id: 'driverWorkPoint',
          checked: false,
          order: 2,
          isLink: false
        },
        {
          label: '学校',
          id: 'school',
          checked: false,
          order: 2,
          isLink: false
        },
        {
          label: '国际进口邮件快件处理场所',
          id: 'email',
          checked: false,
          order: 2,
          isLink: false
        },
        {
          label: '进口物料企业',
          id: 'importedMaterial',
          checked: false,
          order: 2,
          isLink: true
        },
        // {label: '养老院', id: 'nurseHouse', checked: false, order: 2, isLink: false},
        // {label: '月子中心', id: 'maternityCenter', checked: false, order: 2, isLink: false},
        // {label: '工业企业', id: 'industry', checked: false, order: 2, isLink: false},
        // {label: '重点场所', id: 'gcyKeyplace', checked: false, order: 2, isLink: false},
        // {label: '核酸采样点周边', id: 'detectPointAround', checked: false, order: 2, isLink: false},
      ]
    }, {
      label: '物资保障',
      expand: false,
      children: [{
        label: '医院',
        id: 'hospital',
        checked: false,
        order: 2,
        isLink: true
      },
        {
          label: '药店',
          id: 'pharmacy',
          checked: false,
          order: 2
        },
        // {label: '工疗站', id: 'therapyStation', checked: false, order: 2},
        {
          label: '肉菜市场',
          id: 'foodMarket',
          checked: false,
          order: 2,
          isLink: true
        },
        {
          label: '商超',
          id: 'market',
          checked: false,
          order: 2,
          isLink: true
        },
        {
          label: '水产品生产企业',
          id: 'seafoodEmp',
          checked: false,
          order: 2,
          isLink: true,
          chart: 'block'
        },
        {
          label: '防疫物资生产企业',
          id: 'productEmp',
          checked: false,
          order: 2
        },
        {
          label: '畜禽生产企业',
          id: 'farmEmp',
          checked: false,
          order: 2
        },
        {
          label: '建筑项目',
          id: 'buildingEmp',
          checked: false,
          order: 2
        },
        {
          label: '运输企业',
          id: 'busEmp',
          checked: false,
          order: 2
        },
        {
          label: '物流中转仓库',
          id: 'transitWarehouse',
          checked: false,
          order: 2
        },
      ]
    }, {
      label: '人力保障',
      expand: false,
      children: [{
        label: '网格党组织',
        id: 'party',
        checked: false,
        order: 2,
        mapFilterVisible: false,
        isLink: true
      },
        {
          label: '志愿者机构',
          id: 'volunteer',
          checked: false,
          order: 2
        },
        {
          label: '三人小组',
          id: 'threeGroup',
          checked: false,
          order: 2
        },
        {
          label: '核酸检测小组',
          id: 'detectionGroup',
          checked: false,
          order: 2,
          isLink: true,
          chart: 'block'
        },
        {
          label: '安保力量',
          id: 'security',
          checked: false,
          order: 2
        },
        {
          label: '快递配送人员',
          id: 'delivery',
          checked: false,
          order: 2
        },
      ]
    }, {
      label: '视频',
      expand: false,
      width: 220,
      children: [{
        label: '隔离酒店视频',
        id: 'hotel-video',
        checked: false,
        order: 2
      },
        {
          label: '跨境司机作业点视频',
          id: 'driverWorkPoint-video',
          checked: false,
          order: 2
        },
        {
          label: '常规核酸采样点视频',
          id: 'detectionPoint-video',
          checked: false,
          order: 2
        },
        {
          label: '大规模核酸采样点视频',
          id: 'bigDetectionPoint-video',
          checked: false,
          order: 2
        },

        // 采用新函数来处理 =》 newCreateGetVideoDataFn
        {
          label: '冷链仓库视频',
          id: 'coldWarehouse-video',
          checked: false,
          order: 2
        },
        {
          label: '公共场所视频',
          id: 'gcyKeyplace-video',
          checked: false,
          order: 2
        },
        {
          label: '养老机构视频',
          id: 'nurseHouse-video',
          checked: false,
          order: 2
        },
        {
          label: '学校视频',
          id: 'school-video',
          checked: false,
          order: 2
        },
        {
          label: '工业企业视频',
          id: 'industry-video',
          checked: false,
          order: 2
        },
        {
          label: '康复机构视频',
          id: 'recovery-video',
          checked: false,
          order: 2
        }, // 新
        {
          label: '核酸采样点周边视频',
          id: 'detectPointAround-video',
          checked: false,
          order: 2
        },
        {
          label: '母婴服务机构视频',
          id: 'maternalChild-video',
          checked: false,
          order: 2
        }, // 新
        {
          label: '精神卫生机构视频',
          id: 'mentalHealth-video',
          checked: false,
          order: 2
        }, // 新
        {
          label: '药店视频',
          id: 'pharmacy-video',
          checked: false,
          order: 2
        },
        {
          label: '建筑工地视频',
          id: 'constructionSite-video',
          checked: false,
          order: 2
        },
        {
          label: '宗教场所视频',
          id: 'religionPlace-video',
          checked: false,
          order: 2
        },

        // 备份
        /*{label: '隔离酒店视频', id: 'hotel-video', checked: false, order: 2},
        {label: '冷链仓库视频', id: 'coldWarehouse-video', checked: false, order: 2},
        {label: '跨境司机作业点视频', id: 'driverWorkPoint-video', checked: false, order: 2},
        {label: '常规核酸采样点视频', id: 'detectionPoint-video', checked: false, order: 2},
        {label: '大规模核酸采样点视频', id: 'bigDetectionPoint-video', checked: false, order: 2},
        // {label: '肉菜市场视频', id: 'foodMarket-video', checked: false, order: 2},
        {label: '医院视频', id: 'hospital-video', checked: false, order: 2},
        {label: '药店视频', id: 'pharmacy-video', checked: false, order: 2},
        {label: '工疗站视频', id: 'therapyStation-video', checked: false, order: 2},
        {label: '商超视频', id: 'market-video', checked: false, order: 2},
        {label: '学校视频', id: 'school-video', checked: false, order: 2},
        {label: '养老院视频', id: 'nurseHouse-video', checked: false, order: 2},
        {label: '月子中心视频', id: 'maternityCenter-video', checked: false, order: 2},
        {label: '工业企业视频', id: 'industry-video', checked: false, order: 2},
        {label: '公共场所视频', id: 'gcyKeyplace-video', checked: false, order: 2},
        {label: '核酸采样点周边视频', id: 'detectPointAround-video', checked: false, order: 2},
        {label: '社会服务中心视频', id: 'socialServiceCenter-video', checked: false, order: 2},
        */
      ]
    }]
  },

  //获取字典
  getDict() {
    return [...LAYER_DICT]
  },

  //查找镇街信息
  findTown(townName) {
    let match = DISTRICTS.find(v => townName.includes(v.name))
    return match
  },

  getTownList() {
    return DISTRICTS.map(item => {
      return item.name
    })
  },

  //根据图层id获取模板id
  getLayerInfo(param) {

    if (typeof param == 'string') {
      const match = LAYER_DICT.find(v => v.id == param)
      return match
    }

    if (typeof param == 'object') {
      let key = Object.keys(param)[0]
      const match = LAYER_DICT.find(v => v[key] == param[key])
      return match
    }

  },

  //通过图层id获取指定配置
  getLayerSetting(layerId) {
    const match = this.mapLayers.find(v => v.id == layerId)
    return match
  },

  //所有图层配置
  mapLayers
}
