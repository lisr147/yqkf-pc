(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6dad98d9"],{"2dc2":function(e,t,a){"use strict";a("a309")},"81be":function(e,t,a){"use strict";var l=a("4795"),r=a.n(l),i=a("c1df"),s=a.n(i);function n(e,t,a,l,r,i,s){try{var n=e[i](s),o=n.value}catch(c){return void a(c)}n.done?t(o):Promise.resolve(o).then(l,r)}function o(e){return function(){var t=this,a=arguments;return new Promise((function(l,r){var i=e.apply(t,a);function s(e){n(i,l,r,s,o,"next",e)}function o(e){n(i,l,r,s,o,"throw",e)}s(void 0)}))}}t["a"]={methods:{getTableKeys:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"10001",l=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return new Promise(function(){var i=o(r.a.mark((function i(n){var o;return r.a.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return e.tableShow=!1,e.tableListData=e.$options.data().tableListData,r.next=4,e.$Api().ImportDataController.get_config.request({path:{id:a}});case 4:if(o=r.sent,e.dataKeys=o.columns,e.dataKeys.forEach((function(e){"jdid"===e.storeFiled&&(e.fieldName="隔离酒店")})),"10001"===a&&(e.tableListData.tableKeys.push({id:"glzt",label:"隔离状态",minWidth:120}),e.tableListData.tableKeys.push({id:"yglsc",label:"已隔离时长",minWidth:120,formatter:function(e){if(!e.ksglsj)return"未知";var t=new Date(e.ksglsj).getTime(),a=(new Date).getTime(),l=(a-t)/1e3/60/60;if(l<0)return"未知";if(l<24)return Math.floor(l)+"小时";var r=Math.floor(l%24);return l=Math.floor(l/24),l+"天"+r+"小时"}}),e.tableListData.tableKeys.push({id:"ksglsj",label:"开始隔离时间",minWidth:160})),o.columns.forEach((function(t){if(t.show){if("jdid"===t.storeFiled)return;e.tableListData.tableKeys.push({id:t.storeFiled,label:t.fieldName,minWidth:30*t.fieldName.length,searchable:t.searchable,allways:["sfzhzhm","lxdh","xm"].includes(t.storeFiled),formatter:function(e){var a;return e.hasOwnProperty(t.storeFiled)?a=e[t.storeFiled]:e.GAData&&e.GAData.hasOwnProperty(t.storeFiled)&&(a=e.GAData[t.storeFiled]),!a||"createTime"!==t.storeFiled&&"updateTime"!==t.storeFiled||(a=s()(a).format("YYYY-MM-DD HH:mm:ss")),a}})}t.searchable&&e.$set(e.filter,t.storeFiled,"")})),e.tableListData.tableKeys.sort((function(e,a){return t.indexOf(a.id)-t.indexOf(e.id)})),e.tableShow=!0,l){r.next=14;break}return n(),r.abrupt("return");case 14:e.resetSearch(),n();case 16:case"end":return r.stop()}}),i)})));return function(e){return i.apply(this,arguments)}}())}}}},a309:function(e,t,a){},b329:function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[e.tableListData.tableKeys.length?a("table-page",{staticClass:"data-view-table",attrs:{data:e.tableListData,filter:e.filter,defaultSearchMore:!0},on:{search:e.search,resetSearch:e.resetSearch,sizeChange:e.sizeChange,currentChange:e.currentChange,tableSelectionChange:e.tableSelectionChange}},[a("template",{slot:"searchFilter"},[a("el-form",{staticClass:"area-main-filter",attrs:{inline:!0,model:e.filter,"label-width":"140px"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search(t)}}},[a("StatusSelect",{model:{value:e.filter.statu,callback:function(t){e.$set(e.filter,"statu",t)},expression:"filter.statu"}}),a("el-form-item",{attrs:{label:"密接类型"}},[a("el-select",{model:{value:e.filter.mjlx,callback:function(t){e.$set(e.filter,"mjlx",t)},expression:"filter.mjlx"}},[a("el-option",{attrs:{value:"",label:"全部"}}),a("el-option",{attrs:{value:"密切接触者"}}),a("el-option",{attrs:{value:"密接的密接"}}),a("el-option",{attrs:{value:"一般接触者"}}),a("el-option",{attrs:{value:"重点人群"}}),a("el-option",{attrs:{value:"一般人群"}}),a("el-option",{attrs:{value:"其他"}})],1)],1),a("el-form-item",{attrs:{label:"是否运转"}},[a("el-select",{model:{value:e.filter.yz,callback:function(t){e.$set(e.filter,"yz",t)},expression:"filter.yz"}},[a("el-option",{attrs:{value:"",label:"全部"}}),a("el-option",{attrs:{value:"1",label:"是"}}),a("el-option",{attrs:{value:"0",label:"否"}})],1)],1),a("el-form-item",{attrs:{label:"是否分配隔离酒店"}},[a("el-select",{model:{value:e.filter.fpgljd,callback:function(t){e.$set(e.filter,"fpgljd",t)},expression:"filter.fpgljd"}},[a("el-option",{attrs:{value:"",label:"全部"}}),a("el-option",{attrs:{value:"1",label:"是"}}),a("el-option",{attrs:{value:"0",label:"否"}})],1)],1),a("el-form-item",{attrs:{label:"隔离酒店"}},[a("el-select",{model:{value:e.filter.jdid,callback:function(t){e.$set(e.filter,"jdid",t)},expression:"filter.jdid"}},[a("el-option",{attrs:{value:"",label:"全部"}},[e._v("全部")]),e._l(e.hotelList,(function(t){return a("el-option",{key:t.id,attrs:{value:t.id,label:t.jkgcjd}},[e._v(e._s(t.jkgcjd))])}))],2)],1),a("el-form-item",{attrs:{label:"房间人数"}},[a("el-select",{model:{value:e.filter.fjrs,callback:function(t){e.$set(e.filter,"fjrs",t)},expression:"filter.fjrs"}},[a("el-option",{attrs:{value:"",label:"全部"}}),a("el-option",{attrs:{value:"1",label:"1"}}),a("el-option",{attrs:{value:"2",label:"2"}}),a("el-option",{attrs:{value:"3",label:"2个以上"}})],1)],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"导入时间"}},[a("el-date-picker",{attrs:{type:"datetimerange",placeholder:"选择日期时间",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.filterTime.CreateTime,callback:function(t){e.$set(e.filterTime,"CreateTime",t)},expression:"filterTime.CreateTime"}})],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"登车时间"}},[a("el-date-picker",{attrs:{type:"datetimerange",placeholder:"选择日期时间",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.filterTime.Dcsj,callback:function(t){e.$set(e.filterTime,"Dcsj",t)},expression:"filterTime.Dcsj"}})],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"到达酒店时间"}},[a("el-date-picker",{attrs:{type:"datetimerange",placeholder:"选择日期时间",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.filterTime.Jdsmsj,callback:function(t){e.$set(e.filterTime,"Jdsmsj",t)},expression:"filterTime.Jdsmsj"}})],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"开始隔离时间"}},[a("el-date-picker",{attrs:{type:"datetimerange",placeholder:"选择日期时间",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.filterTime.Ksglsj,callback:function(t){e.$set(e.filterTime,"Ksglsj",t)},expression:"filterTime.Ksglsj"}})],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"应解除观察日期"}},[a("el-date-picker",{attrs:{type:"daterange",placeholder:"选择日期时间",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.filterTime.Yjcgcrq,callback:function(t){e.$set(e.filterTime,"Yjcgcrq",t)},expression:"filterTime.Yjcgcrq"}})],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"开始观察日期"}},[a("el-date-picker",{attrs:{type:"daterange",placeholder:"选择日期",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd"},model:{value:e.filter.ksgcrq,callback:function(t){e.$set(e.filter,"ksgcrq",t)},expression:"filter.ksgcrq"}})],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"结束集中观察时间"}},[a("el-date-picker",{attrs:{type:"daterange",placeholder:"选择日期时间",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd"},model:{value:e.filter.jsjzgcsj,callback:function(t){e.$set(e.filter,"jsjzgcsj",t)},expression:"filter.jsjzgcsj"}})],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"结束时间"}},[a("el-date-picker",{attrs:{type:"daterange",placeholder:"选择日期时间",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd"},model:{value:e.filter.jssj,callback:function(t){e.$set(e.filter,"jssj",t)},expression:"filter.jssj"}})],1)],1)],1),a("template",{slot:"controler"},[a("el-button",{attrs:{icon:"el-icon-download",type:"primary"},on:{click:e.exportFile}},[e._v("导出筛选结果")]),a("label",{staticStyle:{"margin-left":"10px"}},[e._v("房间数 : "+e._s(e.fjsCount))])],1)],2):e._e()],1)},r=[],i=a("4795"),s=a.n(i),n=a("b575"),o=a("05d5"),c=a("d2b8"),u=a("81be"),f=a("b592");function d(e,t,a,l,r,i,s){try{var n=e[i](s),o=n.value}catch(c){return void a(c)}n.done?t(o):Promise.resolve(o).then(l,r)}function m(e){return function(){var t=this,a=arguments;return new Promise((function(l,r){var i=e.apply(t,a);function s(e){d(i,l,r,s,n,"next",e)}function n(e){d(i,l,r,s,n,"throw",e)}s(void 0)}))}}var p={name:"data-view",components:{TablePage:o["a"],StatusSelect:f["a"]},mixins:[n["a"],u["a"]],data:function(){return{dialog:null,filter:{pageNum:1,pageSize:c["g"][0],rowTotal:0,pageSizes:c["g"],mjlx:"",yz:"",fpgljd:"",jdid:"",fjrs:"",statu:"",jsjzgcsj:"",ksgcrq:"",jssj:""},tableListData:{selection:!1,columnFunctionsWidth:220,tableData:[],tableKeys:[],tableFunctions:[]},hotelList:[],detail:null,dataKeys:[],fjsCount:"",filterTime:{}}},mounted:function(){var e=this;return m(s.a.mark((function t(){return s.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$Api().HotelController.get_getAllHotelList.request();case 2:e.hotelList=t.sent,e.getTableKeys(["sfzhzhm","lxdh","xm"]);case 4:case"end":return t.stop()}}),t)})))()},methods:{getData:function(){var e=this;return m(s.a.mark((function t(){var a,l,r,i,n;return s.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:for(l in a=JSON.parse(JSON.stringify(e.filter)),delete a.rowTotal,delete a.pageSizes,a)a[l]||delete a[l];for(r in e.filterTime)e.filterTime[r]&&(a["start"+r]=e.filterTime[r][0],a["end"+r]=e.filterTime[r][1]);for(i in a)a[i]||delete a[i];return t.next=8,e.$Api().ConnectionController.post_searchDataByInfo.request({data:a,heaaders:{hideNotify:!0}});case 8:n=t.sent,e.tableListData.tableData=n.data,e.filter.pageNum=n.pageNum,e.filter.pageSize=n.pageSize,e.filter.rowTotal=n.rowTotal,e.fjsCount=n.fjsCount;case 14:case"end":return t.stop()}}),t)})))()},submit:function(e){var t=this;return m(s.a.mark((function a(){return s.a.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(t.dialog=null,console.log(e),t.multiData.length){a.next=5;break}return t.$message({type:"warn",message:"请先选择人员"}),a.abrupt("return");case 5:return a.next=7,t.$Api().RoomController.post_assignByRoom.request({data:{ids:t.multiData.map((function(e){return e._id})),fjh:e.fjh,ksglsj:e.ksglsj}});case 7:t.getData();case 8:case"end":return a.stop()}}),a)})))()},viewInfo:function(e){this.detail=e.row,this.dialog="healty"},viewTL:function(e){this.detail=e.row,this.dialog="timeline"},exportFile:function(){var e=this;return m(s.a.mark((function t(){var a,l,r;return s.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:for(l in a=JSON.parse(JSON.stringify(e.filter)),delete a.rowTotal,delete a.pageSizes,e.filterTime)e.filterTime[l]&&(a["start"+l]=e.filterTime[l][0],a["end"+l]=e.filterTime[l][1]);for(r in a)a[r]||delete a[r];return t.next=7,e.$Api().ConnectionController.post_exportData.request({data:a,responseType:"blob"});case 7:t.sent,e.$message({message:"导出成功",type:"success",duration:3e3,showClose:!0});case 9:case"end":return t.stop()}}),t)})))()},resetSearch:function(){var e=this.filter.pageNum,t=this.filter.pageSize,a=this.filter.rowTotal;this.filter=this.$options.data().filter,this.filterTime=this.$options.data().filterTime,this.filter.pageNum=e,this.filter.pageSize=t,this.filter.rowTotal=a,this.getData()}}},h=p,y=(a("2dc2"),a("2877")),b=Object(y["a"])(h,l,r,!1,null,null,null);t["default"]=b.exports},b575:function(e,t,a){"use strict";t["a"]={data:function(){return{multiData:[]}},methods:{tableSelectionChange:function(e){this.multiData=e},sizeChange:function(e){this.filter.pageSize=e,this.getData()},currentChange:function(e){this.filter.pageNum=e,this.getData()},sortChange:function(e){e.column;var t=e.prop,a=e.order;a?(this.filter.sortOrder="ascending"===a?"ASC":"DESC",this.filter.sortName=t):(this.filter.sortOrder="",this.filter.sortName=""),this.getData()},search:function(){this.filter.pageNum=1,this.getData()},resetSearch:function(){var e=this.filter.pageNum,t=this.filter.pageSize,a=this.filter.rowTotal;this.filter=this.$options.data().filter,this.filter.pageNum=e,this.filter.pageSize=t,this.filter.rowTotal=a,this.getData()}}}},b592:function(e,t,a){"use strict";var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-form-item",{attrs:{label:"状态"}},[a("el-select",{on:{change:e.change},model:{value:e.selectData,callback:function(t){e.selectData=t},expression:"selectData"}},[a("el-option",{attrs:{value:"9",label:"待追踪"}}),a("el-option",{attrs:{value:"8",label:"待转运"}}),a("el-option",{attrs:{value:"5",label:"已扫码登车"}}),a("el-option",{attrs:{value:"1",label:"待分派酒店"}}),a("el-option",{attrs:{value:"6",label:"已分派酒店"}}),a("el-option",{attrs:{value:"4",label:"待分派房间"}}),a("el-option",{attrs:{value:"7",label:"已分派房间"}}),a("el-option",{attrs:{value:"3",label:"隔离中"}}),a("el-option",{attrs:{value:"2",label:"已解除"}}),a("el-option",{attrs:{value:"0",label:"全部"}})],1)],1)},r=[],i={name:"status-select",props:["value"],data:function(){return{selectData:""}},watch:{value:{handler:function(e){this.selectData=e},immediate:!0}},methods:{change:function(e){this.$emit("input",e)}}},s=i,n=a("2877"),o=Object(n["a"])(s,l,r,!1,null,null,null);t["a"]=o.exports}}]);