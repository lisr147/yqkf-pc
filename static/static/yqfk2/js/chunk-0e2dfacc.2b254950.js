(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0e2dfacc"],{"618e":function(t,e,i){"use strict";i("890e")},"890e":function(t,e,i){},ebe4c:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"hcamera"},[i("iframe",{ref:"frame",attrs:{src:t.videoUrl}}),i("div",{staticClass:"refresh-btn",on:{click:t.refreshFrame}},[t._v("刷新")]),i("div",{staticClass:"ctrl",class:{folder:!t.isCtrlOpen}},[i("div",{staticClass:"ctrl-h",on:{click:t.toggleCtrl}},[t._v(" 云台 "),i("span",{staticClass:"ico"}),i("div",{staticClass:"tip"},[i("el-popover",{attrs:{placement:"top-end",offset:1e3,width:"200",trigger:"hover",value:t.tipVisible,content:"视频画面有10秒左右的延迟,操作后请稍等"}},[i("i",{staticClass:"el-icon-info",attrs:{slot:"reference"},slot:"reference"})])],1)]),i("div",{staticClass:"ctrl-b"},[i("div",{staticClass:"dir"},t._l(t.btnList,(function(e,s){return i("b",{key:s,staticClass:"btn",attrs:{title:e.title},on:{mousedown:function(i){return t.handleMouseDown(e.params)},mouseup:function(i){return t.handleMouseUp(e.params)}}},[i("img",{attrs:{src:t.baseUrl+e.icon+".png"}})])})),0),i("div",{staticClass:"zoom"},t._l(t.rbList,(function(e,s){return i("b",{key:s,staticClass:"btn",attrs:{title:e.title},on:{mousedown:function(i){return t.handleMouseDown(e.params)},mouseup:function(i){return t.handleMouseUp(e.params)}}},[i("img",{attrs:{src:t.baseUrl+e.icon+"@2x.png"}})])})),0)]),i("div",{staticClass:"ctrl-f"},[i("el-slider",{attrs:{min:1,max:7,step:1,size:"small",title:"调节镜头移动速度"},model:{value:t.extent,callback:function(e){t.extent=e},expression:"extent"}}),i("div",{staticClass:"ipt"},[t._v(t._s(t.extent))])],1)])])},a=[],n=i("d2b8"),r=i("609f"),o={name:"HCamera",components:{},props:{attributes:{type:Object,default:function(){return{}}}},data:function(){return{videoUrl:"",btnList:[{title:"上左",params:{pan:-1,tilt:1},icon:"1"},{title:"上",params:{pan:0,tilt:1},icon:"2"},{title:"上右",params:{pan:1,tilt:1},icon:"3"},{title:"左",params:{pan:-1,tilt:0},icon:"4"},{title:"开始旋转/停止旋转",params:{rotate:!0},icon:"5"},{title:"右",params:{pan:1,tilt:0},icon:"6"},{title:"下左",params:{pan:-1,tilt:-1},icon:"7"},{title:"下",params:{pan:0,tilt:-1},icon:"8"},{title:"下右",params:{pan:1,tilt:-1},icon:"9"}],rbList:[{title:"靠近",params:{zoom:1},icon:"+"},{title:"远离",params:{zoom:-1},icon:"-"}],baseUrl:"".concat(n["b"],"/static/images/hdcamera/"),extent:4,isPressing:!1,isRotating:!1,isCtrlOpen:!0,tipVisible:!1}},computed:{extentValue:function(){return Math.min(100,15*this.extent)}},watch:{attributes:{handler:function(){this.initFrame()},immediate:!0}},mounted:function(){var t=this;setTimeout((function(){t.tipVisible=!0}),1e3),setTimeout((function(){t.tipVisible=!1}),6e3)},methods:{initFrame:function(){var t=this.attributes,e=t.deviceUid,i=t.livePlayUrl;this.videoUrl="".concat(location.origin).concat(n["b"],"/player/liveplayer/player.html?deviceUid=").concat(e,"&videoUrl=").concat(i)},toggleCtrl:function(){this.isCtrlOpen=!this.isCtrlOpen},handleMouseDown:function(t){var e=this;if(this.isPressing=!0,void 0!==t.pan){var i={pan:t.pan*e.extentValue,tilt:t.tilt*e.extentValue};Object(r["t"])(e.attributes.id,i)}else if(void 0!==t.zoom){var s={zoom:t.zoom*e.extentValue};Object(r["v"])(e.attributes.id,s)}else if(t.rotate){e.isRotating=!e.isRotating;var a={autoPan:e.isRotating?e.extentValue:0};Object(r["u"])(e.attributes.id,a)}},handleMouseUp:function(t){var e=this;if(this.isPressing=!1,void 0!==t.pan){var i={pan:0,tilt:0};Object(r["t"])(e.attributes.id,i)}else if(void 0!==t.zoom){var s={zoom:0};Object(r["v"])(e.attributes.id,s)}this.$message({message:"操作指令已发送，视频画面有延迟，请稍等",type:"success"})},refreshFrame:function(){this.$refs["frame"].src=this.videoUrl+"&time="+parseInt(1e5*Math.random())}}},l=o,c=(i("618e"),i("2877")),u=Object(c["a"])(l,s,a,!1,null,null,null);e["default"]=u.exports}}]);