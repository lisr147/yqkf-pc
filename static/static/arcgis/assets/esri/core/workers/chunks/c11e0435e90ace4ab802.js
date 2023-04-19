"use strict";(self.webpackChunkRemoteClient=self.webpackChunkRemoteClient||[]).push([[6601],{66601:(e,a,r)=>{r.r(a),r.d(a,{fromUrl:()=>y});var t=r(82058),n=r(60991),l=r(76506),s=r(32101),i=r(21132),o=r(67902);async function y(e){var a;const t=null==(a=e.properties)?void 0:a.customParameters,y=await async function(e,a){let r=(0,i.p)(e);if((0,l.b)(r)&&(r=await async function(e,a){var r;const t=await f(e,a);let n=null,o=null;const y=t.type;if("Feature Layer"===y||"Table"===y?(n="FeatureServer",o=t.id):"indexedVector"===y?n="VectorTileServer":t.hasOwnProperty("mapName")?n="MapServer":t.hasOwnProperty("bandCount")&&t.hasOwnProperty("pixelSizeX")?n="ImageServer":t.hasOwnProperty("maxRecordCount")&&t.hasOwnProperty("allowGeometryUpdates")?n="FeatureServer":t.hasOwnProperty("streamUrls")?n="StreamServer":d(t)?(n="SceneServer",o=t.id):t.hasOwnProperty("layers")&&d(null==(r=t.layers)?void 0:r[0])&&(n="SceneServer"),!n)return null;const u=null!=o?(0,i.f)(e):null;return{title:(0,l.i)(u)&&t.name||(0,s.vt)(e),serverType:n,sublayer:o,url:{path:(0,l.i)(u)?u.serviceUrl:(0,s.mN)(e).path}}}(e,a)),(0,l.b)(r))throw new n.Z("arcgis-layers:url-mismatch","The url '${url}' is not a valid arcgis resource",{url:e});const{serverType:t,sublayer:y}=r;let u;const b={FeatureServer:"FeatureLayer",StreamServer:"StreamLayer",VectorTileServer:"VectorTileLayer"};switch(t){case"MapServer":u=null!=y?"FeatureLayer":async function(e,a){return(await f(e,a)).tileInfo}(e,a).then((e=>e?"TileLayer":"MapImageLayer"));break;case"ImageServer":u=f(e,a).then((e=>{const a=e.tileInfo&&e.tileInfo.format;return e.tileInfo?!a||"LERC"!==a.toUpperCase()||e.cacheType&&"elevation"!==e.cacheType.toLowerCase()?"ImageryTileLayer":"ElevationLayer":"ImageryLayer"}));break;case"SceneServer":u=f(r.url.path,a).then((e=>{if(e){if("Voxel"===(null==e?void 0:e.layerType))return"VoxelLayer";if(null!=e&&e.layers&&Array.isArray(e.layers)&&e.layers.length>0){var a;const r={Point:"SceneLayer","3DObject":"SceneLayer",IntegratedMesh:"IntegratedMeshLayer",PointCloud:"PointCloudLayer",Building:"BuildingSceneLayer"},t=null==(a=e.layers[0])?void 0:a.layerType;if(null!=r[t])return r[t]}}return"SceneLayer"}));break;default:u=b[t]}const h="FeatureServer"===t,w={parsedUrl:r,Constructor:null,layerOrTableId:h?y:null,sublayerIds:null,tableIds:null},m=await u;if({FeatureLayer:!0,SceneLayer:!0}[m]&&null==y){const r=await async function(e,a,r){var t,n;let l,s=!1;if("FeatureServer"===a){const a=await async function(e,a){var r,t;let n=await f(e,a);n=n||{},n.layers=(null==(r=n.layers)?void 0:r.filter(c))||[];const l={serviceJSON:n};if(n.currentVersion<10.5)return l;const s=await f(e+"/layers",a);return l.layersJSON={layers:(null==s||null==(t=s.layers)?void 0:t.filter(c))||[],tables:(null==s?void 0:s.tables)||[]},l}(e,r);s=!!a.layersJSON,l=a.layersJSON||a.serviceJSON}else l=await f(e,r);const i=null==(t=l)?void 0:t.layers,o=null==(n=l)?void 0:n.tables;return{layerIds:(null==i?void 0:i.map((e=>e.id)).reverse())||[],tableIds:(null==o?void 0:o.map((e=>e.id)).reverse())||[],layerInfos:s?i:[],tableInfos:s?o:[]}}(e,t,a);if(h&&(w.sublayerInfos=r.layerInfos,w.tableInfos=r.tableInfos),1!==r.layerIds.length+r.tableIds.length)w.sublayerIds=r.layerIds,w.tableIds=r.tableIds;else if(h){var p,L;w.layerOrTableId=null!=(p=r.layerIds[0])?p:r.tableIds[0],w.sourceJSON=null!=(L=r.layerInfos[0])?L:r.tableInfos[0]}}return w.Constructor=await async function(e){return(0,o.l[e])()}(m),w}(e.url,t),b={...e.properties,url:e.url};if(!y.sublayerIds)return null!=y.layerOrTableId&&(b.layerId=y.layerOrTableId,b.sourceJSON=y.sourceJSON),new y.Constructor(b);const h=new(0,(await Promise.all([r.e(949),r.e(6287)]).then(r.bind(r,1128))).default)({title:y.parsedUrl.title});return function(e,a,r){function t(e,t){const n={...r,layerId:e,sublayerTitleMode:"service-name"};return(0,l.i)(t)&&(n.sourceJSON=t),new a.Constructor(n)}a.sublayerIds.forEach((r=>{const n=t(r,u(a.sublayerInfos,r));e.add(n)})),a.tableIds.forEach((r=>{const n=t(r,u(a.tableInfos,r));e.tables.add(n)}))}(h,y,b),h}function u(e,a){return e?e.find((e=>e.id===a)):null}function d(e){return(null==e?void 0:e.hasOwnProperty("store"))&&e.hasOwnProperty("id")&&"number"==typeof e.id}function c(e){return!e.type||"Feature Layer"===e.type}async function f(e,a){return(await(0,t.default)(e,{responseType:"json",query:{f:"json",...a}})).data}r(31450),r(71552),r(88762),r(92143),r(40642),r(50406),r(38742)},67902:(e,a,r)=>{r.d(a,{l:()=>t});const t={BingMapsLayer:async()=>(await Promise.all([r.e(949),r.e(7963)]).then(r.bind(r,37963))).default,BuildingSceneLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(3505),r.e(8957),r.e(1580),r.e(8640),r.e(4044),r.e(3439)]).then(r.bind(r,3439))).default,CSVLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(3505),r.e(8957),r.e(1580),r.e(8640),r.e(4004)]).then(r.bind(r,44004))).default,ElevationLayer:async()=>(await Promise.all([r.e(1688),r.e(2204)]).then(r.bind(r,72204))).default,FeatureLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(3505),r.e(8957),r.e(1580),r.e(8640),r.e(2163)]).then(r.bind(r,68640))).default,GroupLayer:async()=>(await Promise.all([r.e(949),r.e(1128)]).then(r.bind(r,1128))).default,GeoRSSLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(2197)]).then(r.bind(r,92197))).default,GeoJSONLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(3505),r.e(8957),r.e(9039)]).then(r.bind(r,99039))).default,ImageryLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(1580),r.e(7195),r.e(5214),r.e(7108)]).then(r.bind(r,77108))).default,ImageryTileLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(1623),r.e(1688),r.e(7195),r.e(5214),r.e(4489),r.e(9472)]).then(r.bind(r,79472))).default,IntegratedMeshLayer:async()=>(await Promise.all([r.e(1623),r.e(4044),r.e(1244)]).then(r.bind(r,21244))).default,KMLLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(1903)]).then(r.bind(r,21903))).default,MapImageLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(3505),r.e(3049),r.e(2883),r.e(3706)]).then(r.bind(r,62883))).default,MapNotesLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(1623),r.e(3505),r.e(8957),r.e(1580),r.e(8640),r.e(1135)]).then(r.bind(r,41135))).default,OGCFeatureLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(3505),r.e(8957),r.e(3958)]).then(r.bind(r,63958))).default,OpenStreetMapLayer:async()=>(await Promise.all([r.e(949),r.e(3799),r.e(6043)]).then(r.bind(r,16043))).default,PointCloudLayer:async()=>(await Promise.all([r.e(6748),r.e(4044),r.e(5032)]).then(r.bind(r,25032))).default,RouteLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(1623),r.e(3920),r.e(1892),r.e(5850)]).then(r.bind(r,65850)).then((e=>e.R))).default,SceneLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(3505),r.e(8957),r.e(1580),r.e(8640),r.e(4044),r.e(3741)]).then(r.bind(r,3741))).default,StreamLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(3505),r.e(8957),r.e(8324)]).then(r.bind(r,58324))).default,TileLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(3505),r.e(1688),r.e(3049),r.e(560)]).then(r.bind(r,90611))).default,UnknownLayer:async()=>(await r.e(3117).then(r.bind(r,63117))).default,UnsupportedLayer:async()=>(await r.e(8243).then(r.bind(r,88243))).default,VectorTileLayer:async()=>(await Promise.all([r.e(949),r.e(1688),r.e(5414),r.e(6611),r.e(6491)]).then(r.bind(r,46491))).default,VoxelLayer:async()=>(await Promise.all([r.e(4044),r.e(2241)]).then(r.bind(r,72241))).default,WebTileLayer:async()=>(await Promise.all([r.e(949),r.e(3799)]).then(r.bind(r,3799)).then((e=>e.a))).default,WFSLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(9857),r.e(4057),r.e(208),r.e(1623),r.e(3505),r.e(8957),r.e(4797)]).then(r.bind(r,44797))).default,WMSLayer:async()=>(await Promise.all([r.e(949),r.e(135),r.e(6748),r.e(3561)]).then(r.bind(r,73561))).default,WMTSLayer:async()=>(await Promise.all([r.e(949),r.e(3799),r.e(2790)]).then(r.bind(r,82790))).default}}}]);