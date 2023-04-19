/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
import {
    getHotelData,
    getStreetHealthCode,
    getMapLayerData,
    getSchoolLayerData,
    getKeyPlaceLayerData,
    getSpecialPeopleCount,
    getThreeGroupLayerData,
    getRiskAreaPeopleByTown,
    getDeliveryByTown,
    getContactDataByLoca,
    getCurrTown,
    getStandBookCar,
    getYellowCodeCluster,
    getDiagnoseHeatMapData,
    getScanRecordData
} from '@/api/mapData.js'

import {
    getAlarmLayerData
} from '@/api/alarm.js'
import {
    getPositiveTrend
} from '@/api/epidemiologicalSurvey'
import {
    getSealArea,
    parsePolygon
} from '@/api/sealarea2.js'

import moment from 'moment'
import LabelClass from '@arcgis/core/layers/support/LabelClass'
import Store from '@/store/index'

import {
    gridGz2000,
    streetGz2000,
    villageGz2000,
    jinzhouGz2000,
    riversGz2000,
    roadGz2000,
    houseEstateGz2000,
    buildingGz2000
} from '@/api/gz2000Json'

import {
    createMapLayerRender,
    getCurrentTown,
    getGridData,
    createGetVideoDataFn,
    getTimeRange,
    createGetDataFn,
    newCreateGetVideoDataFn,
    createGetListFn,
    getMjHeatmapFn,
    HEATMAP_COLORS,
    getStreetData
} from './MapSettingMethod.js'

import LAYER_DICT from './LayerDict'

import { getCurveByTwoPoints } from '../utils/getCurveByTwoPoints'


export default [{
    id: 'boundary',
    title: '南沙行政区域',
    layerType: 'polygon',
    showLabel: true,
    keyField: 'name',
    labelCover: 'none',
    renderer: {
        type: 'unique-value',
        field: 'type',
        uniqueValueInfos: [{
            value: 0,
            symbol: {
                type: "simple-fill",
                color: [0, 173, 234, 0.1],
                outline: {
                    width: 1,
                    color: "#fff"
                }
            }
        }, {
            value: 1, //选中
            symbol: {
                type: "simple-fill",
                color: [84, 216, 25, 0.1],
                outline: {
                    width: 1,
                    color: [49, 234, 0, 1]
                }
            }
        }]
    },
    getData() {
        return new Promise((resolve) => {

            const currTown = getCurrentTown()

            var arr = getStreetData().map(item => {
                const {
                    name,
                    center,
                    coordinates
                } = item
                return {
                    type: name == currTown ? 1 : 0, //用于判断是否当前选中图层
                    name,
                    center,
                    coordinates,
                    tip: name
                }
            }).filter(v => currTown ? v.name === currTown : true)

            resolve(arr)
        })
    }
},
{
    id: 'grid',
    title: '南沙网格',
    layerType: 'polygon',
    showLabel: false,
    keyField: 'name',
    fields: [{
        name: "code",
        type: "string"
    },
    {
        name: "street",
        type: "string"
    },
    {
        name: "border",
        type: "string"
    },
    {
        name: "committees",
        type: "string"
    }
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [56, 65, 255, 0.4],
            outline: {
                width: 0.2,
                color: "#00ff00"
            }
        }
    },
    getData() {
        return new Promise((resolve) => {

            getGridData().then(res => {

                let arr = []
                Array.from(res.values()).forEach((item) => {
                    const {
                        properties,
                        rings
                    } = item
                    arr.push({
                        code: properties['CODE'],
                        name: properties['NAME'],
                        tip: properties['NAME'],
                        street: properties['STREET_NAME'],
                        border: properties['BASE_GRID_BORDER'],
                        committees: properties['COMMITTEES_NAME'],
                        coordinates: rings[0],
                    })
                })
                // console.log('网格数据', arr)

                //提交网格的数量
                Store.commit('map/SET_MATCH_GRID_COUNT', arr.length)

                resolve(arr)
            })

        })
    }
},
{
    id: 'yellowHeatmap',
    title: '黄码人员热力图',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: {
        type: 'heatmap',
        field: 'value',
        colorStops: HEATMAP_COLORS,
        maxPixelIntensity: 2000,
        minPixelIntensity: 0,
        blurRadius: 10
    },
    getData() {
        return new Promise(resolve => {

            getYellowCodeCluster().then(res => {
                resolve(res)
            })

        })
    }
},
{
    id: 'redYellow',
    title: '红黄码人员',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    fields: [{
        name: 'street',
        type: 'string'
    }],
    labelHaloColor: '#d13f1c',
    renderer: {
        type: 'unique-value',
        field: 'type',
        uniqueValueInfos: [{
            value: 'red',
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/icon-red.svg`,
                width: "40px",
                height: "42px"
            }
        }, {
            value: 'yellow',
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/icon-yellow.svg`,
                width: "40px",
                height: "42px"
            }
        }]
    },
    async getData(opt = {
        commitCount: false
    }) {

        const [redData
            // , yellowData
        ] = await Promise.all([
            getStreetHealthCode({
                sszj: getCurrTown()
            }),
            // getStreetYellowCodeStatistics({
            //     sszj: getCurrTown()
            // })
        ])

        const arr = []
        //红码
        redData.data.forEach(item => {
            let {
                center
            } = getStreetData(item.street)
            const isGz2000 = Store.state.map.mapType === 'gz2000'
            const dis = isGz2000?1000:0.01
            arr.push({
                lngLat: [center[0] + dis, center[1] - dis],
                street: item.street,
                type: 'red',
                value: item.redNum,
            })
            // 黄码
            arr.push({
                lngLat: center,
                street: item.street,
                type: 'yellow',
                value: item.yellowNum,
            })
        })
        //黄码
        // 不用公安的数据了
        // yellowData.data.forEach(item => {
        //     let {
        //         center
        //     } = DISTRICTS.find(v => item.street.includes(v.name))
        //     arr.push({
        //         lngLat: center,
        //         street: item.street,
        //         type: 'yellow',
        //         value: item.yellowNum,
        //     })
        // })

        //提交当前图层的数据数量
        const total = parseInt(parseInt(redData.redTotal) + parseInt(redData.yellowTotal))
        if (opt.commitCount) {
            Store.commit('map/SET_DATA_COUNT', {
                layerId: 'redYellow',
                count: total
            })
        }

        return arr
    }
},
{
    id: 'dangerPeopleHeatmap',
    title: '中高风险地区来粤返粤人员热力图',
    layerType: 'point',
    renderer: {
        type: 'heatmap',
        field: 'value',
        colorStops: HEATMAP_COLORS,
        // maxPixelIntensity: 100,
        minPixelIntensity: 0,
        blurRadius: 15
    },
    getData() {
        return new Promise((resolve) => {
            const zxcjsj = getTimeRange()
            getMapLayerData({
                condition: {
                    sszj: getCurrTown(),
                    zxcjsj
                },
                templateId: 10065
            }).then(res => {
                let temp = {}
                res.data.forEach((item, index) => {
                    if (item.longitude && item.latitude) {
                        if (!temp[item.longitude + item.latitude]) {
                            temp[item.longitude + item.latitude] = {}
                            temp[item.longitude + item.latitude]['value'] = 1
                            temp[item.longitude + item.latitude]['lngLat'] = [parseFloat(item.longitude), parseFloat(item.latitude)]
                        } else {
                            temp[item.longitude + item.latitude].value += 1
                        }
                    }
                })
                const arr = Object.values(temp)
                resolve(arr)
            })

        })
    }
},
{
    id: 'dangerPeopleHeatmap-mini',
    title: '中高风险地区来粤返粤人员热力图 mini',
    layerType: 'point',
    renderer: {
        type: 'heatmap',
        field: 'value',
        colorStops: HEATMAP_COLORS,
        maxPixelIntensity: 500,
        minPixelIntensity: 0,
        blurRadius: 8
    },
    async getData() {

        const zxcjsj = getTimeRange()

        let [res1, res2, res3] = await Promise.all([
            getContactDataByLoca({
                type: 'closeContact',
                showModal: false
            }),
            getContactDataByLoca({
                type: 'secondContact',
                showModal: false
            }),
            getMapLayerData({
                condition: {
                    sszj: null,
                    zxcjsj
                },
                templateId: 10065
            })
        ])

        let temp = {}
        const arr = [...res1, ...res2, ...res3.data]
        arr.forEach((item) => {
            if (item.longitude && item.latitude) {
                if (!temp[item.longitude + item.latitude]) {
                    temp[item.longitude + item.latitude] = {}
                    temp[item.longitude + item.latitude]['value'] = item.total || 1
                    temp[item.longitude + item.latitude]['lngLat'] = [parseFloat(item.longitude), parseFloat(item.latitude)]
                } else {
                    temp[item.longitude + item.latitude].value += item.total || 1
                }
            }
        })
        const res = Object.values(temp)
        return res

    }
},
{
    id: 'mjHeatmap',
    title: '密接人员热力图',
    layerType: 'point',
    // showLabel: false,
    // keyField:'value',
    renderer: {
        type: 'heatmap',
        // field: 'value',
        colorStops: HEATMAP_COLORS,
        maxPixelIntensity: 500,
        minPixelIntensity: 0,
        blurRadius: 10
    },
    getData: getMjHeatmapFn({
        mjlx: '密切接触者'
    })
},
{
    id: 'cmjHeatmap',
    title: '次密接人员热力图',
    layerType: 'point',
    // showLabel: false,
    // keyField:'value',
    renderer: {
        type: 'heatmap',
        // field: 'value',
        colorStops: HEATMAP_COLORS,
        maxPixelIntensity: 500,
        minPixelIntensity: 0,
        blurRadius: 10
    },
    getData: getMjHeatmapFn({
        mjlx: '密接的密接'
    })
},
{
    id: 'hotel',
    title: '隔离酒店',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    labelHaloColor: '#d13f1c',
    labelExpression: `return $feature['name'] + ' '+$feature['value']`,
    fields: [{
        name: "id",
        type: "string"
    },],
    renderer: {
        type: 'unique-value',
        field: 'type',
        defaultSymbol: {
            type: "picture-marker",
            url: `./static/mapIcon/hotel.svg`,
            width: "30px",
            height: "32px"
        }
    },
    getData(params = {}, opt = {
        commitCount: false
    }) {
        return new Promise((resolve, reject) => {
            getHotelData({
                sszj: getCurrTown(),
                showModal: false
            }).then((res) => {
                const arr = res.map(item => {
                    const {
                        longitude,
                        latitude,
                        glrs,
                        jkgcjd,
                        id
                    } = item
                    item.lngLat = [longitude, latitude] //经纬度
                    item.value = glrs //隔离人数
                    item.name = jkgcjd //酒店名称
                    item.id = id //酒店id
                    return item
                })
                //提交当前图层的数据数量
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'hotel',
                        count: arr.length
                    })
                }
                resolve(arr)
            })

        })
    }

},
{
    id: 'specialMen',
    title: '特殊人群',
    layerType: 'point',
    showLabel: true,
    keyField: 'count',
    renderer: createMapLayerRender({
        iconName: 'special'
    }),
    fields: [{
        name: 'street',
        type: 'string'
    },
    {
        name: 'count',
        type: 'string'
    },
    ],
    getData(params = {}, opt = {
        commitCount: false
    }) {
        return new Promise((resolve, reject) => {

            getSpecialPeopleCount({
                sszj: getCurrTown(),
                showModal: false
            }).then(res => {

                var arr = []
                var allTotal = 0

                res.forEach(item => {
                    const {
                        belongTown,
                        total
                    } = item
                    let {
                        center
                    } = getStreetData(item.belongTown)
                    arr.push({
                        street: belongTown,
                        lngLat: center,
                        count: total
                    })
                    if (total) {
                        allTotal += total
                    }
                })
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'specialMen',
                        count: allTotal
                    })
                }
                resolve(arr)

            })
        })
    }
},
{
    id: 'party',
    title: '网格党组织',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'party'
    }),
    getData: createGetDataFn({
        title: '网格党组织'
    })
},
{
    id: 'volunteer',
    title: '志愿者机构',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'volunteer'
    }),
    getData: createGetDataFn({
        title: '志愿者机构'
    })
},
{
    id: 'threeGroup',
    title: '三人小组',
    layerType: 'point',
    showLabel: true,
    keyField: 'count',
    fields: [{
        name: 'count',
        type: 'string'
    },
    {
        name: 'street',
        type: 'string'
    },
    ],
    renderer: createMapLayerRender({
        iconName: 'three_group'
    }),
    getData(params = {}, opt = {
        commitCount: false
    }) {

        return new Promise((resolve, reject) => {

            getThreeGroupLayerData({
                category: 'sszj',
                sszj: getCurrTown(),
                showModal: false
            }).then(res => {
                var arr = []
                var allTotal = 0
                res.forEach(item => {
                    const {
                        townOrGrid,
                        groupNumber
                    } = item

                    let {
                        center,
                        name
                    } = getStreetData(item.townOrGrid)
                    arr.push({
                        street: name,
                        lngLat: center,
                        count: groupNumber
                    })

                    if (groupNumber) {
                        allTotal += groupNumber
                    }
                })
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'threeGroup',
                        count: allTotal
                    })
                }

                resolve(arr)
            })

        })

    }
},
{
    id: 'detectionGroup',
    title: '核酸检测小组',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'hesuan_group'
    }),
    getData: createGetDataFn({
        title: '核酸检测小组'
    })
},
{
    id: 'delivery',
    title: '快递配送人员',
    layerType: 'point',
    showLabel: true,
    keyField: 'count',
    fields: [{
        name: 'count',
        type: 'string'
    },
    {
        name: 'street',
        type: 'string'
    },
    ],
    renderer: createMapLayerRender({
        iconName: 'delivery'
    }),

    getData(params = {}, opt = {
        commitCount: false
    }) {
        return new Promise((resolve, reject) => {
            let currTown = getCurrTown()
            getDeliveryByTown({
                sszj: currTown,
                showModal: false
            }).then(res => {
                var arr = []
                var allTotal = 0

                if (currTown) {
                    let res2 = {}
                    res2[currTown] = res[currTown]
                    res = res2
                }

                Object.keys(res).forEach(key => {
                    const value = res[key]
                    let {
                        center
                    } = getStreetData(key)
                    arr.push({
                        street: key,
                        lngLat: center,
                        count: value
                    })
                    if (value) {
                        allTotal += value
                    }
                })
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'delivery',
                        count: allTotal
                    })
                }

                resolve(arr)

            })
        })
    }
},
{
    id: 'market',
    title: '商超',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'market'
    }),
    getData: createGetDataFn({
        title: '商超'
    })
},
{
    id: 'hospital',
    title: '医院',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'hospital'
    }),
    getData(params = {}, opt = {
        commitCount: false
    }) {
        return new Promise((resolve) => {

            if (!params.condition) {
                params.condition = {}
            }
            params.condition.lb = '医院'
            params.condition.sszj = getCurrTown()

            getMapLayerData(Object.assign({
                templateId: 10008
            }, params)).then(res => {
                const arr = res.data
                // let arr = data.filter(item=>item.lb.includes('医院'))
                arr.forEach(item => {
                    item.lngLat = [item.longitude, item.latitude]
                })
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'hospital',
                        count: arr.length
                    })
                }
                resolve(arr)
            })
        })
    }
},
{
    id: 'pharmacy',
    title: '药店',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'pharmacy'
    }),
    getData(params = {}, opt = {
        commitCount: false
    }) {
        return new Promise((resolve, reject) => {

            if (!params.condition) {
                params.condition = {}
            }
            params.condition.lb = '药店'
            params.condition.sszj = getCurrTown()

            getMapLayerData(Object.assign({
                templateId: 10008
            }, params)).then(res => {
                const arr = res.data
                // let arr = data.filter(item=>item.lb.includes('药店'))
                arr.forEach(item => {
                    item.lngLat = [item.longitude, item.latitude]
                })
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'pharmacy',
                        count: arr.length
                    })
                }

                resolve(arr)
            })
        })
    }
},
// {
//   id: 'therapyStation',
//   title: '工疗站',
//   layerType: 'point',
//   showLabel: false,
//   keyField: 'value',
//   renderer: createMapLayerRender({iconName: 'therapyStation'}),
//   getData: createGetDataFn({title: '工疗站'})
// },
{
    id: 'buildingEmp',
    title: '建筑项目',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'building'
    }),
    getData: createGetDataFn({
        title: '建筑项目'
    })
},
{
    id: 'productEmp',
    title: '防疫物资生产企业',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'factory'
    }),
    getData: createGetDataFn({
        title: '防疫物资生产企业'
    })
},
{
    id: 'detectionPoint',
    title: '核酸采样点',
    layerType: 'point',
    showLabel: true,
    isCluster: false,
    // popupTemplate: {
    //   title: "{yljg}",
    //   content: [{
    //     type: "fields",
    //     fieldInfos: [{
    //       label: '医疗机构',
    //       fieldName: 'yljg'
    //     }]
    //   }]
    // },
    fields: [{
        name: "yljg",
        type: "string"
    }, //医疗机构
    {
        name: "lb",
        type: "string"
    }, //类别
    {
        name: "templateId",
        type: "string"
    }, //类别
    ],
    labelExpression: `return $feature['yljg']`,
    keyField: 'yljg',
    renderer: {
        type: 'unique-value',
        field: 'templateId',
        defaultSymbol: {
            type: "picture-marker",
            url: `./static/mapIcon/hesuan_spot_ls.svg`,
            width: "30px",
            height: "32px"
        },
        uniqueValueInfos: [{
            value: 10027, //10027大规模采样点
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/hesuan_spot_ls.svg`,
                width: "30px",
                height: "32px"
            }
        }, {
            value: 10055, //10055常规采样点
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/hesuan_spot_cq.svg`,
                width: "30px",
                height: "32px"
            }
        }]
    },
    getData: createGetDataFn({
        title: '核酸采样点'
    })
},
{
    id: 'detectionPoint-mini',
    title: '核酸采样点 mini',
    layerType: 'point',
    showLabel: false,
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-marker",
            color: '#42f30f',
            size: '5px',
            outline: {
                color: [66, 243, 15, 0.4],
                width: 2
            }
        }
    },
    // getData: createGetDataFn({title: '核酸采样点'})
},
{
    id: 'roadgate',
    title: '道路出入口',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'roadgate'
    }),
    getData: createGetDataFn({
        title: '道路出入口'
    })
},
{
    id: 'keyPlaces',
    title: '公共场所',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    // labelHaloColor: '#d13f1c',
    // labelExpression: `return $feature['stationName'] +'\\n 红'+$feature['red_count']+' 绿'+$feature['green_count']+' 黄'+$feature['yellow_count'] `,
    fields: [{
        name: "state",
        type: "string"
    },
    {
        name: "address",
        type: "string"
    },
    {
        name: "stationName",
        type: "string"
    },
    {
        name: "green_count",
        type: "string"
    },
    {
        name: "red_count",
        type: "string"
    },
    {
        name: "yellow_count",
        type: "string"
    },
    ],
    renderer: {
        type: 'unique-value',
        field: 'state',
        uniqueValueInfos: [{
            value: 'safe',
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/key_places_blue.svg`,
                width: "30px",
                height: "34px"
            }
        }, {
            value: 'risk',
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/key_places_red.svg`,
                width: "30px",
                height: "34px"
            }
        }]
    },
    getData(params = {}, opt = {
        commitCount: false
    }) {
        return new Promise((resolve, reject) => {
            getKeyPlaceLayerData({
                sszj: getCurrTown(),
                showModal: false
            }).then(res => {
                res.forEach(item => {
                    const {
                        longitude,
                        latitude,
                        red_count,
                        yellow_count,
                        green_count,
                        stationName
                    } = item
                    item.lngLat = [parseFloat(longitude), parseFloat(latitude)]
                    item.state = (red_count > 0 || yellow_count > 0) ? 'risk' : 'safe'
                    item.tip = `${stationName} <br/>
              绿码:${green_count}人 黄码:${yellow_count}人 红码:${red_count}人`
                })
                //提交当前图层的数据数量
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'keyPlaces',
                        count: res.length
                    })
                }

                resolve(res)
            })

        })
    }
},
{
    id: 'dangerPeople',
    title: '中高风险地区来粤返粤人员',
    layerType: 'point',
    showLabel: true,
    keyField: 'count',
    labelHaloColor: '#d13f1c',
    fields: [{
        name: 'street',
        type: 'string'
    },
    {
        name: 'count',
        type: 'string'
    },
    ],
    renderer: createMapLayerRender({
        iconName: 'dangerPeople'
    }),
    getData(params = {}, opt = {
        commitCount: false
    }) {
        return new Promise((resolve, reject) => {

            const [startTime, endTime] = getTimeRange()
            getRiskAreaPeopleByTown({
                sszj: getCurrTown(),
                startTime,
                endTime,
                showModal: false
            }).then(res => {

                var arr = []
                var allTotal = res.total

                res.data.forEach(item => {
                    const {
                        street,
                        streetTotal
                    } = item
                    let match = getStreetData(item.street)
                    if (match) {
                        arr.push({
                            street: street,
                            lngLat: match.center,
                            count: streetTotal
                        })
                    }
                })
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'dangerPeople',
                        count: allTotal
                    })
                }
                resolve(arr)

            })
        })
    }
},
{
    id: 'mjPeople',
    title: '密接人员',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    labelHaloColor: '#d13f1c',
    fields: [{
        name: "jzyxgccs",
        type: "string"
    },],
    // isCluster: true,
    // popupTemplate: {
    //   title: "{jzyxgccs}",
    //   content: [{
    //     type: "fields",
    //     fieldInfos: [{
    //       label: '集中观察场所',
    //       fieldName: 'jzyxgccs'
    //     }]
    //   }]
    // },
    renderer: createMapLayerRender({
        iconName: 'mjPeople'
    }),
    getData(params = {}, opt = {
        commitCount: false
    }) {
        //图层数据接口
        return new Promise((resolve, reject) => {

            getContactDataByLoca({
                type: 'closeContact',
                sszj: getCurrTown(),
                showModal: false
            }).then(res => {

                let total = 0
                res.forEach(item => {
                    item.lngLat = [item.longitude, item.latitude]
                    item.value = item.total
                    item.jzyxgccs = item.placeName
                    total += item.total
                })
                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'mjPeople',
                        count: total
                    })
                }
                resolve(res)
            })

        })
    },
    getListData(params = {}) {
        //列表数据接口
        return new Promise((resolve, reject) => {

            if (!params.condition) {
                params.condition = {}
            }
            params.condition.mjlx = '密切接触者'

            getMapLayerData(Object.assign({
                templateId: 10001
            }, params)).then(res => {
                resolve(res)
            })
        })
    }
},
{
    id: 'cmjPeople',
    title: '次密接人员',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    labelHaloColor: '#e0b20a',
    fields: [{
        name: "jzyxgccs",
        type: "string"
    },],
    // isCluster: true,
    // popupTemplate: {
    //   title: "{jzyxgccs}",
    //   content: [{
    //     type: "fields",
    //     fieldInfos: [{
    //       label: '集中观察场所',
    //       fieldName: 'jzyxgccs'
    //     }]
    //   }]
    // },
    renderer: createMapLayerRender({
        iconName: 'cmjPeople'
    }),
    getData(params = {}, opt = {
        commitCount: false
    }) {
        //图层数据接口
        return new Promise((resolve, reject) => {

            getContactDataByLoca({
                type: 'secondContact',
                sszj: getCurrTown(),
                showModal: false
            }).then(res => {

                let total = 0
                res.forEach(item => {
                    item.lngLat = [item.longitude, item.latitude]
                    item.value = item.total
                    item.jzyxgccs = item.placeName
                    total += item.total
                })

                if (opt.commitCount) {
                    Store.commit('map/SET_DATA_COUNT', {
                        layerId: 'cmjPeople',
                        count: total
                    })
                }

                resolve(res)
            })

        })
    },
    getListData(params = {}) {
        //列表数据接口
        return new Promise((resolve, reject) => {

            if (!params.condition) {
                params.condition = {}
            }
            params.condition.mjlx = '密接的密接'

            getMapLayerData(Object.assign({
                templateId: 10001
            }, params)).then(res => {
                resolve(res)
            })
        })
    }
},
{
    id: 'driver',
    title: '跨境司机',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'driver'
    }),
    getData: createGetDataFn({
        title: '跨境司机'
    })
},
{
    id: 'coldWarehouse',
    title: '冷链仓库',
    layerType: 'point',
    showLabel: false,
    keyField: 'csmc',
    fields: [{
        name: 'csmc',
        type: 'string'
    }],
    renderer: createMapLayerRender({
        iconName: 'coldWarehouse'
    }),
    getData: createGetDataFn({
        title: '冷链仓库'
    })
},
{
    id: 'inout',
    title: '出入境口岸',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'inout'
    }),
    getData: createGetDataFn({
        title: '出入境口岸'
    })
},
{
    id: 'foodMarket',
    title: '肉菜市场',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'foodMarket'
    }),
    getData: createGetDataFn({
        title: '肉菜市场'
    })
},
{
    id: 'nurseHouse',
    title: '养老院',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'nurseHouse'
    }),
    getData: createGetDataFn({
        title: '养老院'
    })
},
{
    id: 'maternityCenter',
    title: '月子中心',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'maternityCenter'
    }),
    getData: createGetDataFn({
        title: '月子中心'
    })
},
{
    id: 'industry',
    title: '工业企业',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'industry'
    }),
    getData: createGetDataFn({
        title: '工业企业'
    })
},
{
    id: 'gcyKeyplace',
    title: '重点场所',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'gcyKeyplace'
    }),
    getData: createGetDataFn({
        title: '重点场所'
    })
},
{
    id: 'detectPointAround',
    title: '核酸采样点周边',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'key_places'
    }),
    getData: createGetDataFn({
        title: '核酸采样点周边'
    })
},
{
    id: 'seafoodEmp',
    title: '水产品生产企业',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'seafoodEmp'
    }),
    getData: createGetDataFn({
        title: '水产品生产企业'
    })
}, {
    id: 'farmEmp',
    title: '畜禽生产企业',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'farmEmp'
    }),
    getData: createGetDataFn({
        title: '畜禽生产企业'
    })
}, {
    id: 'transitWarehouse',
    title: '物流中转仓库',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'transitWarehouse'
    }),
    getData: createGetDataFn({
        title: '物流中转仓库'
    })
}, {
    id: 'driverWorkPoint',
    title: '跨境司机作业点',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'driverWorkPoint'
    }),
    getData: createGetDataFn({
        title: '跨境司机作业点'
    })
}, {
    id: 'busEmp',
    title: '运输企业',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'busEmp'
    }),
    getData: createGetDataFn({
        title: '运输企业'
    })
}, {
    id: 'security',
    title: '安保力量',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'security'
    }),
    getData: createGetDataFn({
        title: '安保力量'
    })
}, {
    id: 'school',
    title: '学校',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    fields: [{
        name: 'ssxxmc',
        type: 'string'
    }],
    renderer: createMapLayerRender({
        iconName: 'school'
    }),
    getData({condition}) {
      return new Promise(resolve => {
            getSchoolLayerData({
              templateId: 10068,
              condition,
            }).then(res => {
                // const {
                //     data
                // } = res
                // 重名学校只取最新数据
                let schoolData = {}
                res.data.forEach(v => {
                    if (!schoolData[v.szxxdz]) {
                        schoolData[v.szxxdz] = v
                    }
                    else {
                        // console.log('重复数据',schoolData[v.szxxdz],v)
                        if (new Date(schoolData[v.szxxdz].jztjsj).getTime() < new Date(v.jztjsj).getTime()) {
                            // console.error('更新数据',schoolData[v.szxxdz],v)
                            schoolData[v.szxxdz] = v
                        }
                    }
                })
                const data = Object.values(schoolData)
                // console.log('聚合学校数据',data)

                data.forEach(item => {
                    item.lngLat = [item.longitude, item.latitude]
                    item.templateId = 10068
                })
                Store.commit('map/SET_DATA_COUNT', {
                    layerId: 'school',
                    count: data.length
                })
                resolve(data)
            })
        })
    },
    getListData: createGetListFn({
        title: '学校'
    })
}, {
    id: 'email',
    title: '国际进口邮件快件处理场所',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'email'
    }),
    getData: createGetDataFn({
        title: '国际进口邮件快件处理场所'
    })
}, {
    id: 'importedMaterial',
    title: '进口物料企业',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'importedMaterial'
    }),
    getData: createGetDataFn({
        title: '进口物料企业'
    })
}, {
    id: 'hotel-video',
    title: '隔离酒店视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: createGetVideoDataFn({
        title: '隔离酒店视频'
    })
}, {
    id: 'coldWarehouse-video',
    title: '冷链仓库视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '冷链仓库视频'
    })
}, {
    id: 'driverWorkPoint-video',
    title: '跨境司机作业点视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: createGetVideoDataFn({
        title: '跨境司机作业点视频'
    })
}, {
    id: 'detectionPoint-video',
    title: '常规核酸采样点视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: createGetVideoDataFn({
        title: '常规核酸采样点视频'
    })
}, {
    id: 'bigDetectionPoint-video',
    title: '大规模核酸采样点视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: createGetVideoDataFn({
        title: '大规模核酸采样点视频'
    })
}, {
    id: 'foodMarket-video',
    title: '肉菜市场视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: createGetVideoDataFn({
        title: '肉菜市场视频'
    })
}, {
    id: 'pharmacy-video',
    title: '药店视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '药店视频'
    })
}, {
    id: 'hospital-video',
    title: '医院视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: createGetVideoDataFn({
        title: '医院视频'
    })
}, {
    id: 'therapyStation-video',
    title: '工疗站视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: createGetVideoDataFn({
        title: '工疗站视频'
    })
}, {
    id: 'market-video',
    title: '商超视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: createGetVideoDataFn({
        title: '商超视频'
    })
}, {
    id: 'school-video',
    title: '学校视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '学校视频'
    })
}, {
    id: 'nurseHouse-video',
    title: '养老机构视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '养老机构视频'
    })
}, {
    id: 'maternityCenter-video',
    title: '月子中心视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: createGetVideoDataFn({
        title: '月子中心视频'
    })
}, {
    id: 'industry-video',
    title: '工业企业视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '工业企业视频'
    })
}, {
    id: 'gcyKeyplace-video',
    title: '公共场所视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '公共场所视频'
    })
}, {
    id: 'detectPointAround-video',
    title: '核酸采样点周边视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '核酸采样点周边视频'
    })
}, {
    id: 'recovery-video',
    title: '康复机构视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '康复机构视频'
    })
}, {
    id: 'maternalChild-video',
    title: '母婴服务机构视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '母婴服务机构视频'
    })
}, {
    id: 'mentalHealth-video',
    title: '精神卫生机构视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '精神卫生机构视频'
    })
}, {
    id: 'socialServiceCenter-video',
    title: '社会服务中心视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '社会服务中心视频'
    })
}, {
    id: 'constructionSite-video',
    title: '建筑工地视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '建筑工地视频'
    })
}, {
    id: 'religionPlace-video',
    title: '宗教场所视频',
    layerType: 'point',
    showLabel: true,
    keyField: 'value',
    renderer: createMapLayerRender({
        iconName: 'video'
    }),
    getData: newCreateGetVideoDataFn({
        title: '宗教场所视频'
    })
}, {
    id: 'vehicle-hospital',
    title: '负压车台账-医院',
    layerType: 'point',
    showLabel: true,
    keyField: 'name',
    renderer: {
        type: 'unique-value',
        field: 'type',
        uniqueValueInfos: [{
            value: 0,
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/startplace.svg`,
                width: "30px",
                height: "34px",
                yoffset: '8px',
                xoffset: '6px'
            }
        }, {
            value: 1,
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/endplace.svg`,
                width: "30px",
                height: "34px",
                yoffset: '8px',
                xoffset: '6px'
            }
        }]
    },
    getData: async function () {

        //整理所有出发点和目的地图标 去重
        const arr = []
        let exist = []
        const res = await getStandBookCar({
            showModal: false
        })
        res.forEach(item => {
            const {
                startPlace,
                endPlace,
                longitudeStart,
                latitudeStart,
                longitudeEnd,
                latitudeEnd
            } = item
            if (!longitudeStart || !latitudeStart || !longitudeEnd || !latitudeEnd) {
                return
            }
            if (!exist.includes(startPlace)) {
                arr.push({
                    name: startPlace,
                    lngLat: [longitudeStart, latitudeStart],
                    type: 0
                })
                exist.push(startPlace)
            }
            if (!exist.includes(endPlace)) {
                arr.push({
                    name: endPlace,
                    lngLat: [longitudeEnd, latitudeEnd],
                    type: 1
                })
                exist.push(endPlace)
            }
        })
        return arr
    }
},
{
    id: 'vehicle-car',
    title: '负压车台账-车辆',
    layerType: 'polyline',
    showLabel: false,
    keyField: 'name',
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-line",
            color: '#21BB00',
            width: '2px',
            style: 'solid',
            marker: {
                color: "#21BB00",
                placement: "end",
                style: "arrow"
            }
        }
    },
    getData: function () {
        return new Promise((resolve, reject) => {

            getStandBookCar({
                showModal: false
            }).then(res => {

                let arr = []
                res.forEach(item => {
                    const {
                        longitudeStart,
                        latitudeStart,
                        longitudeEnd,
                        latitudeEnd
                    } = item
                    if (longitudeStart && latitudeStart && longitudeEnd && latitudeEnd) {
                        arr.push({
                            coordinates: [
                                [longitudeStart, latitudeStart],
                                [longitudeEnd, latitudeEnd]
                            ]
                        })
                    }
                })
                resolve(arr)

            })

        })
    }
},
{
    id: 'seal-area',
    title: '封控管理区',
    layerType: 'polygon',
    showLabel: true,
    keyField: 'name',
    fields: [{
        name: 'sswg',
        type: 'string'
    },
    {
        name: 'mj',
        type: 'integer'
    }
    ],
    renderer: {
        type: 'unique-value',
        field: 'type',
        uniqueValueInfos: [{
            value: '封闭区',
            symbol: {
                type: "simple-fill",
                color: [249, 23, 11, 0.2],
                outline: {
                    width: 1,
                    color: "#f9170b"
                }
            }
        }, {
            value: '封控区',
            symbol: {
                type: "simple-fill",
                color: [253, 150, 32, 0.2],
                outline: {
                    width: 1,
                    color: '#fd9620'
                }
            }
        }, {
            value: '防控区',
            symbol: {
                type: "simple-fill",
                color: [70, 210, 250, 0.2],
                outline: {
                    width: 1,
                    color: '#46d1fb'
                }
            }
        }, {
            value: '健康管理区',
            symbol: {
                type: "simple-fill",
                color: [0, 234, 151, 0.2],
                outline: {
                    width: 1,
                    color: '#00ea97'
                }
            }
        }]
    },
    getData: async function () {

        const {
            templateId
        } = LAYER_DICT.find(v => v.id == 'seal-area')

        // 获取封控区域列表
        const res = await getMapLayerData({
            templateId
        })
        const gridMap = await getGridData()

        let arr = []

        //仅显示已启用的封控区
        const enableLayers = res.data.filter(v => v.sfqy == 0)

        enableLayers.forEach(item => {

            const {
                lx,
                sswg,
                id,
                fw,
                mj
            } = item

            //获取网格对应的地址数据
            let coordinates = []
            sswg.split(',').forEach(key => {
                if (gridMap.get(key)) {
                    coordinates = coordinates.concat(gridMap.get(key).rings[0])
                }
            })

            arr.push({
                type: lx,
                name: fw,
                mj,
                id,
                coordinates,
                sswg
            })

        })
        return arr
    },
    getListData: async function () {

        const {
            templateId
        } = LAYER_DICT.find(v => v.id == 'seal-area')
        // 获取封控区域列表
        const res = await getMapLayerData({
            templateId
        })

        const arr = res.data.filter(v => v.sfqy == 0).map(item => {
            const {
                fw,
                lx,
                id,
                sswg
            } = item
            return {
                name: fw,
                type: lx,
                id,
                sswg
            }
        })

        return arr
    }
},
{
    id: 'seal-area2',
    title: '封控管理区',
    layerType: 'polygon',
    showLabel: true,
    keyField: 'name',
    fields: [{
        name: 'id',
        type: 'string'
    },
    {
        name: 'name',
        type: 'string'
    },
    {
        name: 'type',
        type: 'string'
    },
    {
        name: 'remark',
        type: 'string'
    },
    // {
    //     name: 'unitName',
    //     type: 'string'
    // },
    {
        name: 'order',
        type: 'integer'
    },
    {
        name: 'town',
        type: 'string'
    },
    {
        name: 'labelType',
        type: 'string'
    }
    ],
    orderBy: {
        field: "order",
        order: "ascending" //保证封控区在上面
    },
    renderer: {
        type: 'unique-value',
        field: 'type',
        uniqueValueInfos: [
            {
                value: 'seal', //封控区
                symbol: {
                    type: "simple-fill",
                    color: [249, 23, 11, 0],
                    outline: {
                        width: 3,
                        color: "#f9170b"
                    }
                }
            },
            {
                value: 'manage', //管控区
                symbol: {
                    type: "simple-fill",
                    color: [253, 150, 32, 0],
                    outline: {
                        width: 3,
                        color: '#fd9620'
                    }
                }
            },
            {
                value: 'prevention', //防范区
                symbol: {
                    type: "simple-fill",
                    color: [61, 179, 255, 0],
                    outline: {
                        width: 3,
                        color: '#3db3ff'
                    }
                }
            },
            {
                value: 'managewga', //管控网格
                symbol: {
                    type: "simple-fill",
                    color: [255, 250, 205, 0],
                    outline: {
                        width: 3,
                        color: '#ffff00'
                    }
                }
            },
            {
                value: 'managewgb', //识别网格
                symbol: {
                    type: "simple-fill",
                    color: [205, 250, 255, 0],
                    outline: {
                        width: 3,
                        color: '#aff'
                    }
                }
            },
            {
                value: 'label',//封控区文字标签
                symbol: {
                    type: "simple-marker",  // autocasts as new TextSymbol()
                    // haloSize: "0px",
                    style: "circle",
                    // color: "blue",
                    color: '#fff',
                    size: 0,  // pixels
                    outline: {  // autocasts as new SimpleLineSymbol()
                        width: 0  // points
                    }
                },
            }
        ]
    },
    // 不同类型封控区文字处理不一样
    labelingInfo: [
        new LabelClass({
            deconflictionStrategy: 'static', //文字覆盖设置
            symbol: {
                type: 'text',
                color: '#fff',
                haloColor: "#f9170b",
                haloSize: 1,
                font: { size: 10, weight: "bold" },
            },
            // labelPlacement: 'above-center',
            labelExpressionInfo: {
                expression: `return $feature['name']`
            },
            where: "type = 'seal' or labelType = 'seal'"
        }),
        new LabelClass({
            deconflictionStrategy: 'static', //文字覆盖设置
            symbol: {
                type: 'text',
                color: '#fff',
                haloColor: "#fd9620",
                haloSize: 1,
                font: { size: 10, weight: "bold" },
                // yoffset: 10,
            },
            // labelPlacement: 'above-center',
            labelExpressionInfo: {
                expression: `return $feature['name']`
            },
            where: "type = 'manage'"
        }),
        new LabelClass({
            deconflictionStrategy: 'static', //文字覆盖设置
            symbol: {
                type: 'text',
                color: '#fff',
                haloColor: "#3db3ff",
                haloSize: 1,
                font: { size: 10, weight: "bold" },
                // yoffset: 20,
            },
            // labelPlacement: 'above-center',
            labelExpressionInfo: {
                expression: `return $feature['name']`
            },
            where: "type = 'prevention' or labelType = 'prevention'"
        }),
        new LabelClass({
            deconflictionStrategy: 'static', //文字覆盖设置
            symbol: {
                type: 'text',
                color: '#fff',
                haloColor: "#ffd700",
                haloSize: 1,
                font: { size: 10, weight: "bold" },
                // yoffset: 20,
            },
            // labelPlacement: 'above-center',
            labelExpressionInfo: {
                expression: `return $feature['name']`
            },
            where: "type = 'managewga'"
        }),
        new LabelClass({
            deconflictionStrategy: 'static', //文字覆盖设置
            symbol: {
                type: 'text',
                color: '#fff',
                haloColor: "#099",
                haloSize: 1,
                font: { size: 10, weight: "bold" },
                // yoffset: 20,
            },
            // labelPlacement: 'above-center',
            labelExpressionInfo: {
                expression: `return $feature['name']`
            },
            where: "type = 'managewgb'"
        }),
    ],
    getData(mapType) {
        return new Promise((resolve, reject) => {


            getSealArea(mapType).then(res => {
                const labelArr = []
                const arr = res.map(item => {

                    const {
                        area,
                        id,
                        name,
                        polygon,
                        remark,
                        type,
                        unitName,
                        town
                    } = item
                    //将WKT格式转为数组
                    const parseePolygon = parsePolygon(polygon)

                    let coordinates = parseePolygon[0]

                    // console.log('seal-area Data', item)
                    if (unitName) {
                        const labels = JSON.parse(unitName)
                        // console.log('labels',labels)
                        labels.forEach(label => {
                            const [x, y] = label.lnglat
                            labelArr.push({
                                // 文字标签测试
                                name: label.name,
                                coordinates: [
                                    [x - 10, y - 10],
                                    [x + 10, y - 10],
                                    [x + 10, y + 10],
                                    [x - 10, y + 10],
                                    [x - 10, y - 10]
                                ],
                                type: 'label',
                                id: id,
                                area: area,
                                order: 0,
                                remark: '',
                                town: town,
                                unitName: '',
                                labelType: type,
                            })
                        })
                    }

                    return {
                        id,
                        name,
                        type,
                        area,
                        remark,
                        unitName: '',
                        town,
                        order: type == 'seal' ? 0 : (type == 'manage' ? 1 : 2),
                        coordinates//如数组里有多个多边形，仅取第一个
                    }
                })
                resolve(arr.concat(labelArr))
            })


        })
    }
},
{
    id: 'rangLayer',
    title: '编辑封控区域范围',
    layerType: 'polygon',
    fields: [{
        name: "name",
        type: "string"
    },
    {
        name: "street",
        type: "string"
    },
    {
        name: "type",
        type: "string"
    }
    ],
    showLabel: true,
    keyField: 'name',
    renderer: {
        type: 'unique-value',
        field: 'type',
        defaultSymbol: {
            type: "simple-fill",
            color: [56, 65, 255, 0.8],
            outline: {
                width: 1,
                color: "#fff"
            }
        },
        uniqueValueInfos: [{
            value: '封闭区',
            symbol: {
                type: "simple-fill",
                color: [249, 23, 11, 0.8],
                outline: {
                    width: 1,
                    color: "#f9170b"
                }
            }
        }, {
            value: '封控区',
            symbol: {
                type: "simple-fill",
                color: [253, 150, 32, 0.8],
                outline: {
                    width: 1,
                    color: '#fd9620'
                }
            }
        }, {
            value: '防控区',
            symbol: {
                type: "simple-fill",
                color: [70, 210, 250, 0.8],
                outline: {
                    width: 1,
                    color: '#46d1fb'
                }
            }
        }, {
            value: '健康管理区',
            symbol: {
                type: "simple-fill",
                color: [0, 234, 151, 0.8],
                outline: {
                    width: 1,
                    color: '#00ea97'
                }
            }
        }]
    },
    getData: undefined
},
{
    id: 'event-alarm',
    title: '事件告警',
    layerType: 'point',
    showLabel: false,
    keyField: 'value',
    fields: [{
        name: 'town',
        type: 'string'
    },
    {
        name: 'lngLat',
        type: 'string'
    }, //
    {
        name: 'visible',
        type: 'integer'
    },
    {
        name: 'state',
        type: 'integer'
    },
    {
        name: 'hotel',
        type: 'integer'
    },
    {
        name: 'keyPlaces',
        type: 'integer'
    },
    {
        name: 'mjPeople',
        type: 'integer'
    },
    {
        name: 'buyMedicine',
        type: 'integer'
    },
    {
        name: 'dangerWorker',
        type: 'integer'
    },
    {
        name: 'specialPeople',
        type: 'integer'
    },
    {
        name: 'yellowCode',
        type: 'integer'
    },
    ],
    renderer: {
        type: 'unique-value',
        field: 'visible',
        uniqueValueInfos: [{
            value: 1, //显示图标
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/alarm.svg`,
                width: "36px",
                height: "44px",
                yoffset: '16px'
            }
        }, {
            value: 0, //不显示图标
            symbol: {
                type: "simple-marker",
                color: '#e65931',
                size: '0'
            }
        }]
    },
    getData() {
        return new Promise(resolve => {

            //告警图层的初始状态数据

            getAlarmLayerData().then(res => {
                let currTown = getCurrTown()
                let data = res
                if (currTown) {
                    data = res.filter(v => v.sszj.includes(currTown))
                }
                // console.log(currTown,res,data)
                // debugger
                const arr = data.map(item => {
                    const {
                        sszj,
                        newData,
                        alarmDatas
                    } = item
                    const {
                        center,
                        name
                    } = getStreetData(sszj)
                    const totalCount = alarmDatas.reduce((a, b) => {
                        return a + b.todayCount
                    }, 0)

                    const props = {
                        totalCount, //debugger
                        town: name,
                        lngLat: center, //坐标
                        visible: totalCount > 0 ? 1 : 0, //是否显示图标
                        state: newData ? 1 : 0, //是否有新事件
                    }

                    alarmDatas.forEach(({
                        name,
                        todayCount
                    }) => {
                        props[name] = todayCount
                    })

                    return props
                })

                resolve(arr)
            })

        })
    }
},
{
    id: 'dispatch-person',
    title: '流调人员图层',
    layerType: 'point',
    showLabel: true,
    keyField: 'name',
    isCluster: true,
    fields: [{
        name: 'sfzhm',
        type: 'string'
    }, //身份证号码
    {
        name: 'name',
        type: 'string'
    },
    ],
    renderer: createMapLayerRender({
        iconName: 'dispatch-person'
    }),
    getData() {
        return new Promise(resolve => {
            getMapLayerData({
                templateId: 10095,
                condition: {
                    rylb: '阳性人员',
                    glsjzt: '进行中'
                }
            }).then(res => {
                // let data = res.data.filter(item => item.glsjzt !== '已关闭')
                const isGz2000 = Store.state.map.mapType === 'gz2000'
                const longitude = isGz2000 ? 'gzLongitude' : 'longitude'
                const latitude = isGz2000 ? 'gzLatitude' : 'latitude'

                let data = res.data
                data.forEach(item => {
                    item.lngLat = [item[longitude], item[latitude]]
                    item.tip = item.xzz
                    item.name = item.xm
                    item.showTip = true
                })
                resolve(data)
            })
        })
    }
},
{
    id: 'scan-record',
    title: '扫码记录',
    layerType: 'point',
    showLabel: false,
    keyField: 'csmc',
    renderer: createMapLayerRender({
        iconName: 'scan-record'
    }),
    fields: [
        {
            name: 'csmc',
            type: 'string'
        },
        {
            name: 'glsjId',
            type: 'string'
        },
        {
            name: 'lngLat',
            type: 'geometry'
        }
    ],
    labelingInfo: [
        new LabelClass({
            deconflictionStrategy: 'static', //文字覆盖设置
            symbol: {
                type: 'text',
                color: '#FFF',
                haloColor: '#C18718',
                haloSize: 1,
                font: { size: 10, weight: "bold" },
            },
            labelPlacement: 'above-center',
            labelExpressionInfo: {
                expression: `return $feature['csmc']`
            }
        })
    ],
    async getData() {
        return new Promise(resolve => {
            getScanRecordData([]).then(res=>{
                // 返回坐标为gz2000坐标
                const arr = res.filter(v => v.lngLat?.length && v.lngLat[0] && v.lngLat[1])
                resolve(arr)
            })
        })
    }
},
{
    id: 'diagnose-heatmap',
    title: '疑似病例热力图',
    layerType: 'point',
    showLabel: false,
    fields: [
        {
            name: 'glsjId',
            type: 'string'
        }
    ],
    renderer: {
        type: 'heatmap',
        field: 'value',
        colorStops: HEATMAP_COLORS,
        minDensity: 0,
        radius: 15
    },
    getData() {
        return new Promise(resolve => {
            getDiagnoseHeatMapData([]).then(res => {
                // 返回坐标为gz2000坐标
                const arr = res.filter(v => v.lngLat?.length && v.lngLat[0] && v.lngLat[1])
                resolve(arr)
            })
        })
    }
},
{
    id: 'diagnose-place',
    title: '确诊人员活动场所',
    layerType: 'point',
    showLabel: true,
    keyField: 'name',
    fields: [
        {
            name: 'spotType',
            type: 'string'
        }, //地点类型
        {
            name: 'sfzhm',
            type: 'string'
        }, //身份证号码
        {
            name: 'zdcsInfo',
            type: 'string'
        }, // 场所信息
        {
            name: 'csmc',
            type: 'string'
        } // 场所名称
    ],
    renderer: {
        type: 'unique-value',
        field: 'spotType', // 地点类型 home：家 place：场所
        fieldDelimiter: "-",
        uniqueValueInfos: [{
            value: 'home',
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/home-1.svg`,
                width: "30px",
                height: "34px",
                yoffset: '20px'
            }
        }, {
            value: 'place',
            symbol: {
                type: "picture-marker",
                url: `./static/mapIcon/place-1.svg`,
                width: "30px",
                height: "34px",
                yoffset: '20px'
            }
        }]
    },
    // 不同类型封控区文字处理不一样
    labelingInfo: [
        new LabelClass({
            deconflictionStrategy: 'static', //文字覆盖设置
            symbol: {
                type: 'text',
                color: '#FFF',
                haloColor: '#C18718',
                haloSize: 1,
                font: { size: 10, weight: "bold" },
            },
            labelPlacement: 'above-center',
            labelExpressionInfo: {
                expression: `return $feature['csmc']`
            }
        })
    ],
    getData() {
        return new Promise(resolve => {
            getPositiveTrend().then(res => {
                const isGz2000 = Store.state.map.mapType === 'gz2000'
                const longitude = isGz2000 ? 'gzLongitude' : 'longitude'
                const latitude = isGz2000 ? 'gzLatitude' : 'latitude'

                const arr = []
                res.forEach((item) => {
                     // 居住地
                     if (item.jzd) {
                        arr.push({
                            name: item.name,
                            sfzhm: item.sfzhm,
                            zdcsInfo: null,
                            csmc: item.jzd,
                            spotType: 'home',
                            lngLat: isGz2000 ? [item.gzJzdLongitude, item.gzJzdLatitude] : [item.jzdLongitude, item.jzdLatitude],
                            tip: item.name,
                            showTip: true
                        })
                    }

                    const trace = item.trace
                    trace.forEach(t => {
                        const zdcs = t.zdcs
                        for (let i = 0; i < zdcs.length; i++) {
                            // 重点场所
                            arr.push({
                                name: item.name,
                                sfzhm: item.sfzhm,
                                zdcsInfo: JSON.stringify(zdcs[i]),
                                csmc: zdcs[i].csmc,
                                spotType: 'place',
                                lngLat: [zdcs[i][longitude], zdcs[i][latitude]],
                                tip: item.name,
                                showTip: true
                            })
                        }
                    })
                })
                console.log('arr',arr)
                resolve(arr)
            })
        })
    }
},
{
    id: 'diagnose-trace',
    title: '确诊人员活动历史',
    layerType: 'polyline',
    showLabel: true,
    keyField: 'name',
    fields: [
        {
            name: 'sfzhm',
            type: 'string'
        }, //身份证号码
        {
            name: 'locusDate',
            type: 'string'
        }, // 轨迹时间
        {
            name: 'index',
            type: 'integer'
        }
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-line",
            color: "#FFDD77",
            width: '2px',
            style: 'solid',
            marker: {
                color: "#FFDD77",
                placement: "end",
                style: "arrow",
                declaredClass: 'locus-arrow'
            }
        }
    },
    labelingInfo: [
        new LabelClass({
            deconflictionStrategy: 'static', //文字覆盖设置
            symbol: {
                type: 'text',
                angle: 90,
                color: '#FFF',
                haloColor: '#FF6600',
                haloSize: 1,
                font: { size: 12, weight: "bold" },
            },
            repeatLabel: false,
            labelPlacement: 'center-along',
            labelExpressionInfo: {
                expression: `return $feature['index']`
            }
        })
    ],
    getData() {
        return new Promise(resolve => {
            //阳性人员过滤器
            getPositiveTrend().then(res => {
                const traceArr = []
                const arr = res.concat()
                const isGz2000 = Store.state.map.mapType === 'gz2000'
                const longitude = isGz2000 ? 'gzLongitude' : 'longitude'
                const latitude = isGz2000 ? 'gzLatitude' : 'latitude'

                arr.forEach(item => {
                    item.checked = true
                    item.personalId = item.id
                    item.id = item.sfzhm

                    let allIndex = 1

                    let longitudeStart
                    let latitudeStart
                    let longitudeEnd
                    let latitudeEnd

                    const trace = item.trace.slice().reverse()
                    trace.forEach(t => {
                        const zdcs = t.zdcs
                        let zdcsIndex = 1;
                        if (zdcs.length > 1) {
                            for (let i = 0, j = i + 1; i < zdcs.length - 1; i++, j++) {
                                longitudeStart = zdcs[i][longitude]
                                latitudeStart = zdcs[i][latitude]
                                if (i === 0
                                    && longitudeStart
                                    && latitudeStart
                                    && longitudeEnd
                                    && latitudeEnd
                                    && !(longitudeStart === longitudeEnd && latitudeStart === latitudeEnd)
                                ) {
                                    const coordinates = getCurveByTwoPoints([longitudeEnd, latitudeEnd], [longitudeStart, latitudeStart])
                                    traceArr.push({
                                        name: item.name,
                                        sfzhm: item.sfzhm,
                                        locusDate: 'all',
                                        index: allIndex++,
                                        coordinates
                                    })
                                }

                                longitudeEnd = zdcs[j][longitude]
                                latitudeEnd = zdcs[j][latitude]
                                if (
                                    !longitudeStart
                                    || !latitudeStart
                                    || !longitudeEnd
                                    || !latitudeEnd
                                    || (longitudeStart === longitudeEnd && latitudeStart === latitudeEnd)
                                ) {
                                    continue;
                                }
                                const coordinates = getCurveByTwoPoints([longitudeStart, latitudeStart], [longitudeEnd, latitudeEnd])
                                traceArr.push({
                                    name: item.name,
                                    sfzhm: item.sfzhm,
                                    locusDate: t.locusDate,
                                    index: zdcsIndex++,
                                    coordinates
                                })

                                traceArr.push({
                                    name: item.name,
                                    sfzhm: item.sfzhm,
                                    locusDate: 'all',
                                    index: allIndex++,
                                    coordinates
                                })
                            }
                        } else if (zdcs.length === 1) {
                            longitudeEnd = zdcs[0][longitude]
                            latitudeEnd = zdcs[0][latitude]
                        }
                    })
                })
                Store.commit('common/SET_DIAGNOSE', arr)
                resolve(traceArr)
            })
        })
    }
},
// 临时：运营商提供的人员基站轨迹数据 @hgc 2022-7-14
{
    id: 'person-locus',
    title: '风险人员轨迹-移动方向',
    layerType: 'polyline',
    showLabel: false,
    keyField: 'name',
    fields: [
        // { name: 'name', type: 'string' },
        {
            name: 'startTime',
            type: 'integer'
        },
        {
            name: 'endTime',
            type: 'integer'
        },
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-line",
            color: '#900',
            width: '2px',
            style: 'solid',
            marker: {
                color: "#900",
                placement: "end",
                style: "arrow",
                declaredClass: 'locus-arrow'
            }
        }
    },
    getData: function () {
        return new Promise((resolve) => {
            import('@/views/sealArea2/locus.js').then(res => {
                const data = res.default
                let arr = []
                // let locusData = []
                for (let i = 0; i < data.length - 1; i++) {
                    // 如果下一个数据开始时间大于等于这次的结束时间，可以认为在移动中，出现箭头
                    const startTime = new Date(data[i].dtfirsttime).getTime() / 1000
                    const endTime = new Date(data[i].dtlasttime).getTime() / 1000

                    const nextStartTime = new Date(data[i + 1].dtlasttime).getTime() / 1000
                    if (nextStartTime < endTime) {
                        continue
                    }

                    const longitudeStart = data[i].CG2000_X
                    const latitudeStart = data[i].CG2000_Y
                    const longitudeEnd = data[i + 1].CG2000_X
                    const latitudeEnd = data[i + 1].CG2000_Y
                    arr.push({
                        startTime,
                        endTime,
                        coordinates: [
                            [longitudeStart, latitudeStart],
                            [longitudeEnd, latitudeEnd]
                        ],
                    })
                }
                // console.log('风险人员轨迹数据', arr)
                resolve(arr)
            })
        })
    }
},
{
    id: 'person-locus2',
    title: '风险人员轨迹2',
    layerType: 'polygon',
    showLabel: true,
    keyField: 'name',
    fields: [
        // { name: 'name', type: 'string' },
        {
            name: 'startTime',
            type: 'integer'
        },
        {
            name: 'endTime',
            type: 'integer'
        },
        {
            name: 'long',
            type: 'integer'
        },
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [255, 60, 60, 0.3],
            // style: 'circle',
            size: 50,
            valueUnit: 'kilometers',
            outline: {
                width: 0
            }
        },
        //   动态变量
        visualVariables: [
            {
                type: "color", // 动态变换大小（Possible Values:"color"|"opacity"|"rotation"|"size"）
                field: "long", // 根据长度动态调整
                stops: [
                    { value: 300, color: [255, 60, 60, .5] },
                    { value: 3600, color: [200, 30, 30, .5] },
                    { value: 99999, color: [150, 0, 0, .5] }
                ],
            }
        ],
    },
    getData: function () {
        return new Promise((resolve) => {
            import('@/views/sealArea2/locus.js').then(res => {
                const data = res.default
                let locusData = []
                data.forEach(v => {
                    v.startTime = new Date(v.dtfirsttime).getTime() / 1000
                    v.endTime = new Date(v.dtlasttime).getTime() / 1000
                    locusData.push(v)
                })
                // 时间排序
                // console.log('风险人员轨迹数据2', data, locusData)
                let arr = []

                for (let i = 0; i < locusData.length - 1; i++) {
                    const v = locusData[i]
                    const longitude = parseInt(v.CG2000_X)
                    const latitude = parseInt(v.CG2000_Y)

                    let r = 2000
                    let points = []
                    for (
                        let a = 2 * Math.PI;
                        a >= 2 * Math.PI - (2 * Math.PI * 100) / 100;
                        a -= 0.2
                    ) {
                        let x = Math.sin(a + Math.PI) * r;
                        let y = Math.cos(a + Math.PI) * r;

                        points.push([
                            longitude + x,
                            latitude + y
                        ])
                    }
                    // const longitudeEnd = locusData[i + 1].CG2000_X
                    // const latitudeEnd = locusData[i + 1].CG2000_Y
                    arr.push({
                        name: `${moment(v.startTime * 1000).format('MM-DD HH:mm')}\n${Math.floor((v.endTime - v.startTime) / 60)}分钟`,
                        startTime: v.startTime,
                        endTime: v.endTime,
                        long: v.endTime - v.startTime,
                        // lngLat: [longitudeStart, latitudeStart],
                        coordinates: [
                            points
                        ]
                    })
                }
                // console.log('风险人员轨迹数据2', arr)
                resolve(arr)
            })
        })
    }
},
// GZ2000的网格图层
{
    id: 'grid-gz2000',
    title: '南沙网格GZ2000',
    layerType: 'polygon',
    showLabel: false,
    keyField: 'name',
    fields: [{
        name: "code",
        type: "string"
    },
    {
        name: "street",
        type: "string"
    },
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [56, 65, 255, 0],
            outline: {
                width: 2,
                color: [56, 65, 255, 0.4]
            }
        }
    },
    getData() {
        return new Promise(async (resolve, reject) => {
            const res = await gridGz2000()
            const arr = res.features.map(v => {
                return {
                    code: v.attributes.code,
                    name: v.attributes.name,
                    tip: v.attributes.name,
                    street: v.attributes['镇名'],
                    border: null,
                    committees: v.attributes.name,
                    coordinates: v.geometry.rings[0],
                    showTip: true
                }
            })
            resolve(arr)
        })
    }
},
{
    id: 'street-gz2000',
    title: '南沙镇街GZ2000',
    layerType: 'polygon',
    showLabel: true,
    keyField: 'name',
    fields: [{
        name: "street",
        type: "string"
    },
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [56, 65, 255, 0],
            outline: {
                width: 2,
                color: [56, 65, 255, 0.4]
            }
        }
    },
    getData() {
        return new Promise(async (resolve, reject) => {
            const data = await streetGz2000()
            const arr = data.features.map(v => {
                return {
                    // code: v.attributes.code,
                    name: v.attributes['镇名'],
                    tip: v.attributes['镇名'],
                    street: v.attributes['镇名'],
                    // border: null,
                    // committees: v.attributes.name,
                    coordinates: v.geometry.rings[0],
                }
            })
            // console.log('GZ2000镇街数据', arr, streetGz2000)
            resolve(arr)
        })
    }
},
{
    id: 'village-gz2000',
    title: '南沙村居GZ2000',
    layerType: 'polygon',
    showLabel: true,
    keyField: 'name',
    fields: [{
        name: "code",
        type: "string"
    },
    {
        name: "street",
        type: "string"
    }
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [56, 65, 255, 0],
            outline: {
                width: 2,
                color: [56, 65, 255, 0.4]
            }
        }
    },
    getData() {
        return new Promise(async (resolve, reject) => {
            const res = await villageGz2000()
            const arr = res.features.map(v => {
                return {
                    code: v.attributes['地址编码'],
                    name: v.attributes['名字'],
                    tip: v.attributes['名字'],
                    street: v.attributes['镇界'],
                    showTip: true,
                    // border: null,
                    // committees: v.attributes.name,
                    coordinates: v.geometry.rings[0],
                }
            })
            resolve(arr)
        })
    }
},
{
    id: 'rivers-gz2000',
    title: '南沙街河流',
    layerType: 'polygon',
    showLabel: false,
    keyField: 'name',
    fields: [{
        name: "code",
        type: "string"
    },
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [56, 65, 255, 0],
            outline: {
                width: 2,
                color: [56, 65, 255, 0.4]
            }
        }
    },
    getData() {
        return new Promise(async (resolve, reject) => {
            const res = await riversGz2000()
            const arr = res.features.map(v => {
                return {
                    name: v.attributes.Name,
                    coordinates: v.geometry.paths[0],
                }
            })
            resolve(arr)
        })
    }
},

{
    id: 'road-gz2000',
    title: '南沙街路网',
    layerType: 'polygon',
    showLabel: false,
    keyField: 'name',
    fields: [{
        name: "code",
        type: "string"
    },
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [56, 65, 255, 0],
            outline: {
                width: 2,
                color: [56, 65, 255, 0.4]
            }
        }
    },
    getData() {
        return new Promise(async (resolve, reject) => {
            const res = await roadGz2000()
            const arr = res.features.map(v => {
                return {
                    name: v.attributes.Name,
                    coordinates: v.geometry.paths[0],
                }
            })
            resolve(arr)
        })
    }
},
{
    id: 'houseEstate-gz2000',
    title: '小区',
    layerType: 'polygon',
    showLabel: false,
    keyField: 'name',
    fields: [{
        name: "code",
        type: "string"
    },
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [56, 65, 255, 0],
            outline: {
                width: 2,
                color: [56, 65, 255, 0.4]
            }
        }
    },
    getData() {
        return new Promise(async (resolve, reject) => {
            const res = await houseEstateGz2000()
            const arr = res.features.map(v => {
                return {
                    name: v.attributes.Name,
                    coordinates: v.geometry.rings[0],
                }
            })
            resolve(arr)
        })
    }
},
{
    id: 'building-gz2000',
    title: '小区内楼宇',
    layerType: 'polygon',
    showLabel: false,
    keyField: 'name',
    fields: [{
        name: "code",
        type: "string"
    },
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [56, 65, 255, 0],
            outline: {
                width: 2,
                color: [56, 65, 255, 0.4]
            }
        }
    },
    getData() {
        return new Promise(async (resolve, reject) => {
            const res = await buildingGz2000()
            const arr = res.features.map(v => {
                return {
                    name: v.attributes.Name,
                    coordinates: v.geometry.rings[0],
                }
            })
            resolve(arr)
        })
    }
},

{
    id: 'jinzhou-gz2000',
    title: '金洲村居GZ2000',
    layerType: 'polygon',
    showLabel: true,
    keyField: 'name',
    fields: [{
        name: "code",
        type: "string"
    },
    ],
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-fill",
            color: [92, 143, 255, 0.8],
            outline: {
                width: 2,
                color: [56, 65, 255, 0.6]
            }
        }
    },
    getData() {
        return new Promise(async (resolve) => {
            const res = await jinzhouGz2000()
            const arr = res.features.map(v => {
                return {
                    code: v.attributes['地址编码'],
                    name: v.attributes.Name,
                    tip: v.attributes.Name,
                    coordinates: v.geometry.rings[0],
                }
            })
            // console.log('GZ2000村居数据', arr)
            resolve(arr)
        })
    }
},
// 金洲村无人机三维地图点
{
    id: 'jinzhou-UAV',
    title: '金洲村无人机三维地图点',
    layerType: 'point',
    showLabel: true,
    keyField: 'name',
    isCluster: true,
    fields: [
        {
            name: 'name',
            type: 'string'
        },
    ],
    renderer: createMapLayerRender({
        iconName: 'UAV'
    }),
    getData() {
        return new Promise(resolve => {
            let data = [{
                lngLat: [66645.17276982476, 193160.9531369063],
                name: '金洲村三维地图点',
                showTip: true
            }]
            resolve(data)
        })
    }
},
]

