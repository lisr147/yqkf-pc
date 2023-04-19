import Api from '@/api/api'
import store from '../store'
// 动态增加风险人员台账,需要在VUE启动前加载好这个数据，来配置路由和菜单
var xhr = new XMLHttpRequest();
xhr.open("GET", "/yqfk/api/qyxxcj", false);
xhr.send()
let extraMenuData = JSON.parse(xhr.response)
extraMenuData = extraMenuData.data
setTimeout(() => {
    if (store) {
        store.commit('authority/SET_TEMPLATELIST', extraMenuData)
    }
}, 10)

// 大脑的URL权限接口数据中不包含层级关系，层级关系还是要手动写死
// 2022-01-19版本新增菜单
let menuData = {
    fkglq: {
        name: "封闭管控区",
    },
    zdrq: {
        name: "重点人群",
        // zgfxdqlnsry: '中高风险地区来南沙人员',
        zgfxdqfyryhc: "中高风险地区来粤返粤人员核查情况(总表)", //10058 2022-1-25
        gnzzddqzxryhc: "中高风险地区来粤返粤人员核查情况(当天清零表)", //10059 2022-1-25
        zgfxdqlnsrymx: "中高风险地区来南沙人员明细", //10060 2022-1-25
        zgfxdqfyrymx: "中高风险地区来粤返粤人员明细", //10060 2022-1-25
        gfxgwry: "高风险岗位人员", //10078 2022-2-24
        mjry: "密接、次密接人员",
        // cmjry: '次密接人员',
        // hhmry: '红黄码人员',
        // tsrq: '特殊人群',
        tsrqtj: "特殊人群统计",
        tsrq: "特殊人群明细",
        mjcmryqx: "密接、次密人员去向定位",
        fythmry: "防疫通红码人员",  // 2022-11-01
        fytmjcmjry: "防疫通密接次密接人员",  // 2022-11-15
    },
    medical: {
       name: "门诊信息",
       hospitalOrg: "门诊机构信息",
       hospitalHot: "阳性人员信息",
    },
    jkzcsj: {
        name: '健康自查数据',
    },
    // 2022-3-30 人员采集点
    cjdtz: {
        name: "重点行业台账",
    },
    fxry: {
        name: "重点行业人员",
        // tjbb: "统计报表", //2022-5-27
        scgzry: "商超工作人员", //2022-4-2
        kaqygzry: "口岸企业工作人员", //2022-3-30
        cyhygzry: "大型商场餐饮行业工作人员", //2022-3-30 原 餐饮行业工作人员
        crjqygzry: "出入境企业工作人员", //2022-4-12

        nonStarHotelStaff: "非星级酒店(工作人员)", //2022-4-15
        nonStarHotelTourist: "非星级酒店(旅客)", //2022-4-15
        // yxgzry: '一线工作人员', //2022-4-2
        // ryhshymjzpp: '人员核酸和疫苗接种匹配', //2022-4-12

        gdjzjz6063: "工地项目重点人员", //2022-5-19
        // gdwfsjz6063: "工地外分散居住哨点人员", //2022-5-19
        zxqyzdry: '装修服务重点人员',
        zxzsfwzdry: '装修装卸服务重点人员',
        gsqyzdry: '规上企业重点人员',
        gxqyzdry: '规下企业重点人员',
        sqcydzdry: '社区采样点重点人员',

        schooljzg: '学校重点人员（教职工）',
        schoolrey: '学校重点人员（幼儿园）',
        schoolxx: '学校重点人员（小学）',
        schoolcz: '学校重点人员（初中）',
        schoolgz: '学校重点人员（高中）',
    },
    // 重点行业统计 2022-11-21
    zdhytj: {
        name: "重点行业统计",
        ymjztj: "疫苗接种统计",
        hsjctj: "核酸检测统计",
        zdrqhshgtj: "重点人群核酸合规统计",
        zdrqhshgyjtj: "重点人群核酸预警统计",
    },
    zdcs: {
        name: "重点场所",
        gljd: "隔离酒店",
        gljdry: "酒店隔离人员信息", // 10048 2022-1-25
        hsjcd: "大规模核酸采样点",
        cghsjcd: "常规核酸采样点",
        // detectPointAround: '核酸采样点周边',
        crk: "道路出入口",
        // ggcs: '公共场所',
        llck: "冷链仓库",
        llckry: "冷链仓库工作人员明细", //10035 2022-1-25
        crjka: "出入境口岸",
        // qzrydgcs: "确诊人员到过场所", //2022-5-25 去掉这个菜单
        // 2022-1-24 新增两个
        kjsizyd: "跨境司机作业点",
        kjsj: "跨境司机明细", //10056 2022-1-25
        school: "学校",
        email: "国际进口邮件快件处理场所",
        emailstaff: "国际进口邮件快件处理场所工作人员明细",
        importedMaterial: "进口物料企业",
        importedMaterialStaff: "进口物料企业工作人员明细",
        // maternityCenter: '月子中心',
        // nurseHouse: '养老院',
        // industry: '工业企业',
        // gcyKeyplace: '城管云重点场所',
    },
    shipin: {
        name: "视频",
        // rcscsp: '肉菜市场视频',//10052 2022-1-26
        hsjcdsp: "常规核酸采样点视频", //10082 2022-3-1
        dgmhsjcdsp: "大规模核酸采样点视频",
        gljdsp: "隔离酒店视频", //10061 2022-1-26
        kjsjzydsp: "跨境司机作业点视频", //10062 2022-1-26
        // gcyKeyplaceVideo: '城管云重点场所视频',
        ydyyssp: "移动运营商视频",
        industrialEnterpriseVideo: "工业企业视频",
        videoInPublicPlaces: "公共场所视频",
        detectPointAroundVideo: "核酸采样点周边视频",
        coldChainWarehouseVideo: "冷链仓库视频",
        maternalChildServicesVideo: "母婴服务机构视频",
        zjcssp: "宗教场所视频",
        schoolVideo: "学校视频",
        pensionAgencyVideo: "养老机构视频",
        pharmacyVideo: "药店视频",
        constructionSiteVideo: "建筑工地视频",
        mentalHealthInstitutionsVideo: "精神卫生机构视频",
        rehabilitationFacilityVideo: "康复机构视频",
        allVideo: "视频总账",
    },
    ymjz: {
        name: "疫苗接种",
        ymjzmrtj: "疫苗接种每日统计",
        ymjzpmqk: "疫苗接种每日全市排名情况",
    },

    wzbz: {
        name: "物资保障",
        yyo: "医院",
        qyljzzyzbfzy: "区医疗救治转运专班负压车信息",
        ptyhrypbb: "配套医护人员排班表",
        zjhzpb: "专家会诊排班",
        ydo: "药店",
        // therapyStation: '工疗站',
        ydgyjl: "药店的购药记录", //  10057 2022-1-25
        gyjlpcmx: "购药记录排查情况明细", //  10083 2022-3-4
        gyjlpcqktjs: "购药记录排查情况统计数", //  10084 2022-3-4
        rcsc: "肉菜市场",
        sco: "商超",
        scpscqy: "水产品生产企业",
        fywzscqy: "防疫物资生产企业",
        xqscqy: "畜禽生产企业",
        jzxm: "建筑项目",
        tzss: "特种设施",
        zbysqy: "运输企业",
        zzck: "物流中转仓库",
        zzckpsry: "物流中转仓库派送人员明细", // 10050 2022-1-25
        kcwz: "政府物资储备数据",
    },

    rksj: {
        name: "人口数据",
        rkhcsjgl: "人口核查任务管理",
        rkhcrygl: "人口核查人员管理",
    },
    czc: {
        name: '城中村治理',
        czcCsbj: '城市部件',
        czcGfss: '公服设施',
        czcZdcs: '重点场所'
    },
    hsjc: {
        name: "核酸检测",
    },
    wgsj: {
        name: "网格数据",
    },
    fycl: {
        name: "负压车辆",
        // fyclxgyz: '负压车辆相关运作信息', //备份
        zyclxx: "转运车辆信息", //2022-3-21 原负压车辆相关运作信息模板
        zyryxx: "转运人员信息", //2022-3-21
    },
    // 2022-3-18 增加需求反馈
    feedback: {
        name: "需求反馈",
        fkqqzxqfk: "防控区群众需求反馈",
    },

    dqll: {
        name: "人力保障",
        dzz: "网格党组织",
        dymx: "党员明细",  // 10181 2022-11-09
        gdzyzj: "挂点支援镇（街）安排表",
        zyzjg: "志愿者机构",
        zyzmx: "志愿者明细", // 10041 2022-1-25
        srxz: "三人小组",
        hsjcxz: "核酸检测小组",
        abll: "安保力量",
        psry: "配送人员", //  2022-3-24
    },
    hcsj: {
        name: "货车司机",
        hcqygl: "货车企业管理",
        hcsjtz: "货车司机台账",
        yyhtxjl: "预约和通行记录",
    },
};

let templateIds = {
    tsrq: 11033, //特殊人群数据
    // ylzy: 10008, //物资-医疗资源
    rcsc: 10039, //物资-肉菜市场供应数据
    // scqy: 10010, //物资-生产企业数据
    // 10011  交通数据
    // 10012  网格分布数据
    // 10013  物资—政府物资储备数据
    hsjcd: 10027, //核酸采样点数据
    cghsjcd: 10055,
    // zdcs: 10015, // 重点场所流动人员数据
    // jzqy: 10016, //建筑企业资源数据
    // tzss: 10017,//  特种设施（铁马水马等）数据
    dzz: 10018, //党组织
    // zyz: 10019, //志愿者
    // // 10020  南沙区重点人员信息统计表
    crk: 10021, //南沙出入口统计表
    srxz: 10028,
    // hsxz: 10022,
    gljd: 10047,
    zgfxdqqk: 10023,
    gwryhcqk: 10024,
    gwryyjhcqk: 10025,
    zgfxhcqk: 10026,
    tsrqtj: 10029,
    kcwz: 10031,
    llck: 10032,
    // tsrqmx:10033,
    // kjsj: 10034,
    kjsj: 10056,
    zgfxdqlnsry: 10040,
    mjry: 10001,
    // cmjry: 10001,
    ggcssmjl: 10015, //公共场所扫码记录
    crjka: 10036,
    yyo: 10008,
    therapyStation: 10114, //工疗站
    ydo: 10008,
    sco: 10009,
    scpscqy: 10038,
    fywzscqy: 10010,
    xqscqy: 10037,
    jzxm: 10016,
    zyzjg: 10019,
    hsjcxz: 10022,
    tzss: 10017,
    zzck: 10042, //'中转仓库',
    kjsizyd: 10043, //'跨境司机作业点'
    zbysqy: 10044,
    abll: 10045,
    gljdry: 10048,
    llckry: 10035,
    ydgyjl: 10057,
    zzckpsry: 10050,
    zyzmx: 10041,
    zgfxdqfyryhc: 10058,
    gnzzddqzxryhc: 10059,
    zgfxdqlnsrymx: 10060,
    gdzyzj: 10064,

    //门诊信息
    hospitalOrg: 100081,
    hospitalHot: 100082,

    // 视频
    ggcssp: 10051, //10051 2022-1-26
    rcscsp: 10052, //10052 2022-1-26
    scsp: 10053, //10053 2022-1-26
    gljdsp: 10061, //10061 2022-1-26
    dgmhsjcdsp: 10051, //10061 2022-1-26
    ydsp: 10052, //10061 2022-1-26
    kjsjzydsp: 10062, //10062 2022-1-26
    llcksp: 10063, //10063 2022-1-26
    zgfxdqfyrymx: 10065,
    school: 10068, //学校
    email: 10067, //国际进口邮件快件处理场所
    emailstaff: 10066, //国际进口邮件快件处理场所 工作人员明细
    qyljzzyzbfzy: 10072, //'区医疗救治转运专班负压车信息',
    ptyhrypbb: 10074, // '配套医护人员排班表',
    zjhzpb: 10073, //'专家会诊排班',
    importedMaterial: 10070, //进口物料企业
    importedMaterialStaff: 10071, //进口物料企业工作人员明细
    ymjzmrtj: 10014, //'疫苗接种每日统计'
    ymjzpmqk: 10069, //'疫苗接种每日全市排名情况'
    fyclxgyz: 10075, //负压车辆相关运作信息
    fkqgl: 10076, // 封控管理区
    gfxgwry: 10078, //高风险岗位人员
    mjcmryqx: 10077, //密接、次密人员去向定位
    fythmry: 10180, //防疫通红码人员
    hsjcdsp: 10082, //核酸采样点视频
    xxsp: 10092, //学校视频
    ylysp: 10093, //养老院视频
    maternityCenterVideo: 10101, //月子中心视频
    gyjlpcmx: 10083, //购药记录排查情况明细
    gyjlpcqktjs: 10084, //购药记录排查情况统计数
    fkqqzxqfk: 5008, //防控区群众需求反馈
    zyclxx: 10086, //转运车辆信息
    zyryxx: 10087, //转运人员信息
    psry: 10088, //配送人员
    qzrydgcs: 10090, //确诊人员到过场所
    // , cjdtz: 10089 //采集点台账（口岸企业，餐饮，商超，非星级酒店）  2022-3-30
    kaqygzry: 6001, //口岸企业工作人员 2022-3-30
    nonStarHotelStaff: 6002, //非星级酒店工作人员  2022-4-15
    nonStarHotelTourist: 6002, //非星级酒店旅客  2022-4-15
    cyhygzry: 6003, //餐饮行业工作人员  2022-3-30
    scgzry: 6004, //商超工作人员  2022-3-30
    crjqygzry: 6005, //出入境企业工作人员  2022-4-12
    ryhshymjzpp: 6006, //人员核酸和疫苗接种匹配
    gdjzjz6063: 6063, //工地集中居住哨点人员 2022-5-19
    gdwfsjz6063: 6063, //工地外分散居住哨点人员 2022-5-19
    hcqygl: 10089, //货车企业管理 2022-4-24
    hcsjtz: 6013, //货车司机台账 2022-4-24
    yxgzry: 10091, //一线工作人员  2022-4-7
    zxqyzdry: 6071, //装修企业重点人员
    zxzsfwzdry: 6073, //装修装卸服务重点人员
    gsqyzdry: 6072, // 规上企业重点人员
    gxqyzdry: 6074, // 规下企业重点人员
    sqcydzdry: 6075, // 社区采样点工作人员

    schooljzg: 6049, //学校哨点人员（教职工）
    schoolrey: 6049, //学校哨点人员（幼儿园）
    schoolxx: 6049, //学校哨点人员（小学）
    schoolcz: 6049, //学校哨点人员（初中）
    schoolgz: 6049, //学校哨点人员（高中）




    epidemiologicalSurveyIndex: 10095, //流调信息
    positivePersonnelRecords: 10096, //阳性人员
    personnelContactRecords: 10097, //密接次密接人员
    keyPlaceRecords: 10098, //重点场所
    eventManagement: 10120, //事件管理
    scanManagement: 10125, //扫码管理
    movingTrail: 12124, //移动轨迹台账坐标调整
    personnelCoordinate: 10123, //人员地址坐标调整
    keyPlaceCoordinate: 10122,//重点场所台账坐标调整

    maternityCenter: 10099, //月子中心
    nurseHouse: 10100, //养老院
    detectPointAround: 10102, //核酸采样点周边
    yyhtxjl: 10107, //预约和通行记录(货车司机) 2022-4-24
    industry: 10108, //工业企业
    industryVideo: 10109, //工业企业视频
    gcyKeyplace: 10110, //城管云重点场所
    gcyKeyplaceVideo: 10111, //城管云重点场所视频
    hospitalVideo: 10113, //医院视频
    therapyStationVideo: 10115, //工疗站视频
    ydyyssp: 10116, //移动运营商视频
    allVideo: 10119, //视频总账
    industrialEnterpriseVideo: 10119,
    videoInPublicPlaces: 10119,
    detectPointAroundVideo: 10119,
    coldChainWarehouseVideo: 10119,
    maternalChildServicesVideo: 10119,
    zjcssp: 10119,
    schoolVideo: 10119,
    pensionAgencyVideo: 10119,
    pharmacyVideo: 10119,
    constructionSiteVideo: 10119,
    mentalHealthInstitutionsVideo: 10119,
    rehabilitationFacilityVideo: 10119,
    // 城中村治理
    czcCsbj: 12125,// 12125：城市部件
    czcGfss: 12126,// 12126：公服设施
    czcZdcs: 12127,// 12127：重点场所
    dymx: 10181, //党员明细 - 2022-11-09
    shyccry: 12128, //穗货运乘车人员 - 2022-11-11
    fytmjcmjry: 12129, //防疫通密接次密接人员 - 2022-11-15

    // 重点行业统计
    ymjztj: 12228, //疫苗接种统计
    hsjctj: 12130, //核酸检测统计
    zdrqhshgtj: 12131, //重点人群核酸合规统计
    zdrqhshgyjtj: 12132, //重点人群核酸预警统计

    // 人口数据
    rkhcsjgl:12138, //人口核查数据管理,
    rkhcrygl:12139 //人口核查人员管理,
};

// 动态增加风险人员
// todo采集点通用的模板无需在前端写死，综合门户按以下规则配置即可自动生成台账
// 重点人员：cjdgzry+模板ID，采集点台账：cjdtz+模板ID
extraMenuData.forEach(v => {
    // 风险人员
    menuData.fxry[`cjdgzry${v.templateId}`] = `${v.ztlx}重点人员`
    // 采集点台账
    menuData.cjdtz['cjdtz' + v.templateId] = v.ztlx
    templateIds[`cjdgzry${v.templateId}`] = v.templateId
})
menuData.fxry.yxgzry = '一线工作人员'
menuData.fxry.ryhshymjzpp = '人员核酸和疫苗接种匹配'
menuData.fxry.shyccry = '穗货运乘车人员'
export default menuData



export const templateId = templateIds

let dict = (key, row) => {
    let data = {
        IDENTITY_TYPE: {
            1: '身份证',
            3: '护照',
            4: '军官证',
            6: '港澳居民居住证',
            7: '台湾居民居住证',
            8: '港澳居民来往内地通行证',
            9: '台湾居民来往内地通行证',
            11: '出入境通行证',
            12: '一次有效台湾居民来往大陆通行证',
            13: '多次有效台湾居民来往大陆通行证',
            14: '解除隔离（发热患者核酸检测阴性）',
        },
        CHECK_HANDLE_SUGG: {
            1: '待核酸检测风险人员',
            2: '居家隔离健康管理',
            3: '集中隔离健康管理',
            4: '集中隔离医学观察（密切接触者）',
            5: '留院观察（新观待排）',
            6: '疑似病例',
            7: '阳性检测（无症、状感染者）',
            8: '确诊病例（细分为轻型、普通型、重型、危重型）',
            9: '确诊或阳性检测病例出院后隔离观察',
            10: '解除隔离（满规定观察期核酸检测阴性且无症状）',
            11: '确诊其他疾病排除新冠感染',
            12: '其它',
            13: '居家隔离等待核酸结果',
        },
        UNIT_TYPE: {
            1: '发热门诊',
            2: '收治医院',
            3: '集中隔离医学观察',
            4: '集中隔离健康观察',
            5: '社区'
        },
        IS_IMPORT_PERSON: {
            1: '是', 0: '否'
        },
        BRUSH_CARD_MODE: {
            1: '刷身份证',
            2: '手动输入'
        },
        ONLY_CHILD: {
            1: '是',
            0: '否'
        },
        PUSH_FLAG: {
            0: '正常',
            1: '停止'
        },
        STATUS: {
            0: '未注销',
            1: '人工注销',
            2: '自动注销',
            3: '自动注销已确认',
            4: '确认为同时居住地址',
            5: '撤销同时居住'
        },
    }
    // console.log(key,row,)
    return data[key][parseInt(row[key])] || row[key]
}
// 2022-2-17 新增：通过同步获取的数据列表展示
export const fetchData = [
    // 健康自查数据
    {
        parent: 'jkzcsj',
        name: '健康自查数据',
        id: 'jkzc',
        api: Api().HealthSelfExaminationController.post_dataPage,
        keys: {
            USERNAME: '姓名',
            PHONE: '电话',
            GENDER: '性别',
            BIRTHDAY: '出生日期',
            IDENTITY_TYPE: '证件类型',
            IDENTITY_NUM: '身份证号',
            CITY: '城市',
            AREA: '区',
            STREET: '街道/ 村居名称',
            ADDR: '详细地址',
            PERSON_TYPE: '人员类型',
            RECENT_IN_HUBEI: '14天内在湖北',
            LIVING: '14天内在湖北居住到访城市',
            LIVING_CODE: '14天在湖北居住到访城市行政区划代码',
            STATUS: '状态',
            CREATE_TIME: '提交时间',
            SYMPTOM_DSCR: '症状自行描述',
            CLUE_TYPE: '主动上报还是线索',
            CLUE_SUPPLIER: '反映人姓名',
            CLUE_SUPPLIER_PHONE: '反映人手机',
            CLUE_VEHICLE: '车牌',
            COMMUNITY: '社区',
            IS_ISOLATE: '是否居家隔离',
            RESIDENT_FLAG: '是否常住居民',
            RESIDENT_CONDITION: '近期在常驻地居住情况类型',
            RECENT_REGION_NAME: '近期居住地方',
            TRAVEL_REGION_CLASS: '近期旅居地方分类',
            SOCIAL_CONTACT: '近期接触史',
            HEALTH_STATE: '健康状况',
            IS_CHINESE: '是否中国国籍',
            NATIVE_PLACE: '籍贯',
            DOMICILE_PLACE: '户籍所在地',
            DUMP_TIME: '上报时间',
            CONTACT_DATE_RECENT: '接触日期',
            CONTACT_DATE_LIKE: '可能接触日期',
            QUASI_RETURN_DATE: '拟返回广州日期',
            RETURN_DATE: '返回日期',
            IS_FOCUS_PEOPLE: '是否重点人群',
            CHECK_HANDLE_SUGG: '疫情状态',
            EXPIRY_DATE: '有效期至',
            NATION: '证件类型为护照，对应的国家',
            COUNTRY_NAME: '国家',
            REPORT_SOURCE: '上报来源',
            RELATIONSHIP: '与本人关系',
            VEHICLE_TYPE: '交通工具',
            VEHICLE: '车牌号 / 车次号',
            DEPART_COUNTRY_NAME: '出发地国家',
            DEPART_PROV: '出发地省份',
            DEPART_CITY: '出发地地市',
            DOMICILE_PROV: '户籍所在省份',
            DOMICILE_CITY: '户籍所在地级市'
        },
        filter: [
            'USERNAME',
            'PHONE',
            'IDENTITY_NUM',
            'STREET',
            'DEPART_PROV',
            'DEPART_CITY',
            // 'DOMICILE_PROV',
            // 'DOMICILE_CITY'
        ],
    },
    // 红黄码人员
    {
        parent: 'zdrq',  //1级目录
        name: '红黄码人员',  //菜单名字
        id: 'hhmry',
        api: Api().HealthCodeController.post_pageList, //请求接口
        filter: ['USERNAME', 'hh_type', 'TUISONG_TIME', 'UPDATE_TIME', 'STREET', 'ADDR'],  //筛选字段
        keys: {
            USERNAME: '姓名',
            PHONE: '联系电话',
            IDENTITY_TYPE: '证件类型',
            IDENTITY_NUM: '证件号',
            HSQK: '未来3天内核酸情况',
            IS_CHECK_NO_RESULT: '已做核酸未出结果的状态',
            SYNC_TIME: '同步时间',
            AFFIRM_TIME: '确认时间',
            SEPERATE_ADDR: '隔离地点',
            ARRIVAL_FROM: '抵穗来源地',
            SEPERATE_END: '隔离结束时间',
            SEPERATE_BEGIN: '隔离开始时间',
            UNIT_TYPE: '单位类型- 隔离点与医院类型',
            UNIT_NAME: '单位名称--隔离点与医院名称',
            RESPONSI_DEPT: '责任部门',
            TUISONG_TIME: '推送时间',
            IS_TRUE_IDNUMBER: '是否身份证',
            COMMUNITY_CODE: '社区行政区划代码',
            COMMUNITY: '社区',
            ADDR: '详细地址',
            STREET_CODE: '街道区划代码',
            STREET: '街道名称',
            AREACODE: '县区行政区划代码',
            AREA: '区',
            GRID_CODE: '所属网格编码',
            BIRTHDAY: '出生日期',
            GENDER: '性别',
            STATION_TYPE: '观察点类型',
            ORG_ID: '组织ID',
            NUCLEIN_CHECKTIME: '核酸检测时间',
            NUCLEIN_CHECK: '核酸检测结果',
            PATHOGENESIS_STATIC_TIME: '发病状态时间',
            PATHOGENESIS_STATIC: '发病状态',
            // REGISTER_STATIC: '登记状态',
            QUESTION_TEL: '答疑电话',
            CONF_DEPT: '确诊部门',
            CONF_TIME: '确诊时间',
            UPDATE_TIME: '更新时间',
            UPDATE_USER: '更新人',
            CREATE_TIME: '创建时间',
            CREATOR: '创建人',
            // STATUS: '状态',
            // GZ_Y: 'GZ_Y',
            // GZ_X: 'GZ_X',
            CHECK_HANDLE_SUGG: '疫情状态',
            CHECK_TIME: '核查时间',
            // ID: 'ID',
            // S_DEST_NODE: 'S_DEST_NODE',
            // S_SRC_NODE: 'S_SRC_NODE',
            // S_ROUTE_STATUS: 'S_ROUTE_STATUS',
            // S_TRANS_STATUS: 'S_TRANS_STATUS',
            // S_STATUS: 'S_STATUS',
            // S_LAST_UPDATED: 'S_LAST_UPDATED',
            // S_CREATION_TIME: 'S_CREATION_TIME',
            // S_GUID: 'S_GUID',
            jz: '街镇',
            jz_grid: '街镇grid',
            first_inject_time: '第一针注射时间',
            second_inject_time: '第二针注射时间',
            third_inject_time: '第三针注射时间',
            hs_check_time: '7天内核酸检测时间',
            hs_check_result: '7天内核酸检测结果',
            hh_type: '红黄码类型',
        },
        formatter: {
            IDENTITY_TYPE(row) {
                return dict('IDENTITY_TYPE', row)
            },
            CHECK_HANDLE_SUGG(row) {
                return dict('CHECK_HANDLE_SUGG', row)
            },
            UNIT_TYPE(row) {
                return dict('UNIT_TYPE', row)
            },
        }
    },
    // 公安黄码数据
    {
        parent: 'zdrq',  //1级目录
        name: '公安黄码数据',  //菜单名字
        id: 'publicsecurityyellowcode',
        api: Api().YellowCodeController.post_pageList, //请求接口
        filter: ['sfz', 'xm', 'sjh', 'jz', 'type', 'input_time', 'wg', 'jc'],  //筛选字段
        keys: {
            sfz: '身份证',
            xm: '姓名',
            xb: '性别',
            sjh: '手机号码',
            jz: '街道',
            wg: '网格',
            jc: '村居',
            dz: '地址',
            type: '数据来源',
            input_time: '导入时间',
        },
    },
    // 穗康扫码通行记录
    {
        parent: 'zdcs',
        name: '穗康扫码通行记录',//原公共场所扫码记录
        id: 'ggcssmjl',
        api: Api().PeopleFlowController.post_place,
        filter: ['GRID_POINT_NAME', 'ADDRESS', 'DUMP_TIME', 'QRC_NAME', 'COLOR', 'IDENTITY_NO'
        ],//查询条件：扫码时间（按时间段查询）、姓名、健康码状态
        keys: { // 顺序：采集点名称（场所名称）、检查点地址、穗康码人员昵称、电话号码、证件类别、证件号、性别
            GRID_POINT_NAME: '采集点名称(场所名称)',
            ADDRESS: '检查点地址',
            QRC_NAME: '穗康码人员昵称',
            PHONE: '电话号码',
            IDENTITY_TYPE_CODE: '证件类别',
            IDENTITY_NO: '证件号',
            GENDER: '性别',
            DUMP_TIME: '记录导出时间',
            QRC_ID: '穗康码人员ID',
            CREATE_NAME: '创建人昵称',
            CREATE_ID: '创建人ID',
            CREATE_TIME: '创建时间',
            REMARK: '备注',
            OTHER_SYMPTOM: '其他症状',
            SYMPTOM: '症状',
            // STATE: '状态',
            TEMPERATURE: '体温',
            LATITUDE: '纬度',
            LONGITUDE: '经度',
            GRID_POINT_DATA: '采集点数据JSON',
            GRID_POINT_ID: '采集点ID',
            ID: '唯一标识符',
            // S_DEST_NODE: 'S_DEST_NODE',
            // S_SRC_NODE: 'S_SRC_NODE',
            // S_ROUTE_STATUS: 'S_ROUTE_STATUS',
            // S_TRANS_STATUS: 'S_TRANS_STATUS',
            // S_STATUS: 'S_STATUS',
            // S_LAST_UPDATED: 'S_LAST_UPDATED',
            // S_CREATION_TIME: 'S_CREATION_TIME',
            // S_GUID: 'S_GUID',
            COLOR: '红黄码类型',
            P_ID: '唯一标识',
            P_ROW_NUMBER: '数据行号',
            // P_CREATE_DATETIME: '创建时间',
            // P_UPDATE_DATETIME: '更新时间',
            // P_OPERATION: '操作类型',
        },
        formatter: {
            // COLOR(scope) {
            //     let dict = {
            //         0: '正常',
            //         20: '红码',
            //         10: '黄马'
            //     }
            //     console.log(scope)
            //     if (!scope.COLOR){
            //         return ''
            //     }
            //     return dict[scope.COLOR]
            // }
        }
    },
    //  穗康扫码脱敏数据
    {
        parent: 'zdcs',
        name: '穗康扫码脱敏数据',
        id: 'sksmtmsj',
        api: Api().PeopleFlowController.post_sksm,
        filter: ['skmrymc','wtmsfzh'],
        keys: { // 顺序：穗康码人员姓名、已脱敏身份证号、未脱敏身份证号、性别、手机号码、红黄码类型、居住地、最近一次扫码时间、最近一次核酸时间
            skmrymc: '穗康码人员名称',
            ytmsfzh: '已脱敏身份证号',
            wtmsfzh: '未脱敏身份证号',
            xb: '性别',
            sjhm: '手机号码',
            hhmlx: '红黄码类型',
            jzd: '居住地',
            smcs: '扫码场所',
            smsj: '扫码时间',
            zjychssj: '最近一次核酸时间'
        },
        formatter: {

        }

    },
    // 公安扫码通行记录
    {
        parent: 'zdcs',
        name: '公安扫码通行记录',  //2022-3-16
        id: 'gasmtxjl',
        api: Api().PeopleFlowController.post_gasm,
        filter: ['STATIONNAME', 'ADDRESS', 'LOGTIME', 'FULLNAME', 'SKMSTATUS', 'IDNUM'
        ],//查询条件：扫码时间（按时间段查询）、姓名、健康码状态
        keys: {
            STATIONNAME: '采集点名称(场所名称)',
            ADDRESS: '场所详细地址',
            FULLNAME: '姓名',
            IDNUM: '证件号',
            IDTYPE: '证件类别',
            SKMSTATUS: '穗康码状态',	//穗康码状态(0无 1正常 2为红码 3黄码)
            PHONENUM: '通行人手机号',
            MSG: '提示信息',
            LOGTIME: '记录导出时间',
        },
    },
    // 重点人群配置
    {
        parent: 'zdhytj',
        name: '重点人群统计配置',
        id: 'zdrqtjpz',
        api: Api().ZdRqStatisticConfigController.post_pageList,
        filter: ['ztlx', 'zrdw'],//查询条件：所属行业、责任单位
        keys: { // 顺序：责任单位、细类、检测对象、核酸检测规则、行业类型、人员类别、总人数、在岗人数、放假人数、监测状态、备注
            zrdw: '责任单位',
            xlmc: '细类',
            jcdx: '检测对象',
            rylbDtos: '核酸检测规则',
            ztlx: '行业类型',
            rylb: '人员类别',
            zrs: '总人数',
            zgrs: '在岗人数',
            fjrs: '放假人数',
            status: '监测状态', // 0代表未检测， 1代表检测
            bz: '备注'
        },
        formatter: {
            status(scope) {
                let dict = {
                    '0': false,
                    '1': true,
                }
                return dict[scope.status]
            },
            rylb(scope) {

                return scope.rylb ? scope.rylb.join(',') : '-'
            },
            rylbDtos(scope) {
                let jsRules = []
                scope.rylbDtos.forEach(item => {
                    let str = item.days&&item.times ? `${item.days}天${item.times}检`: ' - '
                    jsRules.push(str)
                })
                return jsRules.join(',')
            }

        }
    },
    // 公共场所
    {
        parent: 'zdcs',
        name: '公共场所',
        id: 'ggcs',
        api: Api().PeopleFlowController.post_commonPlace,
        filter: ['stationName', 'sszj', 'sswg', 'is_key', 'dataSource', 'scene_type_name'
        ],//查询条件：扫码时间（按时间段查询）、姓名、健康码状态
        keys: { // 顺序：采集点名称（场所名称）、检查点地址、穗康码人员昵称、电话号码、证件类别、证件号、性别
            stationName: '场所名称',
            address: '检查点地址',
            is_key: '是否重点场所',
            hsjcd: '关联核酸点',
            sszj: '所属镇街',
            sswg: '所属网格',
            dataSource: '数据来源',
            scene_type_name: '场景类型'
        },
        formatter: {
            is_key(scope) {
                let dict = {
                    '0': '是',
                    '1': '否',
                }
                return dict[scope.is_key]
            },
            hsjcd(scope) {
                if (scope.hsjcd) {
                    return scope.hsjcd.map(v => v.nucleic_name).join(',')
                } else {
                    return '-'
                }

            }
        }
    },
    // 户籍人口
    // {
    //     parent: 'rksj',
    //     name: '户籍人口',
    //     id: 'hjrk',
    //     api: Api().PeopleFlowController.post_huji,
    //     filter: ['NAME', 'HUKOU_PROVENCE', 'HUKOU_CITY', 'HUKOU_COUNTY', 'HUKOU_STREET'],
    //     keys: {
    //         NAME: '姓名',
    //         CONTACT: '联系电话',
    //         ID_CARD_TYPE: '证件类型',
    //         ID_NUMBER: '证件号码',
    //         SEX: '性别',
    //         NATION: '民族',
    //         DIST_CODE: '所属行政区编码',
    //         GRID_CODE: '所属网格编码',
    //         ID: 'ID',
    //         EXT_SYSTEMID: '外部扩展编码',
    //         BATCH_NUMBER: '批号',
    //         DIST_NAME: '所属区名称',
    //         POPULATION_TYPE: '人员类型',
    //         BIRTH: '出生日期',
    //         LIVE_STATUS: '居住状态',
    //         EDUCATION: '文化程度',
    //         MARITAL_STATUS: '婚姻状况',
    //         POLITICAL_STATUS: '政治面貌',
    //         RELIGION: '宗教信仰',
    //         OCCUPATION: '职业',
    //         ADDRESS: '现居住地址',
    //         HUKOU_POLICESATION: '户籍所在地派出所',
    //         HUKOU_PROVENCE: '户籍省',
    //         HUKOU_CITY: '户籍市',
    //         HUKOU_COUNTY: '户籍(区/ 县)',
    //         HUKOU_STREET: '户籍街道',
    //         HUKOU_ADDRESS: '户籍详址',
    //         NATIVE_PROVINCE: '籍贯(省)',
    //         NATIVE_CITY: '籍贯(市)',
    //         NATIVE_COUNTY: '籍贯(区/ 县)',
    //         REMARKS: '备注',
    //         STATUS: '状态',
    //         CREATOR: '创建人',
    //         CREATE_TIME: '创建时间',
    //         UPDATE_USER: '更新人',
    //         UPDATE_TIME: '更新时间',
    //         INIT_TIME: '初始化时间',
    //         CHECK_FLAG: '核查标识',
    //         CLEAN_TIME: '清洗时间',
    //         IS_PROBLEM: '是否有问题',
    //         PROBLEM_TYPE: '问题类型',
    //         PROBLEM_INSTRU: '问题说明',
    //         PUSH_DATA_FLAG: '推送数据标识',
    //         CITY_PUSH_TIME: '市推送时间',
    //         VER_NO: '数据版本号',
    //         EXG_BATCH: '对接批次',
    //         EXG_ID: '对接流水号',
    //         EXG_TIME: '对接时间',
    //         HID: '分户ID',
    //         COMMITTEES: '所属社区',
    //         CITY: '居住城市',
    //         COUNTY: '居住区(县)',
    //         STREET: '居住街镇',
    //         NEIGHBORHOOD_COMMITTEES: '居住所属居委会(村)',
    //         ROAD_NAME: '居住所属街路巷',
    //         DOORPLATE_NUMBER_CODE: '门牌号编码',
    //         DOORPLATE_NUMBER: '门(楼)牌号',
    //         HOUSEBUILD_NUMBER_CODE: '房屋栋编码',
    //         HOUSE_NUMBER_CODE: '房间号编码',
    //         HOUSE_NUMBER: '房间号',
    //         IS_IMPORT_PERSON: '是否是重点人员 1: 是 0: 否',
    //         VIDEO: '视频',
    //         PHOTO: '照片',
    //         COMMITTEES_CODE: '所属社区',
    //         CITY_CODE: '居住城市编码',
    //         COUNTY_CODE: '居住区(县)编码',
    //         ROAD_NAME_CODE: '居住所属街路巷编码',
    //         STREET_CODE: '居住街镇编码',
    //         // WGS84_X: 'WGS84_X',
    //         // WGS84_Y: 'WGS84_Y',
    //         // GZ_X: 'GZ_X',
    //         // GZ_Y: 'GZ_Y',
    //         DATA_SOURCE: '数据来源',
    //         HUKOU_TYPE: '户口类型',
    //         MANAGE_TYPE: '管理分类类型',
    //         PHOTO_ACCEPTANCE_NO: '照片受理号',
    //         ENTERPRISE_NO: '企业编号',
    //         FTA_TYPE: '是否自贸区管理',
    //         BRUSH_CARD_MODE: '人员刷证新增方式(1: 刷身份证  2：手动输入)',
    //         SERVICE_LOCATION: '服务处理所',
    //         NATIONALITY: 'NATIONALITY',
    //         ONLY_CHILD: '是否独生（1、是，0否）',
    //         PUSH_FLAG: '推送状态（0正常、1停止）',
    //         PUSH_NUM: '推送次数',
    //         LIVE_PLACE_ELSE: '其他居住点（从图南同步来的）',
    //         JHID: '图南推送交换ID',
    //         REMARK_ADDRESS: '备注地址',
    //         SEPARATE: '1是0否',
    //         P_ID: '唯一标识',
    //         P_ROW_NUMBER: '数据行号',
    //         P_CREATE_DATETIME: '创建时间',
    //         P_UPDATE_DATETIME: '更新时间',
    //         P_OPERATION: '操作类型',
    //     },
    //     formatter: {
    //         // STATUS: '状态: 0 - 未注销, 1 - 人工注销, 2 - 自动注销, 3 - 自动注销已确认, 4 - 确认为同时居住地址, 5 - 撤销同时居住',
    //         IS_IMPORT_PERSON(row) {
    //             return dict('IS_IMPORT_PERSON', row)
    //         },
    //         BRUSH_CARD_MODE(row) {
    //             return dict('BRUSH_CARD_MODE', row)
    //         },
    //         ONLY_CHILD(row) {
    //             return dict('ONLY_CHILD', row)
    //         },
    //         PUSH_FLAG(row) {
    //             return dict('PUSH_FLAG', row)
    //         },
    //         STATUS(row) {
    //             return dict('STATUS', row)
    //         },
    //     }
    // },
    {
        parent: 'rksj',
        name: '户籍人口',
        id: 'hjrk',
        api: Api().RenkouController.post_findByPage,
        filter: ['idNumber', 'contact', 'name', 'street'],
        condition: {
            rylx: '户籍人口'
        },
        keys: {
            lc: "楼层",
            fh: "房号",
            idNumber: '证件号码',
            name: '姓名',
            // rylx人员类型,
            street: '镇街',
            contact: '联系电话',
            address: '居住地址',
            age: '年龄',
            sex: '性别'
        },
    },
    // 流动人口
    {
        parent: 'rksj',
        name: '常住人口',
        id: 'ldrk',
        api: Api().RenkouController.post_findByPage,
        filter: ['idNumber', 'contact', 'name', 'street'],
        condition: {
            rylx: '流动人口'
        },
        keys: {
            lc: "楼层",
            fh: "房号",
            idNumber: '证件号码',
            name: '姓名',
            // rylx人员类型,
            street: '镇街',
            contact: '联系电话',
            address: '居住地址',
            age: '年龄',
            sex: '性别'
        },
    },
    // 频繁流动人口
    {
        parent: 'rksj',
        name: '流动人口',
        id: 'pfldrk',
        api: Api().RenkouController.post_findCgyByPage,
        filter: ['idNumber', 'contact', 'name', 'street'],
        keys: {
            lc: "楼层",
            fh: "房号",
            idNumber: '证件号码',
            name: '姓名',
            street: '镇街',
            contact: '联系电话',
            address: '居住地址',
            age: '年龄',
            sex: '性别',
            rylx: '人员类型'
        },
    },

    // {
    //     parent: 'rksj',
    //     name: '流动人口',
    //     id: 'ldrk',
    //     api: Api().PeopleFlowController.post_flowPeople,
    //     filter: ['name', 'street_name', 'grid_name', 'hukou_city', 'hukou_county', 'hukou_address'],
    //     keys: {// 顺序：姓名、联系电话、证件类型、证件号码、性别、民族、所属镇街名称、所属镇街编码、所属网格名称、所属网格编码
    //         name: '姓名',
    //         id_card_type: '证件类别',
    //         id_number: '证件号码',
    //         sex: '性别',
    //         nation: '民族',
    //         street_name: '所属镇街名称',
    //         street_code: '所属镇街编码',
    //         grid_name: '所属网格名称',
    //         grid_code: '所属网格编码',
    //         county: '所属区',
    //         community_name: '所属社区名称',
    //         community_code: '所属社区编码',
    //         doorplate_number: '门（楼）牌号',
    //         road_name: '街（路巷）名称',
    //         house_number: '详址（房号）',
    //         hukou_type: '户口性质',
    //         birth: '出生日期',
    //         education: '教育程度',
    //         political_status: '政治面貌',
    //         manage_type: '管理类型',
    //         marital_status: '婚姻状况',
    //         religion: '宗教信仰',
    //         hukou_provence: '户籍省',
    //         hukou_city: '户籍市',
    //         hukou_county: '户籍区',
    //         hukou_address: '户籍地址'
    //     }
    // },
    // 核酸检测
    {
        parent: 'hsjc',
        name: '核酸检测',
        id: 'hsjc',
        api: Api().HSCheckController.post_pageList,
        filter: ['XM', 'ZJHM', 'SJHM'],//姓名、检测时间（时间段）
        keys: {
            XM: '姓名',
            ZJHM: '证件号码',
            SJHM: '手机号码',
            CYRQ: '采样时间',
            JCSJ: '检测时间',
            JCJIEGUO: '检测结果',
            BYZD2: '采样机构名称',
            CYDD: '采样地点',
            JCJG: '检测机构',
            JZD: '居住地',
            CBD: '参保地',
            CBXZ: '参保险种',
            CBLS: '参保类型',
            XXDWMC: '学校/ 单位名称',
            JCXM: '检测项目',
            BBLX: '标本类型',
            JSLX: '结算类型',
            JWRJRY: '是否14天内境外入境人员',
            RYSF: '人员身份',
            RYLY: '人员来源',
            HJD: '户籍地',
            XB: '性别',
            NL: '年龄',
            BYZD5: '检测结果填报时间',
            BYZD4: '采样机构坐落地行政区划',
            ZJLX: '证件类型',
            GJ: '国籍',
            // KFGD_DEL_FLAG: '是否删除',
            KFGD_CTIME: '更新时间',
            KFGD_ID: '唯一标识',
            // S_DEST_NODE: 'S_DEST_NODE',
            // S_SRC_NODE: 'S_SRC_NODE',
            // S_ROUTE_STATUS: 'S_ROUTE_STATUS',
            // S_TRANS_STATUS: 'S_TRANS_STATUS',
            // S_STATUS: 'S_STATUS',
            // S_LAST_UPDATED: 'S_LAST_UPDATED',
            // S_CREATION_TIME: 'S_CREATION_TIME',
            // S_GUID: 'S_GUID',
            P_ID: '唯一标识',
            P_ROW_NUMBER: '数据行号',
            P_CREATE_DATETIME: '创建时间',
            P_UPDATE_DATETIME: '更新时间',
            P_OPERATION: '操作类型',
        },
        formatter: {}
    },
    {
      parent: 'medical',
      name: '门诊科室信息',
      id: 'hospitalDept',
      api: Api().YljzTjController.post_detail,
      filter: ['ssyybh', 'ssyy', 'bh', 'name'],
      condition: {
        tjlx: 'ks'
      },
      keys: {
        ssyybh: '组织机构代码',
        ssyy: '医院名称',
        bh: '科室代码',
        name: '科室名称',
      },
      formatter: {}
    },
    {
        parent: 'medical',
        name: '门急诊实时业务',
        id: 'mjzssyw',
        api: Api().YljzTjController.post_detail,
        filter: ['ssyybh', 'ssyy', 'bh', 'name'],
        condition: {
            tjlx: 'mjzyw'
        },
        keys: {
            ssyybh: '组织机构代码',
            ssyy: '医院名称',
            bh: '科室代码',
            name: '科室名称',
            ghrs: '挂号人数',
            hzrs: '候诊人数',
            mzjzrs: '门诊就诊人数',
            jzjzrs: '急诊就诊人数',
            updateTime: '更新时间',
        },
        formatter: {}
    },
    {
        parent: 'medical',
        name: '住院实时业务',
        id: 'zyssyw',
        api: Api().YljzTjController.post_detail,
        filter: ['ssyybh', 'ssyy', 'bh', 'name'],
        condition: {
            tjlx: 'zy'
        },
        keys: {
            ssyybh: '组织机构代码',
            ssyy: '医院名称',
            bh: '科室代码',
            name: '科室名称',
            icuNum: 'ICU床位数',
            inhosNum: '在院人数',
            outHosNum: '出院人数',
            bedNousedNum: '空床位数',
            updateTime: '更新时间',
        },
        formatter: {}
    },
    {
        parent: 'medical',
        name: '门急诊就诊实时记录',
        id: 'mjzjzssjl',
        api: Api().YljzTjController.post_detail,
        filter: ['hzxm', 'cardNumber', 'ssyybh', 'bh', 'name'],
        condition: {
            tjlx: 'mjzjl'
        },
        keys: {
            hzxm: '姓名',
            cardNumber: '证件号码',
            ssyy: '医院名称',
            ssyybh: '医疗组织机构代码',
            bh: '就诊科室代码',
            name: '就诊科室名称',
            visitDate: '门诊就诊日期',
            updateTime: '更新时间',
        },
        formatter: {}
    },
    {
        parent: 'medical',
        name: '挂号信息',
        id: 'jhxx',
        api: Api().YljzTjController.post_detail,
        filter: ['cardNumber', 'lsh', 'ssyybh', 'bh', 'name'],
        condition: {
            tjlx: 'gh'
        },
        keys: {
            cardNumber: '证件号码',
            lsh: '就诊流水号',
            ssyy: '医院名称',
            ssyybh: '医疗组织机构代码',
            name: '就诊科室',
            bh: '就诊科室代码',
            regDate: '挂/退号日期',
            name5: '更新时间',
        },
        formatter: {}
    },
    // 网格数据
    {
        parent: 'wgsj',
        name: '网格数据',
        id: 'wgsj',
        api: Api().GeoController.post_pageList,
        filter: ['name', 'code', 'street_name', 'committees_name'],
        keys: {
            id: 'ID',
            code: '网格编码',
            name: '网格(辖区)名称',
            street_code: '街镇编码',
            street_name: '街镇名称',
            committees_code: '居委会编号',
            committees_name: '居委会名称',
        }
    },

    {
        parent: 'zdrq',
        name: '穗货运数据',
        id: 'shyyy',
        api: Api().ShyAppointFormController.post_pageList, //请求接口
        filter: ['oid', 'vehicleNo', 'originProvinceName', 'originCityName', 'corpName', 'offUserName', 'areaOrgName'],
        keys: {
            oid: '预约单号',
            vehicleNo: '车牌',
            originProvinceName: '出发地省名称',
            originCityName: '出发地市名称',
            originDistrictName: '出发地区名称',
            parkOrgName: '到访所属园区',
            townOrgName: '到访所属镇街名称',
            corpName: '到访公司名称',
            corpAddress: '到访公司地址',
            applyEnterTime: '计划到达时间',
            applyLeaveTime: '计划离场时间',
            enterTime: '到达时间',
            leaveTime: '离场时间',
            leaveReason: '离场原因',
            remark: '登记备注',
            proc: '处理状态',
            auditUserName: '审核人',
            auditTime: '审核时间',
            auditUserRemark: '审核意见',
            controlStatus: '⻋辆管控状态',
            offTime: '押运时间',
            offFiles: '押运拍照',
            offUserRemark: '押运备注',
            offUserName: '押运人名称',
            location: '填写的时候的定位信息',
            nucleinCheck: '核酸检查情况',
            riskLevel: '风险区等级',
            areaOrgName: '区域名称',
            isSendUnder: '是否需要押运',
            sendUnderLocation: '押运定位',
            drivers: '乘⻋⼈员',
            createTime: '创建时间'
        },
        formatter: {
            offFiles(scope) {
                return scope.offFiles?.length ? '有' : '无'
            },
            proc(scope) {
                let dict = {
                    '1': '提交了预约处理',
                    '9': '审批通过',
                    '-9': '拒绝',
                    '-99': '系统⾃动结单',
                }
                return dict[scope.proc]
            },
            // controlStatus(scope) {
            //   let dict = {
            //     '-1': '未入场',
            //     '0': '离场',
            //     '1': '已进场',
            //     '-7': '待押运超时结单',
            //     '-8': '移交其它物流公司',
            //     '-9': '押送上⾼速',
            //   }
            //   return dict[scope.controlStatus]
            // },
            nucleinCheck(scope) {
                let dict = {
                    0: '未查验',
                    1: '正常',
                    2: '⻛险',
                }
                return dict[scope.nucleinCheck]
            },
            riskLevel(scope) {
                let dict = {
                    0: '低⻛险',
                    1: '中风险',
                    2: '高⻛险',
                    3: '未知',
                }
                return dict[scope.riskLevel]
            },
            isSendUnder(scope) {
                let dict = {
                    0: '不需要押运',
                    1: '需要押运',
                }
                return dict[scope.isSendUnder]
            },
            drivers(scope) {
                return scope.drivers.map(v => v.name).join(',')
            }
        }
    }
]



