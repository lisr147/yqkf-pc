(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-aa6dbf6a","chunk-2d0a2d38"],{"0024":function(e,t,r){"use strict";var n=r("a4ee"),a=(r("c120"),r("e92d"),r("cea0"),r("59b2")),o=r("d386"),i=(r("e041"),r("8eed"),r("f402"),r("6a0e")),s=r("a9ab");let c=class extends i["a"]{constructor(e){super(e),this.geometries=null,this.outSpatialReference=null,this.transformation=null,this.transformForward=null}toJSON(){const e=this.geometries.map((function(e){return e.toJSON()})),t=this.geometries[0],r={};return r.outSR=this.outSpatialReference.wkid||JSON.stringify(this.outSpatialReference.toJSON()),r.inSR=t.spatialReference.wkid||JSON.stringify(t.spatialReference.toJSON()),r.geometries=JSON.stringify({geometryType:Object(s["c"])(t),geometries:e}),this.transformation&&(r.transformation=this.transformation.wkid||JSON.stringify(this.transformation)),null!=this.transformForward&&(r.transformForward=this.transformForward),r}};Object(n["a"])([Object(a["b"])()],c.prototype,"geometries",void 0),Object(n["a"])([Object(a["b"])({json:{read:{source:"outSR"}}})],c.prototype,"outSpatialReference",void 0),Object(n["a"])([Object(a["b"])()],c.prototype,"transformation",void 0),Object(n["a"])([Object(a["b"])()],c.prototype,"transformForward",void 0),c=Object(n["a"])([Object(o["a"])("esri.tasks.support.ProjectParameters")],c);var l=c;t["a"]=l},e2e8:function(e,t,r){"use strict";r.r(t),r.d(t,"create",(function(){return s})),r.d(t,"projectGeometry",(function(){return c}));var n=r("1325"),a=r("ce50"),o=r("0224"),i=r("0024");async function s(e=null,t){if(n["a"].geometryServiceUrl)return new(0,(await r.e("chunk-2d21dff7").then(r.bind(null,"d44e"))).default)({url:n["a"].geometryServiceUrl});if(!e)throw new a["a"]("internal:geometry-service-url-not-configured");let i;if(i="portal"in e?e.portal||o["a"].getDefault():e,await i.load({signal:t}),i.helperServices&&i.helperServices.geometry&&i.helperServices.geometry.url)return new(0,(await r.e("chunk-2d21dff7").then(r.bind(null,"d44e"))).default)({url:i.helperServices.geometry.url});throw new a["a"]("internal:geometry-service-url-not-configured")}async function c(e,t,r=null,n){const o=await s(r,n),c=new i["a"];c.geometries=[e],c.outSpatialReference=t;const l=await o.project(c,{signal:n});if(l&&Array.isArray(l)&&1===l.length)return l[0];throw new a["a"]("internal:geometry-service-projection-failed")}}}]);