<template>
  <div class="report-layer">
    <div class="sidebar pl" v-if="showLeft" :class="{folder: folder.left}" :style="{width: leftWidth}">
      <template v-if="!folder.left">
        <h3 class="sidebar-title">图表总览</h3>
        <div class="edit-charts" v-if="showRight">
          <ul>
            <li title="设置" v-if="!isReportEdit">
              <el-button  type="text" size="medium" @click="handleEditLayout"><i class="el-icon-s-tools"></i> 设置</el-button>
            </li>
            <li class="item" v-else>
              <el-button class="save-btn" type="text" size="small " @click="handleSaveLayout">保存</el-button>
              <el-button class="cancel-btn" type="text" size="small " @click="handleCancelLayout">取消</el-button>
            </li>
          </ul>
        </div>
      </template>
      <main :class="{fl: folder.left}">

        <div class="side-box" :class="{'side-box1': index === 0}" v-for="(item,index) in layout.left" :key="item.i" v-if="!item.slot">
          <div v-if="item.list && item.list.length">
            <el-carousel :interval="10000" indicator-position="outSide" arrow="never" trigger="click" :autoplay="true" :height="(item.height+75)+'px'">
              <el-carousel-item v-for="listItem in item.list" :key="listItem.id">
                <data-board :about="listItem.about" :id="listItem.id"  :code="listItem.code" :countCode="listItem.countCode" :title="listItem.title" :navBar="listItem.navBar" :chartHeight="listItem.height"></data-board>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div v-else>
            <!--中高风险人员计数器-->
            <risk-count v-if="item.code==='getRiskAreasMsgPC'" ref="riskCount" @showMhRiskDetail="showMhRiskDetail"></risk-count>
            <!--实时告警-->
            <event-alarm-list v-else-if="item.code==='eventAlarmList'" ref="evenAlarmList"></event-alarm-list>
            <!--实时上报核酸采样点排队情况-->
            <real-time-line-up v-else-if="item.code==='RealTimeLineUp'"></real-time-line-up>

            <data-board v-else :about="item.about"  :id="item.id" :code="item.code" :countCode="item.countCode" :title="item.title" :navBar="item.navBar" :chartHeight="item.height"  :from="`${from}Left`"></data-board>
            <div class="side-box-mask" v-show="isEdit">
              <div class="btns">
                <el-button icon="el-icon-edit" type="primary" size="small" class="btn" @click="editChart('left', index)">替换</el-button>
                <el-button icon="el-icon-delete" type="warning" size="small" class="btn" @click="delChart('left', index)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
        <slot :name="item.slot" v-else></slot>

        <div class="side-add" v-show="isEdit">
          <el-button icon="el-icon-plus" type="primary" size="mini" class="btn" @click="addChart('left', layout.left.length)">添加</el-button>
        </div>
      </main>
      <div class="trb" @click="toggleSidebar('left')">
        <i :class="[folder.left?'el-icon-arrow-right' :'el-icon-arrow-left']"></i>
      </div>
    </div>

    <div class="sidebar pr" v-if="showRight" :class="{folder: folder.right}" :style="{width: rightWidth}">
      <h3 class="sidebar-title" v-if="!folder.right">联动图表</h3>
      <main :class="{fr: folder.right}" >
        <div class="side-box" v-for="(item,index) in layout.right" :key="item.i" v-if="!item.slot">
          <div v-if="item.list && item.list.length">
            <el-carousel  :interval="10000" indicator-position="outSide" arrow="never" trigger="click"  :height="(item.height+75)+'px'" :autoplay="true">
              <el-carousel-item v-for="listItem in item.list" :key="listItem.id" height="500">
                <data-board :id="listItem.id" :code="item.code" :about="listItem.about" :title="listItem.title" :countCode="listItem.countCode" :navBar="listItem.navBar" :chartHeight="listItem.height"></data-board>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div v-else>
            <data-board :from="`${from}Right`" :about="item.about" v-bind="$attrs" :id="item.id" :code="item.code" :title="item.title" :countCode="item.countCode" :navBar="item.navBar" :chartHeight="item.height" :updateTimeType="item.updateTimeType"></data-board>

          </div>
        </div>
        <slot :name="item.slot" v-else></slot>

        <div class="side-add" v-show="isEdit">
        </div>
      </main>
      <div class="trb" @click="toggleSidebar('right')">
        <i :class="[folder.right?'el-icon-arrow-left' :'el-icon-arrow-right']"></i>
      </div>
    </div>

    <!--选择图表-->
    <report-list class="screen-wrap" v-model="chartListVisible"  @select="confirmItem"></report-list>

  </div>
</template>

<script>
  import DataBoard from '@/components/charts/DataBoard'
  import { saveDashboardLayout,getDashboardLayout } from '@/api/report'
  import ReportList from "@/components/report/ReportList"
  import {deepClone} from "@/utils/global"
  import {getRandomId} from '@/utils/global'
  import {mapState } from 'vuex'
  import RiskCount from "@/views/big/RiskCount"
  import EventAlarmList from "@/views/big/EventAlarmList"
  import RealTimeLineUp from "@/views/big/RealTimeLineUp"
  // import Cookies from "js-cookie"

  export default {
    name: "ReportLayer",
    components: {
      EventAlarmList,
      ReportList,
      DataBoard,
      RiskCount,
      RealTimeLineUp
    },
    props: {
      dashboardCode: {type: String, default: 'Index'},
      titleLeft: {type: String},
      titleRight: {type: String},
      slots: {type: String},
      leftWidth: {type: String, default: '398px'},
      rightWidth: {type: String, default: '398px'},
      visibleIds:{type: Array},
      from:{type: String},//来源（主页or封控区）
      showLeft:{type: Boolean,default:true},
      showRight:{type: Boolean,default:true},
    },
    data() {
      return {
        // 当前仪表盘布局id
        id: null,

        layout: {
          left: [],
          right: []
        },
        oldLayout: {},

        folder: {
          left: false,
          right: false
        },

        // 是否显示可选图表面板
        chartListVisible: false,
        // 当前编辑的图表位置
        editPosition: {
          isNew: false,
          fieldName: null,
          index: null
        },

        enableClickSave: true,
        // legendData: null
      }
    },
    computed: {
      ...mapState('report', ['isEdit','isSaving','isCancel','rightFolder']),
      isReportEdit () {
        // console.log(138,this.$store.state.report.isEdit);
        return this.$store.state.report.isEdit
      },
    },
    watch: {
      visibleIds(val){
      },

      isEdit(val) {
        if (val == true) {
          //暂存布局
          this.oldLayout = deepClone(this.layout)
        }
      },
      async isSaving(val){
        if (val == true) {
          await this.handleSave()
          // this.$store.commit('report/SWITCH_SAVING')
        }
      },
      isCancel(val){
        if (val == true) {
          this.handleCancel()
          // this.$store.commit('report/SWITCH_CANCEL')
        }
      },
      rightFolder(val){
        // console.log(180,val);
        this.folder['right']=val
      }
    },
    mounted() {
      if(this.from==='sealArea'){
        // console.log(198,this.grid);
        this.getFKQLayout()
      }else {
        this.folder['right']=this.rightFolder
        this.getLayout()
      }
    },
    methods: {
      getLayout() {
        getDashboardLayout({
          appCode: 'YQFK',
          dashboardCode: 'YQFK'
        }).then(res => {
        //   console.log(301, res);
          let arr1 = []
          let arr2 = []

          //保存id
          this.id = res.id
        //   console.log(res.dashboardList);
          if (res.dashboardList !== null && res.dashboardList.length !== 0) {

            res.dashboardList.forEach((item, index) => {
              switch (item.panelItem.code) {
                case 'getCovidZJ': //南沙实有人口街镇分布
                  item.countCode = 'covidMsg'
                  item.about = '<p>1、户籍人口数据来源于市公安局南沙区分局，通过区公共信息资源共享服务平台对接到疫情防控指挥平台，每隔24小时更新。</p>' +
                    '<p>2、来穗人口来源于来穗人员服务管理局流动人员基本信息表，通过区公共信息资源共享服务平台对接到疫情防控指挥平台。</p>' +
                    '<p>3、该数据由南沙区公安分局、来穗人员服务管理局通过区公共信息资源共享服务平台清洗后，对接到本系统，每隔24小时更新。</p>'
                  break
                case 'zjqtljqs': //密接/次密最近7天接累计趋势
                  item.countCode = 'qmrsljqs'  //卡片统计
                  break
                case 'getDaysNulacid': //核酸检测人数
                case 'getWeeksNulacid':
                case 'getMonthsNulacid':
                  item.countCode = 'hsjczrs'
                  item.about = `<p>1、核酸检测数据通过区公共信息资源共享服务平台对接广东省政务大数据中心获取，经智慧南沙系统清洗、分析后生成各统计项数据，每隔两小时更新。</p>
                    <p>2、核酸检测总人次：截至数据更新时间近一月，南沙区常住人口累计做过的核酸检测的总人次。</p>
                    <p>3、户籍核酸检测人员：指以当日计算近3日内，对接核酸检测数据的人员中，属于南沙区户籍做过核酸检测的人员。</p>
                    <p>4、来穗核酸检测人员：指以当日计算近3日内，对接核酸检测数据的人员中，不属于南沙区户籍做过核酸检测的人员。</p>
                    <p>5、户籍核酸检测占比=对接核酸检测数据的户籍核酸检测人数/全区户籍人口总数x100%。</p>
                    <p>6、来穗核酸检测占比=对接核酸检测数据的来穗核酸检测人数/全区来穗人口总数x100%。</p>
                    <p>7、总核酸检测占比=（户籍核酸检测人数+来穗核酸检测人数）/全区常住人口总数x100%。</p>`
                  break
                default:
                  break
              }
              let obj = {
                id: item.panelItemId, //图表id, 允许重复
                code: item.panelItem.code,
                title: item.panelItem.title,
                i: getRandomId(),  //图表面板唯一标识
                w: 1,
                h: 1,
                x: item.xAxisPosition,
                y: item.yAxisPosition,
                name: item.name,
                height: item.panelItem.itemType === 'List' ? 80 : 280,
                api: item.api,
                updateTimeType: item.updateTimeType || '',
                list: item.list || null,
                countCode: item.countCode || '',
                navBar: item.navBar || [],
                about: item.about
              }
              if (item.xAxisPosition >= 1) {
                arr2.push(obj)
              } else {
                arr1.push(obj)
              }
            })
          } else {
            if (!localStorage.hasEdit) {
              arr1 = [
                {id: '3306412', code: 'getRiskAreasMsgPC', title: "中高风险地区来粤返粤人员核查情况"},
                {id: '2846164', code: 'zjqtljqs', countCode: "qmrsljqs", title: "密接/次密接累计趋势"},
                {id: '3273789', code: 'getCovidZJ', countCode: "covidMsg", title: "南沙人口镇街分布"},
              ]
            }
          }

          // 追加占位符slot
          const slots = this.slots ? this.slots.split(',') : []
          slots.forEach(item => {
            const [fieldName, index] = item.split('-')
            const arr = fieldName == 'left' ? arr1 : arr2
            arr.splice(index, 0, {slot: item, i: getRandomId(), w: 1, h: 1})
          })

          this.layout.left = arr1
          this.layout.right = arr2
        })

      },

      //封控区处理
      getFKQLayout(){
        let arr=[
          {code: 'qmjtj',title: "密接人员总数与次密接人总数"},
          {code: 'zjqtljqs',title: "密接/次密接累计趋势"},
        ]
        const slots = this.slots ? this.slots.split(',') : []
        slots.forEach(item => {
          const [fieldName, index] = item.split('-')
          arr.splice(index, 0, {slot: item, i: getRandomId(), w: 1, h: 1})
        })
        this.layout.left = arr
      },

      //特殊统计图处理
      showMhRiskDetail(data){
        this.$emit('showMhRiskDetail',data)
      },

      editChart(fieldName, index) {
        this.chartListVisible = true
        this.editPosition = {fieldName, index, isNew: false}
      },

      addChart(fieldName, index){

        this.chartListVisible = true
        this.editPosition = {fieldName, index, isNew: true}
      },

      delChart(fieldName, index) {
        this.layout[fieldName].splice(index, 1)
      },
      confirmItem(item) {
        const {fieldName, index, isNew} = this.editPosition
        if (isNew) {
          // 新图表配置
          let newItem = {
            id: item.id,
            code: item.code,
            i: getRandomId(),
            w: 1,
            h: 1,
            x: fieldName == 'left' ? 0 : 1,
            y: index
          }
          this.layout[fieldName].splice(index, 0, newItem)
        } else {
          // 修改已存在的图表配置
          let newItem = Object.assign({}, item)
          newItem.id = item.id
          // 更新了该标识，图表才会刷新
          newItem.i = getRandomId()
          this.layout[fieldName].splice(index, 1, newItem)
        }

      },

      handleEdit() {
        // this.$store.commit('report/CHANGE_EDIT')
      },

      handleCancel() {

        if (this.isLayoutChanged() == true) {
          this.layout = this.oldLayout
        }
        // this.$store.commit('report/CHANGE_EDIT')
      },

      handleSave() {

        return new Promise((resolve, reject) =>{

          if(this.isLayoutChanged() == false){
            this.$message({
              message: '当前仪表盘没有做任何改动，无需保存',
              type: 'warning',
              onClose: () => {
                this.enableClickSave = true
              }
            })
            this.enableClickSave = false
            this.$store.commit('report/SWITCH_SAVING', false)
            resolve()
            return
          }

          // 发起保存请求
          const arr = []
          Object.keys(this.layout).map(prop => {

            this.layout[prop].forEach(item => {
              if (!item.id) {
                return
              }
              arr.push({
                panelItemId: item.id,
                height: item.w,
                width: item.w,
                xAxisPosition: item.x,
                yAxisPosition: item.y
              })

            })


          })

          saveDashboardLayout({
            id: this.id,
            dashboardList: arr,
            appCode: 'YQFK',
            dashboardCode: 'YQFK'
          }).then(res => {
            this.$store.commit('report/CHANGE_EDIT', false)
            this.$store.commit('report/SWITCH_SAVING')
            this.$message({
              message: '图表布局保存成功',
              type: 'success'
            })

            //更新各个新增面板的id
            // this.getLayout()

            resolve()
          })

        })

      },

      // 判断当前布局是否有变化
      isLayoutChanged () {
        return JSON.stringify(this.layout) !== JSON.stringify(this.oldLayout)
      },

      toggleSidebar(fieldName) {
        this.folder[fieldName] = !this.folder[fieldName]
        this.$store.commit('report/SET_RIGHT_FOLDER_STATE', this.folder[fieldName])
      },

      handleEditLayout () {
        this.$store.commit('report/CHANGE_EDIT')
      },
      handleSaveLayout () {
        this.$store.commit('report/SWITCH_SAVING', true)
        // Cookies.set('hasEdit',true)
        localStorage.hasEdit = true
      },
      handleCancelLayout () {
        this.$store.commit('report/SWITCH_CANCEL', true)
      },
    }
  }
</script>

<style lang="scss" type="text/scss">
.report-layer{
  height: 0;
  z-index: 9;
  .edit-charts{
    position: absolute;
    top: -29px;
    right: -10px;
    color: #fff;
    z-index: 99;
    .item{
      display: inline-block;
      margin: 5px -20px 0 0;
      .save-btn{
        width: 80px;
        background: linear-gradient(180deg, #0F2560 0%, #1C49B8 100%);
        box-shadow: 0px 0px 5px 0px #11245E, inset 0px 0px 5px 0px #2B5FF6;
        border: 1px solid #2B5FF6;
      }
      .cancel-btn{
        width: 80px;
        background: linear-gradient(180deg, #1C2952 0%, #192957 100%);
        box-shadow: 0px 0px 5px 0px #11245E, inset 0px 0px 5px 0px #2B5FF6;
        border: 1px solid #2E4D8D;
        margin: 0 10px;
      }
    }
    .el-button--text{
      color: #fff;
    }
  }
  .sidebar{
    position: absolute;
    top: 60px;
    bottom: 20px;
    width: 398px;
    transition: width ease-in-out .4s;
    z-index: 10;
    box-sizing: border-box;
    border: 34px solid transparent;
    border-image: url("~@/assets/image/sidebar-bg.png") 34;
    background: url("~@/assets/image/sidebar-bg-unit.png");
    background-clip: padding-box;
    background-repeat: repeat;

    &.folder{
      width:0 !important;
      border:0 none;
      border-image: none;
    }

    & > main{
      position: absolute;
      top:0px;
      bottom:0;
      left: -10px;
      right: -20px;
      overflow: auto;
      padding: 5px 0;
    }

    &-title{
      position: absolute;
      top: -22px;
      left: 40%;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 700;
      color: #FFFFFF;
    }
    .side-header{
      margin-bottom: 0.5em;
      padding:0 1em;
      height:36px;
      line-height: 36px;
      font-size: 14px;
      transition: transform ease-in-out .4s;
    }

    .fl{
      transform: translateX(-370px);
    }
    .fr{
      transform: translateX(370px);
    }

    .trb{
      position: absolute;
      top:0;
      z-index: 99;
      width: 16px;
      height: 56px;
      line-height: 56px;

      text-align: center;
      cursor: pointer;
    }

    &.pl{
      left: 20px;
      .trb{
        left:-20px;
      }
    }
    &.pr{
      right: 20px;
      .trb{
        right:-20px;
      }
    }

    .side-box {
      display: block;
      position: relative;
      padding: 0 0 8px;
      width: 100%;
      box-sizing: border-box;

      &.side-box1 {

      }
      &-mask {
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        padding: 10px;
        box-sizing: border-box;
        text-align: right;
        z-index: 2001;
        .btns{
          position: absolute;
          bottom: 15px;
          left: 25%;
          .btn{
            cursor: pointer;
            margin: 0 10px;
          }
        }

      }
      .swiper-box {
        position: relative;
      }
    }
    .side-add{
      position: relative;
      margin: 0 0 1em;
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      padding: 10px;
      text-align: right;
      .btn {
        line-height: 0;
      }
    }
    &>.btn{
      padding: 10px 20px;
      border: none;
    }
  }
  .dot-list {
    position: absolute;
    right: 20px;
    top: 10px;
    .dot-item {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #325AE6;
      &.active {
        background: #374986;
      }
    }
  }

  .legend {
    width: 132px;
    height: 231px;
    position: absolute;
    right: 435px;
    top: 10%;
    z-index: 2;
    color: #fff;
    div {
      background-repeat: no-repeat;
      background-size: 100% auto;
    }
    &_header {
      background-image: url("../../assets/image/box2_top.png");
      height: 29px;
      width: 100%;
      line-height: 29px;
      text-align: center;
    }
    &_body {
      padding-top: 10px;
      background-repeat: repeat-y !important;
      background-image: url("../../assets/image/box2_mid.png");
      & > div {
        width: 100%;
        div {
          width: 100%;
          display: inline-block;
        }
      }
      .icon {
        width: 32px;
        height: 36px;
        margin: 8px 10px;
      }
      .hotel {
        width: calc(100%  - 56px);
        vertical-align: top;
        &_name {
          font-size: 12px;
        }
        &_count {
          color: #FFFF00;
          font-weight: 800;
        }
      }
    }
    &_footer {
      background-image: url("../../assets/image/box2_bottom.png");
      height: 11px;
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
.report-layer .el-carousel__indicators {
  left:inherit;
  right: 0px;
  top: -5px;
  width: 60px;
  height: 40px;
  text-align: center;

  transform: translate(0,0);
  .el-carousel__indicator {
    padding: 10px 6px;
  }
  .el-carousel__button {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #325AE6;
  }
}
.report-layer{
  .sidebar{
    .side-header{
      color: #fff;
      background-color: $theme-color;
    }
    .trb{
      color:#fff;
      //background-color: $theme-color2;
    }
    &>.btn{
      background-color: $theme-color2;
      color: #fff;
    }
    .side-box {
      color: #fff;
      &-mask {
        .btn{
          color:#fff;
          background: linear-gradient(180deg, #0F2560 0%, #1C49B8 100%);
          box-shadow: 0px 0px 5px 0px #11245E, inset 0px 0px 5px 0px #2B5FF6;
          border: 1px solid #2B5FF6;
          height: auto;
          width: auto;
          line-height:1;
        }
        .btn:last-child{
          border: 1px solid #2E4D8D;
          color: #DC1E00;
        }
      }
    }
    .side-add{

      .btn{
        color: #fff;
      }
    }
  }
}

</style>
