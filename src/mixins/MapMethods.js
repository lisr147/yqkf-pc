import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import LabelClass from '@arcgis/core/layers/support/LabelClass'
import SETTING from '@/config/MapSetting.js'
import WebTileLayer from "@arcgis/core/layers/WebTileLayer"
import Queue from "@/class/Queue"
import { WMTS_Layers, GZ2000, WKID, WKIDGoogle } from "@/config/WMTS";
import Store from '@/store/index'

var MapMethods = {
    data() {
        return {
            //点标记图层
            markerLayer: null,

            //默认地图中心
            defaultCenter: [113.54735115356235, 22.78385103258788],
            //默认缩放程度
            defaultZoom: 11,

        }
    },
    mounted() {

    },
    created() {
    },
    methods: {

        //创建基础图形数据
        createGraphic(item, type, spatialReference) {
            var props

            switch (type) {
                case 'point':
                    props = {
                        longitude: item.lngLat[0],
                        latitude: item.lngLat[1],
                    }
                    break;
                case 'polygon':
                    props = {
                        rings: item.coordinates
                    }
                    break;
                case 'polyline':
                    props = {
                        paths: [item.coordinates]
                    }
                    break;
                default:
                    break;
            }
            return new Graphic({
                attributes: item,
                geometry: Object.assign(
                    {
                        type: type,
                        // spatialReference: isGZ2000 ? { wkt: GZ2000.wkt } : spatialReference,
                        spatialReference
                    },
                    props
                ),
            });

        },

        //根据id添加新图层，该图层必须被声明过
        addLayer({ id, visible = true }) {

            //获取图层配置
            var setting = SETTING.mapLayers.find(item => item.id == id)

            if (setting) {
                this.createFeatureLayer(setting, { visible })
            }
        },

        /**
         * 创建图层
         * @param {Object} setting 图层配置
         * @param {Object} defautlState 图层初始状态
         **/
        createFeatureLayer(setting, defautlState, mapType) {
            if (!mapType) {
                const isGZ2000 = Store.state.map.mapType === 'GZ2000'
                if (isGZ2000) {
                    mapType = 'GZ2000'
                }
                else {
                    mapType = 'GD'
                }
            }

            const { id, title, layerType, fields = [], objectIdField, getData } = setting

            const layer = new FeatureLayer({
                id,
                title,
                opacity: 1,
                outFields: ["*"],
                fields: [
                    ...[
                        { name: "ObjectID", type: "string" },
                        { name: "id", type: "string" },
                        { name: "showTip", type: "string" },
                        { name: "name", type: "string" },//名称
                        { name: "type", type: "string" },//类型
                        { name: "value", type: "string" },//值
                        { name: "tip", type: "string" },//标签内容
                        { name: "ssdw", type: "string" },//所属单位
                        { name: "spTemplateId", type: "string" },//模板编号
                    ],
                    ...fields
                ],
                objectIdField: objectIdField || "ObjectID",
                geometryType: layerType || 'point',
                source: [],
                spatialReference: mapType ==='GZ2000' ? { wkt: GZ2000.wkt } : WKID,
                visible: defautlState.visible !== undefined ? defautlState.visible : true,
                orderBy: setting.orderBy || null,
            })

            const { symbolOutlineWidth, symbolOutlineColor, symbolColor } = setting

            switch (layerType) {
                case 'polygon':
                    //配置区块样式
                    if (setting.renderer) {
                        layer.renderer = setting.renderer
                    } else if (setting.legend && setting.keyField) {
                        layer.renderer = {
                            type: 'unique-value',
                            field: setting.keyField,
                            defaultSymbol: {
                                type: "simple-fill",
                                color: symbolColor || '#5c8fff',
                                outline: {
                                    width: symbolOutlineWidth == undefined ? 0.5 : symbolOutlineWidth,
                                    color: symbolOutlineColor || "#fff"
                                }
                            },//缺省样式
                            uniqueValueInfos: setting.legend.map(item => {
                                return {
                                    value: item.value,
                                    symbol: {
                                        type: "simple-fill",
                                        color: item.color,
                                        outline: {
                                            width: setting.symbolOutlineWidth == undefined ? 0.5 : setting.symbolOutlineWidth,
                                            color: symbolOutlineColor || "#fff"
                                        }
                                    }
                                }
                            })
                        }
                    } else {
                        //多边形默认样式
                        layer.renderer = {
                            type: 'simple',
                            symbol: {
                                type: "simple-fill",
                                color: '#5c8fff',
                                outline: {
                                    width: 2,
                                    color: "#fff"
                                }
                            }
                        }
                    }
                    break;
                case 'polyline':
                    if (setting.renderer) {
                        layer.renderer = setting.renderer
                    } else if (setting.legend && setting.keyField) {
                        layer.renderer = {
                            type: 'unique-value',
                            field: setting.keyField,
                            defaultSymbol: {
                                type: "simple-line"
                            }, //缺省样式
                            uniqueValueInfos: setting.legend.map(item => {
                                return {
                                    value: item.value,
                                    symbol: {
                                        type: "simple-line",
                                        color: item.color,
                                        width: item.width || '3px',
                                        style: item.style || 'solid'
                                    }
                                }
                            })
                        }
                    } else {
                        //线默认样式
                        layer.renderer = {
                            type: 'simple',
                            symbol: {
                                type: "simple-line",
                                color: '#ffffff',
                                width: '2px',
                                style: 'solid'
                            }
                        }
                    }
                    break;
                case 'point':
                    if (setting.renderer) {
                        layer.renderer = setting.renderer
                    } else if (setting.legend && setting.keyField) {
                        layer.renderer = {
                            type: 'unique-value',
                            field: setting.keyField,
                            defaultSymbol: {
                                type: "simple-marker",
                                color: '#465fff',
                                outline: {
                                    color: '#fff',
                                    width: 2
                                }
                            }, //缺省样式
                            uniqueValueInfos: setting.legend.map(item => {
                                return {
                                    value: item.value,
                                    symbol: {
                                        type: "simple-marker",
                                        color: item.color,
                                        width: '10px',
                                        outline: {
                                            color: '#fff',
                                            width: 2
                                        }
                                    }
                                }
                            })
                        }
                    } else {
                        layer.renderer = {
                            type: 'simple',
                            symbol: {
                                type: "simple-marker",
                                color: '#e65931',
                                size: '20px',
                                outline: {
                                    color: "#fff",
                                    width: 2
                                }
                            }
                        }
                    }
                    break;
                default:
                    break;
            }

            // 如果有弹窗模板则配置，否则关闭弹窗功能
            if (setting.popupTemplate) {
                layer.popupTemplate = setting.popupTemplate
            } else {
                layer.popupEnabled = false
            }

            // 显示区块名称文字
            if (setting.showLabel && setting.keyField) {
                // 增加自定义文字属性设置项
                if (setting.labelingInfo) {
                    layer.labelingInfo = setting.labelingInfo
                }
                else {
                    const newLabel = new LabelClass({
                        deconflictionStrategy: setting.labelCover || 'static', //文字覆盖设置
                        symbol: {
                            type: 'text',
                            color: setting.labelColor || '#fff',
                            haloColor: setting.labelHaloColor || "#3d83d1",
                            haloSize: setting.labelHaloSize !== undefined ? setting.labelHaloSize : 1,
                            font: { size: setting.labelSize || 10, weight: "bold" },
                        },
                        labelPlacement: setting.labelPlacement || undefined,
                        // labelPlacement: setting.labelPlacement || 'above-center',
                        labelExpressionInfo: {
                            expression: setting.labelExpression || `return $feature['${setting.keyField}']`
                        }
                    })
                    layer.labelingInfo = [newLabel]
                }
            }

            //是否开启聚合
            if (setting.isCluster) {

                layer.featureReduction = {
                    type: "cluster",
                    clusterRadius: "50px",
                    popupEnabled: false,
                    popupTemplate: {
                        title: "数据聚合",
                        content: "共有{cluster_count}个数据",
                        fieldInfos: [
                            {
                                fieldName: "cluster_count",
                                format: {
                                    places: 0,
                                    digitSeparator: true
                                }
                            }
                        ]
                    },
                    clusterMinSize: "30px",
                    clusterMaxSize: "40px",
                    labelingInfo: [
                        {
                            deconflictionStrategy: "none",
                            labelExpressionInfo: {
                                expression: "Text('聚合'+$feature.cluster_count+'人', '#,###')"
                            },
                            symbol: {
                                type: "text",
                                color: "#fff",
                                haloColor: '#3d83d1',
                                haloSize: "2px",
                                yoffset: 24,
                                font: {
                                    weight: "bold",
                                    size: "14px"
                                }
                            },
                            labelPlacement: 'center-center'
                        }
                    ]
                }

            }

            this.map.add(layer)

            //获取图层数据
            if (typeof getData == 'function') {
                if (defautlState.visible) {
                    //马上获取数据
                    this.fillDataToLayer(getData, layer, setting, mapType)
                } else {
                    //延迟获取数据
                    Queue.add(() => {
                        this.fillDataToLayer(getData, layer, setting, mapType)
                    })
                }

            }
            return layer

        },

        //给图层填充数据
        fillDataToLayer(getData, layer, setting, mapType = 'GD') {

            const { title, layerType } = setting

            getData({ mapType }, { commitCount: true }).then(data => {
                // console.log(`图层 ${title}`);
                // console.log(`图层数据 ${data.length}`);
                // console.log(
                //   `图层数据属性`,
                //   layer.fields.map(v => v.name)
                // );

                //组装数据
                const source = data.map(item => {
                    return this.createGraphic(item, layerType, mapType === 'GZ2000' ? { wkt: GZ2000.wkt } : WKID)
                })
                //添加数据到图层
                layer.applyEdits({ addFeatures: source }).then(results => {
                    // console.log(`layer ${layer.id },addFeatures:${results.addFeatureResults.length}`)
                    this.$emit('layerInit', {
                        layer,
                        results,
                        source
                    })
                })
            })

        },

        /**
         * 前端过滤图层数据
         * id 图层id
         * filterCode 过滤指令
         */
        filterDataInLayer({ id, filterCode }) {

            return new Promise((resolve, reject) => {

                const layer = this.map.findLayerById(id.toString())

                this.view.whenLayerView(layer).then(function (layerView) {

                    layerView.filter = filterCode ? { where: filterCode } : null

                    let _query = layerView.filter ? layerView.filter.createQuery() : null
                    // console.log(`调用 queryFeatures ${filterCode}`)

                    layer.queryFeatureCount(_query).then(len => {
                        // console.log(`${id}, ${filterCode}, 过滤到${len}个结果`)
                        resolve({ length: len })
                    })

                })

            })

        },

        /**
         * 地图移动到指定地点
         */
        gotoLocation({ target, lngLat, zoom = 15 }) {

            //按目标定位
            if (target) {
                if (zoom && target.geometry.centroid) {
                    this.view.goTo({
                        center: target.geometry.centroid,
                        zoom
                    })
                } else {
                    this.view.goTo(target.geometry)
                }
            }

            //按坐标定位
            if (lngLat) {
                this.view.goTo({
                    center: lngLat,
                    zoom: zoom || 15
                })
                this.addMarker({ lngLat })
            }
        },

        /**
         * 返回到初始状态
         */
        backToWhole() {

            return new Promise((resolve) => {

                this.view.goTo({
                    center: this.defaultCenter,
                    zoom: this.defaultZoom
                }).then(() => {
                    resolve()
                })

            })
        },

        addMarker({ lngLat }) {
            const isGZ2000 = Store.state.map.mapType === 'gz2000'
            if (!this.markerLayer) {
                this.markerLayer = new GraphicsLayer({
                    id: 'markerLayer',
                    title: '点标记图层'
                })
                this.map.add(this.markerLayer)
            }

            let geometry = {
                type: 'point',
                x: lngLat[0],
                y: lngLat[1],
                spatialReference: WKID,
            }
            if (isGZ2000) {
                geometry = lngLat
            }

            const marker = new Graphic({
                geometry,
                attributes: {},
                symbol: {
                    type: "picture-marker",
                    url: `./static/mapIcon/point.svg`,
                    width: "30px",
                    height: "34px",
                    yoffset: '17px'
                }
            })
            this.markerLayer.add(marker)

        },

        clearMarker() {
            if (this.markerLayer) {
                this.markerLayer.removeAll()
            }
        },

        /**
         * 根据id获取已存在的图层
         * @param layerId
         */
        getLayerById(layerId) {
            return this.map.findLayerById(layerId)
        },

        /**
         * 创建底图
         */
        createBgLayer({ layerId, visible = true }) {

            const match = WMTS_Layers.find(v => v.id == layerId)
            const { urlTemplate, effect, id, title } = match

            const layer = new WebTileLayer({
                urlTemplate,
                subDomains: ["01", "02", "03", "04"],
                spatialReference: WKIDGoogle,
                title,
                effect,
                visible,
                id
            })

            return layer

        },

        //创建所有底图
        createAllBgLayers() {
            const arr = []
            WMTS_Layers.forEach(item => {
                const { urlTemplate, effect, id, title, visible } = item
                const layer = new WebTileLayer({
                    urlTemplate,
                    subDomains: ["01", "02", "03", "04"],
                    spatialReference: WKIDGoogle,
                    title,
                    effect,
                    visible,
                    id
                })
                arr.push(layer)
            })
            return arr
        }




    }
}


export default MapMethods
