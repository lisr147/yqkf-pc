import Store from '@/store/index'
import LAYER_DICT from './LayerDict'

import {
    getHeatMapData,
    getGridMapData,
    getMapLayerData,
    getLayerDataByUnit,
    getCurrTown,
    getVideoGroups,
    getCurrGrid,
} from '@/api/mapData.js'

import {
    formatDate
} from '@/utils/common'


//热力图颜色
export const HEATMAP_COLORS = [{
    color: "rgba(230, 255, 56, 0)",
    ratio: 0
},
{
    color: "#e8ff38",
    ratio: 0.083
},
{
    color: "#e0db4b",
    ratio: 0.166
},
{
    color: "#E0BE2F",
    ratio: 0.249
},
{
    color: "#FB8039",
    ratio: 0.332
},
{
    color: "#fb7134",
    ratio: 0.415
},
{
    color: "#FB6123",
    ratio: 0.498
},
{
    color: "#fb4b10",
    ratio: 0.581
},
{
    color: "#F93D26",
    ratio: 0.747
},
{
    color: "#f92e15",
    ratio: 0.83
},
{
    color: "#F91D1F",
    ratio: 0.913
},
{
    color: "#f90e0f",
    ratio: 1
}
]
/**
 * 创建图标渲染器
 */
export function createMapLayerRender({
    iconName
}) {
    return {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: `./static/mapIcon/${iconName}.svg`,
            width: "30px",
            height: "34px",
            // yoffset: '17px'
        },
    }
}

export //获取当前镇街
    function getCurrentTown() {
    return Store.state.common.town
}

/**
 * 获取网格
 * @returns {Promise<any>}
 */
export function getGridData() {

    return new Promise((resolve) => {

        if (gridMap.size > 0) {
            resolve(gridMap)
        } else {
            getGridMapData({
                transform: true,
                showModal: false
            }).then(res => {

                res.features.forEach(item => {

                    const {
                        geometry,
                        properties,
                    } = item
                    gridMap.set(properties['NAME'], {
                        properties,
                        rings: geometry.coordinates
                    })

                })

                resolve(gridMap)
            })
        }

    })
}

/**
 * 创建“获取视频图层数据”的方法
 * @param title
 * @param commitCount
 */
export function createGetVideoDataFn({
    title
}) {
    const res = LAYER_DICT.find(v => v.label == title)

    const {
        templateId,
        ssdwId,
        id
    } = res

    return function (opt = {
        commitCount: false
    }) {

        return new Promise((resolve) => {

            if (!id) {
                console.error(`缺少id`)
                resolve([])
                return
            }
            if (!templateId) {
                console.error(`图层${id} 缺少templateId：${templateId}`)
                resolve([])
                return
            }

            //按所属单位落图 使用ssdwId
            getLayerDataByUnit({
                templateId: ssdwId,
                showModal: false,
                sszj: getCurrTown(),
                sswg: getCurrGrid()
            }).then(res => {
                var arr = []
                var allTotal = 0

                if (res) {
                    res.forEach(item => {
                        const {
                            spsl,
                            ssdw,
                            longitude,
                            latitude
                        } = item
                        if (spsl > 0) {
                            arr.push({
                                lngLat: [longitude, latitude],
                                value: spsl,
                                ssdw
                            })
                            allTotal += spsl
                        }
                    })
                }
                //提交当前图层的数据数量
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: id,
                        count: allTotal
                    })
                }
                resolve(arr)
            })

        })
    }
}


/**
* 获取时间范围
* @returns {string[]}
*/
export function getTimeRange() {
    const yesterday = new Date()
    const bfYesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    bfYesterday.setDate(bfYesterday.getDate() - 2)

    const arr = [`${formatDate(bfYesterday)} 16:00:00`, `${formatDate(yesterday)} 16:00:00`]
    return arr
}


/**
 * 创建“获取图层数据”的方法
 * @param id
 * @returns {function(): Promise<any>}
 */
export function createGetDataFn({
    title
}) {

    const res = LAYER_DICT.find(v => v.label == title)
    const {
        templateId,
        id,
        externalTemplateId
    } = res
    //   console.log('templateId, id,externalTemplateId', templateId, id, externalTemplateId)
    return function (params = {}, option = {
        commitCount: false
    }) {

        return new Promise((resolve) => {

            if (!id) {
                console.error(`缺少id`)
                resolve([])
                return
            }
            if (!templateId) {
                console.error(`图层${id} 缺少templateId：${templateId}`)
                resolve([])
                return
            }

            //过滤所属镇街
            if (!params.condition) {
                params.condition = {}
            }
            params.condition.sszj = getCurrTown()

            getMapLayerData(Object.assign({
                templateId: templateId
            }, params)).then(res => {

                const {
                    data
                } = res
                data.forEach(item => {
                    item.lngLat = [item.longitude, item.latitude]
                    item.templateId = templateId
                })

                if (externalTemplateId) {
                    getMapLayerData(Object.assign({
                        templateId: externalTemplateId
                    }, params)).then(res2 => {
                        const data2 = res2.data
                        data2.forEach(item => {
                            item.lngLat = [item.longitude, item.latitude]
                            item.templateId = externalTemplateId
                        })

                        let externalData = [...data, ...data2]
                        if (option.commitCount) {
                            Store.commit('map/SET_DATA_COUNT', {
                                layerId: id,
                                count: externalData.length
                            })
                        }
                        // console.log('externalData',externalData)
                        // console.log('layerId: ${id} data.length ${ data.length}')
                        resolve(externalData)
                    })
                } else {

                    //提交当前图层的数据数量
                    if (option.commitCount) {
                        Store.commit('map/SET_DATA_COUNT', {
                            layerId: id,
                            count: data.length
                        })
                    }

                    // console.log('layerId: ${id} data.length ${ data.length}')
                    resolve(data)
                }
            })

        })

    }
}





/**
 * 新-创建“获取视频图层数据”的方法
 * @param title
 * @param commitCount
 */
let VideoGroups = {}

export function newCreateGetVideoDataFn({
    title
}) {

    const res = LAYER_DICT.find(v => v.label == title)

    const {
        id
    } = res

    return function (opt = {
        commitCount: false
    }) {

        return new Promise((resolve) => {
            if (!id) {
                console.error(`缺少id`)
                resolve([])
                return
            }

            let _title = title.replace('视频', '')

            if (!VideoGroups[_title]) {
                getVideoGroups().then(res => {
                    if (res.length) {
                        const isGz2000 = Store.state.map.mapType === 'gz2000'


                        res.forEach(item => {
                            let arr = []
                            VideoGroups[item.tagName] = {}
                            item.data.forEach(child => {
                                const {
                                    spsl,
                                    ssdw,
                                    longitude,
                                    gzLongitude,
                                    latitude,
                                    gzLatitude,
                                    spTemplateId
                                } = child
                                arr.push({
                                    lngLat: [isGz2000 ? gzLongitude : longitude, isGz2000 ? gzLatitude : latitude],
                                    value: spsl,
                                    ssdw,
                                    spTemplateId
                                })
                            })

                            VideoGroups[item.tagName] = {
                                size: item.size,
                                arr
                            }
                        })
                    }
                    //提交当前图层的数据数量
                    if (opt.commitCount) {
                        Store.commit('map/SET_DATA_COUNT', {
                            layerId: id,
                            count: VideoGroups[_title].size
                        })
                    }
                    resolve(VideoGroups[_title].arr)
                })
            } else {
                //提交当前图层的数据数量
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: id,
                        count: VideoGroups[_title].size
                    })
                }
                resolve(VideoGroups[_title].arr)
            }
        })
    }
}



//缓存网格数据
var gridMap = new Map()


/**
 * 获取密接/次密接 热力图
 * @param {String} mjlx 密接類型： 密切接触者， 密接的密接
 * @returns {Promise<any>}
 */
export function getMjHeatmapFn({
    mjlx
}) {

    return function () {

        return new Promise((resolve) => {

            getHeatMapData({
                showModal: false
            }).then(res => {

                let arr = []
                res.forEach((item) => {
                    if (item.longitude && item.latitude && item.mjlx == mjlx) {
                        arr.push({
                            lngLat: [item.longitude, item.latitude]
                        })
                    }
                })
                // console.log(`热力图 ${mjlx}`)
                // console.log(arr)

                resolve(arr)
            })

        })
    }

}

/**
 * 创建“获取列表数据”的方法
 * @param id
 * @returns {function(): Promise<any>}
 */
export function createGetListFn({
    title
}) {

    const res = LAYER_DICT.find(v => v.label == title)
    const {
        templateId,
        id
    } = res

    return function (params = {}) {

        return new Promise((resolve) => {

            if (!id) {
                console.error(`缺少id`)
                resolve([])
                return
            }
            if (!templateId) {
                console.error(`图层${id} 缺少templateId：${templateId}`)
                resolve([])
                return
            }

            getMapLayerData(Object.assign({
                templateId: templateId,
                showModal: false
            }, params)).then(res => {
                resolve(res)
            })

        })
    }
}

/**
 * 获取镇街数据，通过STORE判断现在是GDMAP还是GZ2000，返回对应数据
 * 参数为镇街名，不传为返回所有镇街
 */
import DISTRICTS from '@/components/MapLayer/districts.json'
import streetGz2000 from '@/components/MapLayer/streetGz2000.json'
import streetCenterGz2000 from '@/components/MapLayer/streetCenterGz2000.json'
export function getStreetData(streetName) {
    // console.log('获取镇街数据', Store.state.map.mapType,streetName)
    if (Store.state.map.mapType === 'gdMap') {
        if (!streetName) {
            return DISTRICTS
        }
        const result = DISTRICTS.find(v => streetName.includes(v.name))
        if (!result) {
            console.error('获取镇街数据失败', Store.state.map.mapType, streetName)
        }
        return result
    }
    if (Store.state.map.mapType === 'gz2000') {
        const streetDataGz2000 = streetGz2000.features.map(v => {
            // 计算中心点
            // console.log(v.attributes['镇名'])
            // console.log(streetCenterGz2000[v.attributes['镇名']])
            return {
                name: v.attributes['镇名'],
                center: streetCenterGz2000[v.attributes['镇名']],
                coordinates: v.geometry.rings
            }
        })
        if (!streetName) {
            return streetDataGz2000
        }
        const result = streetDataGz2000.find(v => streetName.includes(v.name))
        if (!result) {
            console.error('获取镇街数据失败', Store.state.map.mapType, streetName)
        }
        return result
    }
}
