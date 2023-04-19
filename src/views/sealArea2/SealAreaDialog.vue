<template>
  <el-dialog
    destroy-on-close
    append-to-body
    class="screen-dialog screen-wrap c-seal-area-dialog"
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    :width="typeProp.width"
  >
    <div slot="title" class="title">
      <span>{{ typeProp.title }}</span>
      <!-- 只有户籍和流动人口有详细数据 -->
      <el-button
        type="text"
        @click="showData(dialogProp.tag)"
        v-if="['household', 'flow'].includes(dialogProp.tag)"
        >查看人口详情</el-button
      >
    </div>

    <div v-if="dialogType === 'contactDetailList'">
      <table-page
        :tableConfig="contactDetailListConfig"
        :tableData="contactDetailListData"
        ref="contactDetailTable"
        customClass="table__dark"
        :filter="contactDetailListFilter"
        @search="getContactDetailList"
        @resetSearch="
          resetSearch('contactDetailListFilter', 'getContactDetailList')
        "
        @sizeChange="
          sizeChange($event, 'contactDetailListFilter', 'getContactDetailList')
        "
        @currentChange="getContactDetailList"
        :hideKeyFilter="true"
      >
        <template slot="searchFilter">
          <div class="search-box">
            <el-form :inline="true" :model="contactDetailListFilter">
              <el-input
                style="width: 300px"
                v-model="contactDetailListFilter.keyword"
                placeholder="请输姓名、身份证搜索"
              ></el-input>
            </el-form>
          </div>
        </template>
        <template v-slot:column_mjlx="row">
          <span
            :style="`color:${
              row.value.mjlx === '密接的密接' ? '#FFFF00' : '#F42A34'
            }`"
          >
            {{ row.value.mjlx }}</span
          >
        </template>
      </table-page>
    </div>
    <div v-if="dialogType === 'healthCodeDetailList'">
      <table-page
        :tableConfig="healthCodeDetailListConfig"
        :tableData="healthCodeDetailListData"
        :filter="healthCodeDetailListFilter"
        @search="getHealthCodeDetailList"
        @resetSearch="
          resetSearch('healthCodeDetailListFilter', 'getHealthCodeDetailList')
        "
        @sizeChange="
          sizeChange(
            'healthCodeDetailListFilter',
            'getHealthCodeDetailList',
            $event
          )
        "
        @currentChange="getHealthCodeDetailList"
        :customClass="'staff_table'"
        :hideKeyFilter="true"
      >
        <template slot="searchFilter">
          <div class="search-box">
            <el-form
              :inline="true"
              :model="healthCodeDetailListFilter"
              label-width="80px"
              @keyup.enter.native="getData"
            >
              <el-form-item :label="`${dialogProp.healthCode}人员姓名`">
                <el-input
                  style="width: 150px; margin: 0 20px"
                  v-model="healthCodeDetailListFilter.keyword"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="镇街">
                <el-select
                  v-model="healthCodeDetailListFilter.street"
                  placeholder="请选择镇街"
                  style="width: 150px; margin: 0 20px"
                >
                  <el-option label="不限" value=""></el-option>
                  <el-option
                    v-for="item in streetList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </template>
        <template v-slot:column_hs_check_time="row">
          <span>{{ row.value.hs_check_time || "无" }}</span>
        </template>
        <template v-slot:column_first_inject_time="row">
          <span>{{ row.value.first_inject_time || "无" }}</span>
        </template>
        <template v-slot:column_second_inject_time="row">
          <span>{{ row.value.second_inject_time || "无" }}</span>
        </template>
        <template v-slot:column_third_inject_time="row">
          <span>{{ row.value.third_inject_time || "无" }}</span>
        </template>
        <template v-slot:column_hs_check_result="row">
          <span>{{ row.value.hs_check_result || "无" }}</span>
        </template>
      </table-page>
    </div>
    <div v-if="dialogType === 'demandDetailList'">
      <table-page
        :tableConfig="demandDetailListConfig"
        :tableData="demandDetailListData"
        ref="demandDetailTable"
        customClass="table__dark"
        :hideKeydemandListProp="true"
        :hideSearch="true"
        :filter="demandListFilter"
        @currentChange="getDemandList"
      >
      </table-page>
    </div>
    <div
      v-if="dialogType === 'nucleicDetailList'"
      class="c-seal-area-dialog-nucleic"
    >
      <detail-list
        :cond="dialogProp"
        @layerClicked="handelCheckDetail"
      ></detail-list>
      <el-dialog
        v-dialogDrag
        destroy-on-close
        class="screen-dialog"
        v-if="showSpotDetail"
        :visible.sync="showSpotDetail"
        title="采样点"
        width="900px"
      >
        <spot-detail :data="spotDetail" @popUp="handlePopUp"></spot-detail>

        <phone-call-panel />
      </el-dialog>
    </div>
    <div
      v-if="dialogType === 'populationDetailList'"
      class="c-seal-area-dialog-chart"
    >
      <data-board
        hideTitle
        code="getPopulationByAge"
        :chartHeight="350"
        :visible="true"
        :options="dialogProp"
        :showBigBtn="false"
        :info="{
          title: '各年龄段人口数据',
          showInfo: true,
        }"
      />
      <data-board
        hideTitle
        code="getPopulationBySex"
        :chartHeight="300"
        :visible="true"
        :options="dialogProp"
        :showBigBtn="false"
        :info="{
          title: '性别人口数据',
          showInfo: true,
        }"
      />
    </div>

    <div v-if="dialogType === 'czcDetail'">
      <data-board
        hideTitle
        code="cityVillageManageLx"
        :originData="dialogProp.data"
        :chartHeight="600"
        :visible="true"
        :options="dialogProp"
        :showBigBtn="false"
      />
    </div>
    <DataList
      v-if="fetchData"
      :fetchData="fetchData"
      @close="fetchData = null"
    />
  </el-dialog>
</template>

<script>
import TablePage from "@zkzc/table-page";
import DataBoard from "@/components/charts/DataBoard";
import { parseTime } from "@/utils/common";
import TablePageFunc from "@/utils/tablepage";
import DetailList from "@/views/big/layer/DetailList";
import "@/assets/css/screenDialog.scss";
import {
  getSealAreaFeedbackList,
  getContactDetail,
  getHealthCodeDetail,
} from "@/api/sealarea2.js";
import SETTING from "@/config/MapSetting.js";
import SpotDetail from "@/components/screen/SpotDetail";

export default {
  name: "SealAreaDialog",
  mixins: [TablePageFunc],
  props: {
    dialogType: {
      type: String,
      required: true,
    },
    dialogProp: {
      type: [String, Object],
    },
  },
  mounted() {
  },
  components: {
    TablePage,
    DataBoard,
    DetailList,
    SpotDetail,
    PhoneCallPanel: () => import("@/components/common/PhoneCallPanel"),
    DataList: () => import("@/components/DataList/"),
  },
  watch: {
    dialogProp: {
      handler() {
        if(!this.typeProp){
            return
        }
        if (this.typeProp.handler) this.typeProp.handler();
      },
      immediate: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      videoList: [],
      showVideoList: false,
      demandListFilter: {
        pageNum: 1,
        rowTotal: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      nucleicDetailListProp: {
        page: 1,
        pageSize: 10,
        rowTotal: 1,
        pageSizes: [10, 20, 50, 100],
      },
      showSpotDetail: false,
      spotDetail: null,
      demandDetailListConfig: Object.freeze({
        tableKeys: [
          {
            id: "xm",
            label: "姓名",
            width: 80,
          },
          {
            id: "szxxdz",
            label: "居住地址",
            width: 80,
          },
          {
            id: "lxdh",
            label: "联系电话",
            width: 80,
          },
          {
            id: "xb",
            label: "性别",
            width: 50,
          },
          {
            id: "nl",
            label: "年龄",
            width: 50,
          },
          {
            id: "xqlx",
            label: "需求类型",
            width: 150,
          },
          {
            id: "xqxq",
            label: "需求详情",
            width: 80,
          },
          {
            id: "sfmy",
            label: "是否满意",
            width: 80,
          },
          {
            id: "fillingTime",
            label: "填报时间",
            width: 150,
          },
        ],
      }),
      demandDetailListData: [],
      contactDetailListFilter: {
        keyword: "",
        pageNum: 1,
        pageSize: 15,
        rowTotal: 1,
        pageSizes: [15, 50, 100, 200],
      },
      contactDetailListConfig: Object.freeze({
        tableKeys: [
          { id: "xm", label: "姓名", width: 100 },
          { id: "xb", label: "性别", width: 80 },
          { id: "sfzhzhm", label: "身份证号", minWidth: 180 },
          { id: "lxdh", label: "联系电话", width: 160 },
        ],
      }),
      contactDetailListData: [],
      healthCodeDetailListFilter: {
        pageNum: 1,
        pageSize: 15,
        rowTotal: 1,
        keyword: "",
        street: "",
        pageSizes: [15, 50, 100, 200],
      },
      healthCodeDetailListConfig: Object.freeze({
        tableKeys: [
          {
            id: "jz",
            label: "镇街",
            width: 100,
          },
          {
            id: "USERNAME",
            label: "姓名",
            width: 100,
          },
          {
            id: "COMMUNITY",
            label: "所属村居",
            width: 80,
          },
          {
            id: "gender",
            label: "性别",
            width: 80,
          },
          {
            id: "PHONE",
            label: "手机号码",
            width: 100,
          },
          {
            id: "address",
            label: "地址",
            minWidth: 100,
          },
        ],
      }),
      healthCodeDetailListData: [],
      fetchData: null,
      streetList: [
        "南沙街",
        "黄阁镇",
        "东涌镇",
        "大岗镇",
        "榄核镇",
        "横沥镇",
        "万顷沙镇",
        "珠江街",
        "龙穴街",
      ],
    };
  },
  methods: {
    handlePopUp(attributes) {
      const { eventType } = attributes;
      if (eventType === "showVideoList") {
        //视频列表
        this.$set(this, "videoList", {
          ...attributes,
          detailType: "videoList",
          dialogTitle: "视频列表",
        });
        this.showVideoList = true;
      }
    },
    editRow({ row }) {
      this.$emit("showCloseContactDetail", row);
    },
    showDialog() {
      this.dialogVisible = true;
    },
    handelCheckDetail({ layerId, attributes }) {
      const { templateId, label } = SETTING.getLayerInfo("detectionPoint");
      const spotDetail = {
        layerId,
        templateId,
        popUpTitle: label,
        detailType: "spotDetail",
        ...attributes,
      };
      this.$set(this, "spotDetail", spotDetail);
      this.showSpotDetail = true;
    },
    async getDemandList(val = 1) {
      this.demandListFilter.pageNum = val;
      const demandDetailData = await getSealAreaFeedbackList(this.dialogProp);
      this.demandDetailListData = demandDetailData.map((v) => ({
        ...v,
        fillingTime: parseTime(v.fillingTime),
      }));
      this.demandListFilter.rowTotal = demandDetailData.total;
    },
    async getContactDetailList(val = 1) {
      this.contactDetailListFilter.pageNum = val;
      const contactDetailListData = await getContactDetail(
        this.dialogProp.areaId,
        {
          ...this.dialogProp,
          ...this.contactDetailListFilter,
        }
      );
      this.contactDetailListData = contactDetailListData.data.map((v) => ({
        ...v,
        fillingTime: parseTime(v.fillingTime),
      }));
      this.contactDetailListFilter.rowTotal = contactDetailListData.total;
    },
    async getHealthCodeDetailList(val = 1) {
      this.healthCodeDetailListFilter.pageNum = val;
      const healthCodeDetailListData = await getHealthCodeDetail(
        this.dialogProp.areaId,
        {
          ...this.dialogProp,
          ...this.healthCodeDetailListFilter,
        }
      );
      this.healthCodeDetailListData = healthCodeDetailListData.data.map(
        (v) => ({
          ...v,
          fillingTime: parseTime(v.fillingTime),
        })
      );
      this.healthCodeDetailListFilter.rowTotal = healthCodeDetailListData.total;
    },
    showData(tag) {
      let _this = this;
      let fetchDataList = {
        household: {
          name: "户籍人口详情",
          api(data) {
            return new Promise((resolve) => {
              _this
                .$Api()
                .SealManageAreaStatisticsController.post_getSealAreaBasicsdataList.request(
                  {
                    path: {
                      areaId: _this.dialogProp.areaId,
                    },
                    data: data.data,
                  }
                )
                .then((res) => {
                  resolve(res);
                });
            });
          },
          filter: ["name", "phone", "address"],
          keys: {
            name: "姓名",
            idNumber: "身份证",
            sex: "性别",
            phone: "联系电话",
            source: "数据来源（户籍人口、流动人口）",
            address: "现居住地址",
          },
          formatter: {},
          areaId: _this.dialogProp.areaId,
        },
        flow: {
          name: "流动人口详情",
          api(data) {
            return new Promise((resolve) => {
              _this
                .$Api()
                .SealManageAreaStatisticsController.post_getSealAreaRecurrentList.request(
                  {
                    path: {
                      areaId: _this.dialogProp.areaId,
                    },
                    data: data.data,
                  }
                )
                .then((res) => {
                  resolve(res);
                });
            });
          },
          filter: ["name", "phone", "address"],
          keys: {
            name: "姓名",
            idNumber: "身份证",
            sex: "性别",
            phone: "联系电话",
            source: "数据来源（户籍人口、流动人口）",
            address: "现居住地址",
          },
          formatter: {},
          areaId: _this.dialogProp.areaId,
        },
      };
      this.fetchData = fetchDataList[tag];
    },
  },
  computed: {
    typeProp() {
      const  dialogProp  = this.dialogProp||{};
      const typeMap = {
        demandDetailList: {
          width: "1100px",
          handler: this.getDemandList,
          title: `需求明细列表-${dialogProp}`,
        },
        nucleicDetailList: {
          width: "1100px",
          title: `${dialogProp.dialogTitle}`,
        },
        populationDetailList: {
          width: "500px",
          title: `人口数据-${dialogProp.originTag}`,
        },
        contactDetailList: {
          width: "820px",
          handler: this.getContactDetailList,
          title: `${dialogProp.contactType}人员明细`,
        },
        healthCodeDetailList: {
          width: "1100px",
          handler: this.getHealthCodeDetailList,
          title: `${dialogProp.healthCode}人员明细`,
        },
        czcDetail: {
          width: "1000px",
          title: dialogProp.tag,
        },
      };
      return typeMap[this.dialogType];
    },
  },
};
</script>

<style lang="scss" type="text/scss">
.c-seal-area-dialog {
  .title {
    display: flex;
    justify-content: space-between;
    padding-right: 40px;
    align-items: center;
  }
  .el-dialog__body {
    overflow: auto;
    max-height: 70vh;
  }
  &-chart {
    height: 750px;
    > div:first-child {
      height: 400px;
    }
    > div:last-child {
      height: 350px;
    }
  }
  &-nucleic {
    .el-table__fixed-right-patch {
      display: none;
    }
    .el-table th,
    .el-table tr {
      background-color: transparent;
    }
  }
}
// 覆盖样式
.c-seal-area-dialog + .el-select-dropdown {
  z-index: 4000 !important;
}
</style>
