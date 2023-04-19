<!-- 2022-2-17 增加，通过接口同步数据的查看列表 -->
<!-- 导入数据列表窗口 -->
<template>
  <div>
    <table-page :data="tableListData" :filter="filter" @sizeChange="sizeChange" @currentChange="currentChange"
      @search="search" @resetSearch="resetSearch" @tableSelectionChange="tableSelect" @setTableKeys="setTableKeys"
      v-if="tableShow" ref="table" :id="`fetchData_${tableId}`" :hideSearch="!showFilter" :class="props ? 'big' : ''"
      :customClass="props ? 'staff_table' : 'table_style'">
      <template slot="searchFilter" v-if="showFilter">
        <el-form :inline="true" :model="filter" label-width="160px">
          <template v-for="item in dataKeys">
            <el-form-item :label="item.fieldName" :key="`filter_${item.storeFiled}`" :title="item.fieldName" :class="
              item.fieldType === 'date' || item.fieldType === 'datetime'
                ? 'search2x'
                : ''
            ">
              <template v-if="item.fieldType === 'date'">
                <el-date-picker v-model="filter[item.storeFiled]" type="daterange" placeholder="选择日期时间"
                  format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
              </template>
              <template v-else-if="item.fieldType === 'datetime'">
                <el-date-picker v-model="filter[item.storeFiled]" type="datetimerange" placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
              </template>

              <el-select v-else-if="['jz', 'street_name', 'STREET'].includes(item.storeFiled)"
                v-model="filter[item.storeFiled]">
                <el-option v-for="option in sszjList" :key="item.storeFiled + option" :value="option" />
              </el-select>
              <template v-else-if="specialOption[item.storeFiled]">
                <el-select v-model="filter[item.storeFiled]">
                  <el-option v-for="(option, index) in specialOption[item.storeFiled]" :key="index"
                    :label="option.label || option" :value="option.value || option" />
                </el-select>
              </template>
              <template v-else-if="['zrdw'].includes(item.storeFiled)">
                <el-input v-model="filter[item.storeFiled]" placeholder="请输入责任单位" />
              </template>
              <!-- <template v-else-if="['skmrymc', 'wtmsfzh'].includes(item.storeFiled)">
                <el-input v-model="filter[item.storeFiled]" :placeholder="`请输入${item.fieldName}`" />
              </template> -->
              <el-input v-else v-model="filter[item.storeFiled]" />
            </el-form-item>
          </template>

          <el-form-item v-if="tableId === 'jkzc'" label="上报时间范围" key="filter_dumpTime" title="上报时间范围" class="search2x">
            <template>
              <el-date-picker v-model="filter.dumpTime" type="daterange" range-separator="至" start-placeholder="开始月份"
                end-placeholder="结束月份" />
            </template>
          </el-form-item>
        </el-form>
      </template>
      <!-- 控制栏 -->
      <template slot="controler" v-if="!props">
        <el-button
          type="primary"
          v-if="['hjrk','ldrk'].includes(tableId)"
          @click="showCountData('疫苗接种')"
          plain
        >疫苗接种统计</el-button>
        <template v-if="tableId === 'ggcs'">
          <el-button type="primary" @click="setKeyPlace(0)">设置重点场所</el-button>
          <el-button type="primary" @click="setKeyPlace(1)">取消重点场所</el-button>
          <el-button type="primary" @click="dataStatistics">数据统计</el-button>
          <el-button type="primary" plain @click="setNucleicPoint">关联核酸点</el-button>
        </template>
        <template v-if="['ggcs', 'hhmry'].includes(tableId)">
          <el-button type="primary" plain @click="showAlarmSet">告警设置</el-button>
        </template>
        <template v-if="['publicsecurityyellowcode', 'jkzc', 'ggcs', 'hospitalDept', 'mjzssyw', 'zyssyw', 'mjzjzssjl', 'jhxx'].includes(tableId)">
          <el-button icon="el-icon-download" type="primary" plain @click="exportFile">批量导出</el-button>
        </template>
        <template v-if="tableId === 'shyyy'">
          <el-button type="primary" plain @click="countDataVisible = true">数据统计</el-button>
          <el-button type="primary" plain @click="showSetTruck = true">统计设置</el-button>
        </template>
        <template v-if="tableId === 'zdrqtjpz'">
          <el-button type="primary" @click="showAdd = true">新增</el-button>
          <el-button type="primary" @click="exportFile">导出统计数据</el-button>
        </template>
      </template>

      <template v-slot:column_status="row" v-if="tableId === 'zdrqtjpz'">
        <el-switch v-model="row.value.status" @change="changeStatus(row.value)"></el-switch>
        <span style="margin-left: 10px">{{ row.value.status ? '监测中' : '未监测' }}</span>
      </template>
    </table-page>

    <Info v-if="infoData" :data="infoData" @close="infoData = null">
      <!--穗货运乘车人详情-->
      <Drivers v-if="infoData.data.drivers" :data="infoData.data.drivers"></Drivers>
    </Info>
    <!-- 扫码统计 -->
    <RowStat v-if="rowStatData" :data="rowStatData" @close="rowStatData = null" />
    <TotalStat v-if="totalStatData" :data="totalStatData" @close="totalStatData = null" />
    <alarm-set v-if="alarmSetVisible" :tableId="tableId" @alarmSetSave="handleAlarmSet" @close="alarmSetVisible = false"
      :alarmSetting="alarmSetting"></alarm-set>

    <!--穗货运统计数据-->
    <TemplateCountData :tableId="tableId" v-if="countDataVisible" @close="countDataVisible = false" countType="穗货运统计">
    </TemplateCountData>
    <!--统计设置-->
    <count-set v-if="showSetTruck" @close="showSetTruck = false"></count-set>

    <!--关联核酸点-->
    <NucleicPointSet v-if="showNucleicPoint" @close="showNucleicPoint = false" @change="updateData"
      :stationIds="stationIds" :linkNucleicPointIds="linkNucleicPointIds">
    </NucleicPointSet>
    <!-- 新增重点人群统计配置 -->
    <AddKeyIndustries v-if="showAdd || showEdit" @close="closeDialoge" :detailData="detailData" @change="updateData">
    </AddKeyIndustries>
    <!--户籍人口、常住人口统计数据-->
    <PopulaStat
      v-if="PopulaCountDataVisible"
      :data="PopulaCountData"
      type="more"
      :tableId="tableId"
      countType="疫苗接种"
      @close="PopulaCountDataVisible=false"
    />
  </div>
</template>
<script>
import TablePage from "zkzc-table-page";
import AlarmSet from "@/components/alarm/AlarmSet";
import { MessageBox } from "@/plugins/element";
import { fetchData } from "@/config/menuData.js";
import { exportYellowList, getSceneTypeName } from "@/api/mapData";
import { getAlarmZtlx, changeStatus, deleteData, exportStatisticData } from "@/api/keyIndustryStat"
import { areaIsKey } from "@/api/sealarea";
import {
  setKeyPlaceAlarm,
  getKeyPlaceAlarm,
  setYellowCodeAlarm,
  getYellowCodeAlarm
} from "@/api/alarm";
import { exportCommonData } from '@/api/commonPlace';
import Drivers from './drivers'
import Info from "./info.vue";
import RowStat from "./rowStat"
import TotalStat from './totalStat'
import moment from "moment";
import TemplateCountData from "./TemplateCountData";
import CountSet from "./CountSet";
import NucleicPointSet from "./NucleicPointSet";
import AddKeyIndustries from '@/views/fetchDataList/AddKeyIndustries'
import { Message } from 'element-ui';

export default {
  name: "fetchDataList",
  components: {
    TablePage,
    Info,
    AlarmSet,
    RowStat,
    TotalStat,
    Drivers,
    TemplateCountData,
    CountSet,
    NucleicPointSet,
    AddKeyIndustries,
    PopulaStat: ()=>import("@/components/Population/PopulaStat")
  },
  //   mixins: [getTableKeys],
  props: ["props"],
  data() {
    return {
      sszjList: [
        "南沙街",
        "珠江街",
        "龙穴街",
        "大岗镇",
        "榄核镇",
        "黄阁镇",
        "东涌镇",
        "横沥镇",
        "万顷沙镇"
      ], //3街6镇列表
      dialog: null,
      showSetTruck: false, //穗货运统计设置
      showNucleicPoint: false, //show关联核酸点
      showAdd: false, // 新增重点人群统计配置
      showEdit: false, // 编辑重点人群统计配置
      ways: 'zj', // 选择的统计方式，默认按镇街统计
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100, 500, 1000]
      },
      multiData: [],
      tableListData: {
        selection: true,
        tableData: [],
        tableKeys: [],
        tableIndex: [],
        tableFunctions: [
          {
            label: "查看",
            method: this.view
          }
          // {
          //   label: "编辑",
          //   method: this.edit,
          // },
          // {
          //   label: '删除',
          //   method: this.remove
          // }
        ]
      },
      detailData: null, // 详情数据
      dataKeys: [], // 所有的KEY
      // tablesList: [],
      tableId: "",
      tableShow: true, // 刷新表格数据
      video: "",
      api: null,
      infoData: null,
      alarmSetVisible: false, //告警设置
      specialOption: {
        sszj: [
          "南沙街",
          "珠江街",
          "龙穴街",
          "大岗镇",
          "榄核镇",
          "黄阁镇",
          "东涌镇",
          "横沥镇",
          "万顷沙镇"
        ],
        is_key: [
          { value: "", label: "全部" },
          { value: "0", label: "是" },
          { value: "1", label: "否" }
        ],
        SKMSTATUS: [
          { value: "0", label: "无" },
          { value: "1", label: "正常" },
          { value: "2", label: "红码" },
          { value: "3", label: "黄码" }
        ],
        COLOR: [
          { value: "0", label: "正常" },
          { value: "20", label: "红码" },
          { value: "10", label: "黄码" }
        ],
        // 数据来源
        type: ["流动人口", "户籍人口"],
        scene_type_name: [],
        // 在岗状态-- 全部、在岗、放假
        is_job: [
          { value: "", label: "全部" },
          { value: "1", label: "在岗" },
          { value: "0", label: "放假" }
        ]
      },
      menuData: null,
      rowStatData: null,
      totalStatData: null,
      countDataVisible: false, // 穗货运统计
      PopulaCountDataVisible: false, // 人口统计（常住、户籍）
      PopulaCountData: {}, // 列表行信息
      // 场所id列表
      stationIds: [],
      // 关联的核酸检测点id
      linkNucleicPointIds: [],
      // 所属行业类型
      zdType: [],
      // 责任单位类型
      dutyTypeOptions: [
        {
          value: 'wbj',
          label: '委办局'
        },
        {
          value: 'zj',
          label: '镇街'
        },
        {
          value: 'other',
          label: '其他'
        }],

    };
  },
  computed: {
    showFilter(){
      if(this.props){
        if(this.props.filter || this.props.showSearch){
          return true
        }
        return false
      }
      return true
    },
    auth() {
      let auth = {
        import: true,
        dataManage: true,
        new: true
      };
      return auth;
    },
    timeDefault() {
      //获取当前时间
      let defalutEndTime = moment(new Date(new Date())).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let defalutStartTime = moment(
        new Date(new Date() - 24 * 60 * 60 * 1000 * 2)
      ).format("YYYY-MM-DD HH:mm:ss");
      return [defalutStartTime, defalutEndTime];
    }
  },
  watch: {
    'filter.dumpTime'(val) {
      console.log('filter.dumpTime', val)
      if (val) {
        let start = moment(val[0])
        let end = moment(val[1])
        console.log('diff', end.diff(start, 'days'))
        if (end.diff(start, 'days') > 7) {
          this.$message.error('上报时间范围最多选择7天')
          this.filter.dumpTime[1] = start.add(7, 'days')
        }

        // if (moment(val[1]).subtract(1, 'months').getTime() > moment(val[1]).getTime()) {
        //   alert('11111')
        //   this.filter.dumpTime[1] = moment(val[0]).add(1,'months')
        // }
      }
    }
  },
  async mounted() {
    let id = this.props ? this.props.id : this.$route.name;
    let tableData = fetchData.filter(v => v.id === id)[0];
    console.log("tabledata", id);
    this.menuData = tableData;

    this.tableId = tableData.id;
    if (this.tableId === "hsjc") {
      const node = document.createElement("SPAN");
      const textnode = document.createTextNode(
        "系统只提供查询近14天的核酸检测数据"
      );
      // node.style.color = "red";
      node.className = "hsjc-tips";
      node.appendChild(textnode);
      document.querySelector(".button-group").appendChild(node);
    }
    if (this.tableId === 'ggcs') {
      this.tableListData.tableFunctions.push(
        {
          label: '关联核酸点',
          method: this.setNucleicPoint
        },
        {
          label: '统计',
          method: this.count
        })
      this.specialOption.scene_type_name = await getSceneTypeName();
      this.tableListData.columnFunctionsWidth = 200; // 操作栏宽度
    }
    // 如果是重点人群统计配置
    if (this.tableId === 'zdrqtjpz') {
      this.tableListData.selection = false
      this.tableListData.tableFunctions = []
      this.tableListData.tableFunctions.push(
        {
          label: '编辑',
          method: this.edit
        },
        {
          label: '删除',
          method: this.delete
        })
      // this.specialOption.zrdw = this.dutyTypeOptions
      let res = await getAlarmZtlx();
      this.zdType = res.map(v => {
        return {
          value: v.ztlx,
          label: v.ztlx
        }
      })

      this.specialOption.ztlx = this.zdType
      this.tableListData.columnFunctionsWidth = 200; // 操作栏宽度
    }
    // 如果是穗康扫码脱敏数据
    if (this.tableId === 'sksmtmsj') {
      this.tableListData.selection = false
    }
    for (let i in tableData.keys) {
      let key = {
        id: i,
        label: tableData.keys[i],
        minWidth: tableData.keys[i].length * 30,
        searchable: true
      };
      if (tableData.formatter && tableData.formatter[i]) {
        key.formatter = tableData.formatter[i];
      }
      this.tableListData.tableKeys.push(key);
    }

    tableData.filter.forEach(v => {
      this.dataKeys.push({
        fieldName: tableData.keys[v],
        storeFiled: v,
        fieldType: [
          "TUISONG_TIME",
          "UPDATE_TIME",
          "LOGTIME",
          "input_time",
          "DUMP_TIME",
          "JCSJ"
        ].includes(v)
          ? "datetime"
          : "input"
      });
    });
    this.api = tableData.api;
    if (this.props) {
      this.tableListData.tableFunctions = [];
      this.tableListData.selection = false;
      Object.assign(this.filter, this.props.condition);
      this.menuData = this.props;
      this.getData();
      return;
    }

    this.resetSearch();
  },
  methods: {
    //统计数据（人员采集）
    showCountData(type) {
      this.countType = type
      this.PopulaCountDataVisible = true;
    },
    // 关闭弹窗
    closeDialoge() {
      this.detailData = {}
      this.showAdd = false
      this.showEdit = false
    },
    async getData() {
      // console.log('查询条件', this.filter)
      if (!this.tableId) {
        this.$message({
          message: `暂无数据模板`,
          type: "warning",
          duration: 5 * 1000,
          showClose: true
        });
        return;
      }

      let condition = {};
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      // console.log(this.props);
      if (this.menuData.condition) {
        condition = Object.assign(condition, this.menuData.condition);
      }
      if (this.tableId === "jkzc" && condition.dumpTime) {
        condition.DUMP_TIME_START = moment(condition.dumpTime[0]).format(
          "YYYY-MM-DD"
        );
        condition.DUMP_TIME_END = moment(condition.dumpTime[1]).format(
          "YYYY-MM-DD"
        );
      }
      let data = {
        condition: condition,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize
      };
      // 穗康扫码通行记录、公安扫码通行记录、核酸检测 日期赋初始值2天
      if (["gasmtxjl"].includes(this.tableId) && !this.filter.DUMP_TIME) {
        data.condition.DUMP_TIME = this.timeDefault;
      } else if (["ggcssmjl"].includes(this.tableId) && !this.filter.LOGTIME) {
        data.condition.LOGTIME = this.LOGTIME;
      }
      let res = await this.api.request({
        data,
        headers: {
          hideNotify: true
        }
      });

      // 后端返回的表格数据
      this.tableListData.tableData = res.data;
      if (this.tableId === 'zdrqtjpz') {
        this.tableListData.tableData = res.data.map(v => {
          return {
            zrdw: v.zrdw,
            xlmc: v.xlmc,
            jcdx: v.jcdx,
            rylbDtos: v.rylbDtos,
            ztlx: v.ztlx,
            rylb: v.rylb,
            zrs: v.zrs,
            zgrs: v.zgrs,
            fjrs: v.fjrs,
            bz: v.bz,
            status: v.status === '0' ? false : true,
            id: v.id,
            num: v.num,
            templateId: v.templateId,
            zrdwlx: v.zrdwlx
          }
        })
      }
      if (this.tableId === 'sksmtmsj') {
        if (res.data.length) {
          this.tableListData.tableData.forEach(item => {
            for(key in item) {
              if(item[key] === '' || item[key] === null){
                item[key] = '-'
              }
            }
          })
        }
      }

      this.filter.pageNum = res.page;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.total;
    },
    search() {
      this.filter.pageNum = 1;
      if (["hsjc"].includes(this.tableId)) {
        if (!this.filter.XM && !this.filter.ZJHM && !this.filter.SJHM) {
          this.$message({
            message: `请输入姓名、证件号码或手机号码查询`,
            type: "error",
            duration: 3 * 1000,
            showClose: true
          });
          return;
        }
      }
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

      if (this.tableId === "jkzc") {
        this.$set(this.filter, "dumpTime", [
          moment()
            .subtract(7, "days")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ]);
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
      let ids = [];
      // 单选
      if (scope) {
        ids.push(scope.row.id);
      } else {
        // 多选
        ids = this.multiData.map(item => {
          return item.id;
        });
      }
      if (ids.length === 0) {
        this.$message({
          message: `请先选择数据再进行操作。`,
          type: "info",
          duration: 5 * 1000,
          showClose: true
        });
        return;
      }
      await MessageBox.alert(`确定删除选择的数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        showCancelButton: true,
        type: "warning"
      });
      await new this.$Api().ImportDataController.delete_data.request({
        path: {
          ids: ids.join(",")
        }
      });
      this.getData();
    },
    async delete(scope) {
      console.log('scope', scope.row)
      // 根据id删除数据
      let id = scope.row.id
      await MessageBox.alert(`确定要删除该条记录?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        showCancelButton: true,
        type: "warning"
      });

      // 发送请求
      let res = await deleteData(id)
      if (res === "删除成功") {
        Message({
          message: res,
          type: "success",
          duration: 5 * 1000
        });
        // 刷新页面
        this.getData();
      }
    },
    edit(scope) {
      this.dialog = "edit";
      this.showEdit = true
      // 深拷贝
      this.detailData = JSON.parse(JSON.stringify(scope.row))
    },
    view(scope) {
      this.infoData = {
        keys: this.tableListData.tableKeys,
        data: scope.row
      };
    },
    count(scope) {
      this.rowStatData = scope.row
    },
    add() {
      this.dialog = "new";
      this.detailData = null;
      this.showAdd = true
    },
    async exportFile() {
      if (this.tableId == "publicsecurityyellowcode") {
        //公安黄码数据
        await exportYellowList({
          condition: this.filter,
          page: this.filter.pageNum,
          pageSize: this.filter.rowTotal
        });
      } else if (this.tableId === "jkzc") {
        let condition = this.filter;
        if (condition.dumpTime) {
          condition.DUMP_TIME_START = moment(condition.dumpTime[0]).format(
            "YYYY-MM-DD"
          );
          condition.DUMP_TIME_END = moment(condition.dumpTime[1]).format(
            "YYYY-MM-DD"
          );
        }
        await this.$Api().HealthSelfExaminationController.post_exportHealthSelfExamination.request(
          {
            responseType: "blob",
            data: {
              condition: this.filter,
              page: 1,
              pageSize: 99999999
            }
          }
        );
      } else if (this.tableId === "ggcs") {
        await exportCommonData({
          condition: this.filter,
          page: 1,
          pageSize: 100000
        })
      } else if (this.tableId === "zdrqtjpz") {
        await exportStatisticData({
          condition: this.filter,
          page: 1,
          pageSize: 100000
        })
      }else if (
          this.tableId === 'hospitalDept' ||
          this.tableId === 'mjzssyw'
          ||
          this.tableId === 'zyssyw' ||
          this.tableId === 'mjzjzssjl' ||
          this.tableId === 'jhxx'
      ) {
        let condition = {...this.filter}
        if (this.menuData.condition) {
          condition = Object.assign(condition, this.menuData.condition);
        }
        await this.$Api().YljzTjController.post_export.request({
          data: condition,
          responseType: "blob"
        });
      }else {
        await this.$Api().ImportDataController.post_exportData.request({
          path: {
            templateId: this.tableId
          },
          data: this.filter,
          responseType: "blob"
        });
      }

      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true
      });
    },
    async exportTemplate() {
      // 导出数据
      // eslint-disable-next-line no-unused-vars
      // let data = Object({},{condition:{
      //     id:-1
      // }},this.filter)
      // 2022-2-16 特殊处理的下载模板
      if (this.tableId === 10066) {
        var anchor = document.createElement("a");
        let filename = encodeURIComponent(
          "南沙区国际进口邮件快件直接接触从业人员汇总-模板.xls"
        );
        anchor.href = `./template/${filename}`;
        // let filename = response.headers['content-disposition'].split('=')[1]
        anchor.download = decodeURIComponent(filename);
        anchor.target = "_blank";
        anchor.click();
        return;
      }
      if (this.tableId === 10014) {
        var anchor = document.createElement("a");
        let filename = encodeURIComponent("疫苗接种每日统计-模板.xls");
        anchor.href = `./template/${filename}`;
        // let filename = response.headers['content-disposition'].split('=')[1]
        anchor.download = decodeURIComponent(filename);
        anchor.target = "_blank";
        anchor.click();
        return;
      }

      let res = await this.$Api().ImportDataController.post_exportData.request({
        path: {
          templateId: this.tableId
        },
        data: {
          // condition:{
          id: -1
          // }
        },
        responseType: "blob"
      });
      // console.log(res)
      // this.$message({
      //   message: `导出成功`,
      //   type: "success",
      //   duration: 3 * 1000,
      //   showClose: true,
      // });
    },

    batchDelete() {
      var ids = this.multiData.map(v => v.id);

      if (ids.length <= 0) {
        this.$message({
          message: "请先勾选至少一个数据",
          type: "warning"
        });
        return;
      }

      this.$confirm("此操作将永久删除数据, 是否继续?", "警告", {
        type: "warning"
      })
        .then(() => {
          this.$Api()
            .ImportDataController.delete_data.request({
              path: {
                ids: ids.join(",")
              }
            })
            .then(res => {
              this.$message({
                message: `批量删除成功`,
                type: "success"
              });
              this.getData();
            });
        })
        .catch(() => {
        });
    },
    setTableKeys(index) {
      console.log("setTableKeys", index);
      localStorage[`importData_${this.tableId}`] = JSON.stringify(index);
    },
    //告警设置
    async showAlarmSet() {
      // const that = this;
      let alarmData = "";
      switch (this.tableId) {
        case "ggcs":
          alarmData = getKeyPlaceAlarm;
          break;
        case "hhmry":
          alarmData = getYellowCodeAlarm;
          break;
      }
      await alarmData()
        .then(res => {
          this.alarmSetting = res;
          if (res.hasOwnProperty('commonRedYellowThresholdValue')) {
            let value = res.commonRedYellowThresholdValue
            this.alarmSetting.commonRedYellowThresholdValue = value === '0' ? false : true
          }
          this.alarmSetVisible = true;
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleAlarmSet(data) {
      let commonRedYellowThresholdValue = data.commonRedYellowThresholdValue ? '1' : '0'
      const { createReceiveUsers, handingTownThresholdValue, commonAlarmTownReceiveUsers, commonAlarmTownThresholdValue } = data;
      if (!handingTownThresholdValue) {
        this.$message.error("请完整填写表单");
        return;
      }
      let setAlarmData = "";
      switch (this.tableId) {
        case "ggcs":
          setAlarmData = setKeyPlaceAlarm;
          break;
        case "hhmry":
          setAlarmData = setYellowCodeAlarm;
          break;
      }
      setAlarmData({
        createReceiveUsers,
        handingTownThresholdValue,
        commonAlarmTownThresholdValue,
        commonAlarmTownReceiveUsers,
        commonRedYellowThresholdValue
      })
        .then(() => {
          this.$message.success("设置成功！");
          this.alarmSetVisible = false;
        })
        .catch(e => {
          this.$message.error("设置失败！ " + e);
          this.alarmSetVisible = false;
        });
    },
    //设置重点场所
    setKeyPlace(type) {
      var ids = this.multiData.map(v => v.ID);
      var names = this.multiData.map(v => v.stationName);
      if (ids.length <= 0) {
        this.$message({
          message: "请先勾选至少一个数据",
          type: "warning"
        });
        return;
      }
      let params = {
        stationName: names.join(",")
      };
      params.isKey = type;
      if (type === 0) {
        this.$confirm(
          `确定要将所选的${ids.length}个场所设置为重点场所吗?`,
          "警告",
          {
            type: "warning"
          }
        )
          .then(() => {
            areaIsKey(params).then(res => {
              this.$message({
                message: `设置成功`,
                type: "success"
              });
              this.getData();
            });
          })
          .catch(() => {
          });
      } else {
        this.$confirm(
          `确定要将所选的${ids.length}个场所取消重点场所吗?`,
          "警告",
          {
            type: "warning"
          }
        )
          .then(() => {
            areaIsKey(params).then(res => {
              this.$message({
                message: `设置成功`,
                type: "success"
              });
              this.getData();
            });
          })
          .catch(() => {
          });
      }
    },
    //数据统计
    dataStatistics() {
      this.totalStatData = {}
    },
    // 关联核酸点
    async setNucleicPoint(scope) {
      // 点击的是单栏的关联核酸点---一个场所关联多个核酸点
      this.stationIds = [];
      this.linkNucleicPointIds = [];
      if (scope.hasOwnProperty('row')) {

        this.stationIds.push(scope.row.stationId)
        // 获取关联的核酸检测点id
        let { hsjcd } = scope.row
        this.linkNucleicPointIds = hsjcd ? hsjcd.map(v => v.id) : []
      } else {
        //判断是否选择了场所
        var ids = this.multiData.map(v => v.stationId);
        if (ids.length <= 0) {
          this.$message({
            message: "请先勾选至少一个数据",
            type: "warning"
          });
          return;
        }
        this.stationIds = ids
      }
      this.showNucleicPoint = true
    },
    // 更新表格数据
    updateData() {
      this.getData()
      this.detailData = null
    },
    // 设置tableDataList中的tableKeys,TableKeys需要动态变化
    getKeys() {
      if (this.ways === 'zj') { // 按镇街统计


      } else if (this.ways === 'zdhy') { // 按重点行业统计
        let hylxKey = {
          checked: true,
          id: 'hylx',
          label: '行业类型',
          minWidth: 120,
          searchable: true
        }
        let ztslKey = {
          checked: true,
          id: 'ztsl',
          label: '主体数量',
          minWidth: 120,
          searchable: true
        }
        this.tableListData.tableKeys.push(hylxKey)
        this.tableListData.tableKeys.push(ztslKey)

      } else if (this.ways === 'qyzt') { // 按企业主体统计

      } else if (this.ways === 'zrdw') { // 按责任单位统计

      }
    },
    // 改变监测状态
    async changeStatus(row) {
      let id = row.id;
      let status = row.status ? 1 : 0;
      // 根据id改变监测状态
      let res = await changeStatus({ id, status })
      if (res) {
        this.getData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.big {
  ::v-deep .button-group {
    display: none;
  }
}
</style>
<style lang="scss">
.hsjc-tips {
  display: block;
  font-size: 0.9em;
  color: #999;
  padding: 12px 40px;
}

.table_style {
  .el-table td div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// 按钮激活时的样式
.active {
  background-color: rgb(0, 121, 254);
  border: none;
  color: #fff;

  &:hover {
    background-color: rgb(99, 102, 255);
    border: none;
    color: #fff;
  }

}
</style>
