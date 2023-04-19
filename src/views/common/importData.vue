<!-- 导入数据列表窗口 -->
<template>
  <div>
    <div class="classify-buttons" v-if="zdhytjTemplateIds.includes(tableId)">
      <el-button
        v-for="(item,index) in statCategoryList"
        :key="index"
        :type="selectedStatIdx===index?'primary':''"
        @click="selectStatCategory(index)"
      >
        {{item.name}}
      </el-button>
    </div>
    <table-page
        :data="tableListData"
        :filter="filter"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @search="search"
        @resetSearch="resetSearch"
        @tableSelectionChange="tableSelect"
        @setTableKeys="setTableKeys"
        v-if="tableShow"
        :hideSearch="!showFilter"
        ref="table"
        custom-class="import-box"
        :id="`importData_${tableId}`"
        :class="props?'big':''"
        :customClass="props?'staff_table':'table_style'"
        :isMergeCell="isMergeCell"
    >
      <template slot="searchFilter" v-if="showFilter">
        <el-form :inline="true" :model="filter" label-width="180px">
          <template v-for="item in dataKeys">
            <el-form-item
                :label="specialTitle[item.storeFiled] || item.fieldName"
                :key="`filter_${item.storeFiled}`"
                :title="specialTitle[item.storeFiled] || item.fieldName"
                v-if="isSearchFieldShow(item)"
                :class="[  item.fieldType === 'date' || item.fieldType === 'datetime'
                  ? 'search2x'
                  : '',item.storeFiled === 'sjhm'?'sjhm':'']

              "
            >
              <template v-if="item.fieldType === 'date'">
                <el-date-picker
                    v-model="filter[item.storeFiled]"
                    type="daterange"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                />
              </template>
              <template v-else-if="item.fieldType === 'datetime'">
                <el-date-picker
                    v-model="filter[item.storeFiled]"
                    type="datetimerange"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                />
              </template>
              <template v-else-if="item.storeFiled === 'sjxz'">
                <el-button
                  v-for="(item,index) in timePeriodList"
                  :key="index"
                  :type="selectedTimePeriod === item.key ? 'primary' : ''"
                  @click="chooseTimePeriod(item.key)"
                >
                  {{item.name}}
                </el-button>
              </template>
              <el-select
                  v-else-if="['sszj','streetName'].includes(item.storeFiled)"
                  v-model="filter[item.storeFiled]"
              >
                <el-option
                    v-for="option in sszjList"
                    :key="item.storeFiled + option"
                    :value="option"
                />
              </el-select>
              <el-select
                v-else-if="item.storeFiled==='zjlx'"
                v-model="filter[item.storeFiled]"
              >
                <el-option
                  v-for="option in zjlxList"
                  :key="item.storeFiled + option"
                  :value="option"
                />
              </el-select>
              <el-select
                v-else-if="item.storeFiled==='jobState'"
                v-model="filter[item.storeFiled]"
              >
                <el-option
                  v-for="option in jobList"
                  :key="item.storeFiled + option"
                  :value="option"
                />
              </el-select>
              <el-select
                v-else-if="item.storeFiled==='controlStatus'"
                v-model="filter[item.storeFiled]"
              >
                <el-option
                  v-for="(option,index) in controlStatusList"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-select
                v-else-if="item.storeFiled==='contactRiskType'"
                v-model="filter[item.storeFiled]"
              >
                <el-option
                  v-for="(option,index) in closeContactRiskTypeList"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-select
                v-else-if="item.storeFiled==='tags'"
                v-model="filter[item.storeFiled]"
              >
                <el-option
                  v-for="option in tagsList"
                  :key="item.storeFiled + option"
                  :value="option"
                />
              </el-select>
              <el-select
                  v-else-if="specialOption[item.storeFiled]"
                  v-model="filter[item.storeFiled]"
              >
                <el-option
                    v-for="option in specialOption[item.storeFiled]"
                    :key="item.storeFiled + option"
                    :value="option"
                />
              </el-select>
              <el-input v-else v-model="filter[item.storeFiled]" :placeholder="`请输入${specialTitle[item.storeFiled] || item.fieldName}`"/>
            </el-form-item>
          </template>
        </el-form>
      </template>

      <!-- 控制栏 -->
      <template slot="controler" v-if="!props && !(tableId===10116)">
        <div>
          <!-- <el-select style="margin-right:10px;" v-model="tableId " @change="getTableKeys" >
          <el-option v-for="item in tablesList" :key="`tables_${item.id}`"  :value="item.id" :label="item.name" />
        </el-select> -->
          <el-button
              icon="el-icon-circle-plus"
              type="primary"
              @click="add"
              v-if="auth.new && ![10029, 10059, 10058, 10084, 10096, 10107, 10120, 10122, 10123, 10125, 12124, 10180, 12128, 12129,12138,...collectTemplateIds,...zdhytjTemplateIds].includes(tableId)"
          >新增
          </el-button
          >
          <!-- <el-button
            icon="el-icon-remove"
            type="primary"
            plain
            @click="remove()"
            v-if="delAble || delAble === ''"
            >删除选中</el-button
          > -->
          <el-button
              icon="el-icon-upload2"
              type="primary"
              plain
              v-if="auth.import && ![10029, 10059, 10058, 10084, 10096, 10107, 10120 ,10180 ,12128, 12129,12138,...zdhytjTemplateIds].includes(tableId)"
              @click="dialog = 'importFile'"
          >批量导入
          </el-button
          >
          <el-button
              icon="el-icon-download"
              type="primary"
              plain
              @click="exportFile"
              v-if="![10120, 12129,12138,...zdhytjTemplateIds].includes(tableId)"
          >批量导出
          </el-button>
          <el-button
            icon="el-icon-download"
            type="primary"
            @click="exportFile"
            v-if="zdhytjTemplateIds.includes(tableId)"
          >导出统计数据
          </el-button>
          <el-button
              icon="el-icon-download"
              type="primary"
              plain
              v-if="auth.import && ![10029, 10059, 10058, 10084, 10096,10107, 10120, 10122, 10123, 10125, 12124, 10180 ,12128, 12129,12138,...zdhytjTemplateIds].includes(tableId)"
              @click="exportTemplate"
          >下载模板
          </el-button
          >
          <el-button
              icon="el-icon-delete"
              type="primary"
              plain
              v-if="![10029, 10059, 10058, 10084, 10089,10096, 10120, 10122, 10125, 12124, 10180,12128, 12129,12138,...zdhytjTemplateIds].includes(tableId)"
              @click="batchDelete"
          >批量删除
          </el-button
          >
          <el-button
              type="primary"
              v-if="alarmSettingAuth"
              plain
              @click="showAlarmSet"
          >告警设置
          </el-button
          >
          <el-button
              type="primary"
              v-if="[11033].includes(tableId)"
              @click="showServiceReportSubmit"
              plain
          >上报服务情况
          </el-button
          >

          <el-button
              type="primary"
              v-if="[10091,12129].includes(tableId)"
              @click="showCountData"
              plain>统计数据
          </el-button>
          <el-button
            type="primary"
            v-if="[6006,...collectTemplateIds].includes(tableId)&&hotelrylb!=='旅客'"
            @click="showCountData('疫苗接种')"
            plain
          >疫苗接种统计</el-button>
          <el-button
            type="primary"
            v-if="[6006,...collectTemplateIds].includes(tableId)"
            @click="showCountData('核酸检测')"
            plain
          >核酸检测统计</el-button>
          <el-button
            type="primary"
            v-if="[6006].includes(tableId)"
            @click="showCountData('按最近一次核酸地址')"
            plain
          >核酸检测统计（按最近一次核酸地址）</el-button>
          <el-button
            icon="el-icon-circle-plus"
            type="primary"
            v-if="[10120].includes(tableId)"
            @click="showAddEventDialog"
          >
              新增事件
          </el-button>
          <!--<el-button-->
          <!--type="primary"-->
          <!--v-if="[10091].includes(tableId)"-->
          <!--@click="showAlarmSet"-->
          <!--plain-->
          <!--&gt;告警设置</el-button-->
          <!--&gt;-->

          <component v-if="notifySetting[tableId]" :is="notifySetting[tableId]"/>
        </div>

        <template v-if="[10107].includes(this.tableId)">
          <el-tabs class="nav-list" v-model="activeName" type="card" @tab-click="handleClickState">
            <el-tab-pane label="未通行" name="未通行"></el-tab-pane>
            <el-tab-pane label="已通行" name="已通行"></el-tab-pane>
            <el-tab-pane label="不允许通行" name="不允许通行"></el-tab-pane>
          </el-tabs>
        </template>
      </template>
      <template v-slot:column_lyd="row">
        {{ row.value.lyd.slice(row.value.lyd.indexOf('desc=') + 5, row.value.lyd.indexOf('}')) }}
      </template>
      <template v-slot:[linkSlotPrefix+key]="row" v-for="key in linkKeys[tableId]">
        <el-link class="link" @click="showKeyIndustryStatDetail(key,row)" :key="key">
          {{ row.value[key] }}
        </el-link>
      </template>
      <template v-slot:[linkSlotPrefix+sumKey]="row" v-if="zdhytjTemplateIds.includes(tableId) && sumKey">
        <span v-if="row.value.isSum">合计</span>
        <span v-else>{{row.value[sumKey]}}</span>
      </template>
    </table-page>
    <import-file
        :tableId="tableId"
        :ztlxType="ztlxType"
        :hotelrylb="hotelrylb"
        :schoolRylb="schoolRylb"
        v-if="dialog === 'importFile'"
        @close="dialog = null"
        @update="getData"
    />
    <import-data-edit
        :keys="dataKeys"
        :tableId="tableId"
        :data="detailData"
        :type="dialog"
        :ztlxType="ztlxType"
        v-if="dialog === 'edit' || dialog === 'new' || dialog === 'view'"
        @close="dialog = null"
        @update="getData"
    />
    <el-dialog
        :visible="true"
        append-to-body
        width="800px"
        :modal="false"
        :close-on-click-modal="false"
        @close="video = ''"
        top="8vh"
        v-if="video"
        title="视频"
    >
      <div style="position:relative;height: 430px;">
        <video-player :videoUrl="video" :videoInfo="videoInfo" title="视频" :isLive="true"/>
      </div>

    </el-dialog>

    <alarm-set v-if="alarmSetVisible" :tableId="tableId" @alarmSetSave="handleAlarmSet" @close="alarmSetVisible = false"
               :alarmSetting="alarmSetting"></alarm-set>

    <alarm-set-list
        v-if="showAlarmSetList"
        @close="showAlarmSetList = false"
    ></alarm-set-list>

    <service-report-submit
        :serviceReportSubmitVisible.sync="serviceReportSubmitVisible"
        @close="serviceReportSubmitVisible = false"
        :ids="this.multiData.map((v) => v.id).join(',')"
    ></service-report-submit>

    <service-report-list
        :serviceReportListVisible.sync="serviceReportListVisible"
        @close="serviceReportListVisible = false"
        :reportList="reportList"
    ></service-report-list>

    <!--查看核酸记录-->
    <nuclein-record :infoData="infoData" :list="nucleinList" v-if="nucleinRecordVisible"
                    @close="nucleinRecordVisible = false"></nuclein-record>
    <!--查看疫苗接种-->
    <vaccination :infoData="infoData" :list="vaccList" v-if="vaccinationVisible"
                 @close="vaccinationVisible = false"></vaccination>
    <!--统计数据-->
    <count-data v-if="countDataVisible" :tableId="tableId" @close="countDataVisible = false" :countType="countType" :schoolRylb="schoolRylb"></count-data>

    <!--一线工作人员统计-->
    <front-line-count-panel v-if="frontLineCountVisible" @close="frontLineCountVisible = false"
                            @popDetail="handlerFrontLinePopDetail"></front-line-count-panel>
    <!--一线工作人员明细-->
    <front-line-staff-panel :cond="frontlineStaffCond" v-if="frontLineStaffVisible"
                            @close="frontLineStaffVisible = false"></front-line-staff-panel>

    <!-- 告警对象设置-->
    <alarm-target-panel v-if="alarmTargetPanelVisible" @close="alarmTargetPanelVisible = false"/>

    <!--阳性人员详情-->
    <positive-person-detail :cond="positivePersonCond" v-if="positivePersonVisible"
                            @close="positivePersonVisible=false"></positive-person-detail>

    <!--重点场所关联人员-->
    <key-place-relation :cond="keyPlaceCond" v-if="keyPlaceRelationVisible"
                        @close="keyPlaceRelationVisible = false"></key-place-relation>

    <!--重点场所环境信息-->
    <key-place-condition-detail :data="keyPlaceConditionData" v-if="keyPlaceConditionDetailVisible"
                                @close="keyPlaceConditionDetailVisible = false"></key-place-condition-detail>

    <!--货车预约详情-->
    <truck-plan-detail :tableId="tableId" :data="detailData" type="view" :keys="dataKeys" v-if="truckPlanDetailVisible"
                       @close="truckPlanDetailVisible = false"></truck-plan-detail>

    <!--哨点工作人员告警设置-->
    <alarm-sentinel-worker v-if="alarmSentinelWorkerVisible" :tableId="tableId" :hotelrylb="hotelrylb" :schoolRylb="schoolRylb"
                           @close="alarmSentinelWorkerVisible = false"></alarm-sentinel-worker>
    <!-- 流调信息-增加事件 -->
    <add-events-dialog :addEventsDialogVisible.sync="addEventsDialogVisible"  @close="addEventsDialogVisible = false"/>
    <!-- 大规模、常规核酸点统计 -->
    <RowStat v-if="rowStatData" :data="rowStatData" @close="rowStatData = null" :codeList="codeList" />
    <!--防疫通密接次密接-->
    <TemplateCountData :tableId="tableId" v-if="fytCountDataVisible"  @close="fytCountDataVisible = false" countType="防疫通密接次密接统计"></TemplateCountData>

    <!-- 重点行业统计-查看更多弹窗 -->
    <key-industry-stat-dialog
      v-if="isKeyIndustryDialogOpen"
      :data="keyIndustryStatData"
      :type="keyIndustryDialogType"
      :tableId="tableId"
      :industryTypes="specialOptions[tableId].ztlx"
    />
    <!-- 人口数据-人员管理查看详情 -->
    <PopuDataDetail
      :keys="dataKeys"
      :tableId="tableId"
      :data="detailData"
      :type="popuDialog"
      v-if="popuDialog === 'view'"
      @close="popuDialog = null"
    />
  </div>
</template>
<script>
// import TablePage from "zkzc-table-page";
import TablePage from "@/components/TablePage/TablePage.vue";
import ImportFile from "./uploadFile";
import {MessageBox} from "@/plugins/element";
import ImportDataEdit from "./ImportDataEdit";
import getTableKeys from "@/views/dataManage/getTableKeys.js";
import moment from "moment";
import {templateId} from "@/config/menuData.js";
import VideoPlayer from "@/components/EasyPlayer/VideoPlayer";
import AlarmSet from "@/components/alarm/AlarmSet";
import AlarmSetList from "@/components/alarm/AlarmSetList";
import ServiceReportSubmit from "@/components/alarm/ServiceReportSubmit";
import ServiceReportList from "@/components/alarm/ServiceReportList";
import CountData from "@/components/PersonCollect/CountData";
import NucleinRecord from "@/components/PersonCollect/NucleinRecord";
import Vaccination from "@/components/PersonCollect/Vaccination";

import {
  getServiceReport,
  setSpecialPopulationAlarm,
  getSpecialPopulationAlarm,
  setDrugDetail,
  getDrugSetDetail,
  getHighRiskDictionary
} from "@/api/alarm";
import {downloadById, changeEventStatus, downloadCoreReport, getAllGlsj} from '@/api/epidemiologicalSurvey'
import {getNuclein, getVacc,getIdListByZt} from "@/api/collect";
import {getVideoFromUid} from '@/api/mapData.js'
import AlarmTargetPanel from "@/components/alarm/AlarmTargetPanel"
import {getShyDriver,exporShyDriver} from '@/api/freight'
import {getYmsStatistic,getHsStatistic,getHsHgStatistic,getIndustryTypes,getHsyjStatistic,exportYmStatistic,exportHsStatistic,exportHsHgStatistic, exportHsYjStatistic} from '@/api/keyIndustryStat'
import {getFytMjcmjData,getFytDetail,getFytControlStatus,getFytContactRiskType} from '@/api/closeContactControl'
import {getPopulaStatPage, getPopulaStatDetail, getInspectorPage,deleteInspector,exportInspectorExport} from '@/api/PopulaStat'

const rylb = {
  nonStarHotelStaff: "工作人员",
  nonStarHotelTourist: "旅客",
};


export default {
  name: "ImportData",
  props: ["delAble", "download", 'props'],
  components: {
    AlarmTargetPanel,
    TablePage,
    ImportFile,
    ImportDataEdit,
    VideoPlayer,
    AlarmSet,
    AlarmSetList,
    ServiceReportSubmit,
    ServiceReportList,
    CountData,
    NucleinRecord,
    Vaccination,
    FrontLineCountPanel: () => import("@/components/PersonCollect/FrontLineCountPanel"),
    FrontLineStaffPanel: () => import("@/components/PersonCollect/FrontLineStaffPanel"),
    PositivePersonDetail: () => import("@/views/epidemiologicalSurvey/PositivePersonDetail"),
    KeyPlaceRelation: () => import("@/views/epidemiologicalSurvey/KeyPlaceRelation"),
    KeyPlaceConditionDetail: () => import("@/views/epidemiologicalSurvey/KeyPlaceConditionDetail"),
    TruckPlanDetail: () => import("@/views/TruckPlan/TruckPlanDetail"),
    AlarmSentinelWorker: () => import("@/components/alarm/AlarmSentinelWorker2"),
    AddEventsDialog: ()=>import("@/components/epidemiologicalSurvey/AddEventsDialog"),
    RowStat: ()=>import("@/views/fetchDataList/rowStat"),
    TemplateCountData: ()=>import("@/views/fetchDataList/TemplateCountData"),
    KeyIndustryStatDialog: ()=>import("@/components/KeyIndustryStat/KeyIndustryStatDialog"),
    PopuDataDetail: ()=>import("@/components/Population/PopuDataDetail")
  },
  mixins: [getTableKeys],

  data() {
    return {
      isMergeCell:false, // 是否合并单元格
      zdhytjTemplateIds: [12228,12130,12131,12132], //重点行业统计模板ID集
      codeList:{},
      rowStatData:null,
      fytCountDataVisible:false, //防疫通密接次密接
      alarmSentinelWorkerVisible: false,//哨点工作人员告警
      activeName: '未通行',
      collectTemplateIds: [6013, 6071, 6072, 6073, 6074],//采集点所有模板ID
      sszjList: ['南沙街', '珠江街', '龙穴街', '大岗镇', '榄核镇', '黄阁镇', '东涌镇', '横沥镇', '万顷沙镇'],//3街6镇列表
      tagsList: ['工业企业', '公共场所', '核酸采样点周边', '精神卫生机构', '康复机构', '冷链仓库', '母婴服务机构', '学校', '养老机构', '药店', '建筑工地', '宗教场所'],
      zjlxList: ['居民身份证','护照','台湾居民来往内地通行证（俗称台胞证）','港澳台居民居住证','港澳居民来往内地通行证（俗称回乡证）','出生医学证明','外国人永久居留身份证'],
      jobList: ['在岗','放假'],
      controlStatusList: [], //管控确认状态 12129
      closeContactRiskTypeList: [], //是否核心密接数据集 12129
      vaccList: [],// 疫苗接种记录
      nucleinList: [],// 核酸记录
      showAlarmSetList: false, //告警规则列表
      dialog: null,
      popuDialog: null,
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100, 500, 1000]
      },
      multiData: [],
      tableListData: {
        selection: true,
        columnFunctionsWidth: 220, // 操作栏宽度
        tableData: [],
        tableKeys: [],
        tableIndex: [],
        tableFunctions: [],
      },
      originalTableKeys: [],
      detailData: null, // 详情数据
      dataKeys: null, // 所有的KEY
      // tablesList: [],
      tableId: "",
      tableShow: true, // 刷新表格数据
      video: "",
      videoInfo: {},
      specialOptions: {
        10001: {
          sszj: [
            '南沙街', '珠江街', '龙穴街', '大岗镇', '榄核镇', '黄阁镇', '东涌镇', '横沥镇', '万顷沙镇'
          ],
          mjlx: ["密切接触者", "密接的密接"],
          yxgcfs: ["集中", "居家"],
          // glzt: ["继续观察", "解除观察"],
          gz: ["继续观察", "解除观察"],
        },
        10077: {
          zt: ["待领取", "已认领待反馈", "已反馈"],
        },
        10078: {
          zgzt: ["在岗", "轮休", "离岗"],
          fxgwlx: [],
        },
        10089: {
          zgbm: ['区住建局（质监站）', '区水务局', '市港务局海港分局', '南沙供电局', '其他'],
        },
        10091: {
          dwlx: ['区直机关事业、法人、单位', '国企', '各镇街']
        },
        10096: {
          bllx: ['本土病例', '入境病例'],
          glsj : []
        },
        6001: {
          gzryzl:  ['拆件或装卸等人员', '入境货物接触人员', '一般工作人员']
        },
        6002: {
          rylb: ['工作人员', '旅客']
        },
        6012: {
          rylb: ['范围超过港珠澳大桥', '出海范围不超过港珠澳大桥','不出海渔民','本市水域返港渔民','从外市海域返港渔民','从敏感海域返港渔民','出海作业中渔民']
        },
        6014: {
          zgbm: ['区住建局（质监站）', '区水务局', '市港务局海港分局', '南沙供电局', '其他'],
        },
        6016: {
          rylb: ['服务对象', '工作人员']
        },
        6017: {
          rylb:  ['一般岗位','重点岗位'],
        },
        6020: {
          rylb: ['与货物直接接触人员', '其他人员']
        },
        6022: {
          rylb:  ['一般岗位','重点岗位'],
        },
        6035: {
          rylb: ['高风险人员', '其他人员']
        },
        6044: {
          qysslb: ['中保税物流区','中保税加工区','小虎岛化工园区','其他'],
          rylb: ['与货物直接接触人员','其他人员'],
        },
        // 6049: {
        //   zjlx: ['居民身份证','护照','台湾居民来往内地通行证（俗称台胞证）','港澳台居民居住证','港澳居民来往内地通行证（俗称回乡证）','出生医学证明','外国人永久居留身份证'],
        // },
        6057: {
          rylb: ['服务对象', '工作人员']
        },
        6061: {
          rylb:  ['一般岗位','重点岗位','观察期中的离岗高风险岗位人员'],
        },
        6062: {
          rylb: ['高风险（工作人员）','低风险','观察期中的离岗高风险岗位人员'],
        },
        6063: {
          jzlx: ['集中居住参建人员', '保安、厨师、采购等岗位以及工地外分散居住参建人员、工地外出后返回人员'],
          // drylb:['管理人员', '工人', '保安/厨师/采购等重点岗位人员']
        },
        6067: {
          rylb: ['高风险岗位人员', '中风险岗位人员', '低风险岗位人员', '高风险离岗换岗轮休人员']
        },
        10180: {
          ryzt: ['待核查', '已核查监测中','已核查结束监测','待接收'],
          source: ['公安下发', '社区摸排','疾控中心','卫生部门下发','疫情系统','省一码通行系统','穗康','CAT系统推送','现场流调','入穗申报','区县系统推送','管控区域扫码']
        },
        10181: {
          dylb: ['A类党员', 'B类党员','C类党员','D类党员','E类党员'],
          dylx: ['出国留学', '其他','退休','在职']
        },
        10041: {
          isdy: ['是', '否'],
        },
        12129:{
          closeContactDegree: ['密切接触者', '密接的密接'],
        },
        12130:{
          ztlx:[],
          zgzt:["全部", '在岗','放假']
        },
        12131:{
          ztlx:[],
          zgzt:["全部", '在岗','放假']
        },
        12132:{
          ztlx:[],
          zgzt:["全部", '在岗','放假']
        },
        12228:{
          ztlx:[],
          zgzt:["全部", '在岗','放假']
        },
        12138:{
          hcjg:["正常", '异常'],
          hczt:["已核查", '未核查']
        },
      },
      specialTitles: {
        10001: {
          gz: "是否应解除隔离",
        }
      },
      statCategoryList: [// 统计分类按钮
          {name:'按镇街统计',key:'azjtj'},
          {name:'按重点行业统计',key:'azdhytj'},
          {name:'按企业主体统计',key:'aqyzttj'},
          {name:'按责任单位统计',key:'azrdwtj'}
      ],
      linkKeys:{ // table需要下钻的key
        12130:['gzrysl','whsjcrs','hsjcrs','yxrs','wcjgrs'],
        12131:['gzrysl','hscyrs','cjgrs','wagzhsjcrs','yxrs','whsjcgzryrs'],
        12228:['gzrysl','dyzkjzrs','dyzjzrs','dezkjzrs','dezjzrs','dszkjzrs','dszjzrs'],
        12132: ['gzrysl','yjrs','whsjcgzryrs']
      },
      linkSlotPrefix:'column_', // 下钻插槽key前缀
      selectedStatIdx: 0, // 选中的统计分类按钮索引值
      hotelrylb: null, //非星级酒店人员类别
      schoolRylb: null, //学校哨点人员类别
      siteProjectrylb: null, //工地项目人员类别
      alarmSetVisible: false, // 告警设置
      serviceReportSubmitVisible: false, // 上报服务情况
      serviceReportListVisible: false, // 服务情况列表
      notifySetting: {
        10077: () => import("./NotifySetting/10077.vue"),
        10107: () => import("./NotifySetting/10107.vue"),
      },
      reportList: [],
      alarmSetting: null,
      countDataVisible: false,//统计数据
      frontLineCountVisible: false,
      frontLineStaffVisible: false,
      nucleinRecordVisible: false,//核酸检测记录
      vaccinationVisible: false,//疫苗接种记录
      alarmTargetPanelVisible: false,
      isKeyIndustryDialogOpen: false, //重点行业统计 查看更多/详情窗口
      keyIndustryStatData: {}, // 重点行业统计 列表行信息
      keyIndustryDialogType: '', //重点行业统计 弹窗类型，more-查看更多，detail-查看详情
      infoData: {}, //核酸被检测人信息
      ztlxType: null, //采集点台账主体类型
      frontlineStaffCond: {},
      sshyType: [],  // 所属行业类型

      //流调管理-阳性人员id
      positivePersonCond: null,
      positivePersonVisible: false,
      //重点场所
      keyPlaceCond: null,
      keyPlaceRelationVisible: false,
      keyPlaceConditionData: null,
      keyPlaceConditionDetailVisible: false,
      truckPlanDetailVisible: false, // 货车预约详情
      addEventsDialogVisible: false, // 流调信息增加事件
      countType:'',
      listForVideoTags: ['移动运营商视频', '视频总账'],
      timePeriodList:  [
        {name:'今日',key:'jt'},
        {name:'近3天',key:'j3t'},
        {name:'近7天',key:'j7t'},
        {name:'近14天',key:'j14t'}
      ],
      selectedTimePeriod:'jt'
    }
  },
  watch: {
    '$route.path': {
      handler(val) {
        this.initData()
      },
      immediate: true
    }
  },
  computed: {
    showFilter(){
        if(this.props){
            if(this.props.filter){
                return true
            }
            return false
        }
        return true
    },
    alarmSettingAuth(){
      // 告警设置权限

      // 哨点人员设置，有权限控制
      if(this.AlarmCollectTempIds.includes(this.tableId)){
        return !!this.$store.state.authority.methAuthority.sdgjsz
      }

      // 有告警功能的页面（无权限控制）
      return  [11033, 10057, 10078].includes(this.tableId)
    },
    specialOption() {
      if (this.specialOptions[this.tableId]) {
        return this.specialOptions[this.tableId];
      }
      return {};
    },
    specialTitle() {
      if (this.specialTitles[this.tableId]) {
        return this.specialTitles[this.tableId];
      }
      return {};
    },
    auth() {
      // 哨点下的批量导入和下载模板功能，只有ADMIN才能看到
      let isAdmin = (this.tableId>=6000&&this.tableId<7000&&this.tableId!==6006)? ['admin','admin1','yqfk_admin'].includes(this.$store.state.user.username)?true: false :true

      let auth = {
        import: isAdmin,
        dataManage: true,
        new: true,
      };
      return auth;
    },
    //人员采集点(过滤模板ID) 告警设置过滤
    AlarmCollectTempIds() {
      // return false
      return this.collectTemplateIds.filter(value => ![6001, 6006, 6013].includes(value))
    },
    // 重点行业统计 获取需要更改值为"合计"的key
    sumKey(){
      return this.tableListData.tableData[0]?.sumKey || ""
    }
  },
  async mounted() {
    window.showVideo = (templateId,uid)=>{
      this.showVideo({row:{
        templateId,
        uid
      }})
    }
    if(this.tableId===12129){
      this.getFytControlStatus()
      this.getFytContactRiskType()
    }
  },
  methods: {
    // 筛选项是否显示
    isSearchFieldShow(item){
        if(this.props){
            if(this.props.filter.includes(item.storeFiled)){
                return true
            }
            return false
        }
        if(item.storeFiled === 'createTime'){
            return true
        }
        if(item.storeFiled ==='tags' && this.listForVideoTags.includes(this.$route.meta.title)){
            return true
        }
        if(item.searchable && item.storeFiled !=='tags'){
            return true
        }
        return false
    },
    handleClickState(e) {
      this.activeName = e.label
      this.getData()
    },
    async initData() {
      let isVideo = this.$route.path.includes("shipin");
      this.initcjdData()
      if (!this.tableId) {
        this.tableId = templateId[this.$route.name] || this.props.id;
      }

      if (this.tableId === 10078) {
        this.specialOptions[this.tableId].fxgwlx = await this.getHighRiskDictionary()
      }
      if(this.zdhytjTemplateIds.includes(this.tableId)){
        let res = await getIndustryTypes()
        if(res){
          this.specialOptions[this.tableId].ztlx = res.map(v => v.ztlx)
        }
      }
      if (this.tableId === 10077) {
        this.sszjList.push('区疾控')
      }
      await this.getTableKeys([], this.tableId, false, rylb[this.$route.name]);
      // if (this.tableId === "10001") {
      //   this.hotelList = await this.$Api().HotelController.get_getAllHotelList.request();
      // }

      // this.tableListData.tableKeys = this.tableListData.tableKeys.filter((v) => {
      //   if (["glzt", "yglsc", "ksglsj"].includes(v.id)) {
      //     return false;
      //   }
      //   return true;
      // });

      if (this.props) {
        // 大屏调用
        // Object.assign(this.filter, this.props.condition)
        this.tableListData.tableFunctions = []
        this.tableListData.selection = false
        if(this.props.tableKeys){
            this.tableListData.tableKeys = this.tableListData.tableKeys.filter(v=>{
                return this.props.tableKeys.includes(v.id)
            })
        }
        this.getData()
        return
      }

      let userId = this.$store.getters.userId + "";
      let dataManage = this.auth.dataManage;
      if (![10089, 10096, 10098, 10116, 10120,...this.zdhytjTemplateIds].includes(this.tableId)) {
        this.tableListData.tableFunctions.push({
          label: "查看",
          method: this.view,
        })
      }

      if (![10029, 10059, 10058, 10084, 10096, 10116, 10180, ...this.zdhytjTemplateIds].includes(this.tableId)) {
        this.tableListData.tableFunctions.push({
          label: "编辑",
          method: this.edit,
          hidden(scope) {
            if (scope.row.creator === userId || dataManage) {
              return false;
            }
            return true;
          },
        });
      }
      // if (this.delAble || this.delAble === "") {
      if (![10029, 10059, 10058, 10084, 10096, 10116, 10180, ...this.zdhytjTemplateIds].includes(this.tableId)) {
        this.tableListData.tableFunctions.push({
          label: "删除",
          method: this.remove,
          hidden(scope) {
            if (scope.row.creator === userId || dataManage) {
              return false;
            }
            return true;
          },
        });
      }
      if ([11033].includes(this.tableId)) {
        this.tableListData.tableFunctions.push({
          label: "查看服务详情",
          method: this.getServiceDetails,
          hidden(scope) {
            if (scope.row.creator === userId || dataManage) {
              return false;
            }
            return true;
          },
        });
      }

      //流调信息 阳性人员和密接次密接人员
      if ([10096].includes(this.tableId)) {
        this.tableListData.tableFunctions = [...[
          {label: "人员详情", method: this.getDispatchPersonDetail},
          {label: "下载资料", method: this.downloadAttachment},
          // {label: "下载核心信息报告", method: this.downloadCoreInfoReport}
        ], ...this.tableListData.tableFunctions]
      this.getAllGlsj(this.tableId);
      }
      //流调信息 重点场所
      if ([10098].includes(this.tableId)) {
        this.tableListData.tableFunctions = [...[
          {label: "查看关联人员", method: this.getKeyPlaceRelation},
          {label: "查看环境信息", method: this.getKeyPlaceDetail},
        ], ...this.tableListData.tableFunctions]
        this.tableListData.columnFunctionsWidth = 400
      }

      //一线工作人员
      if ([10091, 6006].includes(this.tableId)) {
        this.tableListData.tableFunctions = [...[
          {label: "查看核酸记录", method: this.getNuclein},
          {label: "查看疫苗接种", method: this.getVacc}
        ], ...this.tableListData.tableFunctions]
      }

      if ([10120].includes(this.tableId)) {
        this.tableListData.tableFunctions = [...[
          {
            label: "关闭事件",
            method: this.changeEventStatus,
            hidden(scope) {
            const includeValue=['进行中','已结束']
            if (includeValue.includes(scope.row.status)) {
              return false;
            }
            return true;
            }
          },
          {
            label: "重启事件",
            method: this.changeEventStatus,
            hidden(scope) {
            if (scope.row.status === '已关闭') {
              return false;
            }
            return true;
            }
          },
        ], ...this.tableListData.tableFunctions]
      }

      if([10027, 10055].includes(this.tableId)){
        this.tableListData.tableFunctions.splice(1,0,{
          label: "扫码统计",
          method: this.scanCount,
        })
      }

      //人员采集点
      this.$store.state.authority.templateList.map(v => this.collectTemplateIds.push(v.templateId))
      if (this.collectTemplateIds.includes(this.tableId)) {
        this.tableListData.tableFunctions = [
          {
            label: "查看核酸记录",
            method: this.getNuclein
          },
          {
            label: "查看疫苗接种",
            method: this.getVacc
          }
        ]
      }
      //货车司机管理
      if ([10107].includes(this.tableId)) {
        this.tableListData.tableFunctions = [
          {label: "查看详情", method: this.getTruckPlanDetai},
          {label: "查看核酸记录", method: this.getNuclein},
          {label: "查看疫苗接种", method: this.getVacc},
        ]
      }
      //穗货运乘车人员
      if ([12128].includes(this.tableId)) {
        this.tableListData.tableFunctions = [
          {label: "查看", method: this.view},
          {label: "查看核酸记录", method: this.getNuclein},
          {label: "查看疫苗接种", method: this.getVacc}
        ]
      }
      //防疫通密接次密接人员
      if ([12129].includes(this.tableId)) {
        this.tableListData.tableFunctions = [
          {label: "查看", method: this.viewDetail},
        ]
      }
      // 移动运营商视频
      if ([10116].includes(this.tableId)) {
        this.tableListData.columnFunctionsWidth = 100
      }

      // 重点行业统计
      if(this.zdhytjTemplateIds.includes(this.tableId)){
        this.tableListData.tableFunctions = [...[
          {
            label: "查看更多",
            method: this.showKeyIndustryStatMore,
            hidden(scope) {
              return this.selectedStatIdx === 2 || scope.row.isSum === true
            },
          },
        ], ...this.tableListData.tableFunctions]
      }

      // 人口数据
      if([12138, 12139].includes(this.tableId)){
        if(this.tableId===12138){
          this.tableListData.tableFunctions = [
            {
              label: "查看详情",
              method: this.showPopuDataDetail,
            },
          ]
        }else if(this.tableId===12139){
          this.tableListData.tableFunctions = [
            {
              label: "编辑",
              method: this.edit,
            },
            {
              label: "删除",
              method: this.remove,
            },
          ]
        }

      }
      if (isVideo) {
        this.tableListData.tableFunctions.push({
          label: "查看视频",
          method: this.showVideo,
        });
      }

      if (localStorage[`importData_${this.tableId}`]) {
        this.$set(
            this.tableListData,
            "tableIndex",
            JSON.parse(localStorage[`importData_${this.tableId}`])
        );
      }

      this.resetSearch();
    },
    //采集点初始化
    initcjdData() {
      if (this.$route.fullPath.includes('cjdtz')) { //采集点台账
        this.tableId = 10089
      }
      if (this.$route.path.includes('zdrq') && this.$route.name.includes('cjdgzry')) {  //采集点工作人员（重点人群）
        this.tableId = parseInt(this.$route.name.split('cjdgzry')[1])
      }
    },
    async showVideo({row}) {
      const {templateId, uid} = row
      let videoInfo = await getVideoFromUid({templateId, deviceUid: uid})
      videoInfo.deviceUid = uid
      if (videoInfo.hasOwnProperty('url') && videoInfo.url) {
        this.video = videoInfo.url
        this.videoInfo = videoInfo
      } else {
        this.$message({
          message: '获取视频源地址为空',
          type: 'warning'
        })
      }
    },

    //告警设置
    async showAlarmSet() {
      const that = this;
      const {tableId} = this;
      const apiMap = {
        10057: getDrugSetDetail, // 获取购药记录告警设置
        11033: getSpecialPopulationAlarm, // 获取特殊人群告警设置
      }

      switch (tableId) {
        case 10091:
          //一线工作人员
          this.alarmTargetPanelVisible = true
          break;
        case 10078:
          //高风险岗位人员
          this.showAlarmSetList = true
          break
        case 10057:
        case 11033:
          apiMap[tableId]()
              .then((res) => {
                that.alarmSetting = res;
                that.alarmSetVisible = true;
              })
              .catch((e) => {
                console.log(e);
              })
          break;
        default:
          if (this.AlarmCollectTempIds.includes(tableId)) {
            //哨点工作人员告警
            this.alarmSentinelWorkerVisible = true
          } else {
            this.alarmSetVisible = true
          }
          break;
      }
    },
    async getData() {
      if (!this.tableId) {
        this.$message({
          message: `暂无数据模板`,
          type: "warning",
          duration: 5 * 1000,
          showClose: true,
        });
        return;
      }

      if (this.props) {
        // 大屏调用
        Object.assign(this.filter, this.props.condition)
      }

      let condition = {
        usePlaintext: true,
        currentUserId: [10068].includes(this.tableId),
        currentDepartmentId: [10078, 10091,6063,10089].includes(this.tableId),
      };
      if ([6006].includes(this.tableId) && !['admin','admin1','yqfk_admin'].includes(this.$store.state.user.username)) {
        condition.creator = this.$store.state.user.id
      }
      if ([10107].includes(this.tableId)) {
        condition.zt = this.activeName
      }

      if (this.tableId === 10119) {
        const title = this.$route.meta.title;
        if(!this.listForVideoTags.includes(title)) {
          condition.tags = title.split('视频')[0];
        }
      }


      //采集点台账动态化
      if (this.$route.path.includes('cjdtz')) {
        let templateId = this.$route.fullPath.split('cjdtz/cjdtz')[1]
        this.ztlxType = condition.ztlx = this.$store.state.authority.templateList.find((v => v.templateId == templateId)).ztlx
      }
      switch (this.$route.name) {
        case 'yyo':
          condition.lb = "医院";
          break
        case 'ydo':
          condition.lb = "药店";
          break
        case 'ydyyssp':
          condition.videosource = "移动";
          break
        case 'hcqygl':
          this.ztlxType = condition.ztlx = "货车司机";
          break
        case 'nonStarHotelStaff':
          this.hotelrylb = condition.rylb = "工作人员";
          break
        case 'nonStarHotelTourist':
          this.hotelrylb = condition.rylb = "旅客";
          break
        case 'schooljzg':
          this.schoolRylb = condition.rylb = "教职工";
          break
        case 'schoolrey':
          this.schoolRylb = condition.rylb = "幼儿园";
          break
        case 'schoolxx':
          this.schoolRylb = condition.rylb = "小学";
          break
        case 'schoolcz':
          this.schoolRylb = condition.rylb = "初中";
          break
        case 'schoolgz':
          this.schoolRylb = condition.rylb = "高中";
          break
        case 'positivePersonnelRecords':
        case 'personnelContactRecords':
        case 'keyPlaceRecords':
        case 'eventManagement':
          condition.bm = false;
          break
        default:
          break
      }

      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      // let res = await this.$Api().ImportTemplateController.post_dataPage.request({
      //   path: {
      //     templateId: this.tableId
      //   },
      //   data: {
      //     condition: condition,
      //     page: this.filter.pageNum,
      //     pageSize: this.filter.pageSize
      //   },
      //   headers: {
      //     hideNotify: true
      //   }
      // })

      // 重点行业统计
      if(this.zdhytjTemplateIds.includes(this.tableId)) {
        let fetchFunction
        if(this.tableId === 12228){
          // 疫苗接种统计
          fetchFunction = getYmsStatistic
        }else if (this.tableId === 12130){
          condition.sjxz = this.selectedTimePeriod
          // 核酸检测统计
          fetchFunction = getHsStatistic
        }else if (this.tableId === 12131){
          // 重点人群核酸合规统计
          fetchFunction = getHsHgStatistic
        }else if (this.tableId === 12132){
          // 重点人群核酸预警统计
          fetchFunction = getHsyjStatistic
        }
        condition.tjlx = this.statCategoryList[this.selectedStatIdx].key
        this.getKeyIndustryStatistic(condition,fetchFunction)
        return
      }
      // 人口数据
      if([12138,12139].includes(this.tableId)) {
        let fetchFunction
        if(this.tableId === 12138){
          // 核查数据管理
          fetchFunction = getPopulaStatPage
        }else if (this.tableId === 12139){
          // 核查人员管理
          fetchFunction = getInspectorPage
        }
        let params = {
          condition: condition,
          page: this.filter.pageNum,
          pageSize: this.filter.pageSize,
        }
        let res = await fetchFunction(params)
        this.tableListData.tableData = res.data;
        this.filter.pageNum = res.page;
        this.filter.pageSize = res.pageSize;
        this.filter.rowTotal = res.total;
        return
      }
      if(this.tableId===12128){
        this.getShyDriver(condition)
        return
      }
      if(this.tableId===12129){
        this.getFytMjcmjData(condition)
        return
      }

      let res = await this.$Api().ImportDataController.post_dataPage.request({
        path: {
          templateId: this.tableId === 10116 ? 10119 : this.tableId, // 移动运营商特殊处理
        },
        data: {
          condition: condition,
          page: this.filter.pageNum,
          pageSize: this.filter.pageSize,
        },
        headers: {
          hideNotify: true,
        },
      });
      // console.log(res)
      res.data.forEach((v) => {
        v.createTime = v.createTime
            ? moment(v.createTime).format("YYYY-MM-DD HH:mm:ss")
            : null;
        v.updateTime = v.updateTime
            ? moment(v.updateTime).format("YYYY-MM-DD HH:mm:ss")
            : null;
      });


      this.tableListData.tableData = res.data;

      // 判断是否是大规模核酸和常规核酸
      if([10027, 10055].includes(this.tableId)){
        this.tableListData.tableData.forEach((item) => {
          if(item.ggcs.length === 0) {
            item.ggcs = '-'
          }else {
            item.ggcsIds = item.ggcs.map(obj => obj.stationId).join(",")
            item.ggcs = item.ggcs.map(obj => obj.stationName).join(",")
          }
        })
      }
      this.filter.pageNum = res.page;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.total;
    },
    async getKeyIndustryStatistic(condition,fetchFunction){
      let params = {
        condition: condition,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      }
      let res = await fetchFunction(params)
      let data = this.handlerMergeCell(res.data,condition.tjlx)
      this.tableListData.tableData = data;
      this.tableListData.selection = false;
      this.filter.pageNum = res.page;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.total;
    },

    // 合并单元格数据处理
    handlerMergeCell(data, type) {
      ['azjtj', 'azrdwtj'].includes(type) ? this.isMergeCell = true : this.isMergeCell = false
      let cellKey
      switch (type) {
        case'azjtj':
          cellKey = 'sszj'
          break
        case'azrdwtj':
          cellKey = 'zrdw'
          break
      }
      let tempCount = [] //合并的行
      let tempIndex = 0 //合并的行的索引
      data.forEach((item, index) => {
        if (index === 0) {
          tempCount.push(1)
          tempIndex = 0
        } else {
          if (data[index][cellKey] == data[index - 1][cellKey] && !data[index].isSum) {
            tempCount[tempIndex] += 1
            tempCount.push(0)
          } else {
            tempCount.push(1)
            tempIndex = index
          }
        }
      })
      tempCount.forEach((v, index) => {
        data[index].rowSpan = v
      })
      return data
    },

    async getShyDriver(condition){
      let params = {
        condition: condition,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      }
      let res = await getShyDriver(params)
      this.tableListData.tableData = res.data;
      this.filter.pageNum = res.page;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.total;
    },
    // 防疫通密接次密接人员
    async getFytMjcmjData(condition){
      let params = {
        condition: condition,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      }
      let res = await getFytMjcmjData(params)
      this.tableListData.tableData = res.data;
      this.filter.pageNum = res.page;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.total;
    },
    // 防疫通管控确认状态集
    async getFytControlStatus(){
      let res = await getFytControlStatus()
      for (let i in res) {
        this.controlStatusList.push({
          label: res[i],
          value: i
        })
      }
    },
    async getFytContactRiskType(){
      let res = await getFytContactRiskType()
      for (let i in res) {
        this.closeContactRiskTypeList.push({
          label: res[i],
          value: i
        })
      }
    },

    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    resetSearch() {
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i)) {
          this.filter[i] = "";
        }
      }
      this.filter.pageNum = 1;
      if([12130,12132].includes(this.tableId)){
        this.selectedTimePeriod = 'jt'
      }
      if(this.zdhytjTemplateIds.includes(this.tableId)){
        this.$set(this.filter,'zgzt','在岗')
      }
      this.getData();
    },
    sizeChange(val) {
      this.filter.pageSize = val;
      this.filter.pageNum = 1;
      this.getData();
    },
    currentChange(val) {
      this.filter.pageNum = val;
      this.getData();
    },
    tableSelect(data) {
      this.multiData = data;
    },
    async remove(scope) {
      let msg = '确定删除选择的数据吗?'
      let ids = [];
      // 单选
      if (scope) {
        ids.push(scope.row.id);
      } else {
        // 多选
        ids = this.multiData.map((item) => {
          return item.id;
        });
      }
      if (ids.length === 0) {
        this.$message({
          message: `请先选择数据再进行操作。`,
          type: "info",
          duration: 5 * 1000,
          showClose: true,
        });
        return;
      }
      if (this.$route.path.includes('cjdtz')) {
        let res = await getIdListByZt({ztmc:scope.row.ztmc,ztlx:scope.row.ztlx})
        if(res.ids.length>0){
          msg=`系统检测到该企业下已存在${res.total}个哨点人员，删除企业则会同步删除这些哨点人员。确认要删除该企业吗？`
          ids = res.ids
          ids.push(scope.row.id);
        }else {
          msg=`确认要该企业吗？`
        }
      }
      if(this.tableId===10120) {
        msg = Number(scope.row.glldrysl) > 0 ?
         `该事件已关联${scope.row.glldrysl}名被流调人员，若删除，则其流调数据将会全部删除，确定是否要删除该事件`
         :'确定是否删除该事件';
      }
      await MessageBox.alert(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        showCancelButton: true,
        type: "warning",
      });
      if(this.tableId===12139){
        await deleteInspector({inspectorId:ids.join(",")})
      }else {
        await new this.$Api().ImportDataController.delete_data.request({
          path: {
            ids: ids.join(","),
          },
        });
      }
      this.getData();
    },
    edit(scope) {
      this.dialog = "edit";
      this.detailData = scope.row;
    },
    async getServiceDetails({row: {id}}) {
      await getServiceReport(id)
          .then((res) => {
            this.reportList = res.reverse();
            this.serviceReportListVisible = true;
          })
          .catch((e) => {
            this.$message.error("获取数据失败");
            console.log(e);
          });
    },
    view(scope) {
      this.dialog = "view";
      this.detailData = scope.row;
    },
    async showPopuDataDetail(scope) {
      let res = await getPopulaStatDetail({id:scope.row.id})
      this.popuDialog = "view"
      this.detailData = res
    },
    async viewDetail(scope) {
      // 单个防疫通密接次密接详情
      let res = await getFytDetail({insertId:scope.row.insertId})
      this.dialog = "view";
      this.detailData = res
    },
    showKeyIndustryStatMore(scope){
      this.isKeyIndustryDialogOpen = true
      this.keyIndustryDialogType = 'more'
      // 获取在岗状态
      if(!scope.row.zgzt) scope.row.zgzt = this.filter.zgzt
      if(!scope.row.ztlx) scope.row.ztlx = this.filter.ztlx
      this.keyIndustryStatData = {
        ...scope.row,
        tjlx:this.statCategoryList[this.selectedStatIdx].key
      }
    },
    showKeyIndustryStatDetail(key,row){
      if(row.value[key] === 0){
        return;
      }
      this.isKeyIndustryDialogOpen = true
      this.keyIndustryDialogType = 'detail'
      // 判断是否是合计列
      let obj = {}
      if(row.value.isSum) {
        // 需要根据统计类型来判断
        let tjlx = this.statCategoryList[this.selectedStatIdx].key
        if(tjlx === 'azrdwtj') {
          obj = {
            zrdw: this.filter.zrdw,
            ztlx: this.filter.ztlx,
            sszj: this.filter.sszj,
          }
        }else if(tjlx === 'aqyzttj') {
          obj = {
            sszj: this.filter.sszj,
            ztlx: this.filter.ztlx,
            qymc: this.filter.qymc,
          }
        }else {
          obj = {
            sszj: this.filter.sszj,
            ztlx: this.filter.ztlx,
          }
        }
      }
      // 获取在岗状态
      row.value.zgzt = this.filter.zgzt
      this.keyIndustryStatData = {
        ...row.value,
        ...obj,
        property:key,
        tjlx:this.statCategoryList[this.selectedStatIdx].key
      }
    },
    scanCount(scope){
      this.rowStatData = scope.row
      this.codeList = {
        日: "nucleicCommonDay",
        周: "nucleicCommonWeek",
        月: "nucleicCommonMonth",
      }
    },
    add() {
      this.dialog = "new";
      this.detailData = null;
    },
    async exportFile() {
      let data = Object.assign(
          {
            currentUserId: [10068,6006].includes(this.tableId),
            currentDepartmentId: [10078, 10091,6063].includes(this.tableId),
            bm: ![6006,10091].includes(this.tableId),
          },
          this.filter
      );
      if ([6002].includes(this.tableId)) {
        data.rylb = rylb[this.$route.name]
      }
      if ([6049].includes(this.tableId)) {
        data.rylb = this.schoolRylb
      }
      if ([10089].includes(this.tableId)) {
        data.ztlx = this.ztlxType
      }
      if (this.tableId === 10119) {
        const title = this.$route.meta.title;
        if(!this.listForVideoTags.includes(title)) {
          data.tags = title.split('视频')[0];
        }
      }
      if(this.tableId === 6071) data.exportFileName = '装修服务重点人员'

      switch(this.tableId){
        case 12128: //穗货运乘车人
          await this.exporShyDriver()
          break
        case 12228:  // 重点行业统计
        case 12130:
        case 12131:
        case 12132:
          await this.exportStatistic()
          break;
        case 12139: //人口核查人员数据
          await this.exportInspectorExport()
          break;

        default:{
          await this.$Api().ImportDataController.post_exportData.request({
            path: {
              templateId: this.tableId,
            },
            data,
            responseType: "blob",
          });
        }
      }

      // console.log(res)
      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true,
      });
    },
    async exporShyDriver(){
      let res =await exporShyDriver({})
    },
    // 重点行业统计 疫苗接种-导出数据
    // async exportYmStatistic(){
    //   const condition = {};
    //   for (let i in this.filter) {
    //     if (!["pageNum", "pageSize", "rowTotal", "pageSizes"].includes(i) && this.filter[i]) {
    //       condition[i] = this.filter[i];
    //     }
    //   }
    //   await exportYmStatistic({
    //     condition: {...condition, tjlx:this.statCategoryList[this.selectedStatIdx].key},
    //     page: this.filter.pageNum,
    //     pageSize: this.filter.pageSize
    //   })
    // },
    // 重点行业统计 导出数据
    async exportStatistic(){
      const condition = {};
      for (let i in this.filter) {
        if (!["pageNum", "pageSize", "rowTotal", "pageSizes"].includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      let fn
      switch (this.tableId) {
        case 12228:
          fn = exportYmStatistic
          break
        case 12130:
          fn = exportHsStatistic
          break
        case 12131:
          fn = exportHsHgStatistic
          break
        case 12132:
          fn = exportHsYjStatistic
          break
      }

      if(![12130].includes(this.tableId)) {
        condition.tjlx = this.statCategoryList[this.selectedStatIdx].key
        let data = {
          condition,
          page: 1,
          pageSize: 100000
        }
        await fn(data)
      }else{
        await fn({
        ...condition,
        tjlx:this.statCategoryList[this.selectedStatIdx].key,
        sjxz:this.selectedTimePeriod
      })
      }
    },
    // 人口核查数据
    async exportInspectorExport(){
      let condition = {}
      for (let i in this.filter) {
        if (!["pageNum", "pageSize", "rowTotal", "pageSizes"].includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      let params = {
        condition:condition
      }
      let res = await exportInspectorExport(params)
    },
    async exportTemplate() {
      // 导出数据
      // eslint-disable-next-line no-unused-vars
      // let data = Object({},{condition:{
      //     id:-1
      // }},this.filter)
      // 2022-2-16 特殊处理的下载模板
      let anchor = document.createElement("a");
      let filename
      let fileArr = []
      switch (this.tableId) {
        case 6001:
          filename = encodeURIComponent("口岸企业工作人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6002:
          filename = encodeURIComponent("非星级酒店哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6012:
          filename = encodeURIComponent("渔业渔民哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6016:
          filename = encodeURIComponent("养老机构哨点人员-模板.xlsx")
          fileArr.push(this.tableId)
          break
        case 6017:
          filename = encodeURIComponent("环卫工作人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6020:
          filename = encodeURIComponent("小虎化工园区哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6022:
          filename = encodeURIComponent("医疗机构哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6035:
          filename = encodeURIComponent("进口冷链食品企业哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6044:
          filename = encodeURIComponent("重点物流场所哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6049:
          filename = encodeURIComponent("学校哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6057:
          filename = encodeURIComponent("康园工疗站哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6061:
          filename = encodeURIComponent("隔离酒店哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6062:
          filename = encodeURIComponent("入境转运工作人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6063:
          filename = encodeURIComponent("工地项目哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 6067:
          filename = encodeURIComponent("船舶、港口码头哨点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        // case 6076:
        //   filename = encodeURIComponent("来返穗货运哨点人员-模板.xlsx");
        //   fileArr.push(this.tableId)
        //   break
        case 6077:
          filename = encodeURIComponent("疾控及消杀机构重点人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 10001:
          filename = encodeURIComponent("密接次密信息导入表-模板.xls");
          fileArr.push(this.tableId)
          break
        case 10014:
          filename = encodeURIComponent("疫苗接种每日统计-模板.xls");
          fileArr.push(this.tableId)
          break
        case 10066:
          filename = encodeURIComponent("南沙区国际进口邮件快件直接接触从业人员汇总-模板.xls");
          fileArr.push(this.tableId)
          break
        case 10077:
          filename = encodeURIComponent("密接、次密人员去向定位-模板.xls");
          fileArr.push(this.tableId)
          break
        case 10078:
          filename = encodeURIComponent("高风险岗位人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 10083:
          filename = encodeURIComponent("药店的购药记录核查信息表-模板.xlsx");
          fileArr.push(this.tableId)
          break
        case 10091:
          filename = encodeURIComponent("一线工作人员-模板.xlsx");
          fileArr.push(this.tableId)
          break
      }
      if (fileArr.includes(this.tableId)) {
        anchor.href = `./template/${filename}`;
        anchor.download = decodeURIComponent(filename);
        anchor.target = "_blank";
        anchor.click();
        return;
      }
      if (this.tableId === 10089&&this.$route.name==='cjdtz6063') {
        let filename = encodeURIComponent("工地项目-模板.xlsx");
        anchor.href = `./template/${filename}`;
        anchor.download = decodeURIComponent(filename);
        anchor.target = "_blank";
        anchor.click();
        return;
      }
      await this.$Api().ImportDataController.post_exportData.request({
        path: {
          templateId: this.tableId,
        },
        data: {
          id: -1,
          rylb: this.hotelrylb ? this.hotelrylb : undefined
        },
        responseType: "blob",
      });
    },

    batchDelete() {
      var ids = this.multiData.map((v) => v.id);

      if (ids.length <= 0) {
        this.$message({
          message: "请先勾选至少一个数据",
          type: "warning",
        });
        return;
      }
      let msg = '此操作将永久删除数据, 是否继续?'
      if (this.tableId === 12139) {
        this.$confirm(msg, "警告", {
          type: "warning",
        }).then(() => {
          deleteInspector({ inspectorId: ids.join(",") }).then(() => {
            setTimeout(() => {
              this.$message({
                message: `批量删除成功`,
                type: "success",
              });
            }, 500)
            this.getData();
          })
        })
        return
      }
      if (this.$route.path.includes('cjdtz')) {
        msg='删除采集点则会同步删掉其采集点的哨点人员数据，确定是否要删除?'
      }
      this.$confirm(msg, "警告", {
        type: "warning",
      })
          .then(() => {
            this.$Api()
                .ImportDataController.post_dataBatch.request({
              data: ids,
            })
                .then(() => {
                  this.$message({
                    message: `批量删除成功`,
                    type: "success",
                  });
                  this.getData();
                });
          })
          .catch((err) => {
          });
    },
    setTableKeys(index) {
      localStorage[`importData_${this.tableId}`] = JSON.stringify(index);
    },
    showServiceReportSubmit() {
      if (!this.multiData.length) {
        this.$message.warning("请先勾选人员");
        return;
      }
      this.serviceReportSubmitVisible = true;
    },
    //统计数据（人员采集）
    showCountData(type) {

      if ([10091].includes(this.tableId)) {
        //一线工作人员统计
        this.frontLineCountVisible = true
      }else if ([12129].includes(this.tableId)) {
        //防疫通密接次密接人员
        this.fytCountDataVisible = true
      }else {
        this.countType = type
        this.countDataVisible = true;
      }
    },
    handleAlarmSet(data) {
      const {tableId} = this;
      const apiMap = {
        10057: setDrugDetail, // 获取购药记录告警设置
        11033: setSpecialPopulationAlarm, // 获取特殊人群告警设置
      }
      let params;
      const {createReceiveUsers} = data;
      switch (tableId) {
        case 10057:
          params = data;
          break;
        case 11033:
          params = {
            createReceiveUsers
          }
          break;
      }
      apiMap[tableId](params)
          .then(() => {
            this.$message.success('设置成功！');
            this.alarmSetVisible = false;
          })
          .catch(e => {
            this.$message.error('设置失败！ ' + e);
            this.alarmSetVisible = false;
          })
    },
    //获取高风险岗位类型列表
    async getHighRiskDictionary() {
      let res = await getHighRiskDictionary()
      let arr = []
      res.fxgwlx.map(({label}) => {
        arr.push(label)
      })
      return arr
    },

    //疫苗接种记录
    async getVacc(scope) {
      if(this.tableId===12128) scope.row.sfzhm = scope.row.idNo
      if (!scope.row.sfzhm) return this.$message.error('无身份证号码');
      let res = await getVacc({idcard: scope.row.sfzhm})
      if (res) {
        this.vaccList = res
        this.infoData = scope.row
        this.vaccinationVisible = true
      }
    },
    //核酸记录
    async getNuclein(scope) {
      if(this.tableId===12128) scope.row.sfzhm = scope.row.idNo
      if (!scope.row.sfzhm) return this.$message.error('无身份证号码');
      let params = {
        idcard: scope.row.sfzhm
      }
      let res = await getNuclein(params)
      if (res) {
        this.nucleinList = res
        this.infoData = scope.row
        this.nucleinRecordVisible = true
      }
    },
    //货车司机详情
    async getTruckPlanDetai(scope) {
      this.detailData = scope.row;
      this.truckPlanDetailVisible = true
    },
    handlerFrontLinePopDetail({cond}) {
      this.frontlineStaffCond = cond
      this.frontLineStaffVisible = true
    },

    //查看人员详情
    getDispatchPersonDetail(scope) {
      const {ldId, id, glbl} = scope.row
      this.positivePersonCond = {id, ldId, glbl}
      this.positivePersonVisible = true
    },

    //下载资料附件
    async downloadAttachment(scope) {
      await downloadById(scope.row.ldId)
    },

    //查看关联人员
    getKeyPlaceRelation(scope) {
      const {ldId, id, glbl} = scope.row
      this.keyPlaceCond = {ldId, id, glbl}
      this.keyPlaceRelationVisible = true
    },

    //查看环境信息
    getKeyPlaceDetail(scope) {
      const {hjxx} = scope.row
      this.keyPlaceConditionData = hjxx || '[]'
      this.keyPlaceConditionDetailVisible = true
    },

    // 新增事件弹窗
    showAddEventDialog(){
      this.addEventsDialogVisible = true
    },

    //  改变事件状态
    async changeEventStatus(scope){
      const status=['进行中','已结束'].includes(scope.row.status)?'0':'1';
      changeEventStatus(scope.row.id,{status})
      this.getData();
    },

    // 下载核心信息报告
    downloadCoreInfoReport(scope){
      downloadCoreReport(scope.row.ldId);
    },

    async getAllGlsj(tableId){
      //关联事件
      const glsjList = await getAllGlsj()
      const glsjListOptions = glsjList.map(v=>{
        return v.sjmc
      })
      this.specialOptions[tableId].glsj = glsjListOptions
    },

    // 根据统计分类，筛选查询条件key
    selectStatCategory(index){
      this.selectedStatIdx = index
      if(index===2) {
        this.tableListData.tableFunctions = []
      }else {
        this.tableListData.tableFunctions = [
          {
            label: "查看更多",
            method: this.showKeyIndustryStatMore,
            hidden(scope) {
              return scope.row.isSum === true
            },
          },
        ]
      }
      this.getDataKeysByStatType()
      this.getData()
    },

    // 选择时间段
    chooseTimePeriod(key){
      this.selectedTimePeriod = key
    }
  },
};
</script>
<style lang="scss" scoped>
.classify-buttons{
  margin:20px;
}

.nav-list {
  display: inline-flex;
  margin: 20px 0 -20px;
  background-color: whitesmoke;
}

::v-deep.el-tabs--card > .el-tabs__header {
  border: none;
  margin: 0;
}

::v-deep.el-tabs__header {
  margin: 0;
}

::v-deep.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #fff;
}

.link {
  color: #409EFF;
  font-size: 12px;
}

</style>
<style lang="scss">
.table_style {
  .el-table .cell.el-tooltip{
    div {
      overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
    }
  }

}</style>
