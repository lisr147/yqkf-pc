const state = {
    //是否全屏
    isFullScreen: false,

    //当前镇街,用于过滤大屏的所有接口数据
    //枚举值{null,'珠江街','黄阁镇'...}
    town: null,

    //当前网格
    grid: null,

    //当前封控区信息
    sealarea: null,
    village: null,

    //封控区当前模式 0 展示，1 编辑
    sealareaMode: 0,

    //大屏端 z轴高度
    bigDialogZIndex: 3000,

    //外呼电话号码
    curCallNumber: null,

    //告警事件所属镇街
    alarmTown: null,
    //告警事件类型
    alarmType: null,

    //确诊人员数据
    dispatchData: [],

    //邀请的会议成员
    natPrincipals: [],

    //直播会议房间号
    roomId: null,

    // 是否在移动端
    isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),

    // 当前GZ2000选中图层
    currGz2000layers: []
};

var mutations = {

    PLUS_ZINDEX: (state) => {
        state.bigDialogZIndex++
    },

    SET_TOWN: (state, val) => {
        state.town = val
    },

    SET_GRID: (state, val) => {
        state.grid = val
    },
    SET_VILLAGE: (state, val) => {
        state.village = val
    },

    SET_CUR_CALL_NUMBER: (state, val) => {
        state.curCallNumber = val
    },

    SET_CUR_SEALAREA: (state, info) => {
        state.sealarea = info
    },

    SET_SEALAREA_MODE: (state, val) => {
        state.sealareaMode = val
    },

    SET_ALARM_TOWN: (state, val) => {
        state.alarmTown = val
    },

    SET_ALARM_TYPE: (state, val) => {
        state.alarmType = val
    },

    SET_DIAGNOSE: (state, val) => {
        state.dispatchData = val
    },

    SET_NATPRINCIPALS: (state, val) => {
        state.natPrincipals = val
    },
    SET_ROOMID: (state, val) => {
        state.roomId = val
    },
    SET_GZ2000LAYERS(state, val) {
        state.currGz2000layers = val
    }
}

var actions = {

    getDialogZIndex({ commit, state }) {
        commit('PLUS_ZINDEX')
        return state.bigDialogZIndex
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
