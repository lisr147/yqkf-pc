<template>
  <div id="app" class="help-document">
    <header>
      <b class="trigger" @click="toggleMenu()"></b>
      <h1 class="caption">
         {{curTitle || '帮助中心'}}
      </h1>
      <div class="tool">
        <span class="item btn-home"><a href="./">综合门户</a></span>
        <!-- <span class="item btn-qrcode" @click="showQrCode">用手机观看</span> -->
      </div>
    </header>

    <div class="backbone">
      <aside  v-show="menuVisible">
        <el-tree node-key="id" ref="tree" :indent="0" :data="menuTree" :default-expand-all="true" :props="defaultProps" @node-click="chooseItem"></el-tree>
      </aside>

      <main>
        <iframe :src="src" class="wrap"></iframe>
      </main>
    </div>


    <div class="pop" v-show="qrcodeVisible">
      <div class="pop-mask" @click="qrcodeVisible=false"></div>
      <div class="pop-main" id="qrcode"></div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Help',
  data(){
    return {
      src: '',
      curId: null,
      curTitle: '',
      menuVisible: true,
      isMobile: false,

      menuTree: [{
        name: '帮助文档',
        children: [
          { id:'sentinelSiteRiskPersonnelManagementInstructions',name: '哨点人员管理-操作手册', url: 'sentinelSiteRiskPersonnelManagementInstructions.pdf' },
          { id:'managementSystemDataTypeInOperationGuidelines',name: '后台管理系统-数据录入-操作手册', url: 'managementSystemDataTypeInOperationGuidelines.pdf' },
          { id:'buyMedicineForVerificationInstructions',name: '购药监控核查-操作手册', url: 'buyMedicineForVerificationInstructions.pdf' },
          { id:'truckDriverManagementInstructions',name: '货车司机管理-操作手册', url: 'truckDriverManagementInstructions.pdf' },
          { id:'flowManagementSystemInstructions',name: '流调管理系统-操作手册', url: 'flowManagementSystemInstructions.pdf' },
          { id:'contactTimeContactPersonnelToCheckInstructions',name: '密接次密人员核查-操作手册', url: 'contactTimeContactPersonnelToCheckInstructions.pdf' },
          { id:'specialPopulationsServiceInstructionsForReportingAlarmFunction',name: '特殊人群服务上报-操作手册', url: 'specialPopulationsServiceInstructionsForReportingAlarmFunction.pdf' },
          { id:'nucleicAcidTestingPointLineMapUserGuide',name: '核酸采样点排队地图-操作手册', url: 'nucleicAcidTestingPointLineMapUserGuide.pdf' },
          { id:'yellowCodeTooMuchAlarm',name: '黄码人员过多告警-操作手册', url: 'yellowCodeTooMuchAlarm.pdf' },
          { id:'involvedInDiseaseAreaToNanshaPersonnelDataServices',name: '涉疫地区来南沙人员数据服务-操作手册', url: 'involvedInDiseaseAreaToNanshaPersonnelDataServices.pdf' },
          { id:'nucleicAcidSamplePointIsRecommended',name: '核酸采样点推荐-操作手册', url: 'nucleicAcidSamplePointIsRecommended.pdf' },
          { id:'aiIntelligentAnalysisModuleOperationManual',name: 'AI智能分析模块操作手册', url: 'aiIntelligentAnalysisModuleOperationManual.pdf' },
          { id:'nucleicAcidTestingPointLineMap-UserGuideVideo',name: '核酸采样点排队地图-操作视频', url: 'nucleicAcidTestingPointLineMap-UserGuideVideo.mp4' },
            { id: 'sweepYardsQuantityMonitoringInKeySites', name: '重点场所扫码量监控-操作视频', url: 'sweepYardsQuantityMonitoringInKeySites.mp4' },
          { id:'企业端_导入新增数据_操作说明',name: '企业端-导入新增数据-操作说明', url: '企业端_导入新增数据_操作说明.pdf' },
          { id:'enterpriseSideEntryEmployeeInformation',name: '企业端录入员工信息-操作视频', url: 'enterpriseSideEntryEmployeeInformation.mp4' },
          { id: 'streetUsers-MobileEnd-ImportOrNewSentinelEnterprises-OperatingVideo', name: '镇街用户-移动端-导入/新增哨点企业-操作视频', url: 'streetUsers-MobileEnd-ImportOrNewSentinelEnterprises-OperatingVideo.mp4' },
          { id: 'tjhscyd', name: '大屏端-推荐核酸采样点-导出-操作指引视频', url: 'tjhscyd.mp4' },
          { id:'sydqlnsrysjfw',name: '大屏端-涉疫地区来南沙人员数据服务-查看操作指引视频', url: 'sydqlnsrysjfw.mp4' },
        ]
      }],

      defaultProps: {
        children: 'children',
        label: 'name'
      },

      qrcode: null,
      qrcodeVisible: false
    }
  },
  created(){
    this.isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
  },
  mounted(){
    this.init()
  },
  computed: {
    baseUrl() {
      return `${process.env.NODE_ENV === 'production' ? '/yqfk' : process.env.BASE_URL}/static`;
    },
  },
  methods: {

    init () {
      if (this.isMobile) {
        this.menuVisible = false
      }

      //初始页面
      let { id } = this.getHash()
      console.log(id, 'id');
      if (id != undefined) {
        let match = this.$refs['tree'].getNode(id)
        if (match) {
          this.setUrl(match.data)
          return
        }
      }
      this.setUrl(this.menuTree[0].children[0])

    },

    setUrl ({ url, id, name } = {}) {
      if (url == undefined) {
        this.src = `${location.origin}${process.env.VUE_APP_BASE_API}/pdf/web/viewer.html`
        location.hash = ''
        this.curId = null
        this.curTitle = ''
      } else {
        switch(url.split('.')[1]) {
          case 'pdf':
            this.src = `${process.env.VUE_APP_BASE_API}/static/docs/${url}`;
            break
          case 'mp4':
            this.src = `${process.env.VUE_APP_BASE_API}/static/videos/${url}`;
            break
          default:
            this.src = `${process.env.VUE_APP_BASE_API}/static/${url}`;
        }
        location.hash = `#id=${id}`
        this.curId = id
        this.curTitle = name
      }
      this.$refs['tree'].setCurrentKey(this.curId)
    },

    toggleMenu ( val) {
      if (val == undefined) {
        this.menuVisible = !this.menuVisible
      } else {
        this.menuVisible = val
      }
    },

    chooseItem(item){
      if (item.url) {
        this.setUrl(item)
      }
      if (this.isMobile) {
        this.menuVisible = false
      }
    },

    getHash () {
      let str = location.hash.replace('#', '')
      let arr = str.split('&')
      let obj = {}
      arr.forEach(item => {
        let sb = item.split('=')
        if (sb.length == 2 && sb[1] !== '') {
          obj[sb[0]] = sb[1]
        }
      })
      return obj
    },
  }
}
</script>
<style  lang="scss"  rel="stylesheet/scss">
  .help-document{
    display: flex;
    flex-direction: column;

    header {
      position: relative;
      padding: 0 ;
      background-color: #4b73ea;
      color: #fff;
      min-height: 40px;
      line-height: 40px;

      .caption{
        display: inline-block;
        padding: 0.2em  0.4em ;
        box-sizing: border-box;
        vertical-align: top;
        height: 40px;
        line-height: 34px;
        color: #fff;
        font-size: 16px;
      }
      .trigger{
        display: inline-block;
        width: 40px;
        height: 40px;
        background: url("~@assets/image/help/ico-menu.svg") no-repeat center center;
        vertical-align: top;
        cursor: pointer;

        &:hover{
          background-color: #6088ea;
        }
      }
      .tool{
        position: absolute;
        top: 0;
        right:0em;

        a{
          color: #fff;
        }

        .item{
          padding:.2em 1em .2em 1.8em;
          cursor: pointer;
          background:  no-repeat left center;
        }
        .btn-home{
          background-image: url("~@assets/image/help/ico-home.svg");
        }
        .btn-qrcode{
          background-image: url("~@assets/image/help/ico-drcode.svg");
        }
      }
    }

    .backbone {
      display: flex;
      flex:1;
      flex-direction: row;
      position: relative;
      width: 100%;
      height: 100%;

      aside{
        box-sizing: border-box;
        width: 220px;
        background-color: #fff;

        ul{
          padding: 1em 0;
        }
        li{
          padding: 0.5em 1em;
          line-height: 1.6em;
          cursor: pointer;

          &:hover{
            background-color: #a6bef2;
            color: #fff;
          }
          &.active{
            background-color: #6d94ea;
            color: #fff;
          }
        }
      }
      main{
        flex:1;
        position: relative;

        iframe{
          position: absolute;
          width:100%;
          height: 100%;
          border:0 none;
          outline: none;
        }
      }
    }

    .pop{
      position: relative;
      top:0;
      left:0;

      .pop-main{
        position: fixed;
        top:50%;
        left:50%;
        padding: 1em;
        z-index: 10000;
        transform: translate(-50%, -50%);
        background-color: #fff;
        width: 200px;
        height: 200px;
      }
      .pop-mask{
        position: fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-color: rgba(0,0,0,0.6);
        z-index: 9999;
      }
    }

    .el-tree{
      padding: 1em 0;
    }
    .el-tree-node__content{
      height: 32px !important;
    }
    .el-tree-node__content:hover{
      background-color: #6d94ea !important;
      color: #fff;
    }
    .is-current> .el-tree-node__content{
      background-color: #6d94ea !important;
      color: #fff;
    }

  }

  @media screen and(max-width: 1000px) {
    .help-document{

      .backbone{
        aside{
          z-index: 999;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;

          ul{
            padding:0;
          }
          li{
            padding: 1em;
            font-size: 14px;
            border-bottom: 1px solid #ceddf9;
          }
        }
      }
    }

  }

  @media screen and(max-width: 600px) {
    .help-document .tool {
      display: none;
    }
  }
</style>
