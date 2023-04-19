import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout/default";

// 解决重复点击导航菜单项报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

let routes = [
    {
        path: "/",
        // redirect: '/radar'
    },
    //   {
    //     path: "/sealareaIndex",
    //   },
    //   {
    //     meta: { title: "AI智能分析后台" },
    //     path: "/aiAdmin",
    //   },
    //   {
    //     meta: { title: "AI智能分析大屏" },
    //     path: "/aiScreen",
    //   },
    {
        meta: { title: "外呼" },
        path: "/call",
        component: () => import("@/views/demo/Call2.vue"),
    },
    {
        meta: { title: "视频" },
        path: "/video",
        component: () => import("@/views/demo/EasyPlayerDemo.vue"),
    },
    {
        meta: { title: "流调专班数据" },
        path: "/dataManage",
        redirect: "/dataManage/import",
        component: Layout,
        children: [
            {
                path: "import",
                name: "import",
                meta: { title: "疾控数据管理" },
                component: () => import("@/views/dataManage/import.vue"),
            },
            {
                path: "hotel",
                name: "hotel",
                meta: { title: "酒店分派" },
                component: () => import("@/views/dataManage/hotel.vue"),
            },
            {
                path: "room",
                name: "room",
                meta: { title: "房间分派" },
                component: () => import("@/views/dataManage/room"),
            },
            {
                path: "target",
                name: "target",
                meta: { title: "隔离人员状态设置" },
                component: () => import("@/views/dataManage/target"),
            },
            {
                path: "dataList",
                name: "dataList",
                meta: { title: "流调“一张表”" },
                component: () => import("@/views/dataManage/dataList"),
            },
            {
                path: "zyryzt",
                name: "zyryzt",
                meta: { title: "转运人员状态维护" },
                component: () => import("@/views/dataManage/zyryzt"),
            },
            {
                path: "notice",
                name: "notice",
                meta: { title: "信息发布" },
                component: () => import("@/views/dataManage/Notice"),
            },
        ],
    },
    {
        path: "/ldrygl",
        redirect: "/ldrygl/ldrydr",
        component: Layout,
        children: [
            {
                path: "ldrydr",
                name: "ldrydr",
                meta: { title: "流调人员导入" },
                component: () => import("@/views/ldrygl/import.vue"),
            },
            {
                path: "samePerson",
                name: "samePerson",
                meta: { title: "相同人员对比" },
                component: () => import("@/views/ldrygl/samePerson.vue"),
            },
            {
                path: "deffPerson",
                name: "deffPerson",
                meta: { title: "不同人员对比" },
                component: () => import("@/views/ldrygl/deffPerson.vue"),
            },
        ],
    },
    {
        path: "/community",
        redirect: "/community/jiaan",
        component: Layout,
        children: [
            {
                path: "jiaan",
                name: "jiaan",
                meta: { title: "嘉安花园台账" },
                component: () => import("@/views/community/jiaan"),
            },
            {
                path: "jahysjdr",
                name: "jahysjdr",
                meta: { title: "嘉安花园数据导入" },
                component: () => import("@/views/community/import"),
            },
            {
                path: "jaImportant",
                name: "jaImportant",
                meta: { title: "嘉安重点人群" },
                component: () => import("@/views/community/jaImportant"),
            },
            {
                path: "tzyry",
                name: "tzyry",
                meta: { title: "童真幼儿园、嘉安小学" },
                component: () => import("@/views/community/tzyry"),
            },
            {
                path: "zjjfkqry",
                name: "zjjfkqry",
                meta: { title: "珠江街封控区人员" },
                component: () => import("@/views/community/zjjfkqry"),
            },
        ],
    },
    {
        path: "/medical",
        redirect: "/medical/hospitalOrg",
        component: Layout,
        children: [
            {
              path: "hospitalOrg",
              name: "hospitalOrg",
              meta: { title: "门诊机构信息" },
              component: () => import("@/views/medical/hospitalOrg"),
            },
        ],
    },
    {
        meta: { title: "大屏展示" },
        path: "/big",
        redirect: "/big/index",
        component: () => import("@/layout/screen"),
        children: [
            {
                path: "index",
                name: "bigIndex",
                meta: { title: "大屏跳转" },
                component: () => import("@/views/big/gz2000"),
            },
            {
                path: "gd",
                name: "bigGd",
                meta: { title: "高德大屏" },
                component: () => import("@/views/big/index2"),
            },
            {
                path: "index0",
                name: "bigIndex0",
                meta: { title: "大屏0" },
                component: () => import("@/views/big/index"),
            },
            {
                path: "baseMap",
                name: "baseMap",
                meta: { title: "底图" },
                component: () => import("@/views/big/CommandBaseMap/baseMap"),
            },
        ],
    },
    //   {
    //     meta: { title: "封控区管理" },
    //     path: "/sealarea",
    //     redirect: "/sealarea/index",
    //     component: () => import("@/layout/screen"),
    //     children: [
    //       {
    //         path: "/sealarea/index",
    //         name: "sealArea",
    //         meta: { title: "封控区大屏" },
    //         component: () => import("@/views/sealArea/sealAreaIndex"),
    //       },
    //       {
    //         path: "/sealarea/instance",
    //         name: "sealAreaInstance",
    //         meta: { title: "封控区大屏实例" },
    //         component: () => import("@/views/sealArea/sealAreaInstance"),
    //       },
    //     ],
    //   },
    {
        meta: { title: "督查督办事项" },
        path: "/supervision",
        component: Layout,
        redirect: "/supervision/index",
        children: [
            {
                path: "/supervision/index",
                name: "supervisionIndex",
                meta: { title: "督查督办事项" },
                component: () => import("@/views/supervision/index"),
            },
        ],
    },

    {
        meta: { title: "平台使用情况分析" },
        path: "/analysis",
        component: Layout,
        redirect: "/analysis/TownStreet",
        children: [
            {
                path: "/analysis/TownStreet",
                name: "analysisTownStreet",
                meta: { title: "镇街使用情况分析" },
                component: () => import("@/views/analysis/index"),
            },
            {
                path: "/analysis/CommissionOffice",
                name: "analysisCommissionOffice",
                meta: { title: "委办局使用情况分析" },
                component: () => import("@/views/analysis/index"),
            },
        ],
    },
    {
        path: "/analysis/generateReport",
        name: "generateReport",
        meta: { title: "分析报告" },
        component: () => import("@/views/analysis/generateReport"),
    },
    {
        meta: { title: "流调信息" },
        path: "/epidemiologicalSurvey",
        component: Layout,
        redirect: "/epidemiologicalSurvey/index",
        children: [
            {
                path: "/epidemiologicalSurvey/index",
                name: "epidemiologicalSurvey",
                meta: { title: "流调信息概况" },
                component: () => import("@/views/epidemiologicalSurvey/index"),
            },
            {
                path: "/epidemiologicalSurvey/editSurvey",
                name: "editSurvey",
                meta: { title: "编辑流调信息" },
                component: () => import("@/views/epidemiologicalSurvey/editSurvey"),
            },
            {
                path: "/epidemiologicalSurvey/positivePersonnelRecords",
                name: "positivePersonnelRecords",
                meta: { title: "阳性人员台账" },
                component: () => import("@/views/common/importData.vue"),
            },
            {
                path: "/epidemiologicalSurvey/personnelContactRecords",
                name: "personnelContactRecords",
                meta: { title: "密接次密接人员台账" },
                component: () => import("@/views/common/importData.vue"),
            },
            {
                path: "/epidemiologicalSurvey/keyPlaceRecords",
                name: "keyPlaceRecords",
                meta: { title: "重点场所台账" },
                component: () => import("@/views/common/importData.vue"),
            },
            {
                path: "/epidemiologicalSurvey/eventManagement",
                name: "eventManagement",
                meta: { title: "事件管理" },
                component: () => import("@/views/common/importData.vue"),
            },
            {
                path: "/epidemiologicalSurvey/scanManagement",
                name: "scanManagement",
                meta: { title: "扫码台账管理" },
                component: () => import("@/views/common/importData.vue"),
            },
            {
                path: "/epidemiologicalSurvey/movingTrail",
                name: "movingTrail",
                meta: { title: "移动轨迹台账坐标调整" },
                component: () => import("@/views/common/importData.vue"),
            },
            {
                path: "/epidemiologicalSurvey/personnelCoordinate",
                name: "personnelCoordinate",
                meta: { title: "人员地址坐标调整" },
                component: () => import("@/views/common/importData.vue"),
            },
            {
                path: "/epidemiologicalSurvey/keyPlaceCoordinate",
                name: "keyPlaceCoordinate",
                meta: { title: "重点场所台账坐标调整" },
                component: () => import("@/views/common/importData.vue"),
            },
        ],
    },
    {
        meta: { title: "告警查询" },
        path: "/alarmquery",
        component: Layout,
        redirect: "/alarmquery/index",
        children: [
            {
                path: "/alarmquery/index",
                name: "alarmqueryIndex",
                meta: { title: "告警查询" },
                component: () => import("@/views/alarmQuery/index"),
            },
        ],
    },
    {
        meta: { title: "数据服务" },
        path: "/dataService",
        redirect: "/dataService/dataTotal",
        component: Layout,
        children: [
            {
                path: "/dataService/dataTotal",
                name: "dataTotal",
                meta: { title: "数据总览" },
                component: () => import("@/views/dataService/dataTotal"),
            },
            {
                path: "/dataService/dataView",
                name: "dataView",
                meta: { title: "数据查询" },
                component: () => import("@/views/dataService/dataView"),
            },
            {
                path: "/dataService/statics",
                name: "statics",
                meta: { title: "统计数据" },
                component: () => import("@/views/dataService/statics"),
            },
        ],
    },
    {
        meta: { title: "告警推送开关" },
        path: "/alarmConfig",
        component: Layout,
        children: [
            {
                path: "",
                meta: { title: "告警推送开关" },
                name: "alarmConfig",
                component: () => import("@/views/alarmConfig/"),
            },
        ],
    },
    // {
    //   path:"/cjdtz",
    //   component: Layout,
    //   children:[
    //     {
    //       path: "cjdtz:id",
    //       name: "cjdtz:id",
    //       meta: { title: "采集点台账" },
    //       component: () => import("@/views/common/importData"),
    //     },
    //   ]
    // },
    // {
    //   path:"/zdrq",
    //   component: Layout,
    //   children:[
    //     {
    //       path: "cjdgzry:id",
    //       name: "cjdgzry:id",
    //       meta: { title: "重点人群" },
    //       component: () => import("@/views/common/importData"),
    //     },
    //   ]
    // },
    {
        path: "/401",
        component: () => import("@/views/error-page/401"),
        hidden: true,
    },
    {
        path: "/404",
        component: () => import("@/views/error-page/404"),
        hidden: true,
    },
    {
        path: "*",
        redirect: "/",
        hidden: true,
    },
];

import menuData from "@/config/menuData.js";
import { fetchData } from "@/config/menuData.js";

let updateRoute = (data, index, fullPath, route) => {
    if (typeof data === "string") {
        let components = fullPath === '/fxry/tjbb' ? import("@/components/PersonCollect/StatisticalReport") : import("@/views/common/importData.vue")
        route.push({
            path: fullPath,
            name: index,
            meta: { title: data },
            // component: () => import("@/views/common/importData.vue"),
            component: () => components,
        });
    }
    if (typeof data === "object") {
        let newRoter = {
            path: fullPath,
            name: index,
            meta: { title: data.name || "" },
            component: Layout,
            children: [],
        };
        route.push(newRoter);
        for (let i in data) {
            if (i !== "name") {
                updateRoute(data[i], i, fullPath + "/" + i, newRoter.children);
            }
        }
    }
};
let newRoutes = [];

for (let i in menuData) {
    updateRoute(menuData[i], i, `/${i}`, newRoutes);
}

routes = [...newRoutes, ...routes];

fetchData.forEach(v => {
    let routeItem = {
        path: `/${v.parent}/${v.id}`,
        name: v.id,
        meta: { title: v.name },
        component: () => import("@/views/fetchDataList/"),
    };
    let parent = routes.filter(r => r.name === v.parent)[0];
    parent.children.push(routeItem);
});

// console.log("routes", routes);
const router = new VueRouter({
    routes,
});

export default router;
