//图层名和模板id对应字典
const LAYER_DICT = [
    // ssdwId： 所属单位图层id，视频图层数据通过所属单位聚合落图
    // ssdwKey：所属单位所指向的 字段名
    // staffListId： 员工列表id
    //
    {
        label: '中高风险地区来粤返粤人员',
        id: 'dangerPeople',
        templateId: 10058
    },
    {
        label: '中高风险地区来粤返粤人员热力图',
        id: 'dangerPeopleHeatmap',
        templateId: 10065
    },
    {
        label: '密接人员',
        id: 'mjPeople',
        templateId: 10001
    }, // mjlx=密切接触者
    {
        label: '次密接人员',
        id: 'cmjPeople',
        templateId: 10001
    }, // mjlx=密接的密接
    {
        label: '红黄码人员',
        id: 'redYellow',
        templateId: 10018
    },
    {
        label: '黄码人员热力图',
        id: 'yellowHeatmap',
        templateId: null
    },
    {
        label: '特殊人群',
        id: 'specialMen',
        templateId: null
    }, //通过特殊接口按镇街
    {
        label: '跨境司机',
        id: 'driver',
        templateId: 10034
    },
    {
        label: '隔离酒店',
        id: 'hotel',
        templateId: 10047,
        ssdwKey: 'name'
    }, //ssdwKey
    {
        label: '核酸采样点',
        id: 'detectionPoint',
        templateId: 10027,
        externalTemplateId: 10055,
        ssdwKey: 'cghsjcd,yljg'
    }, //10027大规模采样点  10055常规采样点
    {
        label: '核酸采样点 mini',
        id: 'detectionPoint-mini',
        templateId: 10027,
        externalTemplateId: 10055,
        ssdwKey: 'cghsjcd'
    },
    {
        label: '道路出入口',
        id: 'roadgate',
        templateId: 10021
    },
    {
        label: '公共场所',
        id: 'keyPlaces',
        templateId: null,
        ssdwKey: 'stationName'
    },
    {
        label: '冷链仓库',
        id: 'coldWarehouse',
        templateId: 10032,
        staffListId: 10035,
        ssdwKey: 'qyscmc'
    },
    {
        label: '出入境口岸',
        id: 'inout',
        templateId: 10036
    },
    {
        label: '国际进口邮件快件处理场所',
        id: 'email',
        templateId: 10067,
        staffListId: 10066
    }, //国际进口邮件快件处理场所
    {
        label: '进口物料企业',
        id: 'importedMaterial',
        templateId: 10070,
        staffListId: 10071
    },
    {
        label: '学校',
        id: 'school',
        templateId: 10068,
        ssdwKey: 'szxxdz'
    }, //学校
    {
        label: '医院',
        id: 'hospital',
        templateId: 10008,
        transitVehiclesListId: 10072,
        consultationSchedulingListId: 10073,
        allocationHealthCareListId: 10074
    }, //lb=医院
    {
        label: '药店',
        id: 'pharmacy',
        templateId: 10008,
        logListId: 10057,
        ssdwKey: 'mc'
    }, //lb=药店
    // {label: '工疗站',id: 'therapyStation',  templateId: 10114, },
    {
        label: '肉菜市场',
        id: 'foodMarket',
        templateId: 10039,
        ssdwKey: 'csmc'
    },
    {
        label: '养老院',
        id: 'nurseHouse',
        templateId: 10100,
        ssdwKey: 'ssdw'
    },
    {
        label: '月子中心',
        id: 'maternityCenter',
        templateId: 10099,
        ssdwKey: 'ssdw'
    },
    {
        label: '工业企业',
        id: 'industry',
        templateId: 10108,
        ssdwKey: 'ssdw'
    },
    {
        label: '重点场所',
        id: 'gcyKeyplace',
        templateId: 10110,
        ssdwKey: 'ssdw'
    },
    {
        label: '核酸采样点周边',
        id: 'detectPointAround',
        templateId: 10102,
        ssdwKey: 'ssdw'
    },
    {
        label: '商超',
        id: 'market',
        templateId: 10009,
        ssdwKey: 'scmc'
    },
    {
        label: '水产品生产企业',
        id: 'seafoodEmp',
        templateId: 10038
    },
    {
        label: '防疫物资生产企业',
        id: 'productEmp',
        templateId: 10010
    },
    {
        label: '畜禽生产企业',
        id: 'farmEmp',
        templateId: 10037
    },
    {
        label: '建筑项目',
        id: 'buildingEmp',
        templateId: 10016
    },
    {
        label: '网格党组织',
        id: 'party',
        templateId: 10018
    },
    {
        label: '志愿者机构',
        id: 'volunteer',
        templateId: 10019,
        staffListId: 10041
    },
    {
        label: '三人小组',
        id: 'threeGroup',
        templateId: 10028
    }, //通过特殊接口按镇街
    {
        label: '核酸检测小组',
        id: 'detectionGroup',
        templateId: 10022
    },
    {
        label: '快递配送人员',
        id: 'delivery',
        templateId: 10050,
        staffListId: 10050
    },
    {
        label: '物流中转仓库',
        id: 'transitWarehouse',
        templateId: 10042,
        staffListId: 10050,
        ssdwKey: 'kjsjzydmc'
    }, //公共的人员明细
    {
        label: '跨境司机作业点',
        id: 'driverWorkPoint',
        templateId: 10043,
        staffListId: 10056
    },
    {
        label: '运输企业',
        id: 'busEmp',
        templateId: 10044
    },
    {
        label: '安保力量',
        id: 'security',
        templateId: 10045
    },
    {
        label: '隔离酒店视频',
        id: 'hotel-video',
        templateId: 10061,
        ssdwId: 10047
    }, //ssdwId 所属单位id
    {
        label: '冷链仓库视频',
        id: 'coldWarehouse-video',
        templateId: 10119,
        ssdwId: 10032
    },
    {
        label: '跨境司机作业点视频',
        id: 'driverWorkPoint-video',
        templateId: 10062,
        ssdwId: 10043
    },
    {
        label: '常规核酸采样点视频',
        id: 'detectionPoint-video',
        templateId: 10082,
        ssdwId: 10055
    },
    {
        label: '肉菜市场视频',
        id: 'foodMarket-video',
        templateId: 10052,
        ssdwId: 10039
    },
    {
        label: '大规模核酸采样点视频',
        id: 'bigDetectionPoint-video',
        templateId: 10051,
        ssdwId: 10027
    },
    {
        label: '药店视频',
        id: 'pharmacy-video',
        templateId: 10119,
        ssdwId: 10008
    },
    {
        label: '医院视频',
        id: 'hospital-video',
        templateId: 10113,
        ssdwId: 10118
    },
    {
        label: '工疗站视频',
        id: 'therapyStation-video',
        templateId: 10115,
        ssdwId: 10114
    },
    {
        label: '商超视频',
        id: 'market-video',
        templateId: 10053,
        ssdwId: 10009
    },
    {
        label: '学校视频',
        id: 'school-video',
        templateId: 10119,
        ssdwId: 10068
    },
    {
        label: '月子中心视频',
        id: 'maternityCenter-video',
        templateId: 10119,
        ssdwId: 10099
    },
    {
        label: '养老机构视频',
        id: 'nurseHouse-video',
        templateId: 10119,
        ssdwId: 10100
    },
    {
        label: '核酸采样点周边视频',
        id: 'detectPointAround-video',
        templateId: 10119,
        ssdwId: 10102
    },
    {
        label: '工业企业视频',
        id: 'industry-video',
        templateId: 10119,
        ssdwId: 10108
    },
    {
        label: '公共场所视频',
        id: 'gcyKeyplace-video',
        templateId: 10119,
        ssdwId: 10110
    },
    {
        label: '实时视频数据',
        id: 'live-video',
        templateId: 10054
    },
    {
        label: '编辑封控区域范围',
        id: 'rangLayer'
    },
    {
        label: '负压车台账-医院',
        id: 'vehicle-hospital'
    },
    {
        label: '负压车台账-车辆',
        id: 'vehicle-car'
    },
    {
        label: '封控区域',
        id: 'seal-area',
        templateId: 10076
    }, //以网格为最小单位
    {
        label: '封控管理区',
        id: 'seal-area2',
        templateId: null
    }, //以自定义区域为最小单位
    {
        label: '涉疫地区来南沙人员',
        id: 'epidemic-area'
    },
    {
        label: '涉疫地区来南沙人员-流入城市',
        id: 'epidemic-city'
    },
    {
        label: '事件告警',
        id: 'event-alarm'
    },
    {
        label: '确诊人员活动历史',
        id: 'diagnose-trace'
    },
    {
        label: '康复机构视频',
        templateId: 10119,
        id: 'recovery-video'
    },
    {
        label: '母婴服务机构视频',
        templateId: 10119,
        id: 'maternalChild-video'
    },
    {
        label: '精神卫生机构视频',
        templateId: 10119,
        id: 'mentalHealth-video'
    },
    {
        label: '社会服务中心视频',
        templateId: 10119,
        id: 'socialServiceCenter-video'
    },
    {
        label: '建筑工地视频',
        templateId: 10119,
        id: 'constructionSite-video'
    },
    {
        label: '宗教场所视频',
        templateId: 10119,
        id: 'religionPlace-video'
    },
]

export default LAYER_DICT