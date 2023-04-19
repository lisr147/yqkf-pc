<template>
  <div
    class="c-block-statistics"
    :data-code="code"
    :data-sszj="sszj"
    :class="[className, countList && countList.length ? 'mt' : '']"
    v-loading="isLoading"
    element-loading-text="加载数据中"
    element-loading-custom-class="loading-mask"
  >
    <div class="header">
      <h3 class="title">
        <template v-if="from!=='townCount'">{{sszj}}</template>{{ title }}
      </h3>
      <el-popover popper-class="screen-popover" v-if="description" width="360" trigger="hover">
        <div v-html="description"></div>
        <i slot="reference" class="el-icon-question board-chart-question"></i>
      </el-popover>
    </div>
    <div class="chart-real-wrapper" ref="chart-real-wrapper">
      <div class="block-statistics-wrapper">
        <!-- 酒店管理信息总览，冷链仓库, 水产品统计, 核酸检测小组采样能力统计,进口物料企业, 医院资源统计 -->
        <div v-if="chartData.detail">
          <div class="card-wrapper">
            <count-card
                v-for="item in chartData.detail"
                :key="item.key"
                :itemName="item.key"
                :num="item.value"
                :color="item.color"
                :column="item.column"
                :unit="item.unit"
            ></count-card>
          </div>
          <div class="footer">
            <span>
              更新时间：{{ chartData.updateTime }} <br />数据来源：{{ chartData.dataSource }}
            </span>
          </div>
        </div>
        <div v-else class="null">{{errMsg}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import CountCard from "./CountCard";
import {
  getHotelInformationOverview,
  getColdWarehouseInfo,
  getNucleicGroupData,
  getWaterProductData,
  getJkwlygjz,
  getHospitalMaterial,
  getNucleicAcidStreet,
  getNucleicAcidWg,
  getControlArea,
  getControlPeople
} from "@/api/bigCharts";
import { mapState } from "vuex";
import { formatTime } from "@/utils/common";
export default {
  name: "BlockStatistics",
  inject: ["handleItemChoosed"],
  props: {
    code: { type: [String, Number], required: true },
    chartHeight: { type: Number, required: false, default: 240 },
    countCode: { type: [String], required: false },
    navBar: { type: [Array], required: false },
    className: { type: String },
    from: { type: String },
    grid: { type: String },
    about: { type: String }, //数据说明

  },
  components: {
    CountCard
  },

  data() {
    return {
      sealAreaData:{},//封控区
      // 组件名称
      componentName: null,
      // 图表基本信息
      chartInfo: {},
      // 图表内容
      chartData: {},
      // 加载中
      isLoading: false,

      //数据来源
      source: "",
      //说明
      description: "",
      //更新时间
      updateTime: "",
      countList: [],
      currentIndex: 1,
      //所属镇街
      sszj: "",
      //所属网格
      sswg: "",
      showFooter: true,
      customHeight: null,
      templateId: null,
      title: '',
      errMsg:"暂无数据"
    };
  },
  watch: {
    code: {
      handler(val) {
        if(this.from==='sealAreatownCount') return
        this.initData(val);
      },
      immediate: true,
    },
    town(val) {
      this.initData(this.code, val);
    },
    sealarea(val){
      this.sealAreaData= val
      this.initData(this.code);
    }
    // grid: {
    //   handler(val) {
    //     if(this.from==='sealArea'){
    //       this.grid = val
    //       this.initData();
    //     }
    //   },
    //   immediate: true,
    // },
  },
  computed: {
    ...mapState("common", ["town","sealarea"]),
  },
  async mounted() {
    this.isLoading = true;
    if(this.from==='sealAreatownCount'){ //封控区
      this.sswg= this.sealarea.sswg
    }
    if(this.from!=='indexRight'){
      await this.initData(this.code);
    }
    this.isLoading = false;
  },
  methods: {
    async initData(code, val) {
      this.sszj = this.town;
      // console.log(187,code);
      switch (code) {
        case 'gljd':
        case 'gdzlxxStreet':
          this.getHotelInformation();
          break
        case 'llck':
          this.getColdWarehouse();
          break
        case 'detectionGroup':
        case 'nucleicGroup':
          this.getNucleicGroup();
          break
        case 'seafoodEmp':
        case 'waterProduct':
          this.getWaterProduct();
          break
        case 'importedMaterial':
          this.getJkwlygjz();
          break
        case 'hosipital':
        case 'hospitalMaterial':
          this.getHospitalMaterial();
          break
        case 'nucleicAcidStreet':
        case 'nucleicAcidWg':
          this.getNucleicAcidStreet();
          break
        case 'controlArea':
          this.getControlArea();
          break
        case 'controlPeople':
          this.getControlPeople();
          break

      }
    },
    async getHotelInformation() {
      let params = {
        sszj: this.sszj,
      };
      if(this.grid) params.sswg = this.grid
      if(this.sswg) params.sswg = this.sswg
      let res = await getHotelInformationOverview(params);
      this.title = "隔离酒店管理信息";
      this.templateId = 1;
      this.showFooter = false;
      this.customHeight = 380;
      let flterItem=['更新时间','数据来源']
      let updateTime = res.find(v=>v.name==='更新时间')['value']
      let dataSource = res.find(v=>v.name==='数据来源')['value']
      let detail = res.filter(v=>!flterItem.includes(v.name))
      detail.map(v=>v.key=v.name)
      this.chartData = {
        detail,
        updateTime,
        dataSource
      }
      this.description = '统计隔离酒店的各种资源情况。该数据由区卫生健康局在疫情防控指挥平台数据台账管理系统上传数据，每天更新。';
    },
    async getColdWarehouse() {
      let params = {
        sszj: this.sszj,
      };
      if(this.grid) params.sswg = this.grid //首页单个
      if(this.sswg) params.sswg = this.sswg  //封控区多个
      let res = await getColdWarehouseInfo(params);

      this.title = '冷链仓库工作人员统计';
      this.templateId = 2;
      this.customHeight = 270;
      this.chartData = res;
      this.description = res.description;
      this.chartData.updateTime=res.updateTime?formatTime(res.updateTime):formatTime(new Date());
    },
    async getWaterProduct() {
      let params = {
        sszj: this.sszj,
      };
      if(this.grid) params.sswg = this.grid
      if(this.sswg) params.sswg = this.sswg

      let res = await getWaterProductData(params);

      this.title = '水产品生产企业产量统计';
      this.templateId = 3;
      this.customHeight = 270;
      res.detail.map(v=>{
        let num = v.value.toString().split(".")[1]?.length || 0
        if(num>3){
          v.value = v.value.toFixed(3)
        }
      })
      this.chartData = res;
      this.description = '统计水产品生产企业的产量情况。该数据由区农业农村局在疫情防控指挥平台数据台账管理系统上传数据，每周更新。';
      this.chartData.updateTime=res.updateTime?formatTime(res.updateTime):formatTime(new Date());
    },
    async getNucleicGroup() {
      let params = {
        sszj: this.sszj,
      };
      if(this.grid) params.sswg = this.grid
      if(this.sswg) params.sswg = this.sswg

      let res = await getNucleicGroupData(params);
      this.title = '核酸检测小组采样能力统计';
      this.templateId = 4;
      this.customHeight = 270;
      this.chartData = res;
      this.description = res.description;
      this.description = '统计核酸采样点的采样能力。该数据由区卫生健康局在疫情防控指挥平台数据台账管理系统上传数据，每周更新。';
      this.chartData.updateTime=res.updateTime?formatTime(res.updateTime):formatTime(new Date());
    },
    async getJkwlygjz() {
      let params = {
        sszj: this.sszj,
      };

      if(this.grid) params.sswg = this.grid
      if(this.sswg) params.sswg = this.sswg

      let res = await getJkwlygjz(params);
      this.title = '进口物料企业员工接种情况';
      this.templateId = 5;
      this.customHeight = 270;
      this.chartData = res;
      this.description = res.description;
      this.chartData.updateTime=res.updateTime?formatTime(res.updateTime):formatTime(new Date());
    },
    async getHospitalMaterial() {
      let params = {
        sszj: this.sszj,
      };
      if(this.grid) params.sswg = this.grid
      if(this.sswg) params.sswg = this.sswg

      let res = await getHospitalMaterial(params);
      this.title = '医院资源统计';
      this.templateId = 6;
      this.customHeight = 320;
      if(this.from.includes('townCount')){
        res.detail.map((i)=>{
          i.column = 'col-3'
        })
      }
      this.chartData = res;
      this.description = '统计南沙区医院的各类资源情况。该数据由区卫生健康局在疫情防控指挥平台数据台账管理系统上传数据方式每周更新。';
      this.chartData.updateTime=res.updateTime?formatTime(res.updateTime):formatTime(new Date());
    },

    //核酸检测采样点
    async getNucleicAcidStreet() {
      let params = {}
      let res
      if(this.grid){  //网格
        params.sswg = this.grid
        res = await getNucleicAcidWg(params);
      }else if(this.sswg){ //封控区
        params.sswg = this.sswg
        res = await getNucleicAcidWg(params);
      } else { //镇街
        res = await getNucleicAcidStreet(params);
      }
      let data = res.data[0]
      delete data.name
      let detail=[]
      for (const okey in data) {
        detail.push( {okey:okey,value:data[okey]})
      }
      detail.map((i)=>{
        i.color = 'green'
        if( i.okey ==='YIJJJ') i.key ='应检尽检'
        if( i.okey ==='YJJJ') i.key ='愿检尽检'
        if( i.okey ==='HMRY') i.key ='黄码人员'
        if( i.okey ==='ZGFXLNS') i.key ='中高风险来南沙'
      })
      this.title = '核酸检测采样点';
      this.description = '统计各类核酸采样点数量。该数据由区卫生健康局在疫情防控指挥平台数据台账管理系统上传数据，每周更新。';
      this.chartData ={
        detail,
        updateTime:res.updateTime,
        dataSource:res.source
      }
    },

    //封控区面积
    async getControlArea(){
      let params = {}
      if(this.sealAreaData) {
        params.sswg=this.sealAreaData.sswg
      }
      let res = await getControlArea(params)
      this.title = '面积';
      res.detail.map((v)=>{
        v.unit='km²'
        if(v.key==='封闭区') v.color='red'
        if(v.key==='封控区') v.color='yellow'
        if(v.key==='防控区') v.color='blue'
        if(v.key==='健康管理区') v.color='green'
      })
      this.chartData = res;
      // this.description = '统计水产品生产企业的产量情况。该数据由区农业农村局在疫情防控指挥平台数据台账管理系统上传数据，每周更新。';
      this.chartData.updateTime=res.updateTime?formatTime(res.updateTime):formatTime(new Date());
    },
    //封控人口
    async getControlPeople(){
      let params = {}
      if(this.sealAreaData) {
        params.sswg=this.sealAreaData.sswg
      }
      let res = await getControlPeople(params)
      this.title = '人口';
      res.detail.map((v)=>{
        v.unit='人'
        if(v.key==='封闭区') v.color='red'
        if(v.key==='封控区') v.color='yellow'
        if(v.key==='防控区') v.color='blue'
        if(v.key==='健康管理区') v.color='green'
      })
      this.chartData = res;
      // this.description = '统计水产品生产企业的产量情况。该数据由区农业农村局在疫情防控指挥平台数据台账管理系统上传数据，每周更新。';
      this.chartData.updateTime=res.updateTime?formatTime(res.updateTime):formatTime(new Date());
    }
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.c-block-statistics {
  margin: 3px 0;
  overflow: hidden;
  //background-color: #102460;
  padding-bottom: 10px;
  .el-icon-question {
   color: #fff;
  }
  .el-popover__reference-wrapper {
    color: #fff;
  }
  .card-wrapper {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin: 3px 0;
    padding-left: 10px;

    .card{
      //cursor: pointer;
      width: 40%;
      color: #fff;
      padding: 10px;
      text-align: center;
      margin:5px;
      display: flex;
      align-items: center;
      flex-direction: column;
      position: relative;
      background: linear-gradient(90deg, rgba(244, 151, 77, 0.2) 0%, rgba(241, 153, 71, 0.03) 100%);
      .t1{
        font-size: 12px;
        color: #fff;
        margin: 2px auto;
        text-align: center;
      }
      .t2{
        font-weight: 600;
        font-size: 24px;
        font-family: Bebas;
        color: #F4974E;
      }
      .icon{
        position: absolute;
        right: 10px;
        top:50%;
        transform: translateY(-50%);
      }
    }
  }
  .header {
    box-sizing: border-box;
    background: url(../../assets/image/bigCharts/title-bg1.png);
    width: 398px;
    height: 46px;
    background-size: 100%;
    margin: -1px;
    position: relative;
    .title {
      display: inline-block;
      margin-left: 16px;
      margin-top: 8px;
      padding: 0 0.5em;
      font-size: 16px;
      line-height: 1.1em;
      font-weight: normal;
      color: #95dafa;
    }
    .link {
      cursor: pointer;
      color: #fff;
      right: 60px;
      top: 0px;
      position: absolute;
    }
  }
  .footer {
    box-sizing: border-box;
    text-align: left;
    vertical-align: top;
    font-size: 12px;
    color: #6686e6;
    margin: 4px 20px 0;
    padding: 5px 10px;
    //background-image: linear-gradient(to right, #18347c, #102460);
    word-wrap: break-word;
    .footer-m {
      display: inline-block;
      word-wrap: break-word;
    }
    span {
      display: inline-block;
      margin-right: 4px;
    }
  }
  .null{
    color: #fff;
    height: 180px;
    text-align: center;
    line-height: 180px;
  }
}
</style>
