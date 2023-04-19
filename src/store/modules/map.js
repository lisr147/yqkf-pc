import { getVideoFromUid } from '@/api/mapData.js'

const state = {
    //记录每个图层的数据量
    dataCountMap: {},
    //悬浮视频面板中的视频数据
    floatVideoList: [], //{name,url,templateId,deviceUid}

    //匹配网格数
    matchGridCount: 0,

    // 海康播放器 任务队列
    taskList: [], // 当前执行任务列表
    taskRunState: false, // 任务执行状态
    mapType: 'gdMap'   //地图类型gdMap/gz2000
}

var mutations = {
    SET_MAP_TYPE: (state, type) => {
        state.mapType = type
    },

    // 设置指定图层的数据量
    SET_DATA_COUNT: (state, { layerId, count }) => {

        state.dataCountMap[layerId] = count
    },

    ADD_VIDEO(state, attribute) {
        state.floatVideoList.push(attribute)
    },
    UPDATE_VIDEO(state, { attributes, index }) {
        //更新数组
        state.floatVideoList.splice(index, 1, { ...state.floatVideoList[index], ...attributes })
    },
    DELETE_VIDEO(state, index) {
        const delItem = state.floatVideoList.splice(index, 1)

        const taskIndex = state.taskList.findIndex(item => item === delItem[0].deviceUid)
        if (taskIndex >= 1) {
            state.taskList.splice(taskIndex, 1)
        }
    },
    CLEAN_VIDEO(state, val) {
        state.floatVideoList = []

        state.taskList = []
        state.taskRunState = false
    },

    SET_MATCH_GRID_COUNT: (state, val) => {
        state.matchGridCount = val
    },

    // 海康视频 - 待执行任务队列
    ADD_TASK(state, attribute) {
        state.taskList.push(attribute)
    },
    // 海康视频 - 从任务队列移除
    DELETE_TASK(state, index) {
        state.taskRunState = false
        state.taskList.splice(index, 1)
    },
    // 海康视频 - 更换任务状态
    TASK_STATE(state, taskRunState) {
        state.taskRunState = taskRunState
    },
}

var actions = {

    async refreshVideo({ commit, state }, index) {

        const match = state.floatVideoList[index]
        if (match) {
            const { templateId, deviceUid } = match
            let videoInfo = await getVideoFromUid({ templateId, deviceUid })
            commit('UPDATE_VIDEO', { index, attributes: { url: videoInfo.url, videoInfo } })
        }

    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
