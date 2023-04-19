(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-008dffe5"],{"02b4":function(e,t,i){"use strict";i.r(t);var s=i("a4ee"),r=(i("c120"),i("b2b2")),a=i("e92d"),n=(i("cea0"),i("59b2")),o=i("d386"),h=i("ce50"),l=(i("e041"),i("8eed"),i("f402"),i("f4cc")),c=i("ae54"),u=i("6c7a"),d=i("018d"),p=i("07cd"),b=i("d302e"),f=i("365a"),y=i("e94b"),g=i("536f");const m=e=>{let t=class extends e{async fetchPopupFeatures(e,t){const{layer:i}=this;if(!e)return Promise.reject(new h["a"]("tilelayerview:fetchPopupFeatures","Nothing to fetch without area",{layer:i}));if("tile"!==i.type)return Promise.reject(new h["a"]("tilelayerview:fetchPopupFeatures","Layer type should be 'tile'",{type:i.type}));const s=this.get("view.scale"),a=i.allSublayers.toArray().filter(e=>{const t=0===e.minScale||s<=e.minScale,i=0===e.maxScale||s>=e.maxScale;return e.popupTemplate&&e.popupEnabled&&e.visible&&t&&i});return Object(l["j"])(a.map(async i=>{const s=i.createQuery(),a=Object(r["k"])(t)?t.event:null,n=Object(g["a"])({renderer:i.renderer,event:a});return s.geometry=this.createFetchPopupFeaturesQueryGeometry(e,n),s.outFields=await i.popupTemplate.getRequiredFields(),(await i.queryFeatures(s)).features})).then(e=>[].concat(...e.map(e=>e.value).filter(Boolean)))}};return Object(s["a"])([Object(n["b"])()],t.prototype,"layer",void 0),t=Object(s["a"])([Object(o["a"])("esri.layers.mixins.TileLayerView")],t),t};var v=i("566d"),w=i("164a");const O=a["a"].getLogger("esri.views.2d.layers.TileLayerView2D"),j=[0,0];let _=class extends(m(Object(u["a"])(Object(w["a"])(Object(v["a"])(f["a"]))))){constructor(){super(...arguments),this._tileStrategy=null,this._fetchQueue=null,this.layer=null}initialize(){const e=this.layer.tileInfo,t=e&&e.spatialReference;let i;t||(i=new h["a"]("layerview:tiling-information-missing","The layer doesn't provide tiling information",{layer:this.layer})),t.equals(this.view.spatialReference)||(i=new h["a"]("layerview:spatial-reference-incompatible","The spatial reference of this layer does not meet the requirements of the view",{layer:this.layer})),this.watch("resampling",()=>{this.refresh()}),i&&this.addResolvingPromise(Promise.reject(i))}get resampling(){return!("resampling"in this.layer)||!1!==this.layer.resampling}hitTest(){return null}update(e){this._fetchQueue.pause(),this._fetchQueue.state=e.state,this._tileStrategy.update(e),this._fetchQueue.resume(),this.notifyChange("updating")}attach(){const e="tileServers"in this.layer?this.layer.tileServers:null;this._tileInfoView=new d["a"](this.layer.tileInfo,this.layer.fullExtent),this._fetchQueue=new p["a"]({tileInfoView:this._tileInfoView,concurrency:e&&10*e.length||10,process:(e,t)=>this.fetchTile(e,t)}),this._tileStrategy=new b["a"]({cachePolicy:"keep",resampling:this.resampling,acquireTile:e=>this.acquireTile(e),releaseTile:e=>this.releaseTile(e),tileInfoView:this._tileInfoView}),this.requestUpdate(),this.container.requestRender(),super.attach()}detach(){super.detach(),this._tileStrategy.destroy(),this._fetchQueue.clear(),this.container.removeAllChildren(),this._fetchQueue=this._tileStrategy=this._tileInfoView=null}moveStart(){this.requestUpdate()}viewChange(){this.requestUpdate()}moveEnd(){this.requestUpdate()}createFetchPopupFeaturesQueryGeometry(e,t){return Object(y["a"])(e,t,this.view)}async doRefresh(){this.updateRequested||this.suspended||(this._fetchQueue.reset(),this._tileStrategy.tiles.forEach(e=>this._enqueueTileFetch(e)),this.notifyChange("updating"))}isUpdating(){var e;return(null==(e=this._fetchQueue)?void 0:e.length)>0}acquireTile(e){const t=this._bitmapView.createTile(e),i=t.bitmap;return[i.x,i.y]=this._tileInfoView.getTileCoords(j,t.key),i.resolution=this._tileInfoView.getTileResolution(t.key),[i.width,i.height]=this._tileInfoView.tileInfo.size,this._enqueueTileFetch(t),this._bitmapView.addChild(t),this.requestUpdate(),t}releaseTile(e){this._fetchQueue.abort(e.key.id),this._bitmapView.removeChild(e),e.once("detach",()=>e.destroy()),this.requestUpdate()}async fetchTile(e,t){const i="tilemapCache"in this.layer?this.layer.tilemapCache:null,s=!Object(r["j"])(t)&&t.signal;if(!i)try{return await this._fetchImage(e,s)}catch(d){if(!Object(l["m"])(d)&&!this.resampling)return this._createBlankImage();throw d}const a=new c["a"](0,0,0,0);let n;try{if(await i.fetchAvailabilityUpsample(e.level,e.row,e.col,a,{signal:s}),a.level!==e.level&&!this.resampling)return this._createBlankImage();n=await this._fetchImage(a,s)}catch(d){if(Object(l["m"])(d))throw d;n=await this._fetchImage(e,s)}const{level:o,row:h,col:u}=a;return this.resampling&&o!==e.level?this._resampleImage(n,o,h,u,e.level,e.row,e.col):n}async _enqueueTileFetch(e){if(!this._fetchQueue.has(e.key.id)){try{const t=await this._fetchQueue.push(e.key);e.bitmap.source=t,e.bitmap.width=this._tileInfoView.tileInfo.size[0],e.bitmap.height=this._tileInfoView.tileInfo.size[1],e.once("attach",()=>this.requestUpdate())}catch(t){Object(l["m"])(t)||O.error(t)}this.requestUpdate()}}async _fetchImage(e,t){return this.layer.fetchTile(e.level,e.row,e.col,{timestamp:this.refreshTimestamp,signal:t})}_resampleImage(e,t,i,s,r,a,n){const o=this._tileInfoView.tileInfo.size,h=this._tileInfoView.getTileResolution(t),l=this._tileInfoView.getTileResolution(r);let c=this._tileInfoView.getLODInfoAt(r);const u=c.getXForColumn(n),d=c.getYForRow(a);c=this._tileInfoView.getLODInfoAt(t);const p=c.getXForColumn(s),b=c.getYForRow(i),f=Math.round((u-p)/h),y=Math.round(-(d-b)/h),g=Math.round(o[0]*(l/h)),m=Math.round(o[1]*(l/h)),v=this._createBlankImage();return v.getContext("2d").drawImage(e,f,y,g,m,0,0,o[0],o[1]),v}_createBlankImage(){const e=this._tileInfoView.tileInfo.size,t=document.createElement("canvas");return[t.width,t.height]=e,t}};Object(s["a"])([Object(n["b"])()],_.prototype,"resampling",null),_=Object(s["a"])([Object(o["a"])("esri.views.2d.layers.TileLayerView2D")],_);var x=_;t["default"]=x},"164a":function(e,t,i){"use strict";i.d(t,"a",(function(){return n}));var s=i("a4ee"),r=(i("c120"),i("e92d"),i("cea0"),i("59b2"),i("d386")),a=(i("e041"),i("8eed"),i("f402"),i("e80c"));const n=e=>{let t=class extends e{attach(){this.view.timeline.record(this.layer.title+" (BitmapTileLayer) Attach"),this._bitmapView=new a["a"](this._tileInfoView),this.container.addChild(this._bitmapView)}detach(){this.container.removeChild(this._bitmapView),this._bitmapView.removeAllChildren()}};return t=Object(s["a"])([Object(r["a"])("esri.views.2d.layers.BitmapTileLayerView2D")],t),t}},"365a":function(e,t,i){"use strict";var s=i("a4ee"),r=(i("c120"),i("e92d")),a=(i("cea0"),i("59b2")),n=i("d386"),o=(i("e041"),i("8eed"),i("f402"),i("fc29")),h=i("ce6d"),l=i("a5d83"),c=i("fab3"),u=i("9096");let d=class extends(Object(u["b"])(Object(l["a"])(Object(c["b"])(h["a"].EventedMixin(o["a"]))))){constructor(e){super(e),this.layer=null,this.parent=null}initialize(){this.when().catch(e=>{if("layerview:create-error"!==e.name){const t=this.layer&&this.layer.id||"no id",i=this.layer&&this.layer.title||"no title";throw r["a"].getLogger(this.declaredClass).error("#resolve()",`Failed to resolve layer view (layer title: '${i}', id: '${t}')`,e),e}})}get fullOpacity(){const e=e=>null==e?1:e;return e(this.get("layer.opacity"))*e(this.get("parent.fullOpacity"))}get suspended(){return!this.canResume()}get suspendInfo(){return this.getSuspendInfo()}get legendEnabled(){return!this.suspended&&!0===this.layer.legendEnabled}get updating(){return!!(this.updatingHandles&&this.updatingHandles.updating||this.isUpdating())}get visible(){return!0===this.get("layer.visible")}set visible(e){void 0!==e?this._override("visible",e):this._clearOverride("visible")}canResume(){return!this.get("parent.suspended")&&this.get("view.ready")&&this.get("layer.loaded")&&this.visible||!1}getSuspendInfo(){const e=this.parent&&this.parent.suspended?this.parent.suspendInfo:{},t=this;return t.view&&t.view.ready||(e.viewNotReady=!0),this.layer&&this.layer.loaded||(e.layerNotLoaded=!0),this.visible||(e.layerInvisible=!0),e}isUpdating(){return!1}};Object(s["a"])([Object(a["b"])()],d.prototype,"fullOpacity",null),Object(s["a"])([Object(a["b"])()],d.prototype,"layer",void 0),Object(s["a"])([Object(a["b"])()],d.prototype,"parent",void 0),Object(s["a"])([Object(a["b"])({readOnly:!0})],d.prototype,"suspended",null),Object(s["a"])([Object(a["b"])({readOnly:!0})],d.prototype,"suspendInfo",null),Object(s["a"])([Object(a["b"])({readOnly:!0})],d.prototype,"legendEnabled",null),Object(s["a"])([Object(a["b"])({type:Boolean,readOnly:!0})],d.prototype,"updating",null),Object(s["a"])([Object(a["b"])()],d.prototype,"visible",null),d=Object(s["a"])([Object(n["a"])("esri.views.layers.LayerView")],d);var p=d;t["a"]=p},"536f":function(e,t,i){"use strict";function s(e,t){return t?"xoffset"in t&&t.xoffset?Math.max(e,Math.abs(t.xoffset)):"yoffset"in t&&t.yoffset?Math.max(e,Math.abs(t.yoffset||0)):e:e}function r(e){let t=0,i=0;for(let s=0;s<e.length;s++){const r=e[s].size;"number"==typeof r&&(t+=r,i++)}return t/i}function a(e,t){return"number"==typeof e?e:e&&e.stops&&e.stops.length?r(e.stops):t}function n(e,t){if(!t)return e;const i=t.filter(e=>"size"===e.type).map(t=>{const{maxSize:i,minSize:s}=t;return(a(i,e)+a(s,e))/2});let s=0;const r=i.length;if(0===r)return e;for(let a=0;a<r;a++)s+=i[a];const n=Math.floor(s/r);return Math.max(n,e)}function o(e){const t=e&&e.renderer,i="touch"===(e&&e.event&&e.event.pointerType)?9:6;if(!t)return i;const r="visualVariables"in t?n(i,t.visualVariables):i;if("simple"===t.type)return s(r,t.symbol);if("unique-value"===t.type){let e=r;return t.uniqueValueInfos.forEach(t=>{e=s(e,t.symbol)}),e}if("class-breaks"===t.type){let e=r;return t.classBreakInfos.forEach(t=>{e=s(e,t.symbol)}),e}return t.type,r}i.d(t,"a",(function(){return o}))},"566d":function(e,t,i){"use strict";i.d(t,"a",(function(){return S}));var s=i("a4ee"),r=(i("c120"),i("e92d"),i("cea0"),i("59b2")),a=i("d386"),n=(i("e041"),i("8eed"),i("f402"),i("2c4f")),o=i("7d7d"),h=i("3795"),l=i("6a0e");let c=class extends l["a"]{};c=Object(s["a"])([Object(a["a"])("esri.views.layers.support.ClipArea")],c);var u,d=c,p=d;let b=u=class extends p{constructor(){super(...arguments),this.type="rect",this.left=null,this.right=null,this.top=null,this.bottom=null}clone(){return new u({left:this.left,right:this.right,top:this.top,bottom:this.bottom})}get version(){return(this._get("version")||0)+1}};Object(s["a"])([Object(r["b"])({type:[Number,String],json:{write:!0}})],b.prototype,"left",void 0),Object(s["a"])([Object(r["b"])({type:[Number,String],json:{write:!0}})],b.prototype,"right",void 0),Object(s["a"])([Object(r["b"])({type:[Number,String],json:{write:!0}})],b.prototype,"top",void 0),Object(s["a"])([Object(r["b"])({type:[Number,String],json:{write:!0}})],b.prototype,"bottom",void 0),Object(s["a"])([Object(r["b"])({readOnly:!0})],b.prototype,"version",null),b=u=Object(s["a"])([Object(a["a"])("esri.views.layers.support.ClipRect")],b);var f,y=b,g=y,m=i("00c0"),v=i("3760"),w=i("3af1"),O=i("1219"),j=i("a9ab");i("e06a");const _={base:v["a"],key:"type",typeMap:{extent:w["a"],polygon:O["a"]}};let x=f=class extends p{constructor(){super(...arguments),this.type="geometry",this.geometry=null}get version(){return(this._get("version")||0)+1}clone(){return new f({geometry:this.geometry.clone()})}};Object(s["a"])([Object(r["b"])({types:_,json:{read:j["a"],write:!0}})],x.prototype,"geometry",void 0),Object(s["a"])([Object(r["b"])({readOnly:!0})],x.prototype,"version",null),x=f=Object(s["a"])([Object(a["a"])("esri.views.layers.support.Geometry")],x);var R=x,I=R;let T=class extends p{constructor(){super(...arguments),this.type="path",this.path=[]}get version(){return(this._get("version")||0)+1}};Object(s["a"])([Object(r["b"])({type:[[[Number]]],json:{write:!0}})],T.prototype,"path",void 0),Object(s["a"])([Object(r["b"])({readOnly:!0})],T.prototype,"version",null),T=Object(s["a"])([Object(a["a"])("esri.views.layers.support.Path")],T);var k=T,q=k;const V=n["a"].ofType({key:"type",base:p,typeMap:{rect:g,path:q,geometry:I}}),S=e=>{let t=class extends e{constructor(){super(...arguments),this.clips=new V,this.moving=!1,this.attached=!1,this.lastUpdateId=-1,this.updateRequested=!1}initialize(){var e;this.container||(this.container=new m["a"]),this.container.fadeTransitionEnabled=!0,this.container.opacity=0,this.container.clips=this.clips,this.handles.add([Object(h["a"])(this,"suspended",e=>{this.container&&(this.container.visible=!e),this.view&&!e&&this.updateRequested&&this.view.requestUpdate()},!0),Object(h["a"])(this,["layer.opacity","container"],()=>{var e,t;this.container&&(this.container.opacity=null!=(e=null==(t=this.layer)?void 0:t.opacity)?e:1)},!0),Object(h["a"])(this,["layer.blendMode"],e=>{this.container&&(this.container.blendMode=e)},!0),Object(h["a"])(this,["layer.effect"],e=>{this.container&&(this.container.effect=e)},!0),this.clips.on("change",()=>{this.container.clips=this.clips,this.notifyChange("clips")})]),null!=(e=this.view)&&e.whenLayerView?this.view.whenLayerView(this.layer).then(e=>{e!==this||this.attached||this.destroyed||(this.attach(),this.requestUpdate(),this.attached=!0)},()=>{}):this.when().then(()=>{this.attached||this.destroyed||(this.attach(),this.requestUpdate(),this.attached=!0)},()=>{})}destroy(){this.attached&&(this.detach(),this.attached=!1),this.handles.remove("initialize"),this.updateRequested=!1}get updating(){return!this.attached||!this.suspended&&(this.updateRequested||this.isUpdating())}isVisibleAtScale(e){let t=!0;const i=this.layer,s=i.minScale,r=i.maxScale;if(null!=s&&null!=r){let i=!s,a=!r;!i&&e<=s&&(i=!0),!a&&e>=r&&(a=!0),t=i&&a}return t}requestUpdate(){this.destroyed||this.updateRequested||(this.updateRequested=!0,this.suspended||this.view.requestUpdate())}processUpdate(e){!this.isFulfilled()||this.isResolved()?(this._set("updateParameters",e),this.updateRequested&&!this.suspended&&(this.updateRequested=!1,this.update(e))):this.updateRequested=!1}isUpdating(){return!1}isRendering(){return!1}canResume(){return!!super.canResume()&&this.isVisibleAtScale(this.view.scale)}};return Object(s["a"])([Object(r["b"])({type:V,set(e){const t=Object(o["b"])(e,this._get("clips"),V);this._set("clips",t)}})],t.prototype,"clips",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"moving",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"attached",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"container",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"suspended",void 0),Object(s["a"])([Object(r["b"])({readOnly:!0})],t.prototype,"updateParameters",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"updateRequested",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"updating",null),Object(s["a"])([Object(r["b"])()],t.prototype,"view",void 0),t=Object(s["a"])([Object(a["a"])("esri.views.2d.layers.LayerView2D")],t),t}},6722:function(e,t,i){"use strict";var s=i("c84e"),r=i("6f75"),a=i("ec5e"),n=i("9a02");const o=(e,t)=>e.key.level-t.key.level!=0?e.key.level-t.key.level:e.key.row-t.key.row!=0?e.key.row-t.key.row:e.key.col-t.key.col;class h extends n["a"]{constructor(e){super(),this._tileInfoView=e}get requiresDedicatedFBO(){return!1}renderChildren(e){this.sortChildren(o),this.setStencilReference(),super.renderChildren(e)}createRenderParams(e){const{state:t}=e;return{...super.createRenderParams(e),requiredLevel:this._tileInfoView.getClosestInfoForScale(t.scale).level,displayLevel:this._tileInfoView.tileInfo.scaleToZoom(t.scale)}}prepareRenderPasses(e){const t=e.registerRenderPass({name:"stencil",brushes:[a["a"]],drawPhase:s["c"].DEBUG|s["c"].MAP|s["c"].HIGHLIGHT,target:()=>this.getStencilTarget()}),i=e.registerRenderPass({name:"tileInfo",brushes:[r["a"]],drawPhase:s["c"].DEBUG,target:()=>this.children,has:"esri-tiles-debug"});return[...super.prepareRenderPasses(e),t,i]}getStencilTarget(){return this.children}updateTransforms(e){for(const t of this.children){const i=this._tileInfoView.getTileResolution(t.key);t.setTransform(e,i)}}setStencilReference(){let e=1;for(const t of this.children)t.stencilRef=e++}}t["a"]=h},"894c":function(e,t,i){"use strict";class s{constructor(e,t,i){this.pixelBlock=e,this.extent=t,this.originalPixelBlock=i}get width(){return this.pixelBlock?this.pixelBlock.width:0}get height(){return this.pixelBlock?this.pixelBlock.height:0}render(e){const t=this.pixelBlock;if(!t)return;const i=this.filter({pixelBlock:t}),s=i.pixelBlock.getAsRGBA(),r=e.createImageData(i.pixelBlock.width,i.pixelBlock.height);r.data.set(s),e.putImageData(r,0,0)}getRenderedRasterPixels(){const e=this.filter({pixelBlock:this.pixelBlock});return{width:e.pixelBlock.width,height:e.pixelBlock.height,renderedRasterPixels:new Uint8Array(e.pixelBlock.getAsRGBA().buffer)}}}t["a"]=s},c73a:function(e,t,i){"use strict";i.d(t,"a",(function(){return p}));i("c120");var s=i("1c92"),r=i("8c71"),a=i("738e"),n=(i("9f8b"),i("1956"),i("a1ff")),o=(i("d267"),i("7c4b")),h=i("894c");function l(e){return e&&"render"in e}function c(e){return e&&!("render"in e)}function u(e){const t=document.createElement("canvas");return t.width=e.width,t.height=e.height,e.render(t.getContext("2d")),t}function d(e,t,i){const s={target:3553,pixelFormat:6408,internalFormat:6408,dataType:5121,wrapMode:33071};return t&&i&&(s.width=t,s.height=i),new n["a"](e,s)}class p extends o["a"]{constructor(e=null,t,i=!0){super(),this.requestRenderOnSourceChangedEnabled=i,this._textureInvalidated=!0,this.stencilRef=0,this.coordScale=[1,1],this._height=void 0,this.pixelRatio=1,this.resolution=0,this.rotation=0,this._source=null,this._width=void 0,this.x=0,this.y=0,this.transforms={dvs:Object(r["b"])()},this.blendFunction=t,this.source=e,this.requestRender=this.requestRender.bind(this)}destroy(){this._texture&&(this._texture.dispose(),this._texture=null)}get isSourceScaled(){return this.width!==this.sourceWidth||this.height!==this.sourceHeight}get height(){return void 0!==this._height?this._height:this.sourceHeight}set height(e){this._height=e}get source(){return this._source}set source(e){this._source=e,this.invalidateTexture()}get sourceHeight(){return this._source instanceof HTMLImageElement?this._source.naturalHeight:this._source.height}get sourceWidth(){return this._source instanceof HTMLImageElement?this._source.naturalWidth:this._source.width}get width(){return void 0!==this._width?this._width:this.sourceWidth}set width(e){this._width=e}beforeRender(e){super.beforeRender(e),this.updateTexture(e)}invalidateTexture(){this._textureInvalidated||(this._textureInvalidated=!0,this.requestRenderOnSourceChangedEnabled&&this.requestRender())}setTransform(e){const t=Object(s["e"])(this.transforms.dvs),[i,r]=e.toScreenNoRotation([0,0],this.x,this.y),n=this.resolution/this.pixelRatio/e.resolution,o=n*this.width,h=n*this.height,l=Math.PI*this.rotation/180;Object(s["a"])(t,t,Object(a["b"])(i,r)),Object(s["a"])(t,t,Object(a["b"])(o/2,h/2)),Object(s["i"])(t,t,-l),Object(s["a"])(t,t,Object(a["b"])(-o/2,-h/2)),Object(s["f"])(t,t,Object(a["b"])(o,h)),Object(s["g"])(this.transforms.dvs,e.displayViewMat3,t)}setSamplingProfile(e){this._texture&&(e.mips&&!this._texture.descriptor.hasMipmap&&this._texture.generateMipmap(),this._texture.setSamplingMode(e.samplingMode))}bind({context:e},t){this._texture&&e.bindTexture(this._texture,t)}updateTexture({context:e}){var t;if(!this.stage)return null==(t=this._texture)||t.dispose(),void(this._texture=null);if(!this._textureInvalidated)return;this._textureInvalidated=!1,this._texture||(this.source?this._texture=d(e,this.sourceWidth,this.sourceHeight):this._texture=d(e));const i=this.source;if(i){if(this._texture.resize(this.sourceWidth,this.sourceHeight),l(i))if(i instanceof h["a"]){const e=i.getRenderedRasterPixels();this._texture.setData(e.renderedRasterPixels)}else this._texture.setData(u(i));else c(i)&&this._texture.setData(i);this.ready()}else this._texture.setData(null)}onAttach(){this.invalidateTexture()}onDetach(){this.invalidateTexture()}}},e4b1:function(e,t,i){"use strict";i.d(t,"a",(function(){return o}));i("c120");var s=i("1c92"),r=i("ae54"),a=i("8c71"),n=i("7c4b");class o extends n["a"]{constructor(e,t,i,s=i){super(),this.triangleCountReportedInDebug=0,this.transforms={dvs:Object(a["b"])(),tileMat3:Object(a["b"])()},this.triangleCount=0,this.key=new r["a"](e),this.bounds=t,this.size=i,this.coordRange=s}destroy(){this.texture&&(this.texture.dispose(),this.texture=null)}get coords(){return this._coords}get bounds(){return this._bounds}set bounds(e){this._coords=[e[0],e[3]],this._bounds=e}setTransform(e,t){const i=t/(e.resolution*e.pixelRatio),r=this.transforms.tileMat3,[a,n]=e.toScreenNoRotation([0,0],this.coords),o=this.size[0]/this.coordRange[0]*i,h=this.size[1]/this.coordRange[1]*i;Object(s["j"])(r,o,0,0,0,h,0,a,n,1),Object(s["g"])(this.transforms.dvs,e.displayViewMat3,r)}}},e80c:function(e,t,i){"use strict";i.d(t,"a",(function(){return c}));var s=i("9180"),r=i("c84e"),a=i("3b1a"),n=i("6722"),o=i("e4b1"),h=i("c73a");class l extends o["a"]{constructor(e,t,i,s=null){super(e,t,i,i),this.bitmap=new h["a"](s,"standard",!1),this.bitmap.coordScale=i,this.bitmap.once("isReady",()=>this.ready())}destroy(){super.destroy(),this.bitmap.destroy()}beforeRender(e){super.beforeRender(e),this.bitmap.beforeRender(e)}afterRender(e){super.afterRender(e),this.bitmap.afterRender(e)}set stencilRef(e){this.bitmap.stencilRef=e}get stencilRef(){return this.bitmap.stencilRef}setTransform(e,t){super.setTransform(e,t),this.bitmap.transforms.dvs=this.transforms.dvs}onAttach(){this.bitmap.stage=this.stage}onDetach(){this.bitmap&&(this.bitmap.stage=null)}}class c extends n["a"]{get requiresDedicatedFBO(){return this.children.some(e=>"additive"===e.bitmap.blendFunction)}createTile(e){const t=this._tileInfoView.getTileBounds(Object(s["g"])(),e);return new l(e,t,this._tileInfoView.tileInfo.size)}destroyTile(){}prepareRenderPasses(e){const t=e.registerRenderPass({name:"bitmap (tile)",brushes:[a["a"].bitmap],target:()=>this.children.map(e=>e.bitmap),drawPhase:r["c"].MAP});return[...super.prepareRenderPasses(e),t]}doRender(e){this.visible&&e.drawPhase===r["c"].MAP&&super.doRender(e)}}},e94b:function(e,t,i){"use strict";i.d(t,"a",(function(){return o})),i.d(t,"b",(function(){return h}));var s=i("b2b2"),r=i("3af1"),a=(i("e06a"),i("8048")),n=i("536f");function o(e,t,i,n=new r["a"]){let o;if("2d"===i.type)o=t*i.resolution;else if("3d"===i.type){const r=i.overlayPixelSizeInMapUnits(e),n=i.basemapSpatialReference;o=Object(s["k"])(n)&&!n.equals(i.spatialReference)?Object(a["d"])(n)/Object(a["d"])(i.spatialReference):t*r}const h=e.x-o,l=e.y-o,c=e.x+o,u=e.y+o,{spatialReference:d}=i;return n.xmin=Math.min(h,c),n.ymin=Math.min(l,u),n.xmax=Math.max(h,c),n.ymax=Math.max(l,u),n.spatialReference=d,n}function h(e,t,i){const r=i.toMap(e);return!Object(s["j"])(r)&&o(r,Object(n["a"])(),i,l).intersects(t)}const l=new r["a"]}}]);