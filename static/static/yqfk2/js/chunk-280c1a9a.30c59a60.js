(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-280c1a9a"],{2535:function(e,t,i){"use strict";i.r(t);var s=i("a4ee"),r=(i("c120"),i("e92d")),a=(i("cea0"),i("59b2")),n=i("d386"),o=i("ce50"),h=(i("e041"),i("8eed"),i("f402"),i("f4cc")),c=i("3af1"),l=i("6c7a"),d=i("365a"),p=i("22f4"),u=i("b807");const b=e=>{let t=class extends e{initialize(){this.exportImageParameters=new u["a"]({layer:this.layer})}destroy(){this.exportImageParameters.destroy(),this.exportImageParameters=null}get exportImageVersion(){var e;return null==(e=this.exportImageParameters)||e.commitProperty("version"),this.commitProperty("timeExtent"),(this._get("exportImageVersion")||0)+1}fetchPopupFeatures(e){const{layer:t}=this;if(!e)return Promise.reject(new o["a"]("wmslayerview:fetchPopupFeatures","Nothing to fetch without area",{layer:t}));const{popupEnabled:i}=t;if(!i)return Promise.reject(new o["a"]("wmslayerview:fetchPopupFeatures","popupEnabled should be true",{popupEnabled:i}));const s=this.createFetchPopupFeaturesQuery(e);if(!s)return Promise.resolve([]);const{extent:r,width:a,height:n,x:h,y:c}=s;if(!(r&&a&&n))throw new o["a"]("wmslayerview:fetchPopupFeatures","WMSLayer does not support fetching features.",{extent:r,width:a,height:n});const l=t.fetchFeatureInfo(r,a,n,h,c);return Promise.resolve(l?[l]:[])}};return Object(s["a"])([Object(a["b"])()],t.prototype,"exportImageParameters",void 0),Object(s["a"])([Object(a["b"])({readOnly:!0})],t.prototype,"exportImageVersion",null),Object(s["a"])([Object(a["b"])()],t.prototype,"layer",void 0),Object(s["a"])([Object(a["b"])(p["a"])],t.prototype,"timeExtent",void 0),t=Object(s["a"])([Object(n["a"])("esri.layers.mixins.WMSLayerView")],t),t};var y=i("2d39"),g=i("566d"),m=i("bdb8");const v=r["a"].getLogger("esri.views.2d.layers.WMSLayerView2D");let O=class extends(b(Object(l["a"])(Object(g["a"])(d["a"])))){initialize(){const{layer:e,view:t}=this;e.supportsSpatialReference(t.spatialReference)||this.addResolvingPromise(Promise.reject(new o["a"]("layerview:spatial-reference-incompatible","The spatial references supported by this WMS layer are incompatible with the spatial reference of the view",{layer:e})))}hitTest(){return null}update(e){this.strategy.update(e).catch(e=>{Object(h["m"])(e)||v.error(e)})}attach(){const{layer:e}=this,{imageMaxHeight:t,imageMaxWidth:i}=e;this._bitmapContainer=new y["a"],this.container.addChild(this._bitmapContainer),this.strategy=new m["a"]({container:this._bitmapContainer,fetchSource:this.fetchImage.bind(this),requestUpdate:this.requestUpdate.bind(this),imageMaxHeight:t,imageMaxWidth:i,imageRotationSupported:!1,imageNormalizationSupported:!1,hidpi:!1}),this.handles.add(this.watch("exportImageVersion",()=>this.requestUpdate()),"exportImageVersion")}detach(){this.handles.remove("exportImageVersion"),this.strategy.destroy(),this.container.removeChild(this._bitmapContainer),this._bitmapContainer.removeAllChildren()}moveStart(){}viewChange(){}moveEnd(){this.requestUpdate()}createFetchPopupFeaturesQuery(e){const{view:t}=this,i=this._bitmapContainer,{x:s,y:r}=e,{spatialReference:a}=t;let n=null,o=0,h=0;if(i.children.some(e=>{const{width:t,height:i,resolution:l,x:d,y:p}=e,u=d+l*t,b=p-l*i;return s>=d&&s<=u&&r<=p&&r>=b&&(n=new c["a"]({xmin:d,ymin:b,xmax:u,ymax:p,spatialReference:a}),o=t,h=i,!0)}),!n)return null;const l=n.width/o,d=Math.round((s-n.xmin)/l),p=Math.round((n.ymax-r)/l);return{extent:n,width:o,height:h,x:d,y:p}}async doRefresh(){this.requestUpdate()}isUpdating(){return this.strategy.updating||this.updateRequested}fetchImage(e,t,i,s){return this.layer.fetchImage(e,t,i,{timeExtent:this.timeExtent,timestamp:this.refreshTimestamp,...s})}};Object(s["a"])([Object(a["b"])()],O.prototype,"strategy",void 0),Object(s["a"])([Object(a["b"])()],O.prototype,"updating",void 0),O=Object(s["a"])([Object(n["a"])("esri.views.2d.layers.WMSLayerView2D")],O);var j=O;t["default"]=j},"2d39":function(e,t,i){"use strict";i.d(t,"a",(function(){return n}));var s=i("c84e"),r=i("3b1a"),a=i("9a02");class n extends a["a"]{get requiresDedicatedFBO(){return this.children.some(e=>"additive"===e.blendFunction)}prepareRenderPasses(e){const t=e.registerRenderPass({name:"bitmap",brushes:[r["a"].bitmap],target:()=>this.children,drawPhase:s["c"].MAP});return[...super.prepareRenderPasses(e),t]}}},"365a":function(e,t,i){"use strict";var s=i("a4ee"),r=(i("c120"),i("e92d")),a=(i("cea0"),i("59b2")),n=i("d386"),o=(i("e041"),i("8eed"),i("f402"),i("fc29")),h=i("ce6d"),c=i("a5d83"),l=i("fab3"),d=i("9096");let p=class extends(Object(d["b"])(Object(c["a"])(Object(l["b"])(h["a"].EventedMixin(o["a"]))))){constructor(e){super(e),this.layer=null,this.parent=null}initialize(){this.when().catch(e=>{if("layerview:create-error"!==e.name){const t=this.layer&&this.layer.id||"no id",i=this.layer&&this.layer.title||"no title";throw r["a"].getLogger(this.declaredClass).error("#resolve()",`Failed to resolve layer view (layer title: '${i}', id: '${t}')`,e),e}})}get fullOpacity(){const e=e=>null==e?1:e;return e(this.get("layer.opacity"))*e(this.get("parent.fullOpacity"))}get suspended(){return!this.canResume()}get suspendInfo(){return this.getSuspendInfo()}get legendEnabled(){return!this.suspended&&!0===this.layer.legendEnabled}get updating(){return!!(this.updatingHandles&&this.updatingHandles.updating||this.isUpdating())}get visible(){return!0===this.get("layer.visible")}set visible(e){void 0!==e?this._override("visible",e):this._clearOverride("visible")}canResume(){return!this.get("parent.suspended")&&this.get("view.ready")&&this.get("layer.loaded")&&this.visible||!1}getSuspendInfo(){const e=this.parent&&this.parent.suspended?this.parent.suspendInfo:{},t=this;return t.view&&t.view.ready||(e.viewNotReady=!0),this.layer&&this.layer.loaded||(e.layerNotLoaded=!0),this.visible||(e.layerInvisible=!0),e}isUpdating(){return!1}};Object(s["a"])([Object(a["b"])()],p.prototype,"fullOpacity",null),Object(s["a"])([Object(a["b"])()],p.prototype,"layer",void 0),Object(s["a"])([Object(a["b"])()],p.prototype,"parent",void 0),Object(s["a"])([Object(a["b"])({readOnly:!0})],p.prototype,"suspended",null),Object(s["a"])([Object(a["b"])({readOnly:!0})],p.prototype,"suspendInfo",null),Object(s["a"])([Object(a["b"])({readOnly:!0})],p.prototype,"legendEnabled",null),Object(s["a"])([Object(a["b"])({type:Boolean,readOnly:!0})],p.prototype,"updating",null),Object(s["a"])([Object(a["b"])()],p.prototype,"visible",null),p=Object(s["a"])([Object(n["a"])("esri.views.layers.LayerView")],p);var u=p;t["a"]=u},"566d":function(e,t,i){"use strict";i.d(t,"a",(function(){return E}));var s=i("a4ee"),r=(i("c120"),i("e92d"),i("cea0"),i("59b2")),a=i("d386"),n=(i("e041"),i("8eed"),i("f402"),i("2c4f")),o=i("7d7d"),h=i("3795"),c=i("6a0e");let l=class extends c["a"]{};l=Object(s["a"])([Object(a["a"])("esri.views.layers.support.ClipArea")],l);var d,p=l,u=p;let b=d=class extends u{constructor(){super(...arguments),this.type="rect",this.left=null,this.right=null,this.top=null,this.bottom=null}clone(){return new d({left:this.left,right:this.right,top:this.top,bottom:this.bottom})}get version(){return(this._get("version")||0)+1}};Object(s["a"])([Object(r["b"])({type:[Number,String],json:{write:!0}})],b.prototype,"left",void 0),Object(s["a"])([Object(r["b"])({type:[Number,String],json:{write:!0}})],b.prototype,"right",void 0),Object(s["a"])([Object(r["b"])({type:[Number,String],json:{write:!0}})],b.prototype,"top",void 0),Object(s["a"])([Object(r["b"])({type:[Number,String],json:{write:!0}})],b.prototype,"bottom",void 0),Object(s["a"])([Object(r["b"])({readOnly:!0})],b.prototype,"version",null),b=d=Object(s["a"])([Object(a["a"])("esri.views.layers.support.ClipRect")],b);var y,g=b,m=g,v=i("00c0"),O=i("3760"),j=i("3af1"),f=i("1219"),x=i("a9ab");i("e06a");const w={base:O["a"],key:"type",typeMap:{extent:j["a"],polygon:f["a"]}};let _=y=class extends u{constructor(){super(...arguments),this.type="geometry",this.geometry=null}get version(){return(this._get("version")||0)+1}clone(){return new y({geometry:this.geometry.clone()})}};Object(s["a"])([Object(r["b"])({types:w,json:{read:x["a"],write:!0}})],_.prototype,"geometry",void 0),Object(s["a"])([Object(r["b"])({readOnly:!0})],_.prototype,"version",null),_=y=Object(s["a"])([Object(a["a"])("esri.views.layers.support.Geometry")],_);var R=_,S=R;let M=class extends u{constructor(){super(...arguments),this.type="path",this.path=[]}get version(){return(this._get("version")||0)+1}};Object(s["a"])([Object(r["b"])({type:[[[Number]]],json:{write:!0}})],M.prototype,"path",void 0),Object(s["a"])([Object(r["b"])({readOnly:!0})],M.prototype,"version",null),M=Object(s["a"])([Object(a["a"])("esri.views.layers.support.Path")],M);var P=M,I=P;const q=n["a"].ofType({key:"type",base:u,typeMap:{rect:m,path:I,geometry:S}}),E=e=>{let t=class extends e{constructor(){super(...arguments),this.clips=new q,this.moving=!1,this.attached=!1,this.lastUpdateId=-1,this.updateRequested=!1}initialize(){var e;this.container||(this.container=new v["a"]),this.container.fadeTransitionEnabled=!0,this.container.opacity=0,this.container.clips=this.clips,this.handles.add([Object(h["a"])(this,"suspended",e=>{this.container&&(this.container.visible=!e),this.view&&!e&&this.updateRequested&&this.view.requestUpdate()},!0),Object(h["a"])(this,["layer.opacity","container"],()=>{var e,t;this.container&&(this.container.opacity=null!=(e=null==(t=this.layer)?void 0:t.opacity)?e:1)},!0),Object(h["a"])(this,["layer.blendMode"],e=>{this.container&&(this.container.blendMode=e)},!0),Object(h["a"])(this,["layer.effect"],e=>{this.container&&(this.container.effect=e)},!0),this.clips.on("change",()=>{this.container.clips=this.clips,this.notifyChange("clips")})]),null!=(e=this.view)&&e.whenLayerView?this.view.whenLayerView(this.layer).then(e=>{e!==this||this.attached||this.destroyed||(this.attach(),this.requestUpdate(),this.attached=!0)},()=>{}):this.when().then(()=>{this.attached||this.destroyed||(this.attach(),this.requestUpdate(),this.attached=!0)},()=>{})}destroy(){this.attached&&(this.detach(),this.attached=!1),this.handles.remove("initialize"),this.updateRequested=!1}get updating(){return!this.attached||!this.suspended&&(this.updateRequested||this.isUpdating())}isVisibleAtScale(e){let t=!0;const i=this.layer,s=i.minScale,r=i.maxScale;if(null!=s&&null!=r){let i=!s,a=!r;!i&&e<=s&&(i=!0),!a&&e>=r&&(a=!0),t=i&&a}return t}requestUpdate(){this.destroyed||this.updateRequested||(this.updateRequested=!0,this.suspended||this.view.requestUpdate())}processUpdate(e){!this.isFulfilled()||this.isResolved()?(this._set("updateParameters",e),this.updateRequested&&!this.suspended&&(this.updateRequested=!1,this.update(e))):this.updateRequested=!1}isUpdating(){return!1}isRendering(){return!1}canResume(){return!!super.canResume()&&this.isVisibleAtScale(this.view.scale)}};return Object(s["a"])([Object(r["b"])({type:q,set(e){const t=Object(o["b"])(e,this._get("clips"),q);this._set("clips",t)}})],t.prototype,"clips",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"moving",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"attached",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"container",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"suspended",void 0),Object(s["a"])([Object(r["b"])({readOnly:!0})],t.prototype,"updateParameters",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"updateRequested",void 0),Object(s["a"])([Object(r["b"])()],t.prototype,"updating",null),Object(s["a"])([Object(r["b"])()],t.prototype,"view",void 0),t=Object(s["a"])([Object(a["a"])("esri.views.2d.layers.LayerView2D")],t),t}},"894c":function(e,t,i){"use strict";class s{constructor(e,t,i){this.pixelBlock=e,this.extent=t,this.originalPixelBlock=i}get width(){return this.pixelBlock?this.pixelBlock.width:0}get height(){return this.pixelBlock?this.pixelBlock.height:0}render(e){const t=this.pixelBlock;if(!t)return;const i=this.filter({pixelBlock:t}),s=i.pixelBlock.getAsRGBA(),r=e.createImageData(i.pixelBlock.width,i.pixelBlock.height);r.data.set(s),e.putImageData(r,0,0)}getRenderedRasterPixels(){const e=this.filter({pixelBlock:this.pixelBlock});return{width:e.pixelBlock.width,height:e.pixelBlock.height,renderedRasterPixels:new Uint8Array(e.pixelBlock.getAsRGBA().buffer)}}}t["a"]=s},b807:function(e,t,i){"use strict";i.d(t,"a",(function(){return c}));var s=i("a4ee"),r=(i("c120"),i("e92d"),i("cea0"),i("59b2")),a=i("d386"),n=(i("e041"),i("8eed"),i("f402"),i("fc29")),o=i("9096");const h={visible:"visibleSublayers"};let c=class extends(Object(o["b"])(n["a"])){constructor(e){super(e),this.scale=0}set layer(e){this._get("layer")!==e&&(this._set("layer",e),this.handles.remove("layer"),e&&this.handles.add([e.sublayers.on("change",()=>this.notifyChange("visibleSublayers")),e.on("wms-sublayer-update",e=>this.notifyChange(h[e.propertyName]))],"layer"))}get layers(){const{visibleSublayers:e}=this;return e.filter(e=>e.name).map(e=>e.name).join(",")}get version(){this.commitProperty("layers");const e=this.layer;return e&&e.commitProperty("imageTransparency"),(this._get("version")||0)+1}get visibleSublayers(){const{layer:e,scale:t}=this,i=null==e?void 0:e.sublayers,s=[],r=e=>{const{minScale:i,maxScale:a,sublayers:n,visible:o}=e;o&&(0===t||(0===i||t<=i)&&(0===a||t>=a))&&(n?n.forEach(r):s.unshift(e))};return null==i||i.forEach(r),s}toJSON(){const{layer:e,layers:t}=this,{imageFormat:i,imageTransparency:s,version:r}=e;return{format:i,request:"GetMap",service:"WMS",styles:"",transparent:s,version:r,layers:t}}};Object(s["a"])([Object(r["b"])()],c.prototype,"layer",null),Object(s["a"])([Object(r["b"])({readOnly:!0})],c.prototype,"layers",null),Object(s["a"])([Object(r["b"])({type:Number})],c.prototype,"scale",void 0),Object(s["a"])([Object(r["b"])({readOnly:!0})],c.prototype,"version",null),Object(s["a"])([Object(r["b"])({readOnly:!0})],c.prototype,"visibleSublayers",null),c=Object(s["a"])([Object(a["a"])("esri.layers.support.ExportWMSImageParameters")],c)},bdb8:function(e,t,i){"use strict";var s=i("a4ee"),r=(i("c120"),i("e92d"),i("cea0"),i("59b2")),a=i("d386"),n=(i("e041"),i("8eed"),i("f402"),i("f4cc")),o=i("fc29"),h=i("7f83"),c=i("3af1"),l=i("9180"),d=i("dff3"),p=i("ae54"),u=i("018d");const b=Math.PI/180;function y(e){return e*b}function g(e,t){const i=y(t.rotation),s=Math.abs(Math.cos(i)),r=Math.abs(Math.sin(i)),[a,n]=t.size;return e[0]=Math.round(n*r+a*s),e[1]=Math.round(n*s+a*r),e}function m(e,t,i,s){const[r,a]=t,[n,o]=s,h=.5*i;return e[0]=r-h*n,e[1]=a-h*o,e[2]=r+h*n,e[3]=a+h*o,e}var v=i("c73a");const O=Object(l["g"])(),j=[0,0],f=new p["a"](0,0,0,0),x={container:null,fetchSource:null,requestUpdate:null,imageMaxWidth:2048,imageMaxHeight:2048,imageRotationSupported:!1,imageNormalizationSupported:!1,hidpi:!1};let w=class extends o["a"]{constructor(e){super(e),this._imagePromise=null,this.hidpi=x.hidpi,this.imageMaxWidth=x.imageMaxWidth,this.imageMaxHeight=x.imageMaxHeight,this.imageRotationSupported=x.imageRotationSupported,this.imageNormalizationSupported=x.imageNormalizationSupported,this.update=Object(n["i"])(async(e,t)=>{const i=e.state,s=Object(h["d"])(i.spatialReference),r=this.hidpi?e.pixelRatio:1;if(!e.stationary||this.destroyed)return null;this.imageRotationSupported?(j[0]=i.size[0],j[1]=i.size[1]):g(j,i);const a=Math.floor(j[0]*r)>this.imageMaxWidth||Math.floor(j[1]*r)>this.imageMaxHeight,n=s&&(i.extent.xmin<s.valid[0]||i.extent.xmax>s.valid[1]),o=!this.imageNormalizationSupported&&n,c=!a&&!o,l=this.imageRotationSupported?i.rotation:0;if(c)this._imagePromise=this._singleExport(i,j,l,r,t);else{let e=Math.min(this.imageMaxWidth,this.imageMaxHeight);o&&(e=Math.min(i.worldScreenWidth,e)),this._imagePromise=this._tiledExport(i,e,l,r,t)}return this._imagePromise.then(async e=>{if(this._imagePromise=null,!this.destroyed){for(const t of this.container.children)e.includes(t)||t.fadeOut().then(()=>{t.remove()});for(const t of e)this.container.addChild(t),t.fadeIn()}}).catch(e=>{throw this._imagePromise=null,e})},5e3)}destroy(){}get updating(){return null!==this._imagePromise}updateExports(e){for(const t of this.container.children){if(!t.visible||!t.stage)return;e(t)?console.error("ExportStrategy.updateExports doesn't support promise yet"):(t.invalidateTexture(),t.requestRender())}}_export(e,t,i,s,r,a){return Promise.resolve().then(()=>this.fetchSource(e,Math.floor(t*r),Math.floor(i*r),{rotation:s,pixelRatio:r,signal:a})).then(i=>{const a=new v["a"](i,"additive");return a.x=e.xmin,a.y=e.ymax,a.resolution=e.width/t,a.rotation=s,a.pixelRatio=r,a})}_singleExport(e,t,i,s,r){m(O,e.center,e.resolution,t);const a=new c["a"](O[0],O[1],O[2],O[3],e.spatialReference);return this._export(a,t[0],t[1],i,s,r).then(e=>[e])}_tiledExport(e,t,i,s,r){const a=d["a"].create({size:t,spatialReference:e.spatialReference,scales:[e.scale]}),n=new u["a"](a),o=n.getTileCoverage(e);if(!o)return null;const h=[];return o.forEach((a,o,l,d)=>{f.set(a,o,l,d),n.getTileBounds(O,f);const p=new c["a"](O[0],O[1],O[2],O[3],e.spatialReference);h.push(this._export(p,t,t,i,s,r))}),Promise.all(h)}};Object(s["a"])([Object(r["b"])()],w.prototype,"_imagePromise",void 0),Object(s["a"])([Object(r["b"])()],w.prototype,"container",void 0),Object(s["a"])([Object(r["b"])()],w.prototype,"fetchSource",void 0),Object(s["a"])([Object(r["b"])()],w.prototype,"hidpi",void 0),Object(s["a"])([Object(r["b"])()],w.prototype,"imageMaxWidth",void 0),Object(s["a"])([Object(r["b"])()],w.prototype,"imageMaxHeight",void 0),Object(s["a"])([Object(r["b"])()],w.prototype,"imageRotationSupported",void 0),Object(s["a"])([Object(r["b"])()],w.prototype,"imageNormalizationSupported",void 0),Object(s["a"])([Object(r["b"])()],w.prototype,"requestUpdate",void 0),Object(s["a"])([Object(r["b"])()],w.prototype,"updating",null),w=Object(s["a"])([Object(a["a"])("esri.views.2d.layers.support.ExportStrategy")],w);var _=w;t["a"]=_},c73a:function(e,t,i){"use strict";i.d(t,"a",(function(){return u}));i("c120");var s=i("1c92"),r=i("8c71"),a=i("738e"),n=(i("9f8b"),i("1956"),i("a1ff")),o=(i("d267"),i("7c4b")),h=i("894c");function c(e){return e&&"render"in e}function l(e){return e&&!("render"in e)}function d(e){const t=document.createElement("canvas");return t.width=e.width,t.height=e.height,e.render(t.getContext("2d")),t}function p(e,t,i){const s={target:3553,pixelFormat:6408,internalFormat:6408,dataType:5121,wrapMode:33071};return t&&i&&(s.width=t,s.height=i),new n["a"](e,s)}class u extends o["a"]{constructor(e=null,t,i=!0){super(),this.requestRenderOnSourceChangedEnabled=i,this._textureInvalidated=!0,this.stencilRef=0,this.coordScale=[1,1],this._height=void 0,this.pixelRatio=1,this.resolution=0,this.rotation=0,this._source=null,this._width=void 0,this.x=0,this.y=0,this.transforms={dvs:Object(r["b"])()},this.blendFunction=t,this.source=e,this.requestRender=this.requestRender.bind(this)}destroy(){this._texture&&(this._texture.dispose(),this._texture=null)}get isSourceScaled(){return this.width!==this.sourceWidth||this.height!==this.sourceHeight}get height(){return void 0!==this._height?this._height:this.sourceHeight}set height(e){this._height=e}get source(){return this._source}set source(e){this._source=e,this.invalidateTexture()}get sourceHeight(){return this._source instanceof HTMLImageElement?this._source.naturalHeight:this._source.height}get sourceWidth(){return this._source instanceof HTMLImageElement?this._source.naturalWidth:this._source.width}get width(){return void 0!==this._width?this._width:this.sourceWidth}set width(e){this._width=e}beforeRender(e){super.beforeRender(e),this.updateTexture(e)}invalidateTexture(){this._textureInvalidated||(this._textureInvalidated=!0,this.requestRenderOnSourceChangedEnabled&&this.requestRender())}setTransform(e){const t=Object(s["e"])(this.transforms.dvs),[i,r]=e.toScreenNoRotation([0,0],this.x,this.y),n=this.resolution/this.pixelRatio/e.resolution,o=n*this.width,h=n*this.height,c=Math.PI*this.rotation/180;Object(s["a"])(t,t,Object(a["b"])(i,r)),Object(s["a"])(t,t,Object(a["b"])(o/2,h/2)),Object(s["i"])(t,t,-c),Object(s["a"])(t,t,Object(a["b"])(-o/2,-h/2)),Object(s["f"])(t,t,Object(a["b"])(o,h)),Object(s["g"])(this.transforms.dvs,e.displayViewMat3,t)}setSamplingProfile(e){this._texture&&(e.mips&&!this._texture.descriptor.hasMipmap&&this._texture.generateMipmap(),this._texture.setSamplingMode(e.samplingMode))}bind({context:e},t){this._texture&&e.bindTexture(this._texture,t)}updateTexture({context:e}){var t;if(!this.stage)return null==(t=this._texture)||t.dispose(),void(this._texture=null);if(!this._textureInvalidated)return;this._textureInvalidated=!1,this._texture||(this.source?this._texture=p(e,this.sourceWidth,this.sourceHeight):this._texture=p(e));const i=this.source;if(i){if(this._texture.resize(this.sourceWidth,this.sourceHeight),c(i))if(i instanceof h["a"]){const e=i.getRenderedRasterPixels();this._texture.setData(e.renderedRasterPixels)}else this._texture.setData(d(i));else l(i)&&this._texture.setData(i);this.ready()}else this._texture.setData(null)}onAttach(){this.invalidateTexture()}onDetach(){this.invalidateTexture()}}}}]);