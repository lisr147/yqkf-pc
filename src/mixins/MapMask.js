import Handles from '@arcgis/core/core/Handles'
import * as watchUtils from "@arcgis/core/core/watchUtils"
import BaseLayerView2D from '@arcgis/core/views/2d/layers/BaseLayerView2D'
import * as projection from "@arcgis/core/geometry/projection"
import TileInfo from "@arcgis/core/layers/support/TileInfo"
import Layer from "@arcgis/core/layers/Layer"
import Polygon from "@arcgis/core/geometry/Polygon"
import * as promiseUtils from "@arcgis/core/core/promiseUtils"
// import * as geometryEngine from "@arcgis/core/geometry/geometryEngine"
import { GZ2000, WKID, WKIDGoogle } from "@/config/WMTS";

import NANSHA from "@/components/MapLayer/nansha.json"
// import DISTRICTS from "@/components/MapLayer/districts.json"


// const WKID = undefined

const CustomLayerView2D = BaseLayerView2D.createSubclass({
    constructor: function () {
        // Maps from tile id to the image used by that tile.
        this.tileContexts = new window.Map();

        // The handles to the property watchers; we need to store them
        // so that we can unwatch the properties when the layer view
        // is detached.
        this.watchHandles = new Handles();

        // Set to true when the images in the tiles have become obsolete
        // and must be regenerated. This is triggered by a change of
        // layer.geometry, layer.color or layer.distance.
        this.needsImageUpdate = false;
    },

    // Called when the layer is added to the map.
    attach: function () {
        const projectionPromise = projection.load();
        const layerView = this;
        const layer = layerView.layer;

        this.watchHandles.add([
            watchUtils.init(this, "layer.geometry", () => {
                if (!layer.geometry) {
                    layerView.projectedGeometry = null;
                    layerView.needsImageUpdate = true;
                    layerView.requestRender();
                    return;
                }

                projectionPromise.then(() => {
                    layerView.projectedGeometry = projection.project(
                        layer.geometry,
                        layer.tileInfo.spatialReference,
                        projection.getTransformation(
                            layer.geometry.spatialReference,
                            layer.tileInfo.spatialReference
                        )
                    );
                    layerView.needsImageUpdate = true;
                    layerView.requestRender();
                });
            }),

            watchUtils.init(this, "layer.distance", () => {
                layerView.needsImageUpdate = true;
                layerView.requestRender();
            }),

            watchUtils.init(this, "layer.color", () => {
                layerView.needsImageUpdate = true;
                layerView.requestRender();
            })
        ]);
    },

    // Called to regenerate a tile.
    drawGeometry: function (ctx, bounds, tileIndex, tilePos) {
        ctx.globalCompositeOperation = "source-over";
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        // No geometry; entire map is unmasked.
        if (!this.projectedGeometry) {
            ctx.clearRect(0, 0, width, height);
            return;
        }

        if (this.layer.distance === 0) {
            return;
        }

        // We mask the entire map; we will "carve" the unmasked area using
        // an operation that subtracts opacity iteratively.
        const c = this.layer.color;
        ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 1)";
        ctx.fillRect(0, 0, width, height);

        // if (tilePos == 30) {
        //   ctx.fillStyle = "black";
        //   ctx.fillRect(0, 0, width, height);
        // } else if (tilePos == 32) {
        //   ctx.fillStyle = "blue";
        //   ctx.fillRect(0, 0, width, height);
        // } else if (tilePos == 31 || tilePos == 20) {
        //   var gradient = ctx.createLinearGradient(0, 0, 0, height);
        //   gradient.addColorStop(0, "black");
        //   gradient.addColorStop(1, "blue");
        //   ctx.fillStyle = gradient;
        //   ctx.fillRect(0, 0, width, height);
        // } else if (tilePos == 21) {
        //   var gradient = ctx.createLinearGradient(0, 0, 0, height);
        //   gradient.addColorStop(0, "blue");
        //   gradient.addColorStop(1, "black");
        //   ctx.fillStyle = gradient;
        //   ctx.fillRect(0, 0, width, height);
        // }
        //
        // ctx.fillStyle = "red";
        // ctx.font = '80px';
        // ctx.fillText(tileIndex ,20,20);

        // if (tilePos == 30) {
        //   ctx.fillStyle = "black";
        //   ctx.fillRect(0, 0, width, height);
        // } else if (tilePos == 32) {
        //   ctx.fillStyle = "blue";
        //   ctx.fillRect(0, 0, width, height);
        // } else if (tilePos == 31 || tilePos == 20) {
        //   var gradient = ctx.createLinearGradient(0, 0, 0, height);
        //   gradient.addColorStop(0, "black");
        //   gradient.addColorStop(1, "blue");
        //   ctx.fillStyle = gradient;
        //   ctx.fillRect(0, 0, width, height);
        // } else if (tilePos == 21) {
        //   var gradient = ctx.createLinearGradient(0, 0, 0, height);
        //   gradient.addColorStop(0, "blue");
        //   gradient.addColorStop(1, "black");
        //   ctx.fillStyle = gradient;
        //   ctx.fillRect(0, 0, width, height);
        // }
        //
        // ctx.fillStyle = "red";
        // ctx.font = '80px';
        // ctx.fillText(tileIndex ,20,20);

        // Every iteration reduces opacity by a constant term and each iteration acts
        // on a progressively smaller region.
        // The factor "3" is fairly arbitrary, but it works well with "destination-out".
        // Lower values would cause a visible discontinuity between the fully illuminated
        // area and the beginning of the shaded area.
        const unmaskTerm = 3 / this.layer.distance;
        ctx.globalCompositeOperation = "destination-out";

        if (
            this.projectedGeometry.type === "polygon" ||
            this.projectedGeometry.type === "polyline" ||
            this.projectedGeometry.type === "extent"
        ) {
            // Polygons, polylines and extents are carved using increasingly thinner lines
            // and a single fill operation at the end.

            // All geometry types are treated as rings.
            const rings =
                this.projectedGeometry.type === "extent"
                    ? Polygon.fromExtent(this.projectedGeometry).rings
                    : this.projectedGeometry.rings ||
                    this.projectedGeometry.paths;

            // Rings are transformed to tile coordinates.
            const transformed = rings.map((ring) => {
                return ring.map((coords) => {
                    return [
                        Math.round(
                            (width * (coords[0] - bounds[0])) /
                            (bounds[2] - bounds[0])
                        ),
                        Math.round(
                            height *
                            (1 - (coords[1] - bounds[1]) / (bounds[3] - bounds[1]))
                        )
                    ];
                });
            });

            // The rings are drawn as increasingly thinner lines; this produces
            // a blurred edge around the unmasked area, so that transition from
            // unmasked to masked is gradual.
            ctx.lineJoin = "round";

            for (let r = 1; r <= this.layer.distance; ++r) {
                ctx.strokeStyle = "rgba(0, 0, 0, " + unmaskTerm + ")";
                ctx.lineWidth = this.layer.distance + 1 - r;

                for (let i = 0; i < transformed.length; ++i) {
                    const ring = transformed[i];

                    ctx.beginPath();
                    ctx.moveTo(ring[0][0], ring[0][1]);

                    for (let j = 1; j < ring.length; ++j) {
                        ctx.lineTo(ring[j][0], ring[j][1]);
                    }

                    // If it's not a polyline, meaning it's a polygon or an extent,
                    // we close the path.
                    this.projectedGeometry.type !== "polyline" && ctx.closePath();
                    ctx.stroke();
                }
            }

            if (this.projectedGeometry.type !== "polyline") {
                // If it's not a polyline, meaning it's a polygon or an extent,
                // we carve the space occupied by the geometry using a fill
                // operation; this is what fully unmask the geometry.
                ctx.fillStyle = "rgba(0, 0, 0, 1)";

                for (let i = 0; i < transformed.length; ++i) {
                    const ring = transformed[i];

                    ctx.beginPath();
                    ctx.moveTo(ring[0][0], ring[0][1]);

                    for (let j = 1; j < ring.length; ++j) {
                        ctx.lineTo(ring[j][0], ring[j][1]);
                    }

                    ctx.closePath();
                    ctx.fill();
                }
            }
        } else if (
            this.projectedGeometry.type === "point" ||
            this.projectedGeometry.type === "multipoint"
        ) {
            // Points an multipoints are carved using increasingly smaller circles.

            // The "point" case is equivalent to a "multipoint" with a single point.
            const points =
                this.projectedGeometry.type === "multipoint"
                    ? this.projectedGeometry.points
                    : [[this.projectedGeometry.x, this.projectedGeometry.y]];

            // Points are transformed to tile coordinates.
            const transformed = points.map((coords) => {
                return [
                    Math.round(
                        (width * (coords[0] - bounds[0])) / (bounds[2] - bounds[0])
                    ),
                    Math.round(
                        height *
                        (1 - (coords[1] - bounds[1]) / (bounds[3] - bounds[1]))
                    )
                ];
            });

            // The points are drawn using increasingly smaller circles.
            for (let r = 1; r <= this.layer.distance; ++r) {
                const size = this.layer.distance + 1 - r;
                ctx.fillStyle = "rgba(0, 0, 0, " + unmaskTerm + ")";

                for (let i = 0; i < transformed.length; ++i) {
                    const point = transformed[i];
                    ctx.beginPath();
                    ctx.arc(point[0], point[1], Math.round(size / 2), 0, 360);
                    ctx.fill();
                }
            }
        }
    },

    // Creates the images for new tiles that don't have a texture yet, and destroys the images
    // of tiles that are not on screen anymore.
    manageTileImages: function () {
        const gl = this.context;

        const tileIdSet = new Set();
        // Create new images as needed.
        const len = this.tiles.length
        for (let i = 0; i < len; ++i) {
            const tile = this.tiles[i];
            tileIdSet.add(tile.id);

            let ctx = this.tileContexts.get(tile.id);

            //计算tile的位置
            var pos = 0
            // if (len % 3 == 0) {
            //   pos = i > Math.floor(len / 3 * 2) ? 32 : (i > Math.floor(len / 3) ? 31 : 30)
            // } else if (len % 2 == 0) {
            //   pos = i >= Math.floor(len / 2) ? 21 : 20
            // }

            if (ctx) {
                if (this.needsImageUpdate) {
                    this.drawGeometry(ctx, tile.bounds, i, pos);
                }
            } else {
                const canvas = document.createElement("canvas");
                canvas.width = this.layer.tileInfo.size[0];
                canvas.height = this.layer.tileInfo.size[1];
                ctx = canvas.getContext("2d");
                this.tileContexts.set(tile.id, ctx);
                this.drawGeometry(ctx, tile.bounds, i, pos);
            }
        }

        // Destroys unneeded images.
        this.tileContexts.forEach((_, id) => {
            if (!tileIdSet.has(id)) {
                this.tileContexts.delete(id);
            }
        });

        this.needsImageUpdate = false;
    },

    // Example of a render implementation that draws tile boundaries.
    render: function (renderParameters) {
        this.manageTileImages();

        const tileSize = this.layer.tileInfo.size[0];
        const state = renderParameters.state;
        const pixelRatio = state.pixelRatio;
        const width = state.size[0];
        const height = state.size[1];
        const context = renderParameters.context;
        const coords = [0, 0];

        context.clearRect(0, 0, width * pixelRatio, height * pixelRatio);

        // Apply rotation for everything that will be applied to the canvas.
        if (state.rotation !== 0) {
            context.translate(
                width * pixelRatio * 0.5,
                height * pixelRatio * 0.5
            );
            context.rotate((state.rotation * Math.PI) / 180);
            context.translate(
                -width * pixelRatio * 0.5,
                -height * pixelRatio * 0.5
            );
        }

        // Set the style for all the text.
        context.globalAlpha = this.layer.color[3];

        for (let i = 0; i < this.tiles.length; ++i) {
            // Retrieve the current tile and its associated texture.
            const tile = this.tiles[i];
            const ctx = this.tileContexts.get(tile.id);

            const screenScale = (tile.resolution / state.resolution) * pixelRatio;
            state.toScreenNoRotation(coords, tile.coords);
            context.drawImage(
                ctx.canvas,
                coords[0],
                coords[1],
                tileSize * screenScale,
                tileSize * screenScale
            );
        }
    },

    // Destroy the shader program, the buffers and all the tile images.
    detach: () => {
        this.watchHandles.removeAll();
    },

    // Required when using tiling; this methods is called every time that `this.tiles`
    // changes, to give the derived class a chance to perform per-tile work as needed;
    // This is where, for instance, tile data could be fetched from a server.
    tilesChanged: function (added, removed) {
        // console.log(`this.tiles: ${this.tiles.length}`)
    },

    hitTest: function (mapPoint, { x, y }) {

        if (!this.projectedGeometry) {
            return promiseUtils.resolve()
        }

        if (this.layer.visible) {
            // 判断鼠标点击坐标是否在多边形内
            let area = new Polygon({
                hasZ: false,
                hasM: true,
                spatialReference: this.projectedGeometry.spatialReference,
                rings: this.projectedGeometry.rings
            })
            let point = this.view.toMap({ x, y })

            return promiseUtils.resolve({
                layerId: 'maskLayer',
                hit: !area.contains(point)
            })
        } else {
            return promiseUtils.resolve()
        }

    }
})

var MapMask = {
    data: function () {
        return {
            //遮罩层
            maskLayer: null,
            //南沙区边界多边形
            nsGeometry: null,
        }
    },
    computed: {
        isGz2000(){
            return this.$store.state.map.mapType==='gz2000'
        }
    },
    created() {

    },
    methods: {

        initMaskLayer(option = { color: [33, 48, 160, 1] }) {
            console.log('初始化遮罩层', this.isGz2000)
            const MaskLayerClass = Layer.createSubclass({

                tileInfo: TileInfo.create({
                    size: 512,
                    // spatialReference: { wkid: WKID }
                    spatialReference: this.isGz2000 ? GZ2000 : WKIDGoogle,
                }),

                constructor: function () {
                    this.color = [0, 0, 0, 1];
                    this.distance = 10;
                },

                createLayerView: function (view) {
                    if (view.type === "2d") {
                        return new CustomLayerView2D({
                            view: view,
                            layer: this
                        });
                    }
                },

                properties: {
                    color: {},
                    geometry: {},
                    distance: {},
                    id: '',
                    title: '',
                    visible: false
                }
            });

            this.maskLayer = new MaskLayerClass({
                color: option.color, //遮罩层颜色
                distance: 6, //灰度边缘宽度
                id: 'maskLayer',
                title: '遮罩层',
                visible: true
            })
            this.map.add(this.maskLayer)

            //初始化遮罩范围为南沙
            this.maskLayer.geometry = this.getWholeMaskGeometry()
        },

        //获取南沙区边界多边形
        getWholeMaskGeometry() {

            //方法1 多边形聚合
            // if(!this.nsGeometry){
            //   var arr = DISTRICTS.map(item => {
            //     return new Polygon({
            //       rings: [item.coordinates]
            //     })
            //   })
            //   this.nsGeometry = geometryEngine.geodesicBuffer(arr, 100, 'feet', true)[0]
            // }
            // return this.nsGeometry

            //方法2 使用已合并数据
            if (!this.nsGeometry) {
                this.nsGeometry = new Polygon({
                    rings: NANSHA.coordinates
                })
            }
            return this.nsGeometry

        },

        async maskTo(target) {

            if (!target.geometry) {
                console.error(`maskTo失败，无法获取到geometry`)
                return
            }

            //创建遮罩层示例
            if (!this.maskLayer) {
                this.initMaskLayer()
            }

            //定位到遮罩目标
            await this.view.goTo(target.geometry)

            const geometry = await this.getMaskTarget(target)
            this.maskLayer.geometry = geometry
        },
        async maskToGz2000(target) {
            this.maskTo(target)
            this.maskLayer.visible = true
        },

        //获取target的最新状态
        //地图缩放后target.geometry的端点数有所变化
        async getMaskTarget(target) {
            const layer = target.layer
            const { name } = target.attributes

            const query = {
                returnGeometry: true, //获取的feature包含geometry
                where: `name = '${name}'`
            }
            let { features } = await layer.queryFeatures(query)
            return features[0].geometry
        },

        async backToWholeFromMask() {
            await this.view.goTo({
                center: this.defaultCenter,
                zoom: this.defaultZoom
            })
            this.maskLayer.geometry = this.getWholeMaskGeometry()
        },
        async backToWholeFromMaskGz2000() {
            await this.view.goTo({
                center: this.defaultCenter,
                zoom: this.defaultZoom
            })
            this.maskLayer.visible = false
        },

        isHitMask(arr) {
            if (arr.length && arr[0].graphic && arr[0].graphic.hit) {
                return true
            } else {
                return false
            }
        },

    }
}

export default MapMask
