import mapLayers from "@/config/mapLayers.js";
import { getDiagnoseHeatMapData } from '@/api/mapData.js'
import { GZ2000 } from "@/config/WMTS";

export default {
    data() {
        return {

        }
    },
    methods: {
        /**
         * 图层点击相关
         */
        //处理图层点击事件
        async handelLayerClicked(params) {
            //   console.log("图层点击事件", params);
            if (this.$refs.layerSearch) {
                this.$refs.layerSearch.layerClicked(params)
            }

            this.clusterData = null;
            if (!params) {
                return;
            }
            const { layerId } = params;
            switch (layerId) {
                case "boundary":
                    break;
                case "seal-area2":
                    this.layerEventSealArea(params)
                    break;
                case "dispatch-person":
                    this.layerEventDispatchPerson(params)
                    break;
                case "street-gz2000":
                case "village-gz2000":
                case "grid-gz2000":
                case "rivers-gz2000":
                case "road-gz2000":
                case "houseEstate-gz2000":
                case "building-gz2000":
                    this.layerEventGridAddArea(params)
                    break;
                case "jinzhou-gz2000":
                    this.layerEventShow3D()
                    break;
                case "diagnose-place":
                    this.placeDetail = JSON.parse(params.attributes.zdcsInfo);
                    break;
                case "scan-record":
                    this.scanRecordDetail = params.attributes;
                    break;
                default:
                    break;
            }
        },


        // 显示封控区详情
        async layerEventSealArea(params) {
            const { attributes, target } = params;
            if (this.mode == 0) {
                //查看详情
                //判断类型是否为管控网格,不是才触发点击事件
                // if (attributes.type !== "managewga") {
                this.setCurrSealarea(attributes, target);
                // }
            } else if (this.mode == 1) {
                //编辑区域
                if (this.currSealArea.name) {
                    return;
                }

                this.setCurrSealarea(attributes, target);
                this.mapLayer.addDrawFeature(target.graphic.geometry);
                // 再找出对应的点
                const sealLayer = this.mapLayer.getLayerById("seal-area2")
                const { features } = await sealLayer.queryFeatures()
                const points = features.filter(v => v.attributes.id === attributes.id && v.attributes.type === 'label')
                this.mapLayer.addDrawLabel(points)

                // console.log('编辑区域', sealLayer, features, points, attributes, target)

            }
        },
        // 显示流调信息
        async layerEventDispatchPerson(params) {
            const { attributes, event } = params;
            // 聚合模式
            if (attributes.clusterId) {
                let layer = this.mapLayer.getLayerById("dispatch-person");
                let layerView = await this.mapLayer.view.whenLayerView(
                    layer
                );
                let query = layerView.createQuery();
                query.aggregateIds = [attributes.clusterId];
                let res = await layerView.queryFeatures(query);
                console.log("features", res, event);
                this.clusterData = {};
                this.clusterData.data = res.features.map((v) => {
                    return v.attributes;
                });
                this.clusterData.x = event.x;
                this.clusterData.y = event.y;
                return;
            }

            this.dispatchId = attributes.id;
            this.isDispatchPanelVisible = true;
        },
        // 把区域生成区域
        layerEventGridAddArea(params) {
            if (this.mode === 1) {
                const { layerId, attributes, target, event } = params;
                this.currAreaData.type = layerId.split("-")[0];
                this.currAreaData.rings = target.graphic.geometry.rings;
                this.addArea()
            }
        },
        // 显示金州村3D影像
        layerEventShow3D() {
            this.show3d = true
        },
        // 更新疑似病例热力图图层
        async updateDiagnoseHeatMapLayer({ events }) {
            const layer = this.$refs["baseMapLayer"].map.layers.find(v => v.id === 'diagnose-heatmap')
            //获取图层配置
            const { layerType } = mapLayers.find(
                item => item.id == layer.id
            );

            // 获取待添加的图层要素
            const res = await getDiagnoseHeatMapData(events)
            const diagnoseHeatMapData = res.filter(v => v.lngLat?.length && v.lngLat[0] && v.lngLat[1])
            const addFeatures = diagnoseHeatMapData.map(item => {
                return this.$refs["baseMapLayer"].createGraphic(item, layerType, { wkt: GZ2000.wkt })
            })

            // 获取待清除的图层要素id
            const ObjectIds = await layer.queryObjectIds();
            const deleteFeatures = ObjectIds.map(v => {
                return { objectId: v };
            });

            //执行更新
            await layer.applyEdits({ deleteFeatures, addFeatures });

        },

        // 更新扫码记录图层
        updateScanRecordLayer({ events }) {
            let filterCode = null
            if (events.length > 0) {
                filterCode = events
                    .map((v) => {
                        return `glsjId = '${v}'`;
                    })
                    .join(" OR ");
            }
            this.$refs["baseMapLayer"].filterDataInLayer({ id: 'scan-record', filterCode });
        },

    }
}
