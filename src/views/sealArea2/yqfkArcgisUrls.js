
const baseUrl = `${process.env.VUE_APP_MAP_API}/yqfkarcgis/arcgis/rest/services`
export default {
    // 防疫系统路网底图
    LWDT: `${baseUrl}/疫情防控/防疫系统路网底图/MapServer`,
    // 南沙区卫星地图
    NSWX: `${baseUrl}/疫情防控/202208GZ2000影像/MapServer`,
    // 重点场所
    ZDCS: `${baseUrl}/疫情防控/重点场所10_5/MapServer`,
    // 全区房屋面
    FW: `${baseUrl}/疫情防控/全区房屋面/MapServer`,
    // 全区房屋人口
    FWPep: `${baseUrl}/疫情防控/queryResident/MapServer`,

    GGFWSS: `${baseUrl}/疫情防控/金洲村公共服务设施10_5/MapServer`,
    CZCZDCS: `${baseUrl}/疫情防控/城中村重点场所/MapServer`,
    SZGYSS: `${baseUrl}/疫情防控/金洲村市政公用设施10_5/MapServer`,
    CZCSP: `${baseUrl}/城中村/城中村商铺/MapServer`,

    // 南沙区小区范围
    NSQXQ: `${baseUrl}/疫情防控/南沙区小区范围/MapServer`,
    // 河流
    HL: `${baseUrl}/疫情防控/南沙区河流水系/MapServer`,
    // 南沙区基础路网
    JCLW: `${baseUrl}/疫情防控/南沙区基础路网/MapServer`,
    // 村界
    CJ: `${baseUrl}/疫情防控/村界/MapServer`,
    // 网格
    WG: `${baseUrl}/疫情防控/网格0901/MapServer`,
    // 党员志愿者
    DY: `${baseUrl}/疫情防控/党员志愿者/MapServer`,
    // 金洲村三维地图点
    SWDTD: `${baseUrl}/城中村/金洲村三维地图点/MapServer`,
    // 特殊人群
    TSRQ: `${baseUrl}/疫情防控/特殊人群/MapServer`,
    // 医疗资源
    YYWSZX: `${baseUrl}/疫情防控/医疗资源_医院卫生中心/MapServer`,

    // 市政设施（城市部件）
    SSJG: `${baseUrl}/城市部件/上水井盖/MapServer`,
    GDJG: `${baseUrl}/城市部件/供电井盖/MapServer`,
    GGCS: `${baseUrl}/城市部件/公共厕所/MapServer`,
    LJSJD: `${baseUrl}/城市部件/垃圾收集点/MapServer`,
    SZXHX: `${baseUrl}/城市部件/市政消火栓/MapServer`,
    WXXFZ: `${baseUrl}/城市部件/微型消防站/MapServer`,
    PSJG: `${baseUrl}/城市部件/排水井盖/MapServer`,
    ZMSS: `${baseUrl}/城市部件/照明设施/MapServer`,
    JKDZY: `${baseUrl}/城市部件/监控电子眼/MapServer`,
    JSD: `${baseUrl}/城市部件/积水点/MapServer`,

    CSBJList: `${baseUrl}/城市部件?f=pjson`,
    baseUrl
}
