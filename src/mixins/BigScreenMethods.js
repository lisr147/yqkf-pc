// import Cookies from 'js-cookie'
import SETTING from "@/config/MapSetting.js"
import { getHotalDetail, getPersonDetail } from "@/api/mapData.js";

var BigScreenMethods = {

    methods: {

        //查看特殊人员列表
        handleShowSpecialPeopleList(cond) {
            this.$set(this.detailList, `specialPeopleDetailList`, {
                ...cond,
                detailType: "specialPeopleDetailList",
            });
        },

        //处理网格图层显示状态
        handleGridSwitch({ visible }) {
            this.$refs["baseMapLayer"].toggleOneLayer("grid", visible);
            this.$refs["baseMapLayer"].toggleOneLayer("grid-gz2000", visible);
        },
        handleVillageSwitch({ visible }) {
            this.$refs["baseMapLayer"].toggleOneLayer("village-gz2000", visible);
        },

        //处理网格过滤
        async handleGridFilter({ gridKeyword }) {
            const res = await this.$refs["baseMapLayer"].filterDataInLayer({
                id: 'grid',
                filterCode: gridKeyword ? `name LIKE '%${gridKeyword}%'` : null
            })
            this.$store.commit('map/SET_MATCH_GRID_COUNT', res.length)
        },
        async handleGridFilterGz2000({ gridKeyword }) {
            const res = await this.$refs["baseMapLayer"].filterDataInLayer({
                id: 'grid-gz2000',
                filterCode: gridKeyword ? `name LIKE '%${gridKeyword}%'` : null
            })
            this.$store.commit('map/SET_MATCH_GRID_COUNT', res.length)
        },

        handlePartyToggle({ visible }) {
            this.$refs["baseMapLayer"].toggleOneLayer("party", visible);
            if (visible) {
                this.linkData.unshift({ label: '网格党组织', id: 'party', checked: true, })
            } else {
                let delIndex = this.linkData.findIndex(i => i.id === 'party')
                this.linkData.splice(delIndex, 1)
            }
            // Cookies.set('linkData', JSON.stringify(this.linkData))
            localStorage.linkData = JSON.stringify(this.linkData)
        },

        handleGotoLocation(event) {
            this.$refs['baseMapLayer'].clearMarker()
            this.$refs['baseMapLayer'].gotoLocation(event)
        },

        handleClearLocation() {
            this.$refs['baseMapLayer'].clearMarker()
        },

        handelToggleAlarm({ visible }) {
            this.$refs['baseMapLayer'].toggleOneLayer("event-alarm", visible)
            this.$refs['baseMapLayer'].toggleOneLayer("waveLayer", visible)

            if (visible == false) {
                this.resetAlarmInfo()
            }
        },

        //触发底图切换
        handleByMapChange({ id }) {
            this.$refs["baseMapLayer"].switchByLayer(id);
        },

        //触发专题切换事件
        handelTopicChange({ layerId }) {
            this.layer = layerId;
            console.log('切换专题', layerId)
        },

        //关闭echart大图
        showBigClose() {
            this.showBig = false
        },

        //设置地图酒店数据
        setHotelData(hotalData) {
            this.hotalData = hotalData;
            this.setMarkers();
        },

        //显示酒店详情
        async showHotelDetal(data) {
            let res = await getHotalDetail(data.id);
            this.$set(this.detailList, data.id, {
                ...data,
                ...res,
                detailType: "hotel",
            });
            this.$forceUpdate();
        },

        //显示密接详情
        async showContactDetail(data) {
            let res = await getPersonDetail(data.sfzhzhm);
            this.$set(this.detailList, data.sfzhzhm, {
                ...data,
                ...res,
                detailType: "person",
            });
            this.$forceUpdate();
        },

        //opt.reset 是否重置所有组件状态
        switchLayer(val, opt = { reset: true }) {

            if (opt.reset) {
                switch (val) {
                    case 9:
                        //清除告警事件列表的默认镇街筛选
                        this.$store.commit('common/SET_ALARM_TOWN', null)
                        this.$store.commit('common/SET_ALARM_TYPE', null)
                        break;
                    default:
                        break;
                }
            }

            this.layer = val;
        },

        // 显示健康码人员详情(红黄码)
        showRyDetail(item) {
            // console.log('显示健康码人员详情',item)
            this.$set(this.detailList, item.idNumber, {
                ...item,
                detailType: "ryDetail",
            });
        },
        showTotalDetail(type, total = 0) {
            const escape = {
                closeContact: "密接人员总数",
                secondCloseContact: "次密接人员总数"
            };
            switch (type) {
                case 'closeContact':
                case 'secondCloseContact':
                    this.showCloseContactList({
                        key: escape[type],
                        value: total
                    });
                    break;
                case 'red':
                    this.$set(this.detailList, "ry_total", { detailType: "redYellow", type });
                    break;
                case 'yellow':
                    this.$set(this.detailList, "ry_total", { detailType: "redYellow", type });
                    break;
                case 'conventionalNucleicPoint':
                    this.$set(this.detailList, "conventionalNucleicPoint", {
                        detailType: "conventionalNucleicPoint",
                        type,
                        dialogTitle: '核酸采样点列表',
                        templateId: 10055
                    });
                    break;
                case 'massNucleicPoint':
                    this.$set(this.detailList, "massNucleicPoint", {
                        detailType: "massNucleicPoint",
                        type,
                        dialogTitle: '核酸采样点列表',
                        templateId: 10027
                    });
                    break;
            }
        },

        //显示公共场所详情
        async showRiskPlaceDetail(item) {
            // let res = await getHotalDetail(data.id)
            this.$set(this.detailList, item.id, {
                ...item,
                detailType: "riskPlaceDetail",
            });
        },

        //核酸采样点详情
        async showMhRiskDetail(data) {
            this.$set(
                this.detailList,
                "mhRiskDetail",
                Object.assign(data, { detailType: "mhRiskDetail" })
            );
        },

        //显示密接、次密接详情
        async showCloseContactList(item) {
            // console.log(1075,item);
            this.$set(this.detailList, "closeContact", {
                ...item,
                layerId: item.key.includes('次密接') ? 'cmjPeople' : 'mjPeople',
                detailType: "closeContact",
                // dialogTitle: item.key.includes('次密接')? "次密接人员明细" : "密接人员明细"
                dialogTitle: `${item.key}明细`
            });
        },

        //显示密接、次密接详情
        async showCloseContactDetail(item) {
            let attributes = {
                id: item.id,
            };
            this.$set(this.detailList, `spotDetail`, {
                ...attributes,
                layerId: item.mjlx === "密接的密接" ? "cmjPeople" : "mjPeople",
                templateId: "10001",
                popUpTitle: item.mjlx === "密接的密接" ? "次密接人员" : "密接人员",
                detailType: "spotDetail",
            });
        },

        //显示采样点详情
        async showSamplingPointList(item) {
            this.$set(this.detailList, "samplingPointList", {
                ...item,
                detailType: "samplingPointList",
            });
            if (this.detailList["spotDetail"]) {
                this.detailList["spotDetail"] = undefined;
            }
            // console.log(item);
        },
        async showSamplingPointDetail(item) {

            const { templateId, externalTemplateId } = SETTING.getDict().find(v => v.id == 'detectionPoint')
            let attributes = { id: item.id };
            this.$set(this.detailList, `spotDetail`, {
                ...attributes,
                layerId: "detectionPoint",
                templateId: item.spotType == '大规模' ? templateId : externalTemplateId,
                popUpTitle: "采样点",
                detailType: "spotDetail",
            });
        },

        //显示单位挂点支援镇街
        async showUnitSupportStreet(item) {
            this.$set(this.detailList, "unitSupportStreet", {
                ...item,
                detailType: "unitSupportStreet",
            });
        },

        // 详情组件弹出视频列表
        handlePopUpEvent(event) {
            // console.log(event);
            const { eventType, attributes } = event
            switch (eventType) {
                case "showlineUp":
                    //核酸检测点排队情况
                    this.showLineUpMap(attributes)
                    break;
                case "showCloseContactDetail":
                    //密接次密接人员详情
                    this.showCloseContactDetail(attributes)
                    break;
                case "showVideoList":
                    //视频列表
                    this.$set(this.detailList, "videoList", {
                        ...attributes,
                        detailType: "videoList",
                        dialogTitle: "视频列表",
                    });
                    break;
                case "showVideoRecord":
                    this.$refs["videoRecordBoard"].show(attributes);
                    break;
                case "showVideoDetail":
                    //视频详情面板
                    this.$refs["videoDetailBoard"].show();
                    break;
                case "showStaffList":
                    //工作人员列表
                  this.$set(this.detailList, "staffList", {
                        ...attributes,
                        detailType: "staffList",
                        dialogTitle: "工作人员明细",
                    });
                    break;
                //购药记录列表
                case "showLogList":
                    this.$set(this.detailList, "logList", {
                        ...attributes,
                        detailType: "logList",
                        dialogTitle: "购药记录明细",
                    });
                    break;
                case "showTransitVehicles":
                    this.$set(this.detailList, "transitVehiclesList", {
                        ...attributes,
                        detailType: "transitVehiclesList",
                        dialogTitle: "转运车辆信息",
                    });
                    break;
                case "showConsultationScheduling":
                    this.$set(this.detailList, "consultationSchedulingList", {
                        ...attributes,
                        detailType: "consultationSchedulingList",
                        dialogTitle: "会诊排班",
                    });
                    break;
                case "showAllocationHealthCare":
                    this.$set(this.detailList, "allocationHealthCareList", {
                        ...attributes,
                        detailType: "allocationHealthCareList",
                        dialogTitle: "配置医护人员",
                    });
                    break;
                case "showHistory":
                    this.$set(this.detailList, "allocationHealthCareList", {
                        ...attributes,
                        detailType: "historyList",
                        dialogTitle: "历史数据",
                    });
                    break;
                default:
                    break;
            }
        },

        showVideoDetail() {
            this.$refs["videoDetailBoard"].show();
        },
    }

}


export default BigScreenMethods
