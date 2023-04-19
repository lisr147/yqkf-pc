// 划设区域划设功能
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import LabelClass from '@arcgis/core/layers/support/LabelClass'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { GZ2000 } from "@/config/WMTS";
import Graphic from "@arcgis/core/Graphic";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Draw from "@arcgis/core/views/draw/Draw";
export default {
    data() {
        return {
            sketch: null,
            labelSketch: null,
            drawLayer: null,
            labelDrawLayer: null,
            labelFeatureLayer: null,
            labelSource: []
        }
    },
    computed: {
        sealAreaMode() {
            if (this.$store.state.common.sealarea) {
                return this.$store.state.common.sealarea.mode
            }
            return null
        },
        currSealArea() {
            return this.$store.state.common.sealarea;
        },
    },
    watch: {
        sealAreaMode(val) {
            if (val === 'add') {
                this.sketch.visible = true
            }
            else {
                this.sketch.visible = false
            }

        },
        isEditing(val) {
            this.labelSketch.visible = !!val
            const sealLayer = this.getLayerById("seal-area2")
            // console.log('sealLayer', sealLayer)
            sealLayer.visible = !val
        }
    },
    methods: {
        // 初始化编辑功能
        initDrawMethod() {
            this.initDrawLayer()
            this.initSketch();
            this.initLabelLayer()
            this.initLabelSketch()
        },
        //区域绘制图层
        initDrawLayer() {
            const layer = new GraphicsLayer({
                id: "drawLayer",
                title: "绘制图层",
                visible: true
            });
            this.map.add(layer);
            this.drawLayer = layer;
        },
        initSketch() {
            this.initLabelSketch()

            // create a new sketch widget
            const sketch = new Sketch({
                view: this.view,
                layer: this.drawLayer,
                availableCreateTools: ["polygon", "circle", "rectangle"],
                defaultUpdateOptions: {
                    multipleSelectionEnabled: false
                },
                creationMode: "update",
                visibleElements: {
                    selectionTools: {
                        'rectangle-selection': false,
                        'lasso-selection': false
                    },
                    settingsMenu: false
                },
                visible: false
            });
            this.view.ui.add(sketch, "manual");
            sketch.on('create', this.sketchCreate)
            this.sketch = sketch

        },
        // 划设新多边形
        sketchCreate(evt) {
            if (evt.state === 'start') {
                this.clearDrawLayer()
            }
        },
        initLabelLayer() {
            const newLabel = new LabelClass({
                deconflictionStrategy: 'static', //文字覆盖设置
                symbol: {
                    type: 'text',
                    color: '#fff',
                    haloColor: "#3d83d1",
                    haloSize: 1,
                    font: { size: 10, weight: "bold" },
                },
                labelPlacement: 'above-center',
                labelExpressionInfo: {
                    expression: `return $feature['name']`
                }
            })
            this.labelFeatureLayer = new FeatureLayer({
                id: 'labelShowLayer',
                title: '绘制文字渲染层',
                visible: true,
                labelingInfo: [newLabel],
                fields: [
                    { name: 'objectId', type: 'string' },
                    { name: 'name', type: 'string' }
                ],
                geometryType: 'point',
                source: this.labelSource,
                objectIdField: 'objectId',
                renderer: {
                    type: 'simple',
                    symbol: {
                        type: "simple-marker",
                        color: '#e65931',
                        size: '0px',
                    }
                },
                spatialReference: GZ2000

            })
            this.map.add(this.labelFeatureLayer)

            this.labelDrawLayer = new GraphicsLayer({
                id: "labelLayer",
                title: "绘制文字图层",
                visible: true,
            });
            this.map.add(this.labelDrawLayer);
        },
        initLabelSketch() {
            this.labelSketch = new Sketch({
                view: this.view,
                layer: this.labelDrawLayer,
                availableCreateTools: ["point"],
                defaultUpdateOptions: {
                    multipleSelectionEnabled: false
                },
                creationMode: "update",
                visibleElements: {
                    selectionTools: {
                        'rectangle-selection': false,
                        'lasso-selection': false
                    },
                    undoRedoMenu: false,
                    settingsMenu: false
                },
                visible: false
            });
            this.view.ui.add(this.labelSketch, "manual");
            this.labelSketch.domNode.className += ' label-sketch'
            this.labelSketch.on('create', this.labelPointCreate)
            this.labelSketch.on('update', this.labelPointUpdate);
            this.labelSketch.on('delete', this.labelPointDelete)
        },
        async labelPointCreate(evt) {
            if (evt.state === 'complete') {
                console.log(evt)
                const graphic = evt.graphic
                let res
                try {
                    res = await this.$prompt('', '输入名称', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    })
                }
                catch (e) {
                    this.labelDrawLayer.remove(graphic)
                    return
                }

                console.log('res', res)
                const name = (res.value || '').trim()
                if (!name) {
                    this.$message.error('名字不能为空')
                    this.labelDrawLayer.remove(graphic)
                    return
                }

                // console.log('labelSketch create', evt, name)
                graphic.attributes = {
                    name: name
                }
                graphic.attributes.objectId = graphic.uid
                this.labelSource.push(graphic)
                this.labelFeatureLayer.applyEdits({ addFeatures: [graphic] })
            }
        },
        labelPointUpdate(evt) {
            // if (evt.state === 'complete') {
                this.labelFeatureLayer.applyEdits({ updateFeatures: this.labelSource })
            // }
        },
        labelPointDelete(evt) {
            // console.log(evt)
            let object = []
            evt.graphics.forEach(g => {
                const index = this.labelSource.find(v => {
                    v.attributes.objectId === g.attributes.objectId
                })
                object = object.concat(this.labelSource.splice(index, 1))
            })
            this.labelFeatureLayer.applyEdits({ deleteFeatures: object })
        },

        //创建一次绘制行为
        initDraw() {
            const view = this.view;
            const drawLayer = this.drawLayer;
            const _this = this

            let draw = new Draw({
                view: view
            });

            let action = draw.create("polygon", { mode: "click" });

            // PolygonDrawAction.vertex-add
            // Fires when user clicks, or presses the "F" key.
            // Can also be triggered when the "R" key is pressed to redo.
            action.on("vertex-add", function (evt) {
                createPolygonGraphic(evt.vertices);
            });

            // PolygonDrawAction.vertex-remove
            // Fires when the "Z" key is pressed to undo the last added vertex
            action.on("vertex-remove", function (evt) {
                createPolygonGraphic(evt.vertices);
            });

            // Fires when the pointer moves over the view
            action.on("cursor-update", function (evt) {
                createPolygonGraphic(evt.vertices);
            });

            // Add a graphic representing the completed polygon
            // when user double-clicks on the view or presses the "C" key
            action.on("draw-complete", evt => {
                createPolygonGraphic(evt.vertices);
                this.$emit("drawComplete");
            });

            function createPolygonGraphic(vertices) {
                //该操作会引起SketchViewModel报错
                _this.clearDrawLayer()

                let polygon = {
                    type: "polygon",
                    rings: vertices,
                    spatialReference: view.spatialReference
                };

                let graphic = new Graphic({
                    geometry: polygon,
                    symbol: {
                        type: "simple-fill",
                        color: [92, 143, 255, 0.8],
                        outline: {
                            width: 2,
                            color: "#fff",
                            style: "dash"
                        }
                    }
                });
                drawLayer.add(graphic);
            }
        },
        //区域编辑时图层点击事件,触发编辑
        // 实际没作用？
        editLayerClick(event) {
            console.log('editLayerClick', event)
            this.view.hitTest(event).then(res => {
                if (!res.results[0]) {
                    return;
                }
                console.log('点击区域', res.results[0])
                const { graphic } = res.results[0];
                if (graphic.layer == this.sketch.layer) {
                    console.log('sketch.update')
                    this.sketch.update([graphic], { tool: "reshape" });
                }
            });
        },
        //清空区域绘制图层
        async clearDrawLayer() {
            this.drawLayer.removeAll();
            this.labelDrawLayer.removeAll()
            // console.log('deleteFeatures', this.labelSource)
            await this.labelFeatureLayer.applyEdits({ deleteFeatures: this.labelSource })
            this.labelSource = []
        },

        //编辑封控区时，把多边形加入drawLayer
        addDrawFeature(geo) {
            // console.log('addDrawFeature', geo)
            const graphic = new Graphic({
                geometry: geo,
                symbol: {
                    type: "simple-fill",
                    color: [92, 143, 255, 0.8],
                    outline: {
                        width: 2,
                        color: "#fff",
                        style: "dash"
                    }
                }
            });
            this.drawLayer.add(graphic);
            //图形开启编辑模式
            this.sketch.update([graphic], { tool: "reshape" });
        },
        //添加编辑的点数据
        addDrawLabel(points) {
            for (let i = 0; i < points.length; i++) {
                const v = points[i]
                const option = {
                    geometry: {
                        x: v.geometry.centroid.x,
                        y: v.geometry.centroid.y,
                        type: 'point',
                        spatialReference: GZ2000
                    },
                    attributes: v.attributes,
                    symbol: {
                        type: "simple-marker",
                        color: "#fff",
                        size: 6,
                        outline: {
                            width: 1,
                            color: [50, 50, 50, 1]
                        }
                    }
                }
                const graphic = new Graphic(option)
                this.labelDrawLayer.add(graphic)
                this.labelSource.push(graphic)
                this.labelFeatureLayer.applyEdits({ addFeatures: [graphic] })
            }
        },

        //获取当前编辑的区域polygon
        //遍历geometries判断是否在polygon里面
        //有则一同返回
        getDrawFeature({ geometries }) {
            const currGraphic = this.drawLayer.graphics.items[0];
            //   console.log("currGraphic", currGraphic);
            if (!currGraphic || !currGraphic.geometry) {
                return {
                    polygon: [],
                    area: 0
                };
            }

            //墨卡托格式坐标转换成地理坐标
            const currGeometry = webMercatorUtils.webMercatorToGeographic(
                currGraphic.geometry
            );
            const innerArr = [];
            let area = geometryEngine.geodesicArea(currGeometry, "square-meters");
            let subArea = 0;

            geometries.forEach(item => {
                //判断是否在当前编辑的区域内
                let isWithin = geometryEngine.within(item, currGeometry);
                if (isWithin) {
                    subArea += Math.abs(
                        geometryEngine.geodesicArea(item, "square-meters")
                    );
                    innerArr.push(item.rings[0]);
                }
            });

            return {
                polygon: [...currGraphic.geometry.rings, ...innerArr],
                area: Math.abs(area) - subArea
            };
        },


        // 获取定位文字标签的数据
        getLabelFeature() {
            return this.labelDrawLayer.graphics.items.map(v => {
                return {
                    name: v.attributes.name,
                    lnglat: [v.geometry.x, v.geometry.y]
                }
            })
        },

        //获取与当前绘制区域相交的多边形数据
        getIntersectPolygon({ features }) {
            const currGraphic = this.drawLayer.graphics.items[0];
            if (!currGraphic) {
                return [];
            }

            //墨卡托格式坐标转换成地理坐标
            const currGeometry = webMercatorUtils.webMercatorToGeographic(
                currGraphic.geometry
            );

            const res = [];
            features.forEach(item => {
                const { attributes, geometry } = item;
                if (geometryEngine.intersects(currGeometry, geometry)) {
                    res.push(attributes);
                }
            });

            return res;
        },

        //创建一个默认的区域多边形
        // 只在搜索区域中使用
        addDefaultFeature(areaData) {
            // console.log("区域类型data", areaData);
            const { x, y } = this.view.center;
            //   let [lng, lat] = webMercatorUtils.xyToLngLat(x, y);
            //   console.log(lng, lat, x, y, this.view);
            //   let point = new Point({
            //     x: x,
            //     y: y,
            //     spatialReference: { wkt: GZ2000.wkt },
            //   });
            //   const circle = new Circle({
            //     // type: "Circle",
            //     center: point,
            //     numberOfPoints: 4,
            //     radius: 0.5,
            //     radiusUnit: "kilometers",
            //     // geodesic: true,
            //   });

            //   console.log("圆形", point, circle.rings);
            //       x
            // :
            // 54810.07389911926
            // y
            // :
            // 192729.84924644174

            //   从圆形变成方形
            const radius = 500; //半径500米
            let rings = [
                [
                    [x - radius, y - radius],
                    [x + radius, y - radius],
                    [x + radius, y + radius],
                    [x - radius, y + radius]
                ]
            ];
            if (areaData && areaData.rings.length > 0) {
                rings = areaData.rings;
            }

            let graphic = new Graphic({
                geometry: {
                    type: "polygon",
                    //   rings: circle.rings,
                    rings,
                    spatialReference: { wkt: GZ2000.wkt }
                },
                symbol: {
                    type: "simple-fill",
                    color: [92, 143, 255, 0.8],
                    // color:'#f00',
                    outline: {
                        width: 2,
                        color: "#fff",
                        style: "dash"
                    }
                }
            });
            //添加图形到图层
            this.drawLayer.add(graphic);

            //图形开启编辑模式
            this.sketch.update([graphic], { tool: "reshape" });
            this.gotoLocation({
                target: graphic,
                zoom: null
            });
        },
    }
}