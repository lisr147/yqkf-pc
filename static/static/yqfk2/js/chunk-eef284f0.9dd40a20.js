(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-eef284f0"],{"04c4":function(t,e,n){"use strict";n.d(e,"a",(function(){return h}));var i=n("c120"),s=n("ce76");const a=5e4,r={minX:0,minY:0,maxX:0,maxY:0};function o(t,e,n){r.minX=e[0],r.minY=e[1],r.maxX=e[2],r.maxY=e[3],t.search(r,n)}class h{constructor(){this._indexInvalid=!1,this._boundsToLoad=[],this._boundsById=new Map,this._idByBounds=new Map,this._index=new s["a"](9,Object(i["a"])("csp-restrictions")?t=>({minX:t[0],minY:t[1],maxX:t[2],maxY:t[3]}):["[0]","[1]","[2]","[3]"]),this._loadIndex=()=>{if(this._indexInvalid){const t=new Array(this._idByBounds.size);let e=0;this._idByBounds.forEach((n,i)=>{t[e++]=i}),this._indexInvalid=!1,this._index.clear(),this._index.load(t)}else this._boundsToLoad.length&&(this._index.load(this._boundsToLoad.filter(t=>this._idByBounds.has(t))),this._boundsToLoad.length=0)}}clear(){this._indexInvalid=!1,this._boundsToLoad.length=0,this._boundsById.clear(),this._idByBounds.clear(),this._index.clear()}delete(t){const e=this._boundsById.get(t);this._boundsById.delete(t),e&&(this._idByBounds.delete(e),this._indexInvalid||this._index.remove(e))}forEachInBounds(t,e){this._loadIndex(),o(this._index,t,t=>e(this._idByBounds.get(t)))}get(t){return this._boundsById.get(t)}has(t){return this._boundsById.has(t)}invalidateIndex(){this._indexInvalid||(this._indexInvalid=!0,this._boundsToLoad.length=0)}set(t,e){if(!this._indexInvalid){const e=this._boundsById.get(t);e&&(this._index.remove(e),this._idByBounds.delete(e))}this._boundsById.set(t,e),e&&(this._idByBounds.set(e,t),this._indexInvalid||(this._boundsToLoad.push(e),this._boundsToLoad.length>a&&this._loadIndex()))}}},4575:function(t,e,n){"use strict";n.d(e,"a",(function(){return d}));var i=n("7f83"),s=n("3cd6"),a=n("28b1"),r=n("a9ab"),o=n("9180"),h=n("f70f");function d(t){if(!t)return null;if("mesh"===t.type)return t.toJSON();let e=null;const n=t.spatialReference,o=Object(i["d"])(n);if(!o)return t.toJSON();const d=n.isWebMercator?102100:4326,m=h["a"][d].maxX,f=h["a"][d].minX,p=h["a"][d].plus180Line,x=h["a"][d].minus180Line;let b;const _=t.toJSON();if(Object(r["f"])(_))b=u(_,m,f);else if(Object(r["e"])(_))_.points=_.points.map(t=>u(t,m,f)),b=_;else if(Object(r["d"])(_))b=l(_,o);else if(Object(r["g"])(_)||Object(r["h"])(_)){const t=y;Object(a["a"])(t,_);const n={xmin:t[0],ymin:t[1],xmax:t[2],ymax:t[3]},i=Object(h["d"])(n.xmin,f)*(2*m),r=0===i?_:c(_,i);n.xmin+=i,n.xmax+=i,Object(s["a"])(n,p)&&n.xmax!==m||Object(s["a"])(n,x)&&n.xmin!==f?e=r:b=r}else b=t.toJSON();return null!==e?(new g).cut(e,m):b}function c(t,e){const n=Object(h["b"])(t);for(const i of n)for(const t of i)t[0]+=e;return t}function l(t,e){if(!e)return t;const n=m(t,e).map(t=>t.extent);return n.length<2?n[0]||t:n.length>2?(t.xmin=e.valid[0],t.xmax=e.valid[1],t):{rings:n.map(t=>[[t.xmin,t.ymin],[t.xmin,t.ymax],[t.xmax,t.ymax],[t.xmax,t.ymin],[t.xmin,t.ymin]])}}function u(t,e,n){if(Array.isArray(t)){const i=t[0];if(i>e){const n=Object(h["d"])(i,e);t[0]=i+n*(-2*e)}else if(i<n){const e=Object(h["d"])(i,n);t[0]=i+e*(-2*n)}}else{const i=t.x;if(i>e){const n=Object(h["d"])(i,e);t.x+=n*(-2*e)}else if(i<n){const e=Object(h["d"])(i,n);t.x+=e*(-2*n)}}return t}function m(t,e){const n=[],{ymin:i,ymax:s}=t,a=t.xmax-t.xmin,r=t.xmin,o=t.xmax;let h;const[d,c]=e.valid;h=f(t.xmin,e);const l=h.x,u=h.frameId;h=f(t.xmax,e);const m=h.x,x=h.frameId,g=l===m&&a>0;if(a>2*c){const t={xmin:r<o?l:m,ymin:i,xmax:c,ymax:s},e={xmin:d,ymin:i,xmax:r<o?m:l,ymax:s},a={xmin:0,ymin:i,xmax:c,ymax:s},h={xmin:d,ymin:i,xmax:0,ymax:s},f=[],g=[];p(t,a)&&f.push(u),p(t,h)&&g.push(u),p(e,a)&&f.push(x),p(e,h)&&g.push(x);for(let n=u+1;n<x;n++)f.push(n),g.push(n);n.push({extent:t,frameIds:[u]},{extent:e,frameIds:[x]},{extent:a,frameIds:f},{extent:h,frameIds:g})}else l>m||g?n.push({extent:{xmin:l,ymin:i,xmax:c,ymax:s},frameIds:[u]},{extent:{xmin:d,ymin:i,xmax:m,ymax:s},frameIds:[x]}):n.push({extent:{xmin:l,ymin:i,xmax:m,ymax:s},frameIds:[u]});return n}function f(t,e){const[n,i]=e.valid,s=2*i;let a,r=0;return t>i?(a=Math.ceil(Math.abs(t-i)/s),t-=a*s,r=a):t<n&&(a=Math.ceil(Math.abs(t-n)/s),t+=a*s,r=-a),{x:t,frameId:r}}function p(t,e){const{xmin:n,ymin:i,xmax:s,ymax:a}=e;return x(t,n,i)&&x(t,n,a)&&x(t,s,a)&&x(t,s,i)}function x(t,e,n){return e>=t.xmin&&e<=t.xmax&&n>=t.ymin&&n<=t.ymax}class g{cut(t,e){let n;if(t.rings)this.closed=!0,n=t.rings,this.minPts=4;else{if(!t.paths)return null;this.closed=!1,n=t.paths,this.minPts=2}const i=n.length,s=-2*e;for(let a=0;a<i;a++){const t=n[a];if(t&&t.length>=this.minPts){const e=[];for(const n of t)e.push([n[0]+s,n[1]]);n.push(e)}}return this.closed?t.rings=n:t.paths=n,t}}const y=Object(o["g"])()},"59fd":function(t,e,n){"use strict";n.d(e,"a",(function(){return d}));var i=n("e6b53"),s=n("92af"),a=n("43e0");class r extends s["a"]{constructor(t){super({...t,constraint:new a["b"](t.coordinateHelper,t.edgeStart,t.edgeEnd)})}get hints(){return[new i["a"](1,this.constraint.start,this.constraint.end)]}}var o=n("b63c");class h extends s["a"]{constructor(t){super({...t,constraint:new a["d"](t.coordinateHelper,t.targetPoint)})}get hints(){return[new o["a"](this.targetPoint)]}}function d(t,e){switch(t.type){case"edge":return new r({coordinateHelper:e,edgeStart:e.fromPoint(t.start),edgeEnd:e.fromPoint(t.end),targetPoint:e.fromPoint(t.target),objectId:t.objectId});case"vertex":return new h({coordinateHelper:e,targetPoint:e.fromPoint(t.target),objectId:t.objectId})}}},6517:function(t,e,n){"use strict";var i=n("b2b2"),s=n("e92d"),a=n("ce50"),r=n("ce6d"),o=n("9180"),h=n("6655"),d=n("4261"),c=n("04c4"),l=n("9392"),u=n("8152"),m=n("d97e");const f={getObjectId:t=>t.objectId,getAttributes:t=>t.attributes,getAttribute:(t,e)=>t.attributes[e],cloneWithGeometry:(t,e)=>new l["a"](e,t.attributes,null,t.objectId),getGeometry:t=>t.geometry,getCentroid:(t,e)=>(t.centroid||(t.centroid=Object(m["a"])(new u["a"],t.geometry,e.hasZ,e.hasM)),t.centroid)};class p{constructor(t){this.geometryInfo=t,this._boundsStore=new c["a"],this._featuresById=new Map,this._markedIds=new Set,this.events=new r["a"],this.featureAdapter=f}get geometryType(){return this.geometryInfo.geometryType}get hasM(){return this.geometryInfo.hasM}get hasZ(){return this.geometryInfo.hasZ}get numFeatures(){return this._featuresById.size}get fullBounds(){if(!this.numFeatures)return null;const t=Object(o["g"])(o["a"]);return this._featuresById.forEach(e=>{const n=this._boundsStore.get(e.objectId);n&&(t[0]=Math.min(n[0],t[0]),t[1]=Math.min(n[1],t[1]),t[2]=Math.max(n[2],t[2]),t[3]=Math.max(n[3],t[3]))}),t}get storeStatistics(){let t=0;return this._featuresById.forEach(e=>{e.geometry&&e.geometry.coords&&(t+=e.geometry.coords.length)}),{featureCount:this._featuresById.size,vertexCount:t/(this.hasZ?this.hasM?4:3:this.hasM?3:2)}}add(t){this._add(t),this._emitChanged()}addMany(t){for(const e of t)this._add(e);this._emitChanged()}clear(){this._featuresById.clear(),this._boundsStore.clear(),this._emitChanged()}removeById(t){const e=this._featuresById.get(t);return e?(this._remove(e),this._emitChanged(),e):null}removeManyById(t){this._boundsStore.invalidateIndex();for(const e of t){const t=this._featuresById.get(e);t&&this._remove(t)}this._emitChanged()}forEachBounds(t,e,n){for(const i of t){const t=this._boundsStore.get(i.objectId);t&&e(Object(d["k"])(n,t))}}getFeature(t){return this._featuresById.get(t)}has(t){return this._featuresById.has(t)}forEach(t){this._featuresById.forEach(e=>t(e))}forEachInBounds(t,e){this._boundsStore.forEachInBounds(t,t=>{e(this._featuresById.get(t))})}startMarkingUsedFeatures(){this._boundsStore.invalidateIndex(),this._markedIds.clear()}sweep(){let t=!1;this._featuresById.forEach((e,n)=>{this._markedIds.has(n)||(t=!0,this._remove(e))}),this._markedIds.clear(),t&&this._emitChanged()}_emitChanged(){this.events.emit("changed",void 0)}_add(t){if(!t)return;const e=t.objectId;if(null==e)return void s["a"].getLogger("esri.layers.graphics.data.FeatureStore").error(new a["a"]("featurestore:invalid-feature","feature id is missing",{feature:t}));const n=this._featuresById.get(e);let r;if(this._markedIds.add(e),n?(t.displayId=n.displayId,r=this._boundsStore.get(e),this._boundsStore.delete(e)):Object(i["k"])(this.onFeatureAdd)&&this.onFeatureAdd(t),!t.geometry||!t.geometry.coords||!t.geometry.coords.length)return this._boundsStore.set(e,null),void this._featuresById.set(e,t);r=Object(h["r"])(r||Object(o["g"])(),t.geometry,this.geometryInfo.hasZ,this.geometryInfo.hasM),this._boundsStore.set(e,r),this._featuresById.set(e,t)}_remove(t){return Object(i["k"])(this.onFeatureRemove)&&this.onFeatureRemove(t),this._markedIds.delete(t.objectId),this._boundsStore.delete(t.objectId),this._featuresById.delete(t.objectId),t}}e["a"]=p},b234:function(t,e,n){"use strict";n.r(e),n.d(e,"GraphicsSnappingSource",(function(){return B}));var i=n("a4ee"),s=(n("c120"),n("b2b2")),a=(n("e92d"),n("cea0"),n("59b2")),r=n("d386"),o=(n("e041"),n("8eed"),n("f402"),n("b50f")),h=n("f4cc"),d=n("fc29"),c=n("4ae5"),l=n("1219"),u=n("74e2"),m=n("8188"),f=n("9392"),p=n("6655"),x=n("9096"),g=n("6706"),y=n("4575"),b=n("6517"),_=n("6411"),I=n("59fd");let B=class extends(Object(x["b"])(d["a"])){constructor(t){super(t),this.availability=1,this.sources={multipoint:null,point:null,polygon:null,polyline:null},this.loadedWkids=new Set,this.loadedWkts=new Set,this.pendingAdds=[]}get updating(){return this.updatingHandles.updating}get layer(){return this.layerSource.layer}destroy(){const t=this.pendingAdds;this.pendingAdds.length=0;for(const e of t)e.task.abort();this.mapSources(t=>this.destroySource(t))}initialize(){this.handles.add([this.layer.on("graphic-update",t=>this.onGraphicUpdate(t)),this.updatingHandles.addOnCollectionChange(this.layer.graphics,t=>this.onGraphicsChanged(t))]),this.addMany(this.layer.graphics.toArray())}async fetchCandidates(t,e){const n=(await Object(h["k"])(this.mapSources(n=>n.queryEngine.executeQueryForSnapping({point:t.coordinateHelper.toPoint(t.point,new c["a"]).toJSON(),distance:t.distance,types:t.types,query:Object(s["k"])(t.filter)?t.filter.createQuery().toJSON():{where:"1=1"}},e).then(({candidates:t})=>t)))).flat().map(e=>Object(I["a"])(e,t.coordinateHelper));return Object(g["e"])(t.point,n),{candidates:n}}refresh(){}onGraphicUpdate(t){switch(t.property){case"geometry":case"visible":this.remove(t.graphic),this.addMany([t.graphic])}}onGraphicsChanged(t){for(const e of t.removed)this.remove(e);this.addMany(t.added)}addMany(t){const e=[],n=new Map;for(const i of t)Object(s["j"])(i.geometry)||(this.needsInitializeProjection(i.geometry.spatialReference)?(e.push(i.geometry.spatialReference),n.set(i.uid,i)):this.add(i));this.createPendingAdd(e,n)}createPendingAdd(t,e){if(!t.length)return;const n=Object(h["h"])(async n=>{await Object(m["e"])(t.map(t=>({source:t,dest:this.spatialReference})),{signal:n}),this.markLoadedSpatialReferences(t);for(const[,t]of e)this.add(t)});this.updatingHandles.addPromise(n.promise);const i={task:n,graphics:e},s=()=>Object(o["j"])(this.pendingAdds,i);n.promise.then(s,s),this.pendingAdds.push(i)}markLoadedSpatialReferences(t){for(const e of t)null!=e.wkid&&this.loadedWkids.add(e.wkid),null!=e.wkt&&this.loadedWkts.add(e.wkt)}add(t){if(Object(s["j"])(t.geometry)||!t.visible)return;let e=t.geometry;if("mesh"===e.type)return;"extent"===e.type&&(e=l["a"].fromExtent(e));const n=this.ensureSource(e.type);if(Object(s["j"])(n))return;const i=this.createOptimizedFeature(t.uid,e);Object(s["k"])(i)&&n.featureStore.add(i)}needsInitializeProjection(t){return(null==t.wkid||!this.loadedWkids.has(t.wkid))&&(null==t.wkt||!this.loadedWkts.has(t.wkt))&&!Object(m["a"])(t,this.spatialReference)}createOptimizedFeature(t,e){const n=Object(m["i"])(Object(y["a"])(e),this.spatialReference);return n?new f["a"](Object(p["d"])(n,!1,!1),{[j]:t},null,t):null}ensureSource(t){const e=this.sources[t];if(Object(s["k"])(e))return e;const n=this.createSource(t);return this.sources[t]=n,n}createSource(t){const e=u["a"].toJSON(t),n=new b["a"]({geometryType:e,hasZ:!1,hasM:!1});return{featureStore:n,queryEngine:new _["a"]({featureStore:n,fields:[{name:j,type:"esriFieldTypeOID",alias:j}],geometryType:e,hasM:!1,hasZ:!1,objectIdField:j,spatialReference:this.spatialReference,scheduler:Object(s["k"])(this.view)&&"3d"===this.view.type?this.view.resourceController.scheduler:null}),type:t}}remove(t){this.mapSources(e=>this.removeFromSource(e,t));for(const e of this.pendingAdds)e.graphics.delete(t.uid),0===e.graphics.size&&e.task.abort()}removeFromSource(t,e){const n=e.uid;t.featureStore.has(n)&&t.featureStore.removeById(e.uid)}destroySource(t){t.queryEngine.destroy(),this.sources[t.type]=null}mapSources(t){const{point:e,polygon:n,polyline:i,multipoint:a}=this.sources,r=[];return Object(s["k"])(e)&&r.push(t(e)),Object(s["k"])(n)&&r.push(t(n)),Object(s["k"])(i)&&r.push(t(i)),Object(s["k"])(a)&&r.push(t(a)),r}};Object(i["a"])([Object(a["b"])({constructOnly:!0})],B.prototype,"spatialReference",void 0),Object(i["a"])([Object(a["b"])({constructOnly:!0})],B.prototype,"layerSource",void 0),Object(i["a"])([Object(a["b"])({constructOnly:!0})],B.prototype,"view",void 0),Object(i["a"])([Object(a["b"])({readOnly:!0})],B.prototype,"updating",null),Object(i["a"])([Object(a["b"])({readOnly:!0})],B.prototype,"availability",void 0),B=Object(i["a"])([Object(r["a"])("esri.views.interactive.snapping.featureSources.GraphicsSnappingSource")],B);const j="OBJECTID"},ce76:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var i=n("b2b2"),s=n("b50f"),a=n("8a44"),r=n("4637");class o{constructor(t=9,e){this.compareMinX=l,this.compareMinY=u,this.toBBox=function(t){return t},this._maxEntries=Math.max(4,t||9),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),e&&("function"==typeof e?this.toBBox=e:this._initFormat(e)),this.clear()}destroy(){this.clear(),_.prune(),I.prune(),B.prune(),j.prune()}all(t){this._all(this.data,t)}search(t,e){let n=this.data;const i=this.toBBox;if(y(t,n))for(_.clear();n;){for(let s=0,a=n.children.length;s<a;s++){const a=n.children[s],r=n.leaf?i(a):a;y(t,r)&&(n.leaf?e(a):g(t,r)?this._all(a,e):_.push(a))}n=_.pop()}}collides(t){let e=this.data;const n=this.toBBox;if(!y(t,e))return!1;for(_.clear();e;){for(let i=0,s=e.children.length;i<s;i++){const s=e.children[i],a=e.leaf?n(s):s;if(y(t,a)){if(e.leaf||g(t,a))return!0;_.push(s)}}e=_.pop()}return!1}load(t){if(!t.length)return this;if(t.length<this._minEntries){for(let e=0,n=t.length;e<n;e++)this.insert(t[e]);return this}let e=this._build(t.slice(0,t.length),0,t.length-1,0);if(this.data.children.length)if(this.data.height===e.height)this._splitRoot(this.data,e);else{if(this.data.height<e.height){const t=this.data;this.data=e,e=t}this._insert(e,this.data.height-e.height-1,!0)}else this.data=e;return this}insert(t){return t&&this._insert(t,this.data.height-1),this}clear(){return this.data=new M([]),this}remove(t){if(!t)return this;let e,n=this.data,a=null,r=0,o=!1;const h=this.toBBox(t);for(B.clear(),j.clear();n||B.length>0;){var d;if(n||(n=Object(i["d"])(B.pop()),a=B.data[B.length-1],r=null!=(d=j.pop())?d:0,o=!0),n.leaf&&(e=Object(s["e"])(n.children,t,n.children.length,n.indexHint),-1!==e))return n.children.splice(e,1),B.push(n),this._condense(B),this;o||n.leaf||!g(n,h)?a?(r++,n=a.children[r],o=!1):n=null:(B.push(n),j.push(r),r=0,a=n,n=n.children[0])}return this}toJSON(){return this.data}fromJSON(t){return this.data=t,this}_all(t,e){let n=t;for(I.clear();n;){var i;if(!0===n.leaf)for(const t of n.children)e(t);else I.pushArray(n.children);n=null!=(i=I.pop())?i:null}}_build(t,e,n,i){const s=n-e+1;let a=this._maxEntries;if(s<=a){const i=new M(t.slice(e,n+1));return h(i,this.toBBox),i}i||(i=Math.ceil(Math.log(s)/Math.log(a)),a=Math.ceil(s/a**(i-1)));const r=new w([]);r.height=i;const o=Math.ceil(s/a),d=o*Math.ceil(Math.sqrt(a));b(t,e,n,d,this.compareMinX);for(let h=e;h<=n;h+=d){const e=Math.min(h+d-1,n);b(t,h,e,o,this.compareMinY);for(let n=h;n<=e;n+=o){const s=Math.min(n+o-1,e);r.children.push(this._build(t,n,s,i-1))}}return h(r,this.toBBox),r}_chooseSubtree(t,e,n,i){for(;i.push(e),!0!==e.leaf&&i.length-1!==n;){let n,i=1/0,s=1/0;for(let a=0,r=e.children.length;a<r;a++){const r=e.children[a],o=m(r),h=p(t,r)-o;h<s?(s=h,i=o<i?o:i,n=r):h===s&&o<i&&(i=o,n=r)}e=n||e.children[0]}return e}_insert(t,e,n){const i=this.toBBox,s=n?t:i(t);B.clear();const a=this._chooseSubtree(s,this.data,e,B);for(a.children.push(t),c(a,s);e>=0&&B.data[e].children.length>this._maxEntries;)this._split(B,e),e--;this._adjustParentBBoxes(s,B,e)}_split(t,e){const n=t.data[e],i=n.children.length,s=this._minEntries;this._chooseSplitAxis(n,s,i);const a=this._chooseSplitIndex(n,s,i);if(!a)return void console.log("  Error: assertion failed at PooledRBush._split: no valid split index");const r=n.children.splice(a,n.children.length-a),o=n.leaf?new M(r):new w(r);o.height=n.height,h(n,this.toBBox),h(o,this.toBBox),e?t.data[e-1].children.push(o):this._splitRoot(n,o)}_splitRoot(t,e){this.data=new w([t,e]),this.data.height=t.height+1,h(this.data,this.toBBox)}_chooseSplitIndex(t,e,n){let i,s,a;i=s=1/0;for(let r=e;r<=n-e;r++){const e=d(t,0,r,this.toBBox),o=d(t,r,n,this.toBBox),h=x(e,o),c=m(e)+m(o);h<i?(i=h,a=r,s=c<s?c:s):h===i&&c<s&&(s=c,a=r)}return a}_chooseSplitAxis(t,e,n){const i=t.leaf?this.compareMinX:l,s=t.leaf?this.compareMinY:u;this._allDistMargin(t,e,n,i)<this._allDistMargin(t,e,n,s)&&t.children.sort(i)}_allDistMargin(t,e,n,i){t.children.sort(i);const s=this.toBBox,a=d(t,0,e,s),r=d(t,n-e,n,s);let o=f(a)+f(r);for(let h=e;h<n-e;h++){const e=t.children[h];c(a,t.leaf?s(e):e),o+=f(a)}for(let h=n-e-1;h>=e;h--){const e=t.children[h];c(r,t.leaf?s(e):e),o+=f(r)}return o}_adjustParentBBoxes(t,e,n){for(let i=n;i>=0;i--)c(e.data[i],t)}_condense(t){for(let e=t.length-1;e>=0;e--){const n=t.data[e];if(0===n.children.length)if(e>0){const i=t.data[e-1],a=i.children;a.splice(Object(s["e"])(a,n,a.length,i.indexHint),1)}else this.clear();else h(n,this.toBBox)}}_initFormat(t){const e=["return a"," - b",";"];this.compareMinX=new Function("a","b",e.join(t[0])),this.compareMinY=new Function("a","b",e.join(t[1])),this.toBBox=new Function("a","return {minX: a"+t[0]+", minY: a"+t[1]+", maxX: a"+t[2]+", maxY: a"+t[3]+"};")}}function h(t,e){d(t,0,t.children.length,e,t)}function d(t,e,n,i,s){s||(s=new M([])),s.minX=1/0,s.minY=1/0,s.maxX=-1/0,s.maxY=-1/0;for(let a,r=e;r<n;r++)a=t.children[r],c(s,t.leaf?i(a):a);return s}function c(t,e){t.minX=Math.min(t.minX,e.minX),t.minY=Math.min(t.minY,e.minY),t.maxX=Math.max(t.maxX,e.maxX),t.maxY=Math.max(t.maxY,e.maxY)}function l(t,e){return t.minX-e.minX}function u(t,e){return t.minY-e.minY}function m(t){return(t.maxX-t.minX)*(t.maxY-t.minY)}function f(t){return t.maxX-t.minX+(t.maxY-t.minY)}function p(t,e){return(Math.max(e.maxX,t.maxX)-Math.min(e.minX,t.minX))*(Math.max(e.maxY,t.maxY)-Math.min(e.minY,t.minY))}function x(t,e){const n=Math.max(t.minX,e.minX),i=Math.max(t.minY,e.minY),s=Math.min(t.maxX,e.maxX),a=Math.min(t.maxY,e.maxY);return Math.max(0,s-n)*Math.max(0,a-i)}function g(t,e){return t.minX<=e.minX&&t.minY<=e.minY&&e.maxX<=t.maxX&&e.maxY<=t.maxY}function y(t,e){return e.minX<=t.maxX&&e.minY<=t.maxY&&e.maxX>=t.minX&&e.maxY>=t.minY}function b(t,e,n,s,a){const o=[e,n];for(;o.length;){const e=Object(i["d"])(o.pop()),n=Object(i["d"])(o.pop());if(e-n<=s)continue;const h=n+Math.ceil((e-n)/s/2)*s;Object(r["a"])(t,h,n,e,a),o.push(n,h,h,e)}}const _=new a["a"],I=new a["a"],B=new a["a"],j=new a["a"]({deallocator:void 0});class O{constructor(){this.minX=1/0,this.minY=1/0,this.maxX=-1/0,this.maxY=-1/0}}class v extends O{constructor(){super(...arguments),this.height=1,this.indexHint=new s["a"]}}class M extends v{constructor(t){super(),this.children=t,this.leaf=!0}}class w extends v{constructor(t){super(),this.children=t,this.leaf=!1}}}}]);