"use strict";(self.webpackChunkRemoteClient=self.webpackChunkRemoteClient||[]).push([[487],{23761:(e,t,r)=>{r.d(t,{Z:()=>h});var i=r(29768),s=r(74569),o=r(86748),n=r(96467),a=r(85339),l=r(74673),u=r(76506),p=r(19657),c=r(34250),d=(r(91306),r(17533)),y=r(32422);function f(e){if(!(0,u.i)(e))return null;const t={};for(const r in e){const i=e[r];i&&(t[r]=i.toJSON())}return 0!==Object.keys(t).length?t:null}r(21801),r(40642),r(71552),r(73796),r(97714),r(60947),r(2906),r(21972),r(23639),r(92143),r(31450),r(60474),r(66396),r(22723),r(86656),r(91055),r(6540),r(60991),r(6906),r(50406),r(91597),r(86787),r(35132),r(89623),r(84069),r(44567),r(98380),r(92896),r(22781),r(57251),r(15324),r(76996),r(14249),r(60217),r(29107),r(30574),r(2157),r(25977),r(58076),r(98242),r(7471),r(54414),r(59465),r(1648),r(8925),r(33921),r(3482),r(45154),r(16769),r(55531),r(30582),r(593),r(85699),r(96055),r(47776),r(18033),r(6331),r(62048),r(4292),r(75626),r(72652),r(29641),r(30493),r(70821),r(82673),r(34229),r(37029),r(63571),r(30776),r(48027),r(54174),r(82426),r(29794),r(63130),r(25696),r(59877),r(42775),r(95834),r(34394),r(57150),r(76726),r(20444),r(76393),r(78548),r(2497),r(49906),r(46527),r(11799),r(48649),r(94216),r(9960),r(30823),r(53326),r(92482),r(5853),r(39141),r(32101),r(38742),r(48243),r(34635),r(10401),r(49900),r(88762),r(82058),r(22739),r(20543),r(67477),r(78533),r(74653),r(91091),r(58943),r(70737),r(36834),r(8487),r(17817),r(90814),r(15459),r(61847),r(16796),r(16955),r(22401),r(77894),r(55187),r(8586),r(44509),r(69814),r(11305),r(62259),r(44790),r(5909),r(60669),r(48208),r(51589);let m=class extends((0,a.C)(l.a)){constructor(...e){super(...e),this.isAggregate=!1,this.layer=null,this.popupTemplate=null,this.sourceLayer=null,Object.defineProperty(this,"uid",{value:(0,p.g)(),configurable:!0})}normalizeCtorArgs(e,t,r,i){return e&&!e.declaredClass?e:{geometry:e,symbol:t,attributes:r,popupTemplate:i}}set aggregateGeometries(e){const t=this._get("aggregateGeometries");JSON.stringify(t)!==JSON.stringify(e)&&this._set("aggregateGeometries",e)}set attributes(e){const t=this._get("attributes");t!==e&&(this._set("attributes",e),this._notifyLayer("attributes",t,e))}set geometry(e){const t=this._get("geometry");t!==e&&(this._set("geometry",e),this._notifyLayer("geometry",t,e))}set symbol(e){const t=this._get("symbol");t!==e&&(this._set("symbol",e),this._notifyLayer("symbol",t,e))}set visible(e){const t=this._get("visible");t!==e&&(this._set("visible",e),this._notifyLayer("visible",t,e))}getEffectivePopupTemplate(e=!1){if(this.popupTemplate)return this.popupTemplate;for(const t of[this.sourceLayer,this.layer])if(t){if("popupTemplate"in t&&t.popupTemplate)return t.popupTemplate;if(e&&"defaultPopupTemplate"in t&&(0,u.i)(t.defaultPopupTemplate))return t.defaultPopupTemplate}return null}getAttribute(e){return this.attributes&&this.attributes[e]}setAttribute(e,t){if(this.attributes){const r=this.getAttribute(e);this.attributes[e]=t,this._notifyLayer("attributes",r,t,e)}else this.attributes={[e]:t},this._notifyLayer("attributes",void 0,t,e)}getObjectId(){return this.sourceLayer&&"objectIdField"in this.sourceLayer&&this.sourceLayer.objectIdField?this.getAttribute(this.sourceLayer.objectIdField):null}toJSON(){return{aggregateGeometries:f(this.aggregateGeometries),geometry:(0,u.i)(this.geometry)?this.geometry.toJSON():null,symbol:(0,u.i)(this.symbol)?this.symbol.toJSON():null,attributes:{...this.attributes},popupTemplate:this.popupTemplate&&this.popupTemplate.toJSON()}}notifyGeometryChanged(){this._notifyLayer("geometry",this.geometry,this.geometry)}notifyMeshTransformChanged(){(0,u.i)(this.geometry)&&"mesh"===this.geometry.type&&this._notifyLayer("transform",this.geometry.transform,this.geometry.transform)}_notifyLayer(e,t,r,i){if(!this.layer||!("graphicChanged"in this.layer))return;const s={graphic:this,property:e,oldValue:t,newValue:r};"attributes"===e&&(s.attributeName=i),this.layer.graphicChanged(s)}};(0,i._)([(0,c.Cb)({value:null,json:{read:function(e){if(!e)return null;const t={};for(const r in e){const i=(0,y.im)(e[r]);i&&(t[r]=i)}return 0!==Object.keys(t).length?t:null}}})],m.prototype,"aggregateGeometries",null),(0,i._)([(0,c.Cb)({value:null})],m.prototype,"attributes",null),(0,i._)([(0,c.Cb)({value:null,types:s.qM,json:{read:y.im}})],m.prototype,"geometry",null),(0,i._)([(0,c.Cb)({type:Boolean})],m.prototype,"isAggregate",void 0),(0,i._)([(0,c.Cb)({clonable:"reference"})],m.prototype,"layer",void 0),(0,i._)([(0,c.Cb)({type:o.Z})],m.prototype,"popupTemplate",void 0),(0,i._)([(0,c.Cb)({clonable:"reference"})],m.prototype,"sourceLayer",void 0),(0,i._)([(0,c.Cb)({value:null,types:n.LB})],m.prototype,"symbol",null),(0,i._)([(0,c.Cb)({type:Boolean,value:!0})],m.prototype,"visible",null),m=(0,i._)([(0,d.j)("esri.Graphic")],m),(m||(m={})).generateUID=p.g;const h=m},25781:(e,t,r)=>{r.d(t,{a:()=>o,b:()=>b,c:()=>g,d:()=>n,e:()=>m,f:()=>c,g:()=>h,h:()=>y,i:()=>a,j:()=>d,l:()=>s,o:()=>l,r:()=>u,s:()=>f,t:()=>p});var i=r(57251);const s=(0,i.s)()({esriCentimeters:"centimeters",esriDecimalDegrees:"decimal-degrees",esriDecimeters:"decimeters",esriFeet:"feet",esriInches:"inches",esriKilometers:"kilometers",esriMeters:"meters",esriMiles:"miles",esriMillimeters:"millimeters",esriNauticalMiles:"nautical-miles",esriPoints:"points",esriUnknownUnits:"unknown",esriYards:"yards"}),o=(0,i.s)()({esriNAUCentimeters:"centimeters",esriNAUDecimalDegrees:"decimal-degrees",esriNAUDecimeters:"decimeters",esriNAUFeet:"feet",esriNAUInches:"inches",esriNAUKilometers:"kilometers",esriNAUMeters:"meters",esriNAUMiles:"miles",esriNAUMillimeters:"millimeters",esriNAUNauticalMiles:"nautical-miles",esriNAUPoints:"points",esriNAUYards:"yards"}),n=(0,i.s)()({esriNAUDays:"days",esriNAUHours:"hours",esriNAUMinutes:"minutes",esriNAUSeconds:"seconds"}),a=(0,i.s)()({esriDOTComplete:"complete",esriDOTCompleteNoEvents:"complete-no-events",esriDOTFeatureSets:"featuresets",esriDOTInstructionsOnly:"instructions-only",esriDOTStandard:"standard",esriDOTSummaryOnly:"summary-only"}),l=(0,i.s)()({esriNAOutputLineNone:"none",esriNAOutputLineStraight:"straight",esriNAOutputLineTrueShape:"true-shape",esriNAOutputLineTrueShapeWithMeasure:"true-shape-with-measure"}),u=((0,i.s)()({esriNAOutputPolygonNone:"none",esriNAOutputPolygonSimplified:"simplified",esriNAOutputPolygonDetailed:"detailed"}),(0,i.s)()({esriNFSBAllowBacktrack:"allow-backtrack",esriNFSBAtDeadEndsOnly:"at-dead-ends-only",esriNFSBNoBacktrack:"no-backtrack",esriNFSBAtDeadEndsAndIntersections:"at-dead-ends-and-intersections"})),p=((0,i.s)()({esriNATravelDirectionFromFacility:"from-facility",esriNATravelDirectionToFacility:"to-facility"}),(0,i.s)()({esriNATimeOfDayNotUsed:"not-used",esriNATimeOfDayUseAsStartTime:"start",esriNATimeOfDayUseAsEndTime:"end"}),(0,i.s)()({AUTOMOBILE:"automobile",TRUCK:"truck",WALK:"walk",OTHER:"other"})),c=(0,i.s)()({0:"either-side-of-vehicle",1:"right-side-of-vehicle",2:"left-side-of-vehicle",3:"no-u-turn"},{useNumericKeys:!0}),d=(0,i.s)()({0:"stop",1:"waypoint",2:"break"},{useNumericKeys:!0}),y=(0,i.s)()({0:"ok",1:"not-located",2:"network-element-not-located",3:"element-not-traversable",4:"invalid-field-values",5:"not-reached",6:"time-window-violation",7:"not-located-on-closest"},{useNumericKeys:!0}),f=(0,i.s)()({1:"right",2:"left"},{useNumericKeys:!0}),m=(0,i.s)()({0:"restriction",1:"added-cost"},{useNumericKeys:!0}),h=(0,i.s)()({0:"permit",1:"restrict"},{useNumericKeys:!0}),g=(0,i.s)()({1:"header",50:"arrive",51:"depart",52:"straight",100:"on-ferry",101:"off-ferry",102:"central-fork",103:"roundabout",104:"u-turn",150:"door",151:"stairs",152:"elevator",153:"escalator",154:"pedestrian-ramp",200:"left-fork",201:"left-ramp",202:"clockwise-roundabout",203:"left-handed-u-turn",204:"bear-left",205:"left-turn",206:"sharp-left",207:"left-turn-and-immediate-left-turn",208:"left-turn-and-immediate-right-turn",300:"right-fork",301:"right-ramp",302:"counter-clockwise-roundabout",303:"right-handed-u-turn",304:"bear-right",305:"right-turn",306:"sharp-right",307:"right-turn-and-immediate-left-turn",308:"right-turn-and-immediate-right-turn",400:"up-elevator",401:"up-escalator",402:"up-stairs",500:"down-elevator",501:"down-escalator",502:"down-stairs",1e3:"general-event",1001:"landmark",1002:"time-zone-change",1003:"traffic-event",1004:"scaled-cost-barrier-event",1005:"boundary-crossing",1006:"restriction-violation"},{useNumericKeys:!0}),b=(0,i.s)()({0:"unknown",1:"segment",2:"maneuver-segment",3:"restriction-violation",4:"scaled-cost-barrier",5:"heavy-traffic",6:"slow-traffic",7:"moderate-traffic"},{useNumericKeys:!0})},62206:(e,t,r)=>{r.d(t,{c:()=>s});class i{constructor(e={}){this._options=e}toQueryParams(e){if(!e)return null;const t=e.toJSON(),r={};return Object.keys(t).forEach((e=>{const i=this._options[e];if(i){const s="boolean"!=typeof i&&i.name?i.name:e,o="boolean"!=typeof i&&i.getter?i.getter(t):t[e];null!=o&&(r[s]=(e=>{if(!Array.isArray(e))return!1;const[t]=e;return"number"==typeof t||"string"==typeof t})(o)?o.join(","):"object"==typeof o?JSON.stringify(o):o)}else r[e]=t[e]}),this),r}}function s(e){return new i(e)}},69997:(e,t,r)=>{r.d(t,{g:()=>s});var i=r(53785);function s(e,t){const r=t||e.extent,s=e.width,o=(0,i.g)(r&&r.spatialReference);return r&&s?r.width/s*o*i.i*96:0}},81731:(e,t,r)=>{r.d(t,{a:()=>s,e:()=>n,p:()=>o}),r(76506);var i=r(32101);function s(e,t){return t?{...t,query:{...e,...t.query}}:{query:e}}function o(e){return"string"==typeof e?(0,i.mN)(e):e}function n(e,t,r){const i={};for(const s in e){if("declaredClass"===s)continue;const o=e[s];if(null!=o&&"function"!=typeof o)if(Array.isArray(o)){i[s]=[];for(let e=0;e<o.length;e++)i[s][e]=n(o[e])}else if("object"==typeof o)if(o.toJSON){const e=o.toJSON(r&&r[s]);i[s]=t?e:JSON.stringify(e)}else i[s]=t?o:JSON.stringify(o);else i[s]=o}return i}r(69997)},45937:(e,t,r)=>{r.d(t,{et:()=>b,ef:()=>v,bI:()=>A,Wf:()=>N});var i=r(82058),s=r(60991),o=r(76506),n=r(71552),a=r(32101),l=r(81731),u=r(29768),p=r(74673),c=r(34250),d=(r(91306),r(59465)),y=r(17533),f=r(25781),m=r(64560);r(31450),r(88762),r(92143),r(40642),r(50406),r(69997),r(53785),r(57251),r(95587),r(60947),r(2906),r(21972),r(23639),r(60474),r(66396),r(22723),r(86656),r(91055),r(6540),r(19657),r(6906),r(89623);let h=class extends p.a{constructor(e){super(e),this.accumulateAttributeNames=null,this.currentVersion=null,this.defaultTravelMode=null,this.directionsLanguage=null,this.directionsLengthUnits=null,this.directionsSupportedLanguages=null,this.directionsTimeAttribute=null,this.hasZ=null,this.impedance=null,this.networkDataset=null,this.supportedTravelModes=null}};(0,u._)([(0,c.Cb)()],h.prototype,"accumulateAttributeNames",void 0),(0,u._)([(0,c.Cb)()],h.prototype,"currentVersion",void 0),(0,u._)([(0,c.Cb)()],h.prototype,"defaultTravelMode",void 0),(0,u._)([(0,c.Cb)()],h.prototype,"directionsLanguage",void 0),(0,u._)([(0,d.e)(f.a)],h.prototype,"directionsLengthUnits",void 0),(0,u._)([(0,c.Cb)()],h.prototype,"directionsSupportedLanguages",void 0),(0,u._)([(0,c.Cb)()],h.prototype,"directionsTimeAttribute",void 0),(0,u._)([(0,c.Cb)()],h.prototype,"hasZ",void 0),(0,u._)([(0,c.Cb)()],h.prototype,"impedance",void 0),(0,u._)([(0,c.Cb)()],h.prototype,"networkDataset",void 0),(0,u._)([(0,c.Cb)({type:[m.Z]})],h.prototype,"supportedTravelModes",void 0),h=(0,u._)([(0,y.j)("esri.rest.support.NetworkServiceDescription")],h);const g=h;function b(e,t,r,i){i[r]=[t.length,t.length+e.length],e.forEach((e=>{t.push(e.geometry)}))}function v(e,t){for(let r=0;r<t.length;r++){const i=e[t[r]];if(i&&i.length)for(const e of i)e.z=void 0}console.log("The remote Network Analysis service is powered by a network dataset which is not Z-aware.\nZ-coordinates of the input geometry are ignored.")}function N(e,t){for(let r=0;r<t.length;r++){const i=e[t[r]];if(i&&i.length)for(const e of i)if((0,o.i)(e)&&e.hasZ)return!0}return!1}async function A(e,t,r){if(!e)throw new s.Z("network-service:missing-url","Url to Network service is missing");const o=(0,l.a)({f:"json",token:t},r),{data:u}=await(0,i.default)(e,o);u.supportedTravelModes||(u.supportedTravelModes=[]);for(let e=0;e<u.supportedTravelModes.length;e++)u.supportedTravelModes[e].id||(u.supportedTravelModes[e].id=u.supportedTravelModes[e].itemId);const p=u.currentVersion>=10.4?async function(e,t,r){try{const s=(0,l.a)({f:"json",token:t},r),o=(0,a.Qj)(e)+"/retrieveTravelModes",{data:{supportedTravelModes:n,defaultTravelMode:u}}=await(0,i.default)(o,s);return{supportedTravelModes:n,defaultTravelMode:u}}catch(e){throw new s.Z("network-service:retrieveTravelModes","Could not get to the NAServer's retrieveTravelModes.",{error:e})}}(e,t,r):async function(e,t){var r,s;const o=(0,l.a)({f:"json"},t),{data:u}=await(0,i.default)(e.replace(/\/rest\/.*$/i,"/info"),o);if(!u||!u.owningSystemUrl)return{supportedTravelModes:[],defaultTravelMode:null};const{owningSystemUrl:p}=u,c=(0,a.Qj)(p)+"/sharing/rest/portals/self",{data:d}=await(0,i.default)(c,o),y=(0,n.g)("helperServices.routingUtilities.url",d);if(!y)return{supportedTravelModes:[],defaultTravelMode:null};const f=(0,l.p)(p),m=/\/solve$/i.test(f.path)?"Route":/\/solveclosestfacility$/i.test(f.path)?"ClosestFacility":"ServiceAreas",h=(0,l.a)({f:"json",serviceName:m},t),g=(0,a.Qj)(y)+"/GetTravelModes/execute",b=await(0,i.default)(g,h),v=[];let N=null;if(null!=b&&null!=(r=b.data)&&null!=(s=r.results)&&s.length){const e=b.data.results;for(const t of e){var A;if("supportedTravelModes"===t.paramName){if(null!=(A=t.value)&&A.features)for(const{attributes:e}of t.value.features)if(e){const t=JSON.parse(e.TravelMode);v.push(t)}}else"defaultTravelMode"===t.paramName&&(N=t.value)}}return{supportedTravelModes:v,defaultTravelMode:N}}(e,r),{defaultTravelMode:c,supportedTravelModes:d}=await p;return u.defaultTravelMode=c,u.supportedTravelModes=d,g.fromJSON(u)}},2710:(e,t,r)=>{r.d(t,{Z:()=>p});var i=r(29768),s=r(57251),o=r(74673),n=r(34250),a=(r(76506),r(91306),r(17533));r(71552),r(21972),r(23639),r(92143),r(31450),r(40642),r(60474),r(66396),r(22723),r(86656),r(91055),r(6540),r(19657),r(6906),r(50406),r(60991);const l=new s.J({esriJobMessageTypeInformative:"informative",esriJobMessageTypeProcessDefinition:"process-definition",esriJobMessageTypeProcessStart:"process-start",esriJobMessageTypeProcessStop:"process-stop",esriJobMessageTypeWarning:"warning",esriJobMessageTypeError:"error",esriJobMessageTypeEmpty:"empty",esriJobMessageTypeAbort:"abort"});let u=class extends o.a{constructor(e){super(e),this.description=null,this.type=null}};(0,i._)([(0,n.Cb)({type:String,json:{write:!0}})],u.prototype,"description",void 0),(0,i._)([(0,n.Cb)({type:String,json:{read:l.read,write:l.write}})],u.prototype,"type",void 0),u=(0,i._)([(0,a.j)("esri.rest.support.GPMessage")],u);const p=u},37265:(e,t,r)=>{r.d(t,{Z:()=>p});var i=r(29768),s=r(57251),o=r(34250),n=(r(76506),r(91306),r(17533)),a=r(2710);r(71552),r(92143),r(31450),r(40642),r(60474),r(66396),r(22723),r(86656),r(60991),r(6540),r(74673),r(21972),r(23639),r(91055),r(19657),r(6906),r(50406);const l=new s.J({0:"informative",1:"process-definition",2:"process-start",3:"process-stop",50:"warning",100:"error",101:"empty",200:"abort"});let u=class extends a.Z{constructor(e){super(e),this.type=null}};(0,i._)([(0,o.Cb)({type:String,json:{read:l.read,write:l.write}})],u.prototype,"type",void 0),u=(0,i._)([(0,n.j)("esri.rest.support.NAMessage")],u);const p=u},64560:(e,t,r)=>{r.d(t,{Z:()=>d});var i,s=r(29768),o=r(74673),n=r(76506),a=r(34250),l=(r(91306),r(59465)),u=r(17533),p=r(25781);r(21972),r(23639),r(92143),r(31450),r(71552),r(40642),r(60474),r(66396),r(22723),r(86656),r(91055),r(6540),r(19657),r(6906),r(50406),r(60991),r(57251);let c=i=class extends o.a{constructor(e){super(e),this.attributeParameterValues=null,this.description=null,this.distanceAttributeName=null,this.id=null,this.impedanceAttributeName=null,this.name=null,this.restrictionAttributeNames=null,this.simplificationTolerance=null,this.simplificationToleranceUnits=null,this.timeAttributeName=null,this.type=null,this.useHierarchy=null,this.uturnAtJunctions=null}clone(){return new i((0,n.d9)({attributeParameterValues:this.attributeParameterValues,description:this.description,distanceAttributeName:this.distanceAttributeName,id:this.id,impedanceAttributeName:this.impedanceAttributeName,name:this.name,restrictionAttributeNames:this.restrictionAttributeNames,simplificationTolerance:this.simplificationTolerance,simplificationToleranceUnits:this.simplificationToleranceUnits,timeAttributeName:this.timeAttributeName,type:this.type,useHierarchy:this.useHierarchy,uturnAtJunctions:this.uturnAtJunctions}))}};(0,s._)([(0,a.Cb)({type:[Object],json:{write:!0}})],c.prototype,"attributeParameterValues",void 0),(0,s._)([(0,a.Cb)({type:String,json:{write:!0}})],c.prototype,"description",void 0),(0,s._)([(0,a.Cb)({type:String,json:{write:!0}})],c.prototype,"distanceAttributeName",void 0),(0,s._)([(0,a.Cb)({type:String,json:{write:!0}})],c.prototype,"id",void 0),(0,s._)([(0,a.Cb)({type:String,json:{write:!0}})],c.prototype,"impedanceAttributeName",void 0),(0,s._)([(0,a.Cb)({type:String,json:{write:!0}})],c.prototype,"name",void 0),(0,s._)([(0,a.Cb)({type:[String],json:{write:!0}})],c.prototype,"restrictionAttributeNames",void 0),(0,s._)([(0,a.Cb)({type:Number,json:{write:{allowNull:!0}}})],c.prototype,"simplificationTolerance",void 0),(0,s._)([(0,l.e)(p.l)],c.prototype,"simplificationToleranceUnits",void 0),(0,s._)([(0,a.Cb)({type:String,json:{write:!0}})],c.prototype,"timeAttributeName",void 0),(0,s._)([(0,l.e)(p.t)],c.prototype,"type",void 0),(0,s._)([(0,a.Cb)({type:Boolean,json:{write:!0}})],c.prototype,"useHierarchy",void 0),(0,s._)([(0,l.e)(p.r)],c.prototype,"uturnAtJunctions",void 0),c=i=(0,s._)([(0,u.j)("esri.rest.support.TravelMode")],c);const d=c},50487:(e,t,r)=>{r.r(t),r.d(t,{default:()=>O});var i=r(29768),s=r(34250),o=r(76506),n=(r(91306),r(17533)),a=r(82058),l=r(62206),u=r(95533),p=r(45937),c=r(81731),d=(r(74569),r(23761)),y=r(74673),f=r(97714),m=r(60947),h=r(37265),g=r(91597),b=r(92896),v=r(44567),N=r(32422);function A(e){return e.features.map((t=>{const r=m.Z.fromJSON(e.spatialReference),i=d.Z.fromJSON(t);return(0,o.u)(i.geometry).spatialReference=r,i}))}function T(e){return(0,o.F)(e.features.map((t=>((0,o.i)(t.geometry)&&(t.geometry.spatialReference=e.spatialReference),(0,N.im)(t.geometry)))))}r(21801),r(40642),r(71552),r(73796),r(21972),r(23639),r(92143),r(31450),r(60474),r(66396),r(22723),r(86656),r(91055),r(6540),r(19657),r(6906),r(50406),r(60991),r(2906),r(35132),r(89623),r(86787),r(84069),r(22781),r(57251),r(98380),r(86748),r(15324),r(76996),r(14249),r(60217),r(29107),r(30574),r(2157),r(25977),r(58076),r(98242),r(7471),r(54414),r(59465),r(1648),r(8925),r(33921),r(3482),r(45154),r(16769),r(55531),r(30582),r(593),r(85699),r(96055),r(47776),r(18033),r(6331),r(62048),r(4292),r(75626),r(72652),r(29641),r(30493),r(70821),r(82673),r(34229),r(37029),r(96467),r(63571),r(30776),r(48027),r(54174),r(82426),r(29794),r(63130),r(25696),r(59877),r(42775),r(95834),r(34394),r(57150),r(76726),r(20444),r(76393),r(78548),r(2497),r(49906),r(46527),r(11799),r(48649),r(94216),r(9960),r(30823),r(53326),r(92482),r(5853),r(39141),r(32101),r(38742),r(48243),r(34635),r(10401),r(49900),r(88762),r(22739),r(20543),r(67477),r(78533),r(74653),r(91091),r(58943),r(70737),r(36834),r(85339),r(8487),r(17817),r(90814),r(15459),r(61847),r(16796),r(16955),r(22401),r(77894),r(55187),r(8586),r(44509),r(69814),r(11305),r(62259),r(44790),r(5909),r(60669),r(48208),r(51589),r(2710);let _=class extends y.a{constructor(e){super(e),this.facilities=null,this.messages=null,this.pointBarriers=null,this.polylineBarriers=null,this.polygonBarriers=null,this.serviceAreaPolylines=null,this.serviceAreaPolygons=null}readFacilities(e){return T(e)}readPointBarriers(e,t){return T(t.barriers)}readPolylineBarriers(e){return T(e)}readPolygonBarriers(e){return T(e)}readIncidents(e,t){return A(t.saPolylines)}readServiceAreaPolygons(e,t){return A(t.saPolygons)}};(0,i._)([(0,s.Cb)({type:[g.Z]})],_.prototype,"facilities",void 0),(0,i._)([(0,f.r)("facilities")],_.prototype,"readFacilities",null),(0,i._)([(0,s.Cb)({type:[h.Z]})],_.prototype,"messages",void 0),(0,i._)([(0,s.Cb)({type:[g.Z]})],_.prototype,"pointBarriers",void 0),(0,i._)([(0,f.r)("pointBarriers",["barriers"])],_.prototype,"readPointBarriers",null),(0,i._)([(0,s.Cb)({type:[b.Z]})],_.prototype,"polylineBarriers",void 0),(0,i._)([(0,f.r)("polylineBarriers")],_.prototype,"readPolylineBarriers",null),(0,i._)([(0,s.Cb)({type:[v.Z]})],_.prototype,"polygonBarriers",void 0),(0,i._)([(0,f.r)("polygonBarriers")],_.prototype,"readPolygonBarriers",null),(0,i._)([(0,s.Cb)({type:[d.Z]})],_.prototype,"serviceAreaPolylines",void 0),(0,i._)([(0,f.r)("serviceAreaPolylines",["saPolylines"])],_.prototype,"readIncidents",null),(0,i._)([(0,s.Cb)({type:[d.Z]})],_.prototype,"serviceAreaPolygons",void 0),(0,i._)([(0,f.r)("serviceAreaPolygons",["saPolygons"])],_.prototype,"readServiceAreaPolygons",null),_=(0,i._)([(0,n.j)("esri.rest.support.ServiceAreaSolveResult")],_);const w=_;r(94751),r(25781),r(64560),r(69997),r(53785),r(95587);const S=(0,l.c)({accumulateAttributes:{name:"accumulateAttributeNames"},attributeParameterValues:!0,defaultBreaks:!0,facilities:!0,outSpatialReference:{name:"outSR",getter:e=>e.outSpatialReference.wkid},pointBarriers:{name:"barriers"},polylineBarriers:!0,polygonBarriers:!0,restrictionAttributes:{name:"restrictionAttributeNames"},returnPointBarriers:{name:"returnBarriers"},travelMode:!0});var C=r(658);let M=class extends C.Z{constructor(e){super(e),this.url=null}solve(e,t){return async function(e,t,r){const i=[],s=[],o={},n={},l=(0,c.p)(e),{path:d}=l;t.facilities&&t.facilities.features&&(0,p.et)(t.facilities.features,s,"facilities.features",o),t.pointBarriers&&t.pointBarriers.features&&(0,p.et)(t.pointBarriers.features,s,"pointBarriers.features",o),t.polylineBarriers&&t.polylineBarriers.features&&(0,p.et)(t.polylineBarriers.features,s,"polylineBarriers.features",o),t.polygonBarriers&&t.polygonBarriers.features&&(0,p.et)(t.polygonBarriers.features,s,"polygonBarriers.features",o);const y=await(0,u.aX)(s);for(const e in o){const t=o[e];i.push(e),n[e]=y.slice(t[0],t[1])}if((0,p.Wf)(n,i)){let e=null;try{e=await(0,p.bI)(d,t.apiKey,r)}catch{}e&&!e.hasZ&&(0,p.ef)(n,i)}for(const e in n)n[e].forEach(((r,i)=>{t.get(e)[i].geometry=r}));const f={...r,query:{...l.query,...S.toQueryParams(t),f:"json"}},{data:m}=await(0,a.default)(`${d}/solveServiceArea`,f);return w.fromJSON(m)}(this.url,e,t)}};(0,i._)([(0,s.Cb)()],M.prototype,"url",void 0),M=(0,i._)([(0,n.j)("esri.tasks.ServiceAreaTask")],M);const O=M},658:(e,t,r)=>{r.d(t,{Z:()=>u});var i=r(29768),s=r(21972),o=r(32101),n=r(34250),a=(r(76506),r(91306),r(17533));r(23639),r(92143),r(31450),r(71552),r(40642),r(60474),r(66396),r(22723),r(86656),r(91055),r(6540),r(19657),r(6906),r(50406),r(60991);let l=class extends s.Z{constructor(...e){super(...e),this.requestOptions=null,this.url=null}normalizeCtorArgs(e,t){return"string"!=typeof e?e:{url:e,...t}}get parsedUrl(){return this._parseUrl(this.url)}_parseUrl(e){return e?(0,o.mN)(e):null}_encode(e,t,r){const i={};for(const s in e){if("declaredClass"===s)continue;const o=e[s];if(null!=o&&"function"!=typeof o)if(Array.isArray(o)){i[s]=[];for(let e=0;e<o.length;e++)i[s][e]=this._encode(o[e])}else if("object"==typeof o)if(o.toJSON){const e=o.toJSON(r&&r[s]);i[s]=t?e:JSON.stringify(e)}else i[s]=t?o:JSON.stringify(o);else i[s]=o}return i}};(0,i._)([(0,n.Cb)({readOnly:!0})],l.prototype,"parsedUrl",null),(0,i._)([(0,n.Cb)()],l.prototype,"requestOptions",void 0),(0,i._)([(0,n.Cb)({type:String})],l.prototype,"url",void 0),l=(0,i._)([(0,a.j)("esri.tasks.Task")],l);const u=l}}]);