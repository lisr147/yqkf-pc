<template>
  <div class="p-epidemiological-survey">
    <table-page
      :tableConfig="tableConfig"
      :tableData="tableData"
      :filter="filter"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @search="search"
      @resetSearch="resetSearch"
      ref="epidemiologicalSurveyTable"
      id="epidemiological_informationTable"
    >
      <template slot="searchFilter">
        <el-form
          :inline="true"
          :model="filter"
          label-width="60px"
          @keyup.enter.native="getData"
        >
          <el-form-item label="姓名" :label-width="labelWidth">
            <el-input v-model="filter.xm" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="电话" :label-width="labelWidth">
            <el-input
              v-model="filter.lxdh"
              placeholder="请输入电话"
              prop="lxdh"
            />
          </el-form-item>
          <el-form-item
            label="证件号码"
            :label-width="labelWidth"
            prop="sfzhm"
          >
            <el-input
              v-model.trim="filter.sfzhm"
              placeholder="请输入证件号码"
            />
          </el-form-item>
          <el-form-item label="流调状态" :label-width="labelWidth">
            <el-select v-model="currentTab">
              <el-option
                :value="item"
                :label="item"
                v-for="item in statusArray"
                :key="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="关联事件" prop="glsj" :label-width="labelWidth">
          <el-select
            v-model="filter.glsj"
            placeholder="请选择关联事件"
          >
            <el-option
              v-for="(item,index) in relatedEvent"
              :key="index"
              :label="item.sjmc"
              :value="item.sjmc"
            ></el-option>
            <el-option
              label="不限"
              :value="null"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-form>
      </template>
      <template slot="controler">
        <template v-if="!isMobile">
          <el-button
            icon="el-icon-circle-plus"
            type="primary"
            @click="addPositivePerson('local')"
          >
            新增本土病例</el-button
          >
          <el-button
            icon="el-icon-circle-plus"
            type="primary"
            @click="addPositivePerson('immigrate')"
          >
            新增入境病例</el-button
          >
          <el-button
            icon="el-icon-circle-plus"
            type="primary"
            @click="addCloseContactPerson"
          >
            新增密接次密接人员</el-button
          >
          <el-button
            icon="el-icon-circle-plus"
            type="primary"
            @click="uploadPositivePersons"
          >
            导入初筛阳性人员</el-button
          >
          <el-link
            :href='templateUrl'
            :underline="false"
            type="primary"
            download="初筛阳性人员-模板"
            style="margin: 0 10px"
          >
            <el-button
              icon="el-icon-download"
              type="primary"
              plain>
              初筛阳性人员模板下载
            </el-button>
          </el-link>
          <el-button
            icon="el-icon-download"
            type="primary"
            plain
            @click="exportRelatePersonMsg"
          >
            导出关联人员信息
          </el-button>
          <el-button
            icon="el-icon-download"
            type="primary"
            plain
            @click="exportData"
          >
            导出全部</el-button
          >
        </template>
        <template v-else>
          <el-dropdown @command="command => this[command]()" trigger="click">
            <span class="el-dropdown-link">
              表单操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addPositivePerson">新增阳性人员</el-dropdown-item>
              <el-dropdown-item command="addCloseContactPerson">新增密接次密接人员</el-dropdown-item>
              <el-dropdown-item command="exportData">导出全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </template>

      <template slot="tableHeader">
        <tabs :tabs="tabs" v-model="currentTab"></tabs>
      </template>
      <template v-slot:column_ymjzzc="row">
        <el-button
          type="text"
          @click="showVaccinationStatus(row.value)"
          :disabled="row.value.ymjzzc === '-'"
          >{{ row.value.ymjzzc }}</el-button
        >
      </template>
      <template v-slot:column_hscs="row">
        <el-button type="text" @click="showNucleicAcidStatus(row.value)">
          {{row.value.hscs}}
        </el-button>
      </template>
      <template v-slot:column_fxrywz="row">
        <el-button type="text" @click="showCurrentPosition(row.value)"
        :disabled="!row.value.longitude || row.value.longitude==='-' || !row.value.latitude || row.value.latitude==='-'">
          {{!row.value.longitude || row.value.longitude === '-' || !row.value.latitude || row.value.latitude === '-' ? '-' : '查看'}}
        </el-button>
      </template>
      <template v-slot:column_smcssl="row">
        <el-button type="text" @click="showScanPlaces(row.value)">
          {{row.value.smcssl}}
        </el-button>
      </template>
    </table-page>

    <el-dialog
      :title="positiveType==='local'?'新增本土病例':'新增入境病例'"
      :visible.sync="addPositivePersonDialogVisible"
      width="708px"
      @close="resetFields('addPositivePersonForm')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="add-positive-person-dialog"
    >
      <el-form
        ref="addPositivePersonForm"
        :model="addPositivePersonForm"
        label-width="100px"
        class="add-positive-person-dialog-form"
        :rules="addPersonRules"
      >
        <el-form-item label="关联事件" prop="glsjId">
          <el-select
            v-model="addPositivePersonForm.glsjId"
            placeholder="请选择关联事件"
          >
            <el-option
              v-for="(item,index) in relatedEvent"
              :key="index"
              :label="item.sjmc"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input
            v-model="addPositivePersonForm.xm"
            placeholder="请填写姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="lxdh">
          <el-input
            v-model="addPositivePersonForm.lxdh"
            placeholder="请填写电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="zjlx">
          <el-select
            v-model="addPositivePersonForm.zjlx"
            placeholder="请选择证件类型"
          >
            <el-option
              v-for="(item,index) in certificateTypes"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="sfzhm">
          <el-input
            v-model.trim="addPositivePersonForm.sfzhm"
            placeholder="请填写证件号码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="addPositivePersonDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="addPositivePersonConfirm"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="新增密接次密接人员"
      :visible.sync="addCloseContactPersonDialogVisible"
      width="708px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="resetFields('addCloseContactPersonForm')"
      custom-class="add-close-contact-person-dialog"
    >
      <el-form
        ref="addCloseContactPersonForm"
        :model="addCloseContactPersonForm"
        label-width="100px"
        class="add-positive-person-dialog-form"
        :rules="addPersonRules"
      >
        <el-form-item label="关联事件" prop="glsjId">
          <el-select
            v-model="addCloseContactPersonForm.glsjId"
            placeholder="请选择"
            @change="getLinkageData"
          >
            <el-option
              v-for="(item,index) in relatedEvent"
              :key="index"
              :label="item.sjmc"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重点场所" prop="keyPlace">
          <el-select
            v-model="addCloseContactPersonForm.keyPlace"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in relatedKeyPlace"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联病例">
          <el-select
            v-model="addCloseContactPersonForm.glbl"
            placeholder="请选择"
          >
            <el-option
              v-for="item in relatedCases"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input
            v-model="addCloseContactPersonForm.xm"
            placeholder="请填写姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="lxdh">
          <el-input
            v-model="addCloseContactPersonForm.lxdh"
            placeholder="请填写电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件号码" prop="sfzhm">
          <el-input
            v-model.trim="addCloseContactPersonForm.sfzhm"
            maxlength="18"
            placeholder="请填写证件号码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="addCloseContactPersonDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="addCloseContactPersonConfirm"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="疫苗接种状况"
      v-if="currentItem"
      :visible.sync="vaccinationStatusVisible"
      width="708px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="p-epidemiological-survey-dialog"
    >
      <section class="p-epidemiological-survey-dialog-header">
        <section>姓名：{{ currentItem.xm }}</section>
        <section>证件号码：{{ currentItem.sfzhm }}</section>
      </section>
      <section class="p-epidemiological-survey-dialog-content">
        <ul
          class="p-epidemiological-survey-dialog-list"
          v-if="vaccinationStatus.length"
        >
          <li
            v-for="(item, index) in vaccinationStatus"
            :key="index"
            class="p-epidemiological-survey-dialog-item"
          >
            <section
              v-for="key in Object.keys(item).filter(
                key => key in vaccinationFieldMap
              )"
              :key="key"
            >
              {{ vaccinationFieldMap[key] }}：{{ item[key] }}
            </section>
          </li>
        </ul>
        <empty v-else></empty>
      </section>
    </el-dialog>
    <el-dialog
      title="近14日核酸情况"
      v-if="currentItem"
      :visible.sync="nucleicAcidStatusVisible"
      width="708px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="p-epidemiological-survey-dialog"
    >
      <section class="p-epidemiological-survey-dialog-header">
        <section>被检测人姓名：{{ currentItem.xm }}</section>
        <section>被检测人证件号码：{{ currentItem.sfzhm }}</section>
        <section>所属哨点类别：{{ sentinelInfo }}</section>
      </section>
      <section class="p-epidemiological-survey-dialog-content">
        <ul
          class="p-epidemiological-survey-dialog-list"
          v-if="nucleicAcidStatus.data && nucleicAcidStatus.data.length"
        >
          <li
            v-for="(item, index) in nucleicAcidStatus.data"
            :key="index"
            class="p-epidemiological-survey-dialog-item"
          >
            <section
              v-for="key in Object.keys(item).filter(
                key => key in nucleicAcidMap
              )"
              :key="key"
            >
              {{ nucleicAcidMap[key] }}：
              <span
                :class="
                  key === 'jcjg' && item[key] === '阳性'
                    ? 'p-epidemiological-survey-dialog-item__danger'
                    : ''
                "
                >{{ item[key] }}</span
              >
              <i
                v-if="key === 'jcjg' && item[key] === '阴性'"
                class="p-epidemiological-survey-dialog-negative"
              ></i>
            </section>
          </li>
        </ul>
        <empty v-else></empty>
      </section>
    </el-dialog>
    <el-dialog
      title="近14日扫码场所"
      v-if="currentItem"
      :visible.sync="scanRecordsVisible"
      width="708px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="p-epidemiological-survey-dialog"
    >
      <scan-record :scanRecord="scanRecord" :personnelId="currentItem.id"/>
    </el-dialog>
    <el-dialog
      title="当前位置"
      :visible.sync="currentPositionVisible"
      width="708px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="p-epidemiological-survey-dialog"
    >
      <img :src="img_url" class="p-epidemiological-survey-dialog-img" />
    </el-dialog>
    <import-file
        :tableId="10095"
        positiveRylb="初筛阳性人员"
        v-if="uploadPositivePersonsDialogVisible"
        @close="uploadPositivePersonsDialogVisible = false"
        @update="getData"
    />
  </div>
</template>

<script>
import TablePage from "@zkzc/table-page";
import TablePageFunc from "@/utils/tablepage.js";
import ImportFile from "@/views/common/uploadFile";

import {
  getTemplateData,
  addTemplateData,
  deleteDataByIds,
  putTemplateData,
  exportData,
} from "@/api/common";
import {
  getNumByType,
  getNucleicAcidResult,
  getEpidemicVaccinationResult,
  sendMessage,
  downloadById,
  getAllGlsj,
  getAllGlbl,
  getAllZdcs,
  getCodeScanning,
  exportRelatePersonMessage
} from "@/api/epidemiologicalSurvey";
import { uploadFile } from "@/api/mediaInfo";
import Tabs from "@/components/common/Tabs.vue";
import {
  vaccinationFieldMap,
  nucleicAcidMap,
  addPersonRules,
  epidemiologicalSurveyTableKeys,
  statusArray,
  epidemiologicalSurveyTabs,
  addPositivePersonFormTemplate
} from "./config";
import Empty from "@/components/common/Empty";
import Watcher from "@/class/watcher";
import ScanRecord from './components/scanRecord'

export default {
  name: "epidemiologicalSurveyIndex",
  components: {
    TablePage,
    Tabs,
    Empty,
    ImportFile,
    ScanRecord
  },
  mixins: [TablePageFunc],
  data() {
    return {
      filter: {
        xm: "",
        zt: "全部",
        lxdh: "",
        sfzhm: "",
        glsj: "",
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100],
      },
      labelWidth: "100px",
      tableConfig: Object.freeze({
        columnFunctionsWidth: 400, // 操作栏宽度
        tableKeys: epidemiologicalSurveyTableKeys,
        // 表格函数
        tableFunctions: [
          {
            label: "编辑流调内容",
            method: this.editContent,
          },
          {
            label: scope =>
              scope.row.dxfszt === "已发短信" ? "重发短信" : "发送短信",
            method: this.sendMessage,
          },
          {
            label: "删除",
            method: this.remove,
          },
          {
            label: "下载资料",
            method: this.downloadImage,
          },
          {
            label: "上传消费记录",
            method: this.uploadConsumptionRecords,
          },
        ],
      }),
      tableData: [], //表格内容
      currentTab: "全部",
      addPersonRules,
      statusArray,
      addPositivePersonDialogVisible: false,
      positiveType:'',
      addCloseContactPersonDialogVisible: false,
      uploadPositivePersonsDialogVisible:false,
      vaccinationStatusVisible: false,
      nucleicAcidStatusVisible: false,
      scanRecordsVisible: false,
      currentPositionVisible: false,
      addPositivePersonForm: Object.assign({}, addPositivePersonFormTemplate),
      addCloseContactPersonForm: Object.assign({
        glbl: "",
        zdcs: "",
        keyPlace: [],
      }, addPositivePersonFormTemplate),
      currentItem: null,
      img_url: "",
      relatedCases: [],
      keyPlaceList: [],
      tabs: epidemiologicalSurveyTabs,
      vaccinationStatus: [],
      nucleicAcidStatus: [],
      vaccinationFieldMap,
      nucleicAcidMap,
      relatedEvent: [],
      relatedKeyPlace: [],
      templateUrl: `${process.env.BASE_URL}template/阳性人员-模板.xlsx`,
      scanRecord: {},
      certificateTypes:['居民身份证','护照','台湾居民来往内地通行证（俗称台胞证）','港澳台居民居住证','港澳居民来往内地通行证（俗称回乡证）','出生医学证明','外国人永久居留身份证']
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.common.isMobile;
    },
    sentinelInfo(){
      let info = '';
      const sdxx=this.nucleicAcidStatus.sdxx;
      if(typeof sdxx === 'string'){
        info=sdxx;
      }else if(Array.isArray(sdxx)){
        sdxx.forEach((item,index)=>{
          info+=`${index>0?'；':''}${item.ztlx}（核酸规则：${item.hsgz?item.hsgz:'暂无设置'}）`
        })
      }
      return info;
    }
  },
  watch: {
    currentTab(val) {
      this.filter.zt = val;
      this.getData();
    },
  },
  created() {
    console.clear();
    // 获取数据
    getNumByType().then(res => {
      const { total, ywcNum, wksNum, jxzNum } = res;
      const reflectMap = {
        全部: total,
        流调未开始: wksNum,
        流调进行中: jxzNum,
        流调已结束: ywcNum,
      };
      this.tabs = this.statusArray.map(item => {
        return {
          label: item,
          value: item,
          extra: reflectMap[item],
        };
      });
    });
    this.getData();
    this.getRelatedCases();
    this.getKeyPlaceList();
    this.getAllRelatedEvent();
    this.initWatcher();
  },
  methods: {
    initWatcher(){
      if (window['_watcher_voice']) return;
      const ws = new Watcher({
        name: 'dispatchWatcher',
        type: 'voice',
        scope: this
      })

      ws.addListener((data)=>{
        this.updateViewFromSocket(data)
      })
    },
    //更新流调信息
    updateViewFromSocket(data) {
      const { tableData } = this;
      const {
        dataId, //流调id
        type, // 用于区分信息簇 base:基本信息 track:核心轨迹 vaccination:疫苗接种 detection:近7天核酸情况 other:其他 map:地图
        value, //信息值
      } = data;
      const modifyIndex = tableData.findIndex(item => item.id === dataId);
      if(type === 'map' && modifyIndex > -1) {
        const { longitude, latitude } = value;
        tableData[modifyIndex].longitude = longitude;
        tableData[modifyIndex].latitude = latitude;
        this.$forceUpdate();
      }
    },
    async getData() {
      const { filter: condition } = this;
      const conditionMap = {
        全部: "",
        流调未开始: "未开始",
        流调进行中: "进行中",
        流调已结束: "已完成",
      };
      condition.zt =
        conditionMap[condition.zt] || conditionMap[condition.zt] === ""
          ? conditionMap[condition.zt]
          : condition.zt;
      condition.bm = false;
      const res = await getTemplateData({
        templateId: 10095,
        condition,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      });
      const { data } = res;

      this.tableData = data.map((item, index) => {
        const obj = {
          index: (this.filter.pageNum - 1) * this.filter.pageSize + (index + 1),
          ...item,
        };
        epidemiologicalSurveyTableKeys
          .map(v => v.id)
          .forEach(key => {
            if (!obj[key]) {
              obj[key] = "-";
            }
            if(key==='hscs'){
              obj[key] = `${(obj[key])}次`
            }else if(key==='smcssl'){
              const scanPlacesNum = obj[key];
              obj[key] = scanPlacesNum === '0' ? '无' : `${scanPlacesNum}个场所`
            }
          });
        return obj;
      });
      this.filter.rowTotal = res.total;
    },
    resetFilter() {
      let pageNum = this.filter.pageNum;
      let pageSize = this.filter.pageSize;
      let rowTotal = this.filter.rowTotal;
      this.filter = this.$options.data().filter;
      this.currentTab = "全部";
      this.filter.pageNum = pageNum;
      this.filter.pageSize = pageSize;
      this.filter.rowTotal = rowTotal;
      this.getData();
    },
    getAllRelatedEvent() {
      getAllGlsj().then(res => {
        this.relatedEvent = res;
      });
    },
    getLinkageData(glsj = "") {
      this.getAllKeyPlace(glsj);
      this.getRelatedCases(glsj);
      this.addCloseContactPersonForm.glbl = '';
    },
    getAllKeyPlace(glsj) {
      getAllZdcs(glsj).then(res => {
        this.relatedKeyPlace = [
          ...res,
        ];
      });
    },
    getRelatedCases(glsj) {
      getAllGlbl(glsj).then(res => {
        this.relatedCases = [
          ...res,
          {
            key: "",
            value: "",
          },
        ];
      });
    },
    getKeyPlaceList() {
      getTemplateData({ templateId: 10098 }).then(res => {
        this.keyPlaceList = res.data;
      });
    },
    sendMessage(scope) {
      sendMessage(scope.row.id).then(res => {
        if (res) {
          this.$message.success("发送成功");
        } else {
          this.$message.error("发送失败");
        }
        this.getData();
      });
    },
    downloadImage({ row: { id } }) {
      downloadById(id);
    },
    editContent(scope) {
      this.$router.push({
        name: "editSurvey",
        query: {
          id: scope.row.id,
          positiveType: scope.row.bllx
        },
      });
    },
    uploadConsumptionRecords({ row: { id } }) {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.click();
      input.onchange = async () => {
        const file = input.files[0];
        const res = await uploadFile("es", file);
        putTemplateData(id, {
          xfjl: res.id,
        }).then(() => {
          this.$message.success("上传成功");
        });
      };
    },
    remove(scope) {
      this.$confirm("确定删除该条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDataByIds(scope.row.id).then(() => {
            this.$message.success("删除成功");
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    showVaccinationStatus(item) {
      if (item.ymjzzc === "-") {
        this.$message.error("该人员未填写疫苗接种情况");
        return;
      }
      this.currentItem = item;
      getEpidemicVaccinationResult(item.id).then(res => {
        this.vaccinationStatus = res.data;
        this.vaccinationStatusVisible = true;
      });
    },
    async showCurrentPosition({ id }) {
      const {
        data: [item],
      } = await getTemplateData({
        templateId: 10095,
        condition: { id },
      });
      const { longitude, latitude } = item;
      if (!longitude || !latitude) {
        this.$message.error("该人员未填写经纬度");
        return;
      }
      const loglat = `${longitude},${latitude}`;
      this.img_url =
        "https://restapi.amap.com/v3/staticmap?location=" +
        loglat +
        "&zoom=15&size=708*400&markers=mid,,A:" +
        loglat +
        "&key=b2525adffd9c59179b5b64c6bf092012";
      this.currentPositionVisible = true;
    },
    showNucleicAcidStatus(item) {
      this.currentItem = item;
      getNucleicAcidResult(item.id).then(res => {
        this.nucleicAcidStatus = res;
        this.nucleicAcidStatusVisible = true;
      });
      this.nucleicAcidStatusVisible = true;
    },
    showScanPlaces(item){
      this.currentItem = item;
      getCodeScanning(item.id,{pageNum:1,pageSize:10}).then(res=>{
        this.scanRecord = res;
        this.scanRecordsVisible = true;
      })
    },
    addPositivePerson(type) {
      this.addPositivePersonDialogVisible = true;
      this.positiveType = type;
    },
    addCloseContactPerson() {
      this.addCloseContactPersonDialogVisible = true;
    },
    uploadPositivePersons(){
      this.uploadPositivePersonsDialogVisible=true;
    },
    exportData() {
      exportData({ templateId: 10095, ...this.filter });
    },
    exportRelatePersonMsg(){
      const { pageNum: page } = this.filter;
        exportRelatePersonMessage({
          condition: this.filter,
          page,
          pageSize: 1000
        });
    },
    addPositivePersonConfirm() {
      this.$refs["addPositivePersonForm"].validate(async valid => {
        if (valid) {
          addTemplateData({
            templateId: 10095,
            rylb: "初筛阳性人员",
            bllx: this.positiveType==='local'?'本土病例':'入境病例',
            ...this.addPositivePersonForm,
          }).then(() => {
            this.$message.success("添加成功");
            this.addPositivePersonDialogVisible = false;
            this.addPositivePersonForm = {
              glsjId: "",
              xm: "",
              lxdh: "",
              sfzhm: "",
            };
            this.$refs.addPositivePersonForm.resetFields();
            this.getData();
          });
        }
      });
    },
    resetFields(name) {
      this.$refs[name].resetFields();
    },
    addCloseContactPersonConfirm() {
      this.$refs["addCloseContactPersonForm"].validate(async valid => {
        if (valid) {
          const data = {
            templateId: 10095,
            rylb: "密切接触者",
            csdz: this.addCloseContactPersonForm.keyPlace.join(","),
            ...this.addCloseContactPersonForm,
          };
          delete data.keyPlace;
          addTemplateData(data).then(() => {
            this.$message.success("添加成功");
            this.addCloseContactPersonDialogVisible = false;
            this.addCloseContactPersonForm = {
              glsjId: "",
              xm: "",
              lxdh: "",
              sfzhm: "",
              glbl: "",
              zdcs: "",
            };
            this.$refs.addCloseContactPersonForm.resetFields();
            this.getData();
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" type="text/scss" scoped>
.p-epidemiological-survey-dialog {
  &-header {
    padding: 10px;
    margin-bottom: 10px;
    border-bottom: 2px solid rgb(249, 249, 249);
  }
  &-content {
    padding: 10px;
    height: 442px;
    overflow-y: auto;
  }
  &-item {
    margin-bottom: 10px;
    border-bottom: 2px solid rgb(249, 249, 249);
    &__danger {
      color: red;
    }
  }
  &-img {
    width: 100%;
    height: 100%;
  }
  &-negative {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url(../../assets/image/epidemiologicalSurvey/icon-negative.svg)
      no-repeat center center / contain;
    position: relative;
    left: 8px;
    top: 4px;
  }
  section {
    cursor: default;
    line-height: 2.6;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
