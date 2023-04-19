(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-44c3f768"],{"0ca1":function(e,t,r){"use strict";var s=r("a4ee"),a=(r("c120"),r("e92d"),r("cea0"),r("59b2")),o=r("fa8a"),n=r("d386"),i=(r("e041"),r("8eed"),r("f402"),r("6a0e"));const l=new o["a"]({esriJobMessageTypeInformative:"informative",esriJobMessageTypeProcessDefinition:"process-definition",esriJobMessageTypeProcessStart:"process-start",esriJobMessageTypeProcessStop:"process-stop",esriJobMessageTypeWarning:"warning",esriJobMessageTypeError:"error",esriJobMessageTypeEmpty:"empty",esriJobMessageTypeAbort:"abort"});let c=class extends i["a"]{constructor(e){super(e),this.description=null,this.type=null}};Object(s["a"])([Object(a["b"])({type:String,json:{write:!0}})],c.prototype,"description",void 0),Object(s["a"])([Object(a["b"])({type:String,json:{read:l.read,write:l.write}})],c.prototype,"type",void 0),c=Object(s["a"])([Object(n["a"])("esri.tasks.support.GPMessage")],c);var u=c;t["a"]=u},"3af5":function(e,t,r){"use strict";r.d(t,"a",(function(){return f}));var s=r("a4ee"),a=(r("c120"),r("9d1d")),o=r("b2b2"),n=(r("e92d"),r("cea0"),r("59b2"),r("d386")),i=r("ce50"),l=r("e041"),c=(r("8eed"),r("f402"),r("2eab")),u=r("9209");async function p(e,t){try{const{data:{supportedTravelModes:r,defaultTravelMode:s}}=await Object(c["default"])(e+("/"===e[e.length-1]?"":"/")+"retrieveTravelModes",{query:{f:"json",token:t}});return{supportedTravelModes:r,defaultTravelMode:s}}catch(r){throw new i["a"]("network-service:retrieveTravelModes","Could not get to the NAServer's retrieveTravelModes.",{error:r})}}async function d(e,t){const{data:r}=await Object(c["default"])(e.substring(0,e.indexOf("/rest/")+6)+"info",{query:{f:"json",token:t}});if(!r||!r.owningSystemUrl)return{supportedTravelModes:[],defaultTravelMode:null};e=r.owningSystemUrl;const{data:s}=await Object(c["default"])(e+("/"===e[e.length-1]?"":"/")+"sharing/rest/portals/self",{query:{f:"json",token:t}}),o=Object(a["b"])("helperServices.routingUtilities.url",s);if(!o)return{supportedTravelModes:[],defaultTravelMode:null};const n=Object(l["J"])(e),i=/\/solveClosestFacility$/.test(n.path)?"Route":/\/solveClosestFacility$/.test(n.path)?"ClosestFacility":"ServiceAreas",u=await Object(c["default"])(o+("/"===o[o.length-1]?"":"/")+"GetTravelModes/execute",{query:{f:"json",serviceName:i,token:t}}),p=[];let d=null;if(u&&u.data&&u.data.results&&u.data.results.length){const e=u.data.results;for(const t of e)if("supportedTravelModes"===t.paramName){if(t.value&&t.value.features)for(const{attributes:e}of t.value.features)if(e){const t=JSON.parse(e.TravelMode);p.push(t)}}else"defaultTravelMode"===t.paramName&&(d=t.value)}return{supportedTravelModes:p,defaultTravelMode:d}}const f=e=>{let t=class extends e{async getServiceDescription(e){return this._serviceDescriptionPromise||(this._serviceDescriptionPromise=this._fetchServiceDescription(e)),this._serviceDescriptionPromise}async _fetchServiceDescription(e){if(!this.url||!this.parsedUrl)throw new i["a"]("network-service:missing-url","Url to Network service is missing");const t=this.url,{data:r}=await Object(c["default"])(t,{query:{f:"json",token:e}});r.supportedTravelModes||(r.supportedTravelModes=[]);for(let n=0;n<r.supportedTravelModes.length;n++)r.supportedTravelModes[n].id||(r.supportedTravelModes[n].id=r.supportedTravelModes[n].itemId);const s=r.currentVersion>=10.4?p(t,e):d(t,e),{defaultTravelMode:a,supportedTravelModes:o}=await s;return r.defaultTravelMode=a,r.supportedTravelModes=o,r}_isInputGeometryZAware(e,t){for(let r=0;r<t.length;r++){const s=e[t[r]];if(s&&s.length)for(const e of s)if(Object(o["k"])(e)&&e.hasZ)return!0}return!1}_dropZValuesOffInputGeometry(e,t){for(let r=0;r<t.length;r++){const s=e[t[r]];if(s&&s.length)for(const e of s)e.z=void 0}console.log("The remote Network Analysis service is powered by a network dataset which is not Z-aware.\nZ-coordinates of the input geometry are ignored.")}};return t=Object(s["a"])([Object(n["a"])("esri.tasks.mixins.NAServiceDescription")],t),t};let b=class extends(f(u["a"])){};b=Object(s["a"])([Object(n["a"])("esri.tasks.mixins.NAServiceDescription")],b)},"64a6":function(e,t,r){"use strict";r.d(t,"a",(function(){return w})),r.d(t,"b",(function(){return B})),r.d(t,"c",(function(){return S})),r.d(t,"d",(function(){return N})),r.d(t,"e",(function(){return k}));var s=r("9d1d"),a=r("b2b2"),o=r("ce50"),n=r("2eab"),i=r("bb72"),l=r("a4ee"),c=(r("c120"),r("e92d"),r("cea0"),r("59b2")),u=r("afcf"),p=r("d386"),d=(r("e041"),r("8eed"),r("f402"),r("6a0e")),f=r("8d60"),b=r("f29a"),y=r("e789"),v=r("78a2");let h=class extends d["a"]{constructor(e){super(e),this.directions=null,this.route=null,this.routeName=null,this.stops=null}};Object(l["a"])([Object(c["b"])({type:v["a"],json:{write:!0}})],h.prototype,"directions",void 0),Object(l["a"])([Object(c["b"])({type:f["a"],json:{write:!0}})],h.prototype,"route",void 0),Object(l["a"])([Object(c["b"])({type:String,json:{write:!0}})],h.prototype,"routeName",void 0),Object(l["a"])([Object(c["b"])({type:[f["a"]],json:{write:!0}})],h.prototype,"stops",void 0),h=Object(l["a"])([Object(p["a"])("esri.tasks.support.RouteResult")],h);var m=h,j=m;function g(e){return e&&b["default"].fromJSON(e).features.map(e=>e)}let O=class extends d["a"]{constructor(e){super(e),this.barriers=null,this.messages=null,this.pointBarriers=null,this.polylineBarriers=null,this.polygonBarriers=null,this.routeResults=null}readPointBarriers(e,t){return g(t.barriers||t.pointBarriers)}readPolylineBarriers(e){return g(e)}readPolygonBarriers(e){return g(e)}};Object(l["a"])([Object(c["b"])({aliasOf:"pointBarriers"})],O.prototype,"barriers",void 0),Object(l["a"])([Object(c["b"])({type:[y["a"]]})],O.prototype,"messages",void 0),Object(l["a"])([Object(c["b"])({type:[f["a"]]})],O.prototype,"pointBarriers",void 0),Object(l["a"])([Object(u["a"])("pointBarriers",["barriers","pointBarriers"])],O.prototype,"readPointBarriers",null),Object(l["a"])([Object(c["b"])({type:[f["a"]]})],O.prototype,"polylineBarriers",void 0),Object(l["a"])([Object(u["a"])("polylineBarriers")],O.prototype,"readPolylineBarriers",null),Object(l["a"])([Object(c["b"])({type:[f["a"]]})],O.prototype,"polygonBarriers",void 0),Object(l["a"])([Object(u["a"])("polygonBarriers")],O.prototype,"readPolygonBarriers",null),Object(l["a"])([Object(c["b"])({type:[j]})],O.prototype,"routeResults",void 0),O=Object(l["a"])([Object(p["a"])("esri.tasks.support.RouteResultsContainer")],O);var T=O,M=T;function w(e,t,r,s){s[r]=[t.length,t.length+e.length],e.forEach(e=>{t.push(e.geometry)})}function B(e,t){for(let r=0;r<t.length;r++){const s=e[t[r]];if(s&&s.length)for(const e of s)e.z=void 0}console.log("The remote Network Analysis service is powered by a network dataset which is not Z-aware.\nZ-coordinates of the input geometry are ignored.")}function N(e){const t=[],r=[],{directions:s=[],routes:{features:a=[],spatialReference:o=null}={},stops:{features:n=[],spatialReference:i=null}={},barriers:l,polygonBarriers:c,polylineBarriers:u,messages:p}=e.data,d="esri.tasks.RouteTask.NULL_ROUTE_NAME";let f,b,y=!0;const v=a&&o||n&&i||l&&l.spatialReference||c&&c.spatialReference||u&&u.spatialReference;s.forEach(e=>{t.push(f=e.routeName),r[f]={directions:e}}),a.forEach(e=>{-1===t.indexOf(f=e.attributes.Name)&&(t.push(f),r[f]={}),e.geometry&&(e.geometry.spatialReference=v),r[f].route=e}),n.forEach(e=>{b=e.attributes,-1===t.indexOf(f=b.RouteName||d)&&(t.push(f),r[f]={}),f!==d&&(y=!1),e.geometry&&(e.geometry.spatialReference=v),null==r[f].stops&&(r[f].stops=[]),r[f].stops.push(e)}),n.length>0&&!0===y&&(r[t[0]].stops=r[d].stops,delete r[d],t.splice(t.indexOf(d),1));const h=t.map(e=>(r[e].routeName=e===d?null:e,r[e]));return M.fromJSON({routeResults:h,pointBarriers:l,polygonBarriers:c,polylineBarriers:u,messages:p})}function k(e,t){for(let r=0;r<t.length;r++){const s=e[t[r]];if(s&&s.length)for(const e of s)if(Object(a["k"])(e)&&e.hasZ)return!0}return!1}async function S(e){if(!e)throw new o["a"]("network-service:missing-url","Url to Network service is missing");const{data:t}=await Object(n["default"])(e,{query:{f:"json"}});t.supportedTravelModes||(t.supportedTravelModes=[]);for(let o=0;o<t.supportedTravelModes.length;o++)t.supportedTravelModes[o].id||(t.supportedTravelModes[o].id=t.supportedTravelModes[o].itemId);const r=t.currentVersion>=10.4?x(e):R(e),{defaultTravelMode:s,supportedTravelModes:a}=await r;return t.defaultTravelMode=s,t.supportedTravelModes=a,t}async function R(e){const{data:t}=await Object(n["default"])(e.substring(0,e.indexOf("/rest/")+6)+"info",{query:{f:"json"}});if(!t||!t.owningSystemUrl)return{supportedTravelModes:[],defaultTravelMode:null};e=t.owningSystemUrl;const{data:r}=await Object(n["default"])(e+("/"===e[e.length-1]?"":"/")+"sharing/rest/portals/self",{query:{f:"json"}}),a=Object(s["b"])("helperServices.routingUtilities.url",r);if(!a)return{supportedTravelModes:[],defaultTravelMode:null};const o=Object(i["c"])(e),l=/\/solve$/.test(o.path)?"Route":/\/solveClosestFacility$/.test(o.path)?"ClosestFacility":"ServiceAreas",c=await Object(n["default"])(a+("/"===a[a.length-1]?"":"/")+"GetTravelModes/execute",{query:{f:"json",serviceName:l}}),u=[];let p=null;if(c&&c.data&&c.data.results&&c.data.results.length){const e=c.data.results;for(const t of e)if("supportedTravelModes"===t.paramName){if(t.value&&t.value.features)for(const{attributes:e}of t.value.features)if(e){const t=JSON.parse(e.TravelMode);u.push(t)}}else"defaultTravelMode"===t.paramName&&(p=t.value)}return{supportedTravelModes:u,defaultTravelMode:p}}async function x(e){try{const{data:{supportedTravelModes:t,defaultTravelMode:r}}=await Object(n["default"])(e+("/"===e[e.length-1]?"":"/")+"retrieveTravelModes",{query:{f:"json"}});return{supportedTravelModes:t,defaultTravelMode:r}}catch(t){throw new o["a"]("network-service:retrieveTravelModes","Could not get to the NAServer's retrieveTravelModes.",{error:t})}}},"78a2":function(e,t,r){"use strict";var s=r("a4ee"),a=(r("c120"),r("b2b2")),o=(r("e92d"),r("cea0"),r("59b2")),n=r("afcf"),i=r("d386"),l=(r("e041"),r("8eed"),r("f402"),r("5996")),c=r("4ae5"),u=r("3af1"),p=r("521c"),d=(r("e06a"),r("8d60")),f=r("f29a");let b=class extends f["default"]{constructor(e){super(e),this.extent=null,this.features=null,this.geometryType="polyline",this.routeId=null,this.routeName=null,this.totalDriveTime=null,this.totalLength=null,this.totalTime=null}readFeatures(e,t){(e||[]).forEach(e=>{this._decompressFeatureGeometry(e,t.summary.envelope.spatialReference)});const r=l["a"].fromJSON(t.spatialReference);return e.map(e=>{const t=d["a"].fromJSON(e),s=e.geometry&&e.geometry.spatialReference;return t.geometry&&!s&&(Object(a["q"])(t.geometry).spatialReference=r),t.strings=e.strings,t.events=(e.events||[]).map(t=>{const r=new d["a"]({geometry:new c["a"]({x:t.point.x,y:t.point.y,z:t.point.z,hasZ:void 0!==t.point.z,spatialReference:e.geometry&&e.geometry.spatialReference}),attributes:{ETA:t.ETA,arriveTimeUTC:t.arriveTimeUTC}});return r.strings=t.strings,r}),t})}get mergedGeometry(){if(!this.features)return null;const e=this.features.map(({geometry:e})=>Object(a["q"])(e)),t=this.get("extent.spatialReference");return this._mergePolylinesToSinglePath(e,t)}get strings(){return this.features.map(({strings:e})=>e)}_decompressFeatureGeometry(e,t){e.geometry=this._decompressGeometry(e.compressedGeometry,t)}_decompressGeometry(e,t){let r=0,s=0,a=0,o=0;const n=[];let i,l,c,u,p,d,f,b,y=0,v=0,h=0;if(p=e.match(/((\+|\-)[^\+\-\|]+|\|)/g),p||(p=[]),0===parseInt(p[y],32)){y=2;const e=parseInt(p[y],32);y++,d=parseInt(p[y],32),y++,1&e&&(v=p.indexOf("|")+1,f=parseInt(p[v],32),v++),2&e&&(h=p.indexOf("|",v)+1,b=parseInt(p[h],32),h++)}else d=parseInt(p[y],32),y++;for(;y<p.length&&"|"!==p[y];){i=parseInt(p[y],32)+r,y++,r=i,l=parseInt(p[y],32)+s,y++,s=l;const e=[i/d,l/d];v&&(u=parseInt(p[v],32)+a,v++,a=u,e.push(u/f)),h&&(c=parseInt(p[h],32)+o,h++,o=c,e.push(c/b)),n.push(e)}return{paths:[n],hasZ:v>0,hasM:h>0,spatialReference:t}}_mergePolylinesToSinglePath(e,t){let r=[];(e||[]).forEach(e=>{e.paths.forEach(e=>{r=r.concat(e)})});const s=[];let a=[0,0];return r.forEach(e=>{e[0]===a[0]&&e[1]===a[1]||(s.push(e),a=e)}),new p["a"]({paths:[s]},t)}};Object(s["a"])([Object(o["b"])({type:u["a"],json:{read:{source:"summary.envelope"}}})],b.prototype,"extent",void 0),Object(s["a"])([Object(o["b"])()],b.prototype,"features",void 0),Object(s["a"])([Object(n["a"])("features")],b.prototype,"readFeatures",null),Object(s["a"])([Object(o["b"])()],b.prototype,"geometryType",void 0),Object(s["a"])([Object(o["b"])({readOnly:!0})],b.prototype,"mergedGeometry",null),Object(s["a"])([Object(o["b"])()],b.prototype,"routeId",void 0),Object(s["a"])([Object(o["b"])()],b.prototype,"routeName",void 0),Object(s["a"])([Object(o["b"])({value:null,readOnly:!0})],b.prototype,"strings",null),Object(s["a"])([Object(o["b"])({json:{read:{source:"summary.totalDriveTime"}}})],b.prototype,"totalDriveTime",void 0),Object(s["a"])([Object(o["b"])({json:{read:{source:"summary.totalLength"}}})],b.prototype,"totalLength",void 0),Object(s["a"])([Object(o["b"])({json:{read:{source:"summary.totalTime"}}})],b.prototype,"totalTime",void 0),b=Object(s["a"])([Object(i["a"])("esri.tasks.support.DirectionsFeatureSet")],b);var y=b;t["a"]=y},"98bd":function(e,t,r){"use strict";r.r(t);var s=r("a4ee"),a=(r("c120"),r("e92d"),r("cea0"),r("59b2"),r("d386")),o=(r("e041"),r("8eed"),r("f402"),r("9209")),n=r("2eab"),i=r("a8d5"),l=r("bb72"),c=r("a3a2"),u=r("64a6");const p=Object(c["a"])({accumulateAttributes:{name:"accumulateAttributeNames"},attributeParameterValues:!0,directionsTimeAttribute:{name:"directionsTimeAttributeName"},impedanceAttribute:{name:"impedanceAttributeName"},outSpatialReference:{name:"outSR",getter:e=>e.outSpatialReference.wkid},pointBarriers:{name:"barriers"},polylineBarriers:!0,polygonBarriers:!0,restrictionAttributes:{name:"restrictionAttributeNames"},stops:!0,travelMode:!0});async function d(e,t,r){const s=[],a=[],o={},c={},d=Object(l["c"])(e);return t.stops&&t.stops.features&&Object(u["a"])(t.stops.features,a,"stops.features",o),t.pointBarriers&&t.pointBarriers.features&&Object(u["a"])(t.pointBarriers.features,a,"pointBarriers.features",o),t.polylineBarriers&&t.polylineBarriers.features&&Object(u["a"])(t.polylineBarriers.features,a,"polylineBarriers.features",o),t.polygonBarriers&&t.polygonBarriers.features&&Object(u["a"])(t.polygonBarriers.features,a,"polygonBarriers.features",o),Object(i["a"])(a).then(e=>{for(const t in o){const r=o[t];s.push(t),c[t]=e.slice(r[0],r[1])}return Object(u["e"])(c,s)?Object(u["c"])(d.path):Promise.resolve({dontCheck:!0})}).then(e=>{("dontCheck"in e?e.dontCheck:e.hasZ)||Object(u["b"])(c,s);for(const r in c)c[r].forEach((e,s)=>{t.get(r)[s].geometry=e});const a={...r,query:{...d.query,...p.toQueryParams(t),f:"json"}},{path:o}=d,i="/solve",l=o.endsWith(i)?o:o+i;return Object(n["default"])(l,a)}).then(e=>Object(u["d"])(e))}var f=r("3af5");let b=class extends(Object(f["a"])(o["a"])){constructor(e){super(e)}solve(e,t){return d(this.url,e,t)}};b=Object(s["a"])([Object(a["a"])("esri.tasks.RouteTask")],b);var y=b;t["default"]=y},a3a2:function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));const s=e=>{if(!Array.isArray(e))return!1;const[t]=e;return"number"==typeof t||"string"==typeof t};class a{constructor(e={}){this._options=e}toQueryParams(e){if(!e)return null;const t=e.toJSON(),r={};return Object.keys(t).forEach(e=>{const a=this._options[e];if(a){const o="boolean"!=typeof a&&a.name?a.name:e,n="boolean"!=typeof a&&a.getter?a.getter(t):t[e];null!=n&&(r[o]=s(n)?n.join(","):"object"==typeof n?JSON.stringify(n):n)}else r[e]=t[e]},this),r}}function o(e){return new a(e)}},e789:function(e,t,r){"use strict";var s=r("a4ee"),a=(r("c120"),r("e92d"),r("cea0"),r("59b2")),o=r("fa8a"),n=r("d386"),i=(r("e041"),r("8eed"),r("f402"),r("0ca1"));const l=new o["a"]({0:"informative",1:"process-definition",2:"process-start",3:"process-stop",50:"warning",100:"error",101:"empty",200:"abort"});let c=class extends i["a"]{constructor(e){super(e),this.type=null}};Object(s["a"])([Object(a["b"])({type:String,json:{read:l.read,write:l.write}})],c.prototype,"type",void 0),c=Object(s["a"])([Object(n["a"])("esri.tasks.support.NAMessage")],c);var u=c;t["a"]=u}}]);