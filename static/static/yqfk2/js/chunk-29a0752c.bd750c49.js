(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-29a0752c"],{5069:function(t,e,a){"use strict";a("a3a8")},"81be":function(t,e,a){"use strict";var r=a("4795"),n=a.n(r),i=a("c1df"),l=a.n(i);function s(t,e,a,r,n,i,l){try{var s=t[i](l),o=s.value}catch(c){return void a(c)}s.done?e(o):Promise.resolve(o).then(r,n)}function o(t){return function(){var e=this,a=arguments;return new Promise((function(r,n){var i=t.apply(e,a);function l(t){s(i,r,n,l,o,"next",t)}function o(t){s(i,r,n,l,o,"throw",t)}l(void 0)}))}}e["a"]={methods:{getTableKeys:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"10001",r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return new Promise(function(){var i=o(n.a.mark((function i(s){var o;return n.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return t.tableShow=!1,t.tableListData=t.$options.data().tableListData,n.next=4,t.$Api().ImportDataController.get_config.request({path:{id:a}});case 4:if(o=n.sent,t.dataKeys=o.columns,t.dataKeys.forEach((function(t){"jdid"===t.storeFiled&&(t.fieldName="隔离酒店")})),"10001"===a&&(t.tableListData.tableKeys.push({id:"glzt",label:"隔离状态",minWidth:120}),t.tableListData.tableKeys.push({id:"yglsc",label:"已隔离时长",minWidth:120,formatter:function(t){if(!t.ksglsj)return"未知";var e=new Date(t.ksglsj).getTime(),a=(new Date).getTime(),r=(a-e)/1e3/60/60;if(r<0)return"未知";if(r<24)return Math.floor(r)+"小时";var n=Math.floor(r%24);return r=Math.floor(r/24),r+"天"+n+"小时"}}),t.tableListData.tableKeys.push({id:"ksglsj",label:"开始隔离时间",minWidth:160})),o.columns.forEach((function(e){if(e.show){if("jdid"===e.storeFiled)return;t.tableListData.tableKeys.push({id:e.storeFiled,label:e.fieldName,minWidth:30*e.fieldName.length,searchable:e.searchable,allways:["sfzhzhm","lxdh","xm"].includes(e.storeFiled),formatter:function(t){var a;return t.hasOwnProperty(e.storeFiled)?a=t[e.storeFiled]:t.GAData&&t.GAData.hasOwnProperty(e.storeFiled)&&(a=t.GAData[e.storeFiled]),!a||"createTime"!==e.storeFiled&&"updateTime"!==e.storeFiled||(a=l()(a).format("YYYY-MM-DD HH:mm:ss")),a}})}e.searchable&&t.$set(t.filter,e.storeFiled,"")})),t.tableListData.tableKeys.sort((function(t,a){return e.indexOf(a.id)-e.indexOf(t.id)})),t.tableShow=!0,r){n.next=14;break}return s(),n.abrupt("return");case 14:t.resetSearch(),s();case 16:case"end":return n.stop()}}),i)})));return function(t){return i.apply(this,arguments)}}())}}}},a3a8:function(t,e,a){},b575:function(t,e,a){"use strict";e["a"]={data:function(){return{multiData:[]}},methods:{tableSelectionChange:function(t){this.multiData=t},sizeChange:function(t){this.filter.pageSize=t,this.getData()},currentChange:function(t){this.filter.pageNum=t,this.getData()},sortChange:function(t){t.column;var e=t.prop,a=t.order;a?(this.filter.sortOrder="ascending"===a?"ASC":"DESC",this.filter.sortName=e):(this.filter.sortOrder="",this.filter.sortName=""),this.getData()},search:function(){this.filter.pageNum=1,this.getData()},resetSearch:function(){var t=this.filter.pageNum,e=this.filter.pageSize,a=this.filter.rowTotal;this.filter=this.$options.data().filter,this.filter.pageNum=t,this.filter.pageSize=e,this.filter.rowTotal=a,this.getData()}}}},c6cf:function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{title:"健康信息",visible:!0,"append-to-body":"",width:"400px",top:"30px"},on:{close:function(e){return t.$emit("close")}}},[a("el-tabs",{attrs:{type:"card"},model:{value:t.type,callback:function(e){t.type=e},expression:"type"}},[a("el-tab-pane",{attrs:{label:"核酸检查",name:"0"}},[t._l(t.nucleicData,(function(e,r){return a("el-card",{key:"healtyData"+r,staticClass:"box-card"},[a("div",[t._v(" 核酸采样时间 : "+t._s(e.examinationTime)+" ")]),a("div",[t._v(" 核酸检测结果 : "+t._s("0"===e.result?"阴性":"阳性")+" ")]),a("div",[t._v(" 备注 : "+t._s(e.remarks)+" ")])])})),0===t.nucleicData.length?a("el-card",{staticClass:"box-card"},[a("div",[t._v(" 暂无数据 ")])]):t._e()],2),a("el-tab-pane",{attrs:{label:"健康监测",name:"1"}},[t._l(t.healtyData,(function(e,r){return a("el-card",{key:"healtyData"+r,staticClass:"box-card"},[a("div",[t._v(" 健康监测时间 : "+t._s(e.examinationTime)+" ")]),a("div",[t._v(" 体温 : "+t._s(e.temperature)+" 症状 : "+t._s("1"===e.symptom?"有":"无")+" ")]),a("div",[t._v(" 备注 : "+t._s(e.remarks)+" ")])])})),0===t.healtyData.length?a("el-card",{staticClass:"box-card"},[a("div",[t._v(" 暂无数据 ")])]):t._e()],2)],1)],1)},n=[],i=a("4795"),l=a.n(i);function s(t,e,a,r,n,i,l){try{var s=t[i](l),o=s.value}catch(c){return void a(c)}s.done?e(o):Promise.resolve(o).then(r,n)}function o(t){return function(){var e=this,a=arguments;return new Promise((function(r,n){var i=t.apply(e,a);function l(t){s(i,r,n,l,o,"next",t)}function o(t){s(i,r,n,l,o,"throw",t)}l(void 0)}))}}var c={name:"healty-info",props:["data"],data:function(){return{healtyData:{},nucleicData:{}}},mounted:function(){var t=this;return o(l.a.mark((function e(){return l.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$Api().HealthExaminationController.get_searchExamination.request({path:{personId:t.data.id}});case 2:return t.healtyData=e.sent,e.next=5,t.$Api().NucleicAcidExaminationController.get_searchExamination.request({path:{personId:t.data.id}});case 5:t.nucleicData=e.sent;case 6:case"end":return e.stop()}}),e)})))()}},u=c,f=(a("5069"),a("2877")),d=Object(f["a"])(u,r,n,!1,null,null,null);e["a"]=d.exports},ed36:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t.tableListData.tableKeys.length?a("table-page",{attrs:{data:t.tableListData,filter:t.filter},on:{search:t.search,resetSearch:t.resetSearch,sizeChange:t.sizeChange,currentChange:t.currentChange,tableSelectionChange:t.tableSelectionChange}},[a("template",{slot:"searchFilter"},[a("el-form",{staticClass:"area-main-filter",attrs:{inline:!0,model:t.filter,"label-width":"140px"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.search(e)}}},[a("el-form-item",{attrs:{label:"联系电话"}},[a("el-input",{attrs:{type:"text",placeholder:"请输入手机号码"},model:{value:t.filter.phone,callback:function(e){t.$set(t.filter,"phone",e)},expression:"filter.phone"}})],1),a("el-form-item",{attrs:{label:"姓名"}},[a("el-input",{attrs:{type:"text",placeholder:"请输入姓名"},model:{value:t.filter.name,callback:function(e){t.$set(t.filter,"name",e)},expression:"filter.name"}})],1),a("el-form-item",{attrs:{label:"隔离酒店"}},[a("el-select",{model:{value:t.filter.jdid,callback:function(e){t.$set(t.filter,"jdid",e)},expression:"filter.jdid"}},[a("el-option",{attrs:{value:t.hotelAllIds,label:"全部"}},[t._v("全部")]),t._l(t.hotelList,(function(e){return a("el-option",{key:e.id,attrs:{value:e.id,label:e.jkgcjd}},[t._v(t._s(e.jkgcjd))])}))],2)],1),a("el-form-item",{attrs:{label:"状态"}},[a("el-select",{model:{value:t.filter.glzt,callback:function(e){t.$set(t.filter,"glzt",e)},expression:"filter.glzt"}},[a("el-option",{attrs:{value:"隔离中"}}),a("el-option",{attrs:{value:"已解除"}}),a("el-option",{attrs:{value:"已转诊"}}),a("el-option",{attrs:{value:"转密接"}}),a("el-option",{attrs:{label:"全部",value:""}})],1)],1),a("el-form-item",{attrs:{label:"密接类型"}},[a("el-select",{model:{value:t.filter.mjlx,callback:function(e){t.$set(t.filter,"mjlx",e)},expression:"filter.mjlx"}},[a("el-option",{attrs:{value:"",label:"全部"}}),a("el-option",{attrs:{value:"密切接触者"}}),a("el-option",{attrs:{value:"密接的密接"}}),a("el-option",{attrs:{value:"一般接触者"}}),a("el-option",{attrs:{value:"重点人群"}}),a("el-option",{attrs:{value:"一般人群"}})],1)],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"开始观察日期"}},[a("el-date-picker",{attrs:{type:"daterange",placeholder:"选择日期",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd"},model:{value:t.filter.ksgcrq,callback:function(e){t.$set(t.filter,"ksgcrq",e)},expression:"filter.ksgcrq"}})],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"结束集中观察时间"}},[a("el-date-picker",{attrs:{type:"daterange",placeholder:"选择日期时间",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd"},model:{value:t.filter.jsjzgcsj,callback:function(e){t.$set(t.filter,"jsjzgcsj",e)},expression:"filter.jsjzgcsj"}})],1),a("el-form-item",{staticClass:"search2x",attrs:{label:"结束时间"}},[a("el-date-picker",{attrs:{type:"daterange",placeholder:"选择日期时间",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd"},model:{value:t.filter.jssj,callback:function(e){t.$set(t.filter,"jssj",e)},expression:"filter.jssj"}})],1)],1)],1),a("template",{slot:"controler"},[a("el-button",{attrs:{type:"primary"},on:{click:t.removeIsolation}},[t._v("解除隔离")]),a("el-button",{attrs:{type:"primary"},on:{click:t.transferTreatment}},[t._v("转诊")]),a("el-button",{attrs:{type:"primary"},on:{click:t.transferConnection}},[t._v("转密接")])],1)],2):t._e(),t.detail?a("HealtyInfo",{attrs:{data:t.detail},on:{close:function(e){t.detail=null}}}):t._e()],1)},n=[],i=a("4795"),l=a.n(i),s=a("b575"),o=a("05d5"),c=a("d2b8"),u=a("c6cf"),f=a("81be");function d(t,e,a,r,n,i,l){try{var s=t[i](l),o=s.value}catch(c){return void a(c)}s.done?e(o):Promise.resolve(o).then(r,n)}function h(t){return function(){var e=this,a=arguments;return new Promise((function(r,n){var i=t.apply(e,a);function l(t){d(i,r,n,l,s,"next",t)}function s(t){d(i,r,n,l,s,"throw",t)}l(void 0)}))}}var p={name:"hotel",components:{TablePage:o["a"],HealtyInfo:u["a"]},mixins:[s["a"],f["a"]],data:function(){return{dialog:null,filter:{pageNum:1,pageSize:c["g"][0],rowTotal:0,pageSizes:c["g"],glzt:"",jdid:"",phone:"",mjlx:"",jsjzgcsj:null,ksgcrq:null,jssj:null},tableListData:{selection:!0,columnFunctionsWidth:120,tableData:[],tableKeys:[],tableFunctions:[]},hotelList:[],detail:null,hotelAllIds:""}},mounted:function(){var t=this;return h(l.a.mark((function e(){return l.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$Api().HotelController.get_getAllHotelList.request();case 2:t.hotelList=e.sent,t.getTableKeys(["jdmc","sfzhzhm","lxdh","xm","fjh","ksglsj","yglsc","glzt"]);case 4:case"end":return e.stop()}}),e)})))()},methods:{resetSearch:function(){var t=this.filter.pageNum,e=this.filter.pageSize,a=this.filter.rowTotal;this.filter=this.$options.data().filter,this.filter.pageNum=t,this.filter.pageSize=e,this.filter.rowTotal=a,this.filter.jdid=this.hotelAllIds,this.getData()},getData:function(){var t=this;return h(l.a.mark((function e(){var a,r;return l.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=JSON.parse(JSON.stringify(t.filter)),delete a.rowTotal,delete a.pageSizes,e.next=5,t.$Api().ConnectionController.post_searchByInfo.request({data:a,heaaders:{hideNotify:!0}});case 5:r=e.sent,t.tableListData.tableData=r.data,t.filter.pageNum=r.pageNum,t.filter.pageSize=r.pageSize,t.filter.rowTotal=r.rowTotal;case 10:case"end":return e.stop()}}),e)})))()},viewInfo:function(t){this.detail=t.row},removeIsolation:function(){var t=this;return h(l.a.mark((function e(){return l.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.multiData.length){e.next=3;break}return t.$message({type:"warn",message:"请先选择人员"}),e.abrupt("return");case 3:return e.next=5,t.$Api().IsolationStatusController.post_removeIsolation.request({data:{ids:t.multiData.map((function(t){return t.id}))}});case 5:t.getData();case 6:case"end":return e.stop()}}),e)})))()},transferConnection:function(){var t=this;return h(l.a.mark((function e(){return l.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.multiData.length){e.next=3;break}return t.$message({type:"warn",message:"请先选择人员"}),e.abrupt("return");case 3:return e.next=5,t.$Api().IsolationStatusController.post_transferConnection.request({data:{ids:t.multiData.map((function(t){return t.id}))}});case 5:t.getData();case 6:case"end":return e.stop()}}),e)})))()},transferTreatment:function(){var t=this;return h(l.a.mark((function e(){return l.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.multiData.length){e.next=3;break}return t.$message({type:"warn",message:"请先选择人员"}),e.abrupt("return");case 3:return e.next=5,t.$Api().IsolationStatusController.post_transferTreatment.request({data:{ids:t.multiData.map((function(t){return t.id}))}});case 5:t.getData();case 6:case"end":return e.stop()}}),e)})))()}}},m=p,v=a("2877"),g=Object(v["a"])(m,r,n,!1,null,null,null);e["default"]=g.exports}}]);