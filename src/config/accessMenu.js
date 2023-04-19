import menuDataJs from './menuData.js'
import { fetchData } from './menuData.js'
import store from '@/store'

// 动态增加的菜单项
let updateMenu = (data, index, fullPath, route) => {
    if (typeof data === "string") {
        route.push({
            path: fullPath,
            name: data,
            id: index,
            icon: "nav-main",
        });
    }
    if (typeof data === "object") {
        let newRoter = {
            path: fullPath,
            name: data.name,
            id: index,
            icon: "nav-main",
            children: [],
        };
        route.push(newRoter);
        for (let i in data) {
            if (i !== "name") {
                updateMenu(data[i], i, fullPath + "/" + i, newRoter.children);
            }
        }
    }
};

let addMenu = [];
for (let i in menuDataJs) {
    updateMenu(menuDataJs[i], i, "/" + i, addMenu);
}
// 流调信息菜单排序到重点人群后面
let ldxxMenu = {
  path: "/epidemiologicalSurvey",
  name: "流调信息",
  id: "epidemiologicalSurvey",
  icon: "nav-app",
  children: [
    {
      path: "/epidemiologicalSurvey/index",
      name: "流调信息管理",
      id: "epidemiologicalSurveyIndex",
      icon: "nav-main",
    },
    {
      path: "/epidemiologicalSurvey/positivePersonnelRecords",
      name: "阳性人员台账",
      id: "positivePersonnelRecords",
      icon: "nav-main",
    },
    {
      path: "/epidemiologicalSurvey/personnelContactRecords",
      name: "密接次密接人员台账",
      id: "personnelContactRecords",
      icon: "nav-main",
    },
    {
      path: "/epidemiologicalSurvey/keyPlaceRecords",
      name: "重点场所台账",
      id: "keyPlaceRecords",
      icon: "nav-main",
    },
    {
      path: "/epidemiologicalSurvey/eventManagement",
      name: "事件管理",
      id: "eventManagement",
      icon: "nav-main",
    },
    {
      path: "/epidemiologicalSurvey/scanManagement",
      name: "扫码台账管理",
      id: "scanManagement",
      icon: "nav-main",
    },
    {
      path: "/epidemiologicalSurvey/movingTrail",
      name: "移动轨迹台账坐标调整",
      id: "movingTrail",
      icon: "nav-main",
    },
    {
      path: "/epidemiologicalSurvey/personnelCoordinate",
      name: "人员地址坐标调整",
      id: "personnelCoordinate",
      icon: "nav-main",
    },
    {
      path: "/epidemiologicalSurvey/keyPlaceCoordinate",
      name: "重点场所台账坐标调整",
      id: "keyPlaceCoordinate",
      icon: "nav-main",
    }
  ],
}
let ldxxIndex = addMenu.findIndex(value => value.id === 'zdrq')
addMenu.splice(ldxxIndex > -1 ? ldxxIndex + 1 : 0, 0, ldxxMenu)
// AI智能跳转地址增加镇街
let aiAdmin = 'http://172.29.1.167/dashboard-front'
let aiScreen = 'http://172.29.1.167/nanshaAI-dashboard/#/nanshaAI'
if (['榄核镇', '南沙街', '横沥镇', '珠江街', '万顷沙镇', '大岗镇', '龙穴街', '东涌镇', '黄阁镇',].includes(store.state.user.departmentName)) {
    aiAdmin += '?street=' + store.state.user.departmentName
    aiScreen += '?streetName=' + store.state.user.departmentName
}

// 静态菜单项
const menuData = [
    {
        path: "/supervision",
        name: "督查督办事项",
        id: "supervision",
        icon: "nav-main",
    },
    {
        path: "/sealArea",
        name: "封控区管理大屏",
        id: "sealArea",
        icon: "nav-main",
        type: 'link',
        href: 'sealarea.html#/gz2000',
        target: '_blank'
    },
    // {
    //   path: '/alarmquery/index',
    //   name: '告警查询',
    //   id: 'alarmquery',
    //   icon: "nav-main",
    // },
    {
        path: "/big/index",
        name: "疫情防控指挥系统",
        id: "big",
        icon: "nav-main",
        type: 'link',
        href: 'big.html#/gz2000',
        target: '_blank'
    },
    {
        path: "/analysis",
        name: "平台使用情况分析",
        id: "analysis",
        icon: "nav-main",
        children: [
            {
                path: "/analysis/TownStreet",
                name: "镇街使用情况分析",
                id: "analysisTownStreet",
                icon: "nav-main",
            },
            {
                path: "/analysis/CommissionOffice",
                name: "委办局使用情况分析",
                id: "analysisCommissionOffice",
                icon: "nav-main",
            }
        ],
    },
    ...addMenu,

    {
        path: "/alarmConfig",
        name: "告警推送开关",
        id: "alarmConfig",
        icon: "nav-main",
    },
    {
        path: "/dataService",
        name: "数据服务",
        id: "dataService",
        icon: "nav-app",
        children: [
            {
                path: "/dataService/dataTotal",
                name: "数据总览",
                id: "dataTotal",
                icon: "nav-main",
            },
            {
                path: "/dataService/dataView",
                name: "数据查询",
                id: "dataView",
                icon: "nav-main",
            },
            {
                path: "/dataService/statics",
                name: "统计数据",
                id: "statics",
                icon: "nav-main",
            },
        ],
    },
    {
        path: "/dataManage",
        name: "流调专班数据",
        id: "dataManage",
        icon: "nav-app",
        children: [
            {
                path: "/dataManage/import",
                name: "疾控数据管理",
                id: "import",
                icon: "nav-main",
            },
            {
                path: "/dataManage/hotel",
                name: "酒店分派",
                id: "hotel",
                icon: "nav-main",
            },
            {
                path: "/dataManage/room",
                name: "房间分派",
                id: "room",
                icon: "nav-main",
            },
            {
                path: "/dataManage/target",
                name: "隔离人员状态设置",
                id: "target",
                icon: "nav-main",
            },
            {
                path: "/dataManage/zyryzt",
                name: "转运人员状态维护",
                id: "zyryzt",
                icon: "nav-main",
            },
            {
                path: "/dataManage/dataList",
                name: "流调“一张表”",
                id: "dataList",
                icon: "nav-main",
            },
        ],
    },
    {
        path: "/community",
        name: "重点区域管理",
        id: "community",
        icon: "nav-app",
        children: [
            {
                path: "/community/jahysjdr",
                name: "嘉安花园数据导入",
                id: "jahysjdr",
                icon: "nav-main",
            },
            {
                path: "/community/jiaan",
                name: "嘉安花园台账",
                id: "jiaan",
                icon: "nav-main",
            },
            {
                path: "/community/jaImportant",
                name: "嘉安重点人群",
                id: "jaImportant",
                icon: "nav-main",
            },
            {
                path: "/community/tzyry",
                name: "童真幼儿园、嘉安小学",
                id: "tzyry",
                icon: "nav-main",
            },
            {
                path: "/community/zjjfkqry",
                name: "珠江街封控区人员",
                id: "zjjfkqry",
                icon: "nav-main",
            },
        ],
    },
    {
        path: "/ldrygl",
        name: "公安流调人员管理",
        id: "ldrygl",
        icon: "nav-app",
        children: [
            {
                path: "/ldrygl/ldrydr",
                name: "流调人员导入",
                id: "ldrydr",
                icon: "nav-main",
            },
            {
                path: "/ldrygl/samePerson",
                name: "相同人员对比",
                id: "samePerson",
                icon: "nav-main",
            },
            {
                path: "/ldrygl/deffPerson",
                name: "不同人员对比",
                id: "deffPerson",
                icon: "nav-main",
            },
        ],
    },
    {
        path: "/notice",
        name: "信息管理",
        id: "notice",
        icon: "nav-app",
        children: [
            {
                path: "/dataManage/notice",
                name: "信息发布",
                id: "notice",
                icon: "nav-main",
            },
        ],
    },
    {
        path: "/aiAdmin",
        name: "AI智能分析后台",
        id: "aiAdmin",
        icon: "nav-main",
        type: 'link',
        href: aiAdmin,
        target: '_blank'
    },
    {
        path: "/aiScreen",
        name: "AI智能分析大屏",
        id: "aiScreen",
        icon: "nav-main",
        type: 'link',
        href: aiScreen,
        target: '_blank'
    },
    {
        path: "/dataManageScanManage",
        name: "视频监控管理",
        id: "dataManageScanManage",
        icon: "nav-main",
        type: 'link',
        href: 'http://172.29.1.167/dashboard-front/#/dataManageScanManage/scanManage?showOther=true',
        target: '_blank'
    },
];

fetchData.forEach((v) => {
    let routeItem = {
        path: `/${v.parent}/${v.id}`,
        name: v.name,
        id: v.id,
        icon: "nav-main",
    };
    let parent = menuData.find((r) => r.id === v.parent);
    parent.children.push(routeItem);
});

// console.log('菜单数据',menuData)

export default menuData
