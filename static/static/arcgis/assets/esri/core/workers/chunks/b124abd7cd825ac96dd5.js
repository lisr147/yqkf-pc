"use strict";(self.webpackChunkRemoteClient=self.webpackChunkRemoteClient||[]).push([[332],{60332:(e,n,t)=>{t.r(n),t.d(n,{registerFunctions:()=>y});var r=t(1886),i=t(97944),a=t(61146),l=t(72256),s=t(50406),o=t(72274),f=t(68640),u=t(97546);function c(e,n,t){const r=e.getVariables();if(r.length>0){const i=[];for(let e=0;e<r.length;e++){const a={name:r[e]};i.push(n.evaluateIdentifier(t,a))}return(0,s.$6)(i).then((n=>{const t={};for(let e=0;e<r.length;e++)t[r[e]]=n[e];return e.parameters=t,e}))}return(0,s.DB)(e)}function d(e,n,t=null){for(const t in e)if(t.toLowerCase()===n.toLowerCase())return e[t];return t}function p(e){if(null===e)return null;const n={type:d(e,"type",""),name:d(e,"name","")};if("range"===n.type)n.range=d(e,"range",[]);else{n.codedValues=[];for(const t of d(e,"codedValues",[]))n.codedValues.push({name:d(t,"name",""),code:d(t,"code",null)})}return n}function m(e){if(null===e)return null;const n={},t=d(e,"wkt",null);null!==t&&(n.wkt=t);const r=d(e,"wkid",null);return null!==r&&(n.wkid=r),n}function h(e){if(null===e)return null;const n={hasZ:d(e,"hasz",!1),hasM:d(e,"hasm",!1)},t=d(e,"spatialreference",null);t&&(n.spatialReference=m(t));const r=d(e,"x",null);if(null!==r)return n.x=r,n.y=d(e,"y",null),n;const i=d(e,"rings",null);if(null!==i)return n.rings=i,n;const a=d(e,"paths",null);if(null!==a)return n.paths=a,n;const l=d(e,"points",null);if(null!==l)return n.points=l,n;for(const t of["xmin","xmax","ymin","ymax","zmin","zmax","mmin","mmax"]){const r=d(e,t,null);null!==r&&(n[t]=r)}return n}function y(e){"async"===e.mode&&(e.functions.getuser=function(n,t){return e.standardFunctionAsync(n,t,((e,t,l)=>{(0,a.p)(l,1,2);let s=(0,a.n)(l[1],""),o=!0===s;if(s=!0===s||!1===s?"":(0,a.h)(s),l[0]instanceof r.l){let e=null;return n.services&&n.services.portal&&(e=n.services.portal),e=(0,i.g)(l[0],e),(0,i.l)(e,s,o).then((e=>{if(e){const n=JSON.parse(JSON.stringify(e));for(const e of["lastLogin","created","modified"])void 0!==n[e]&&null!==n[e]&&(n[e]=new Date(n[e]));return r.F.convertObjectToArcadeDictionary(n)}return null}))}let f=null;if((0,a.R)(l[0])&&(f=l[0]),f)return o=!1,s?null:f.load().then((()=>f.getOwningSystemUrl())).then((e=>{if(!e)return s?null:f.getIdentityUser().then((e=>e?r.F.convertObjectToArcadeDictionary({username:e}):null));let t=null;return n.services&&n.services.portal&&(t=n.services.portal),t=(0,i.g)(new r.l(e),t),(0,i.l)(t,s,o).then((e=>{if(e){const n=JSON.parse(JSON.stringify(e));for(const e of["lastLogin","created","modified"])void 0!==n[e]&&null!==n[e]&&(n[e]=new Date(n[e]));return r.F.convertObjectToArcadeDictionary(n)}return null}))}));throw new Error("Invalid Parameter")}))},e.signatures.push({name:"getuser",min:"1",max:"2"}),e.functions.featuresetbyid=function(n,t){return e.standardFunctionAsync(n,t,((e,n,t)=>{if((0,a.p)(t,2,4),t[0]instanceof i.F){const e=(0,a.h)(t[1]);let n=(0,a.n)(t[2],null);const r=(0,a.g)((0,a.n)(t[3],!0));if(null===n&&(n=["*"]),!1===(0,a.l)(n))throw new Error("Invalid Parameter");return t[0].featureSetById(e,r,n)}throw new Error("Invalid Parameter")}))},e.signatures.push({name:"featuresetbyid",min:"2",max:"4"}),e.functions.getfeatureset=function(n,t){return e.standardFunctionAsync(n,t,((e,t,r)=>{if((0,a.p)(r,1,2),(0,a.J)(r[0])){let e=(0,a.n)(r[1],"datasource");return null===e&&(e="datasource"),e=(0,a.h)(e).toLowerCase(),(0,i.c)(r[0].fullSchema(),e,n.lrucache,n.interceptor,n.spatialReference)}throw new Error("Invalid Parameter")}))},e.signatures.push({name:"getfeatureset",min:"1",max:"2"}),e.functions.featuresetbyportalitem=function(n,t){return e.standardFunctionAsync(n,t,((e,t,l)=>{if((0,a.p)(l,2,5),null===l[0])throw new Error("Portal is required");if(l[0]instanceof r.l){const e=(0,a.h)(l[1]),t=(0,a.h)(l[2]);let r=(0,a.n)(l[3],null);const s=(0,a.g)((0,a.n)(l[4],!0));if(null===r&&(r=["*"]),!1===(0,a.l)(r))throw new Error("Invalid Parameter");let o=null;return n.services&&n.services.portal&&(o=n.services.portal),o=(0,i.g)(l[0],o),(0,i.a)(e,t,n.spatialReference,r,s,o,n.lrucache,n.interceptor)}if(!1===(0,a.b)(l[0]))throw new Error("Portal is required");const s=(0,a.h)(l[0]),o=(0,a.h)(l[1]);let f=(0,a.n)(l[2],null);const u=(0,a.g)((0,a.n)(l[3],!0));if(null===f&&(f=["*"]),!1===(0,a.l)(f))throw new Error("Invalid Parameter");if(n.services&&n.services.portal)return(0,i.a)(s,o,n.spatialReference,f,u,n.services.portal,n.lrucache,n.interceptor);throw new Error("Portal is required")}))},e.signatures.push({name:"featuresetbyportalitem",min:"2",max:"5"}),e.functions.featuresetbyname=function(n,t){return e.standardFunctionAsync(n,t,((e,n,t)=>{if((0,a.p)(t,2,4),t[0]instanceof i.F){const e=(0,a.h)(t[1]);let n=(0,a.n)(t[2],null);const r=(0,a.g)((0,a.n)(t[3],!0));if(null===n&&(n=["*"]),!1===(0,a.l)(n))throw new Error("Invalid Parameter");return t[0].featureSetByName(e,r,n)}throw new Error("Invalid Parameter")}))},e.signatures.push({name:"featuresetbyname",min:"2",max:"4"}),e.functions.featureset=function(n,t){return e.standardFunction(n,t,((e,t,l)=>{(0,a.p)(l,1,1);let s=l[0];const o={layerDefinition:{geometryType:"",objectIdField:"",globalIdField:"",typeIdField:"",fields:[]},featureSet:{geometryType:"",features:[]}};if((0,a.b)(s))s=JSON.parse(s),void 0!==s.layerDefinition?(o.layerDefinition=s.layerDefinition,o.featureSet=s.featureSet,s.layerDefinition.spatialReference&&(o.layerDefinition.spatialReference=s.layerDefinition.spatialReference)):(o.featureSet.features=s.features,o.featureSet.geometryType=s.geometryType,o.layerDefinition.geometryType=o.featureSet.geometryType,o.layerDefinition.objectIdField=s.objectIdFieldName,o.layerDefinition.typeIdField=s.typeIdFieldName,o.layerDefinition.globalIdField=s.globalIdFieldName,o.layerDefinition.fields=s.fields,s.spatialReference&&(o.layerDefinition.spatialReference=s.spatialReference));else{if(!(l[0]instanceof r.F))throw new Error("Invalid Parameter");{s=JSON.parse(l[0].castToText());const e=d(s,"layerdefinition");if(null!==e){o.layerDefinition.geometryType=d(e,"geometrytype",""),o.featureSet.geometryType=o.layerDefinition.geometryType,o.layerDefinition.globalIdField=d(e,"globalidfield",""),o.layerDefinition.objectIdField=d(e,"objectidfield",""),o.layerDefinition.typeIdField=d(e,"typeidfield","");const n=d(e,"spatialreference",null);n&&(o.layerDefinition.spatialReference=m(n));for(const n of d(e,"fields",[])){const e={name:d(n,"name",""),alias:d(n,"alias",""),type:d(n,"type",""),nullable:d(n,"nullable",!0),editable:d(n,"editable",!0),length:d(n,"length",null),domain:p(d(n,"domain"))};o.layerDefinition.fields.push(e)}const t=d(s,"featureset",null);if(t){const e={};for(const n of o.layerDefinition.fields)e[n.name.toLowerCase()]=n.name;for(const n of d(t,"features",[])){const t={},r=d(n,"attributes",{});for(const n in r)t[e[n.toLowerCase()]]=r[n];o.featureSet.features.push({attributes:t,geometry:h(d(n,"geometry",null))})}}}else{o.layerDefinition.geometryType=d(s,"geometrytype",""),o.featureSet.geometryType=o.layerDefinition.geometryType,o.layerDefinition.objectIdField=d(s,"objectidfieldname",""),o.layerDefinition.typeIdField=d(s,"typeidfieldname","");const e=d(s,"spatialreference",null);e&&(o.layerDefinition.spatialReference=m(e));for(const e of d(s,"fields",[])){const n={name:d(e,"name",""),alias:d(e,"alias",""),type:d(e,"type",""),nullable:d(e,"nullable",!0),editable:d(e,"editable",!0),length:d(e,"length",null),domain:p(d(e,"domain"))};o.layerDefinition.fields.push(n)}const n={};for(const e of o.layerDefinition.fields)n[e.name.toLowerCase()]=e.name;for(const e of d(s,"features",[])){const t={},r=d(e,"attributes",{});for(const e in r)t[n[e.toLowerCase()]]=r[e];o.featureSet.features.push({attributes:t,geometry:h(d(e,"geometry",null))})}}}}if(0==(!!(f=o).layerDefinition&&!!f.featureSet&&!1!==function(e,n){for(const n of["","esriGeometryPoint","esriGeometryPolyline","esriGeometryPolygon","esriGeometryMultipoint","esriGeometryEnvelope"])if(n===e)return!0;return!1}(f.layerDefinition.geometryType)&&null!==f.layerDefinition.objectIdField&&""!==f.layerDefinition.objectIdField&&!1!==(0,a.l)(f.layerDefinition.fields)&&!1!==(0,a.l)(f.featureSet.features)))throw new Error("Invalid Parameter");var f;return i.b.create(o,n.spatialReference)}))},e.signatures.push({name:"featureset",min:"1",max:"1"}),e.functions.filter=function(n,t){return e.standardFunctionAsync(n,t,((t,r,l)=>{if((0,a.p)(l,2,2),(0,a.l)(l[0])||(0,a.o)(l[0])){const t=[];let r=l[0];r instanceof a.I&&(r=r.toArray());let i=null;if(l[1]instanceof a.F)i=e.arcadeCustomFunctionHandler(l[1]);else if(l[1]instanceof a.N)i=(...e)=>l[1].fn(n,{preparsed:!0,arguments:e});else{if(!(l[1]instanceof a.S))throw new Error("Invalid Parameter");i=(...e)=>{if(e.length!==l[1].paramCount)throw new Error("Invalid parameters");return l[1].fn(...e)}}return r.reduce(((e,n,a)=>e.then((e=>{a>0&&!0===e&&t.push(r[a-1]);const l=i(n);return(0,s.y8)(l)?l:(0,s.DB)(l)}))),Promise.resolve(!1)).then((e=>(!0===e&&r.length>0&&t.push(r[r.length-1]),t)))}return(0,a.R)(l[0])?l[0].load().then((t=>{const r=o.WhereClause.create(l[1],t.getFieldsIndex()),a=r.getVariables();if(a.length>0){const t=[];for(let r=0;r<a.length;r++){const i={name:a[r]};t.push(e.evaluateIdentifier(n,i))}return(0,s.$6)(t).then((e=>{const n={};for(let t=0;t<a.length;t++)n[a[t]]=e[t];return r.parameters=n,new i.d({parentfeatureset:l[0],whereclause:r})}))}return(0,s.DB)(new i.d({parentfeatureset:l[0],whereclause:r}))})):e.failDefferred("Filter cannot accept this parameter type")}))},e.signatures.push({name:"filter",min:"2",max:"2"}),e.functions.orderby=function(n,t){return e.standardFunctionAsync(n,t,((n,t,r)=>{if((0,a.p)(r,2,2),(0,a.R)(r[0])){const e=new i.O(r[1]);return(0,s.DB)(new i.e({parentfeatureset:r[0],orderbyclause:e}))}return e.failDefferred("Order cannot accept this parameter type")}))},e.signatures.push({name:"orderby",min:"2",max:"2"}),e.functions.top=function(n,t){return e.standardFunctionAsync(n,t,((n,t,r)=>((0,a.p)(r,2,2),(0,a.R)(r[0])?(0,s.DB)(new i.T({parentfeatureset:r[0],topnum:r[1]})):(0,a.l)(r[0])?(0,a.f)(r[1])>=r[0].length?r[0].slice(0):r[0].slice(0,(0,a.f)(r[1])):(0,a.o)(r[0])?(0,a.f)(r[1])>=r[0].length()?r[0].slice(0):r[0].slice(0,(0,a.f)(r[1])):e.failDefferred("Top cannot accept this parameter type"))))},e.signatures.push({name:"top",min:"2",max:"2"}),e.functions.first=function(n,t){return e.standardFunctionAsync(n,t,((e,n,t)=>((0,a.p)(t,1,1),(0,a.R)(t[0])?t[0].first(e.abortSignal).then((e=>{if(null!==e){const n=r.j.createFromGraphicLikeObject(e.geometry,e.attributes,t[0]);n._underlyingGraphic=e,e=n}return e})):(0,a.l)(t[0])?0===t[0].length?(0,s.DB)(null):(0,s.DB)(t[0][0]):(0,a.o)(t[0])?0===t[0].length()?(0,s.DB)(null):(0,s.DB)(t[0].get(0)):null)))},e.signatures.push({name:"first",min:"1",max:"1"}),e.functions.attachments=function(n,t){return e.standardFunctionAsync(n,t,((e,t,l)=>{(0,a.p)(l,1,2);const s={minsize:-1,maxsize:-1,types:null,returnMetadata:!1};if(l.length>1)if(l[1]instanceof r.F){if(l[1].hasField("minsize")&&(s.minsize=(0,a.f)(l[1].field("minsize"))),l[1].hasField("metadata")&&(s.returnMetadata=(0,a.g)(l[1].field("metadata"))),l[1].hasField("maxsize")&&(s.maxsize=(0,a.f)(l[1].field("maxsize"))),l[1].hasField("types")){const e=(0,a.ah)(l[1].field("types"),!1);e.length>0&&(s.types=e)}}else if(null!==l[1])throw new Error("Invalid Parameter");if((0,a.J)(l[0])){let e=l[0]._layer;return e instanceof f.default&&(e=(0,i.f)(e,n.spatialReference,["*"],!0,n.lrucache,n.interceptor)),null===e||!1===(0,a.R)(e)?[]:e.load().then((()=>e.queryAttachments(l[0].field(e.objectIdField),s.minsize,s.maxsize,s.types,s.returnMetadata)))}if(null===l[0])return[];throw new Error("Invalid Parameter")}))},e.signatures.push({name:"attachments",min:"1",max:"2"}),e.functions.featuresetbyrelationshipname=function(n,t){return e.standardFunctionAsync(n,t,((e,t,r)=>{(0,a.p)(r,2,4);const s=r[0],u=(0,a.h)(r[1]);let c=(0,a.n)(r[2],null);const d=(0,a.g)((0,a.n)(r[3],!0));if(null===c&&(c=["*"]),!1===(0,a.l)(c))throw new Error("Invalid Parameter");if(null===r[0])return null;if(!(0,a.J)(r[0]))throw new Error("Invalid Parameter");let p=s._layer;return p instanceof f.default&&(p=(0,i.f)(p,n.spatialReference,["*"],!0,n.lrucache,n.interceptor)),null===p||!1===(0,a.R)(p)?null:p.load().then((e=>{const t=e.relationshipMetaData().filter((e=>e.name===u));if(0===t.length)return null;if(void 0!==t[0].relationshipTableId&&null!==t[0].relationshipTableId&&t[0].relationshipTableId>-1)return(0,i.h)(e,t[0],s.field(e.objectIdField),e.spatialReference,c,d,n.lrucache,n.interceptor);let r=e.serviceUrl();return r?(r="/"===r.charAt(r.length-1)?r+t[0].relatedTableId.toString():r+"/"+t[0].relatedTableId.toString(),(0,i.i)(r,e.spatialReference,c,d,n.lrucache,n.interceptor).then((n=>n.load().then((()=>n.relationshipMetaData())).then((r=>{if(r=r.filter((e=>e.id===t[0].id)),!1===s.hasField(t[0].keyField)||null===s.field(t[0].keyField))return e.getFeatureByObjectId(s.field(e.objectIdField),[t[0].keyField]).then((e=>{if(e){const i=o.WhereClause.create(r[0].keyField+"= @id",n.getFieldsIndex());return i.parameters={id:e.attributes[t[0].keyField]},n.filter(i)}return new l.E({parentfeatureset:n})}));const i=o.WhereClause.create(r[0].keyField+"= @id",n.getFieldsIndex());return i.parameters={id:s.field(t[0].keyField)},n.filter(i)}))))):null}))}))},e.signatures.push({name:"featuresetbyrelationshipname",min:"2",max:"4"}),e.functions.featuresetbyassociation=function(n,t){return e.standardFunctionAsync(n,t,((e,t,r)=>{(0,a.p)(r,2,3);const l=r[0],s=(0,a.h)((0,a.n)(r[1],"")).toLowerCase(),c=(0,a.b)(r[2])?(0,a.h)(r[2]):null;if(null===r[0])return null;if(!(0,a.J)(r[0]))throw new Error("Invalid Parameter");let d=l._layer;return d instanceof f.default&&(d=(0,i.f)(d,n.spatialReference,["*"],!0,n.lrucache,n.interceptor)),null===d||!1===(0,a.R)(d)?null:d.load().then((()=>{const e=d.serviceUrl();return(0,i.j)(e,n.spatialReference)})).then((e=>{let n=null,t=null,r=!1;if(null!==c&&""!==c&&void 0!==c){for(const n of e.terminals)n.terminalName===c&&(t=n.terminalId);null===t&&(r=!0)}const f=e.associations.getFieldsIndex(),p=f.get("TOGLOBALID").name,m=f.get("FROMGLOBALID").name,h=f.get("TOTERMINALID").name,y=f.get("FROMTERMINALID").name,g=f.get("FROMNETWORKSOURCEID").name,F=f.get("TONETWORKSOURCEID").name,I=f.get("ASSOCIATIONTYPE").name,E=f.get("ISCONTENTVISIBLE").name,D=f.get("OBJECTID").name;for(const e of d.fields)if("global-id"===e.type){n=l.field(e.name);break}let w=null,b=new i.S(new u.Z({name:"percentalong",alias:"percentalong",type:"double"}),o.WhereClause.create("0",e.associations.getFieldsIndex())),A=new i.S(new u.Z({name:"side",alias:"side",type:"string"}),o.WhereClause.create("''",e.associations.getFieldsIndex()));const N="globalid",S="globalId",x={};for(const n in e.lkp)x[n]=e.lkp[n].sourceId;const $=new i.k(new u.Z({name:"classname",alias:"classname",type:"string"}),null,x);let C="";switch(s){case"midspan":{C=`((${p}='${n}') OR ( ${m}='${n}')) AND (${I} IN (5))`,$.codefield=o.WhereClause.create(`CASE WHEN (${p}='${n}') THEN ${g} ELSE ${F} END`,e.associations.getFieldsIndex());const t=(0,a.a3)(i.A.findField(e.associations.fields,m));t.name=N,t.alias=N,w=new i.S(t,o.WhereClause.create(`CASE WHEN (${m}='${n}') THEN ${p} ELSE ${m} END`,e.associations.getFieldsIndex())),b=e.unVersion>=4?new i.n(i.A.findField(e.associations.fields,f.get("PERCENTALONG").name)):new i.S(new u.Z({name:"percentalong",alias:"percentalong",type:"double"}),o.WhereClause.create("0",e.associations.getFieldsIndex()));break}case"junctionedge":{C=`((${p}='${n}') OR ( ${m}='${n}')) AND (${I} IN (4,6))`,$.codefield=o.WhereClause.create(`CASE WHEN (${p}='${n}') THEN ${g} ELSE ${F} END`,e.associations.getFieldsIndex());const t=(0,a.a3)(i.A.findField(e.associations.fields,m));t.name=N,t.alias=N,w=new i.S(t,o.WhereClause.create(`CASE WHEN (${m}='${n}') THEN ${p} ELSE ${m} END`,e.associations.getFieldsIndex())),A=new i.S(new u.Z({name:"side",alias:"side",type:"string"}),o.WhereClause.create(`CASE WHEN (${I}=4) THEN 'from' ELSE 'to' END`,e.associations.getFieldsIndex()));break}case"connected":{let r=`${p}='@T'`,l=`${m}='@T'`;null!==t&&(r+=` AND ${h}=@A`,l+=` AND ${y}=@A`),C="(("+r+") OR ("+l+"))",C=(0,a.E)(C,"@T",n),r=(0,a.E)(r,"@T",n),null!==t&&(r=(0,a.E)(r,"@A",t.toString()),C=(0,a.E)(C,"@A",t.toString())),$.codefield=o.WhereClause.create("CASE WHEN "+r+` THEN ${g} ELSE ${F} END`,e.associations.getFieldsIndex());const s=(0,a.a3)(i.A.findField(e.associations.fields,m));s.name=N,s.alias=N,w=new i.S(s,o.WhereClause.create("CASE WHEN "+r+` THEN ${m} ELSE ${p} END`,e.associations.getFieldsIndex()));break}case"container":C=`${p}='${n}' AND ${I} = 2`,null!==t&&(C+=` AND ${h} = `+t.toString()),$.codefield=g,C="( "+C+" )",w=new i.m(i.A.findField(e.associations.fields,m),N,N);case"content":C=`(${m}='${n}' AND ${I} = 2)`,null!==t&&(C+=` AND ${y} = `+t.toString()),$.codefield=F,C="( "+C+" )",w=new i.m(i.A.findField(e.associations.fields,p),N,N);break;case"structure":C=`(${p}='${n}' AND ${I} = 3)`,null!==t&&(C+=` AND ${h} = `+t.toString()),$.codefield=g,C="( "+C+" )",w=new i.m(i.A.findField(e.associations.fields,m),N,S);break;case"attached":C=`(${m}='${n}' AND ${I} = 3)`,null!==t&&(C+=` AND ${y} = `+t.toString()),$.codefield=F,C="( "+C+" )",w=new i.m(i.A.findField(e.associations.fields,p),N,S);break;default:throw new Error("Invalid Parameter")}return r&&(C="1 <> 1"),new i.A({parentfeatureset:e.associations,adaptedFields:[new i.n(i.A.findField(e.associations.fields,D)),new i.n(i.A.findField(e.associations.fields,E)),w,A,$,b],extraFilter:C?o.WhereClause.create(C,e.associations.getFieldsIndex()):null})}))}))},e.signatures.push({name:"featuresetbyassociation",min:"2",max:"6"}),e.functions.groupby=function(n,t){return e.standardFunctionAsync(n,t,((t,i,f)=>((0,a.p)(f,3,3),(0,a.R)(f[0])?f[0].load().then((t=>{const i=[],u=[];let d=!1,p=[];if((0,a.b)(f[1]))p.push(f[1]);else if(f[1]instanceof r.F)p.push(f[1]);else if((0,a.l)(f[1]))p=f[1];else{if(!(0,a.o)(f[1]))return e.failDefferred("Illegal Value: GroupBy");p=f[1].toArray()}for(const n of p)if((0,a.b)(n)){const e=o.WhereClause.create((0,a.h)(n),t.getFieldsIndex()),r=!0===(0,l.i)(e)?(0,a.h)(n):"%%%%FIELDNAME";i.push({name:r,expression:e}),"%%%%FIELDNAME"===r&&(d=!0)}else{if(!(n instanceof r.F))return e.failDefferred("Illegal Value: GroupBy");{const r=n.hasField("name")?n.field("name"):"%%%%FIELDNAME",a=n.hasField("expression")?n.field("expression"):"";if("%%%%FIELDNAME"===r&&(d=!0),!r)return e.failDefferred("Illegal Value: GroupBy");i.push({name:r,expression:o.WhereClause.create(a||r,t.getFieldsIndex())})}}if(p=[],(0,a.b)(f[2]))p.push(f[2]);else if((0,a.l)(f[2]))p=f[2];else if((0,a.o)(f[2]))p=f[2].toArray();else{if(!(f[2]instanceof r.F))return e.failDefferred("Illegal Value: GroupBy");p.push(f[2])}for(const n of p){if(!(n instanceof r.F))return e.failDefferred("Illegal Value: GroupBy");{const r=n.hasField("name")?n.field("name"):"",i=n.hasField("statistic")?n.field("statistic"):"",a=n.hasField("expression")?n.field("expression"):"";if(!r||!i||!a)return e.failDefferred("Illegal Value: GroupBy");u.push({name:r,statistic:i.toLowerCase(),expression:o.WhereClause.create(a,t.getFieldsIndex())})}}if(d){const e={};for(const n of t.fields)e[n.name.toLowerCase()]=1;for(const n of i)"%%%%FIELDNAME"!==n.name&&(e[n.name.toLowerCase()]=1);for(const n of u)"%%%%FIELDNAME"!==n.name&&(e[n.name.toLowerCase()]=1);let n=0;for(const t of i)if("%%%%FIELDNAME"===t.name){for(;1===e["field_"+n.toString()];)n++;e["field_"+n.toString()]=1,t.name="FIELD_"+n.toString()}}const m=[];for(const t of i)m.push(c(t.expression,e,n));for(const t of u)m.push(c(t.expression,e,n));return m.length>0?(0,s.$6)(m).then((()=>(0,s.DB)(f[0].groupby(i,u)))):(0,s.DB)(f[0].groupby(i,u))})):e.failDefferred("Illegal Value: GroupBy"))))},e.signatures.push({name:"groupby",min:"3",max:"3"}),e.functions.distinct=function(n,t){return e.standardFunctionAsync(n,t,((t,i,f)=>(0,a.R)(f[0])?((0,a.p)(f,2,2),f[0].load().then((t=>{const i=[];let u=[];if((0,a.b)(f[1]))u.push(f[1]);else if(f[1]instanceof r.F)u.push(f[1]);else if((0,a.l)(f[1]))u=f[1];else{if(!(0,a.o)(f[1]))return e.failDefferred("Illegal Value: GroupBy");u=f[1].toArray()}let d=!1;for(const n of u)if((0,a.b)(n)){const e=o.WhereClause.create((0,a.h)(n),t.getFieldsIndex()),r=!0===(0,l.i)(e)?(0,a.h)(n):"%%%%FIELDNAME";i.push({name:r,expression:e}),"%%%%FIELDNAME"===r&&(d=!0)}else{if(!(n instanceof r.F))return e.failDefferred("Illegal Value: GroupBy");{const r=n.hasField("name")?n.field("name"):"%%%%FIELDNAME",a=n.hasField("expression")?n.field("expression"):"";if("%%%%FIELDNAME"===r&&(d=!0),!r)return e.failDefferred("Illegal Value: GroupBy");i.push({name:r,expression:o.WhereClause.create(a||r,t.getFieldsIndex())})}}if(d){const e={};for(const n of t.fields)e[n.name.toLowerCase()]=1;for(const n of i)"%%%%FIELDNAME"!==n.name&&(e[n.name.toLowerCase()]=1);let n=0;for(const t of i)if("%%%%FIELDNAME"===t.name){for(;1===e["field_"+n.toString()];)n++;e["field_"+n.toString()]=1,t.name="FIELD_"+n.toString()}}const p=[];for(const t of i)p.push(c(t.expression,e,n));return p.length>0?(0,s.$6)(p).then((()=>(0,s.DB)(f[0].groupby(i,[])))):(0,s.DB)(f[0].groupby(i,[]))}))):function(e,n,t,i){if(1===i.length){if((0,a.l)(i[0]))return(0,r.w)(e,i[0],-1);if((0,a.o)(i[0]))return(0,r.w)(e,i[0].toArray(),-1)}return(0,r.w)(e,i,-1)}("distinct",0,0,f)))})}t(73796),t(74673),t(21972),t(23639),t(76506),t(92143),t(31450),t(71552),t(40642),t(60474),t(66396),t(22723),t(17533),t(86656),t(6540),t(91306),t(60991),t(91055),t(34250),t(19657),t(6906),t(97714),t(60947),t(2906),t(91597),t(86787),t(35132),t(89623),t(32422),t(21801),t(84069),t(44567),t(98380),t(92896),t(40267),t(85674),t(3482),t(36097),t(88762),t(32101),t(53785),t(57251),t(95587),t(56240),t(52228),t(82058),t(23761),t(74569),t(22781),t(86748),t(15324),t(76996),t(14249),t(60217),t(29107),t(30574),t(2157),t(25977),t(58076),t(98242),t(7471),t(54414),t(59465),t(1648),t(8925),t(33921),t(45154),t(16769),t(55531),t(30582),t(593),t(85699),t(96055),t(47776),t(18033),t(6331),t(62048),t(4292),t(75626),t(72652),t(29641),t(30493),t(70821),t(82673),t(34229),t(37029),t(96467),t(63571),t(30776),t(48027),t(54174),t(82426),t(29794),t(63130),t(25696),t(59877),t(42775),t(95834),t(34394),t(57150),t(76726),t(20444),t(76393),t(78548),t(2497),t(49906),t(46527),t(11799),t(48649),t(94216),t(9960),t(30823),t(53326),t(92482),t(5853),t(39141),t(38742),t(48243),t(34635),t(10401),t(49900),t(22739),t(20543),t(67477),t(78533),t(74653),t(91091),t(58943),t(70737),t(36834),t(85339),t(8487),t(17817),t(90814),t(15459),t(61847),t(16796),t(16955),t(22401),t(77894),t(55187),t(8586),t(44509),t(69814),t(11305),t(62259),t(44790),t(5909),t(60669),t(48208),t(51589),t(81317),t(1709),t(53426),t(34446),t(2845),t(81731),t(69997),t(49214),t(95533),t(94751),t(76733),t(11385),t(55823),t(92847),t(31292),t(93314),t(35197),t(69218),t(27207),t(9801),t(53523),t(42911),t(46826),t(45433),t(54732),t(87258),t(46646),t(39210),t(90549),t(78303),t(46495),t(56420),t(73173),t(74742),t(28239),t(42870),t(65514),t(46987),t(37453),t(66284),t(87239),t(5777),t(55306),t(65684),t(12158),t(74864),t(63683),t(94479),t(45702),t(51127),t(74071),t(51723),t(23243),t(51669),t(6090),t(3977),t(36741),t(11253),t(90319),t(38822),t(74057),t(48190),t(85557),t(94070),t(43022),t(16218),t(9075),t(71206),t(9352),t(89241),t(91700),t(51979),t(63136),t(32037),t(60698),t(90811),t(86758),t(95310),t(93939),t(238),t(71831),t(20208),t(82933),t(54179),t(10691),t(38949),t(71777),t(27371),t(78648),t(87558),t(13063),t(17153),t(35962),t(9252),t(67350),t(11471),t(83748),t(28376),t(62554),t(29027),t(41617),t(47628),t(95873),t(58085),t(21781),t(75025),t(21132),t(11118),t(92200),t(65949),t(22465),t(65775),t(8547),t(46942),t(6210),t(36231),t(89440),t(67541),t(1557),t(47842),t(17298),t(33045),t(62162),t(41864),t(16647),t(58912),t(19902),t(59765),t(77361),t(83290),t(13322),t(14460),t(77807),t(50203),t(6941),t(47346),t(17055),t(68653),t(2180),t(14327),t(40944),t(68714),t(78893)}}]);