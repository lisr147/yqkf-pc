<template>
  <div class="c-sealarea-detail">
    <div class="c-sealarea-detail-header">
      {{ info.name }}
      <b class="el-icon-close" @click="dispatchClose"></b>
    </div>
    <section class="c-sealarea-detail-bottom">
      <folder-box title="基本信息">
        <table
          class="c-sealarea-detail-table"
          v-loading="loadingDetail"
          element-loading-text="加载数据中"
          element-loading-custom-class="loading-mask"
        >
          <tr>
            <div class="c-sealarea-detail-panel__col-2">
              <td width="80px">所属镇街：</td>
              <td>{{ sealAreaDetail.town || "-" }}</td>
            </div>
            <div
              class="c-sealarea-detail-panel__col-2"
              v-if="info.type === 'seal'"
            >
              <td width="80px">所属村居：</td>
              <td>{{ sealAreaDetail.committees || "-" }}</td>
            </div>
          </tr>
          <tr>
            <td width="80px">类型：</td>
            <td colspan="3">{{ areaTypeMap[sealAreaDetail.type].label }}</td>
          </tr>
          <tr>
            <td width="80px">描述：</td>
            <td colspan="3">
              {{ sealAreaDetail.remark || "-" }}
            </td>
          </tr>
        </table>
      </folder-box>

      <folder-box title="统计数" class="c-sealarea-detail-header__count">
        <div class="c-sealarea-detail-count">
          <div class="c-sealarea-detail-count__col__3">
            <p class="c-sealarea-detail-desc">人口</p>
            <div
              v-loading="loadingPopulation"
              element-loading-text="加载数据中"
              element-loading-custom-class="loading-mask"
            >
              <count-card
                v-for="item in population"
                :key="item.name"
                :itemName="item.name"
                :num="item.value"
                column="col-3"
                unit="人"
                class="c-sealarea-detail-item__clickable"
                @click.native="checkPopulation(item.name)"
              ></count-card>
            </div>
          </div>
          <div class="c-sealarea-detail-count__col__1">
            <p class="c-sealarea-detail-desc">面积</p>
            <div
              v-loading="loadingDetail"
              element-loading-text="加载数据中"
              element-loading-custom-class="loading-mask"
            >
              <count-card
                :itemName="`${areaTypeMap[sealAreaDetail.type].label}面积`"
                :num="sealAreaDetail.area"
                :unit="sealAreaDetail.areaUnit"
                column="col-1"
              ></count-card>
            </div>
          </div>
        </div>
        <div class="c-sealarea-detail-count">
          <div class="c-sealarea-detail-count__col__3">
            <p class="c-sealarea-detail-desc">特殊人群</p>
            <div
              v-loading="loadingSpeciaPeople"
              element-loading-text="加载数据中"
              element-loading-custom-class="loading-mask"
            >
              <count-card
                v-for="(item, index) in speciaPeople"
                :key="item.key"
                :itemName="item.key"
                :num="item.value"
                column="col-3"
                unit="人"
                class="c-sealarea-detail-item__clickable"
                @click.native="showData('getSealAreaSpecialList', index + 1)"
              ></count-card>
            </div>
          </div>
          <div class="c-sealarea-detail-count__col__1"></div>
        </div>
        <div class="c-sealarea-detail-count">
          <div class="c-sealarea-detail-count__col__2">
            <p class="c-sealarea-detail-desc">密接次密接</p>
            <div
              v-loading="loadingContact"
              element-loading-text="加载数据中"
              element-loading-custom-class="loading-mask"
            >
              <count-card
                v-for="item in contact"
                :key="item.key"
                :itemName="item.key"
                :num="item.value"
                :color="item.color"
                :unit="item.unit"
                column="col-2"
                class="c-sealarea-detail-item__clickable"
                @click.native="getContactDetail(item.key)"
              ></count-card>
            </div>
          </div>
          <div class="c-sealarea-detail-count__col__2">
            <p class="c-sealarea-detail-desc">红黄码人员</p>
            <div
              v-loading="loadingHealthCode"
              element-loading-text="加载数据中"
              element-loading-custom-class="loading-mask"
            >
              <count-card
                v-for="item in healthCode"
                :key="item.name"
                :itemName="item.name"
                :num="item.value"
                :color="item.color"
                :unit="item.unit"
                column="col-2"
                class="c-sealarea-detail-item__clickable"
                @click.native="getHealthCodeDetail(item.name)"
              ></count-card>
            </div>
          </div>
        </div>
      </folder-box>

      <folder-box title="物资储备">
        <div
          class="c-sealarea-detail-block"
          v-loading="loadingMaterial"
          element-loading-text="加载数据中"
          element-loading-custom-class="loading-mask"
        >
          <template v-if="!loadingMaterial">
            <p>
              该区域配套生活物资保供应企业（商超）<el-button
                type="text"
                class="num-link"
                @click="showData('getSealAreaShopList')"
                >{{ material.count }}</el-button
              >
              个。
            </p>
            <p>
              储存物资量：蔬菜{{ material.sccbl }}公斤，食用油{{
                material.syycbl
              }}公斤，粮食{{ material.dmmfcbl }}公斤，鸡蛋{{
                material.jdcbl
              }}公斤，肉类{{ material.zrcbl }}公斤，奶制品{{
                material.nzpcbl
              }}公斤。
            </p>
            <p>
              在不继续增加采购的情况下，粮食可以供{{
                areaTypeMap[sealAreaDetail.type].label
              }}生活<span class="c-sealarea-detail-text__highlight">{{
                material.dmmfDay
              }}</span
              >天，蔬菜可以供{{
                areaTypeMap[sealAreaDetail.type].label
              }}生活<span class="c-sealarea-detail-text__highlight">{{
                material.scDay
              }}</span
              >天，食用油可以供{{
                areaTypeMap[sealAreaDetail.type].label
              }}生活<span class="c-sealarea-detail-text__highlight">{{
                material.syyDay
              }}</span
              >天，鸡蛋可以供{{
                areaTypeMap[sealAreaDetail.type].label
              }}生活<span class="c-sealarea-detail-text__highlight">{{
                material.jdDay
              }}</span
              >天， 肉类可以供{{
                areaTypeMap[sealAreaDetail.type].label
              }}生活<span class="c-sealarea-detail-text__highlight">{{
                material.zrDay
              }}</span
              >天， 奶制品可以供{{
                areaTypeMap[sealAreaDetail.type].label
              }}生活<span class="c-sealarea-detail-text__highlight">{{
                material.nzpDay
              }}</span
              >天。
            </p>
            <p>
              当物资不足时，可以考虑从<span
                class="c-sealarea-detail-text__highlight"
                >{{ material.nearestShop }}</span
              >提供物资。
            </p>
          </template>
        </div>
        <div class="c-sealarea-detail-push">
          <el-button
            type="primary"
            :disabled="sealAreaDetail.materialReserveYzyIsPush === '1'"
            size="mini"
            @click="adoptAndPush('materialReserve')"
            >采纳并推送</el-button
          >
        </div>
      </folder-box>

      <folder-box title="物资配送" v-if="sealAreaDetail.type === 'seal'">
        <div
          class="c-sealarea-detail-block"
          v-loading="loadingMaterialDistribution"
          element-loading-text="加载数据中"
          element-loading-custom-class="loading-mask"
        >
          该区域有可调配人员
          <span class="c-sealarea-detail-text__highlight"
            ><el-button
              class="num-link"
              type="text"
              @click="showData('getSealAreaDistributionList')"
              >{{ materialDistribution.count }}</el-button
            ></span
          >
          名。根据{{
            areaTypeMap[sealAreaDetail.type].label
          }}人数测算，目前配送人员<span
            class="c-sealarea-detail-text__highlight"
            >{{ materialDistribution.status }}</span
          >，还需补充
          <span class="c-sealarea-detail-text__highlight">{{
            materialDistribution.lackCount
          }}</span
          >名。
        </div>
        <div class="c-sealarea-detail-push">
          <el-button
            type="primary"
            size="mini"
            :disabled="sealAreaDetail.materialDistributionYzyIsPush === '1'"
            @click="adoptAndPush('materialDistribution')"
            >采纳并推送</el-button
          >
        </div>
      </folder-box>

      <folder-box title="核酸检测采样" v-if="sealAreaDetail.type === 'seal'">
        <div
          class="c-sealarea-detail-block"
          v-loading="loadingThreeGroupData"
          element-loading-text="加载数据中"
          element-loading-custom-class="loading-mask"
        >
          该区域负责核酸采样三人小组共{{ threeGroupInfo.groupNum || 0 }}组，{{
            threeGroupInfo.totalNum || 0
          }}人，具体名单如下：
        </div>
        <table-page
          :data="tableListData"
          ref="sealAreaTable"
          id="seal_area_table"
          customClass="table__dark three-group-table"
          :hideKeyFilter="true"
          :hideSearch="true"
          :filter="filter"
          @currentChange="handleCurrentChange"
        >
        </table-page>
      </folder-box>

      <folder-box v-else title="核酸采样点">
        <div
          class="c-sealarea-detail-count"
          v-loading="loadingNucleicAcidSamples"
          element-loading-text="加载数据中"
          element-loading-custom-class="loading-mask"
        >
          <div class="c-sealarea-detail-count__col__3">
            <div>
              <count-card
                v-for="item in nucleicAcidSamples"
                :key="item.key"
                :itemName="item.key"
                :num="item.value"
                column="col-3"
                :unit="item.unit"
                :class="
                  item.key === '可覆盖的采样规模'
                    ? ''
                    : 'c-sealarea-detail-item__clickable'
                "
                @click.native="checkNucleicPoint(item.key)"
              ></count-card>
              <!-- 接口更换，先屏蔽入口 -->
            </div>
          </div>
        </div>
      </folder-box>

      <folder-box
        title="特殊人群服务情况"
        v-if="sealAreaDetail.type === 'seal'"
      >
        <div
          class="c-sealarea-detail-block"
          v-loading="loadingSpecialService"
          element-loading-text="加载数据中"
          element-loading-custom-class="loading-mask"
        >
          <!-- {{ specialService }} -->
          今日已服务特殊人群
          <el-button
            class="num-link"
            type="text"
            @click="showData('getSealAreaSpecialServiceList', [1, null])"
            >{{ specialService[0] }}</el-button
          >
          人，未服务
          <el-button
            class="num-link"
            type="text"
            @click="showData('getSealAreaSpecialServiceList', [0, null])"
            >{{ specialService[1] }}</el-button
          >
          人，（孕产妇
          <el-button
            class="num-link"
            type="text"
            @click="showData('getSealAreaSpecialServiceList', [0, 2])"
            >{{ specialService[2] }}</el-button
          >
          人，行动不便人员
          <el-button
            class="num-link"
            type="text"
            @click="showData('getSealAreaSpecialServiceList', [0, 3])"
            >{{ specialService[3] }}</el-button
          >
          人，精神障碍患者
          <el-button
            class="num-link"
            type="text"
            @click="showData('getSealAreaSpecialServiceList', [0, 4])"
            >{{ specialService[4] }}</el-button
          >
          人，透析、化疗等特殊就医服用药人员
          <el-button
            class="num-link"
            type="text"
            @click="showData('getSealAreaSpecialServiceList', [0, 1])"
            >{{ specialService[5] }}</el-button
          >
          人，独居老人
          <el-button
            class="num-link"
            type="text"
            @click="showData('getSealAreaSpecialServiceList', [0, 6])"
            >{{ specialService[6] }}</el-button
          >
          人），服务率 {{ specialService[7] }} 。
        </div>
      </folder-box>

      <folder-box
        title="防控区群众需求反馈"
        class="folder-box__link"
        @click.native="handleFeedbackClick"
        v-if="sealAreaDetail.type === 'seal'"
      >
        <div>
          <data-board
            id="3370243"
            hideTitle
            code="qzxqfk"
            :chartHeight="400"
            :visible="true"
            @onChartClick="handleChartClick"
          />
        </div>
      </folder-box>
      <!-- 城中村治理 -->
      <CZC
        :areaAttribute="areaAttribute"
        @showDialog="showDialog"
        v-if="isGZ2000"
      />
    </section>
    <seal-area-dialog
      ref="sealAreaDialog"
      :dialogType="dialogType"
      :dialogProp="dialogProp"
    ></seal-area-dialog>
    <DataList v-if="fetchData" :fetchData="fetchData" @close="fetchData = null">
      <ServiceReportList
        :serviceReportListVisible.sync="reportList"
        @close="reportList = null"
        :reportList="reportList"
        v-if="reportList"
        darkScreen
      />
    </DataList>
  </div>
</template>

<script>
import FolderBox from "@/components/common/FolderBox";
import CountCard from "@/components/charts/CountCard";
import TablePage from "zkzc-table-page";
import DataBoard from "@/components/charts/DataBoard";
import SealAreaDialog from "./SealAreaDialog";
import "@/assets/css/screenDialog.scss";
import {
  getSealAreaById,
  getSealAreaPopulation,
  getHealthCode,
  getSealAreaContact,
  getSealAreaSpecial,
  getSealAreaThreeGroup,
  getMaterial,
  getMaterialDistribution,
  getSealAreaSpecialService,
  getSealAreaHsPoint,
  pushMaterialInfo
} from "@/api/sealarea2.js";
import moment from "moment";

const apiList = [
  "getSealAreaById",
  "getSealAreaPopulation",
  "getHealthCode",
  "getSealAreaContact",
  "getSealAreaSpecial",
  "getSealAreaThreeGroup",
  "getMaterial",
  "getMaterialDistribution",
  "getSealAreaSpecialService",
  "getSealAreaHsPoint",
];
import { getServiceReport } from "@/api/alarm";
export default {
  name: "SealAreaDetail",
  components: {
    FolderBox,
    CountCard,
    TablePage,
    DataBoard,
    SealAreaDialog,
    DataList: () => import("@/components/DataList/"),
    ServiceReportList: () => import("@/components/alarm/ServiceReportList"),
    CZC: () => import("./detail/czc.vue")
  },
  provide() {
    return {
      handleItemChoosed: this.handleItemChoosed
    };
  },
  props: {
    areaAttribute: Object,
    showme: { type: Boolean, default: false }
  },
  model: {
    prop: "showme",
    event: "toggle"
  },
  data() {
    return {
      filter: {
        page: 1,
        pageSize: 10,
        rowTotal: 1,
        pageSizes: [10, 20, 50, 100]
      },
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: [
          {
            id: "srxzzm",
            label: "组名",
            width: 120
          },
          {
            id: "sscj",
            label: "所属村居",
            width: 120
          },
          {
            id: "xm",
            label: "姓名",
            minWidth: 80
          },
          {
            id: "rylb",
            label: "成员类别",
            width: 120
          },
          {
            id: "lxfs",
            label: "联系方式",
            width: 150
          }
        ],
        tableFunctions: []
      },
      sealAreaDetail: {
        town: "",
        type: "seal",
        area: "",
        id: 0,
        name: "",
        polygon: "",
        remark: "",
        unitName: ""
      },
      population: [],
      healthCode: null,
      contact: null,
      threeGroup: null,
      areaTypeMap: {
        seal: { label: "高风险区" },
        // manage: { label: "中风险区" },
        prevention: { label: "低风险区" },
        managewga: { label: "管控网格" },
        managewgb: { label: "识别区域" }
      },
      speciaPeople: null,
      material: {
        count: 0,
        sccbl: 0,
        syycbl: 0,
        dmmfcbl: 0,
        jdcbl: 0,
        zrcbl: 0,
        dmmfDay: 0,
        scDay: 0,
        syyDay: 0,
        jdDay: 0,
        zrDay: 0,
        nearestShop: ""
      },
      materialDistribution: {
        count: 0,
        status: "不足",
        lackCount: 0
      },
      threeGroupInfo: {
        groupNum: 0,
        totalNum: 0
      },
      specialService: "",
      nucleicAcidSamples: [],
      dialogType: "",
      loadingPopulation: false,
      loadingDetail: false,
      loadingContact: false,
      loadingSpeciaPeople: false,
      loadingHealthCode: false,
      loadingMaterial: false,
      loadingMaterialDistribution: false,
      loadingThreeGroupData: false,
      loadingNucleicAcidSamples: false,
      loadingSpecialService: false,
      loadingCzc: false,
      dialogProp: null,
      fetchData: null, //详情数据
      reportList: null //特殊人群服务服务情况数据
    };
  },
  computed: {
    info() {
      return this.$store.state.common.sealarea || {};
    },
    isGZ2000() {
      return this.$route.path === "/gz2000";
    },
    fetchDataList() {
      let _this = this;
      let extra = null;
      let result = {
        // 配送人员
        getSealAreaDistributionList: {
          name: "配送人员明细",
          api(data) {
            return new Promise(resolve => {
              _this
                .$Api()
                .SealManageAreaStatisticsController.post_getSealAreaDistributionList.request(
                  {
                    path: {
                      areaId: _this.areaAttribute.id
                    },
                    data: data.data
                  }
                )
                .then(res => {
                  resolve(res);
                });
            });
          },
          filter: ["xm", "lxdh", "szxxdz"],
          keys: {
            xm: "姓名",
            lxdh: "联系电话",
            sfzhm: "身份证号码",
            szxxdz: "工作单位及地址",
            ymjzqk: "疫苗接种情况"
          },
          formatter: {}
        },
        // 商超
        getSealAreaShopList: {
          name: "商超明细",
          api(data) {
            return new Promise(resolve => {
              _this
                .$Api()
                .SealManageAreaStatisticsController.post_getSealAreaShopList.request(
                  {
                    path: {
                      areaId: _this.areaAttribute.id
                    },
                    data: data.data
                  }
                )
                .then(res => {
                  resolve(res);
                });
            });
          },
          filter: ["mc", "szxxdz", "fwfsfw"],
          keys: {
            mc: "商超名称",
            szxxdz: "详细地址",
            fwfsfw: "服务辐射范围",
            fwfsrs: "服务辐射人数",
            zrcbl: "猪肉储备量",
            syycbl: "食用油储备量",
            dmcbl: "大米储备量",
            sccbl: "蔬菜储备量",
            jdcbl: "鸡蛋储备量",
            mfcbl: "面粉储备量",
            // '奶制品储备量'
            tjsj: "统计时间"
          },
          formatter: {
            tjsj(row) {
              return moment(row).format("YYYY-MM-DD HH:mm:ss");
            }
          }
        },
        // 特殊人群
        getSealAreaSpecialList: {
          name: "特殊人群明细",
          setExtra(data) {
            extra = data;
          },
          api(data) {
            return new Promise(resolve => {
              data.data.condition.rylb = extra;
              _this
                .$Api()
                .SealManageAreaStatisticsController.post_getSealAreaSpecialList.request(
                  {
                    path: {
                      areaId: _this.areaAttribute.id
                    },
                    data: data.data
                  }
                )
                .then(res => {
                  resolve(res);
                });
            });
          },
          filter: ["key", "xb"],
          keys: {
            xm: "姓名",
            xb: "性别",
            nl: "年龄",
            sfzhm: "身份证",
            sjhm: "联系方式",
            rylb: "人员类型",
            sscj: "所属村居",
            ywzjnl: "有无自救能力"
          },
          formatter: {},
          tableFunctions: [
            {
              label: "查看服务情况",
              method: async ({ row: { _id } }) => {
                await getServiceReport(_id)
                  .then(res => {
                    _this.reportList = res.reverse();
                  })
                  .catch(e => {
                    _this.$message.error("获取数据失败");
                    console.log(e);
                  });
              }
            }
          ]
        },
        // 特殊人群服务
        getSealAreaSpecialServiceList: {
          name: "特殊人群服务明细",
          setExtra(data) {
            extra = data;
          },
          api(data) {
            return new Promise(resolve => {
              data.data.condition.rylb = extra[1];
              _this
                .$Api()
                .SealManageAreaStatisticsController.post_getSealAreaSpecialServiceList.request(
                  {
                    path: {
                      areaId: _this.areaAttribute.id
                    },
                    data: data.data,
                    params: {
                      tag: extra[0]
                    }
                  }
                )
                .then(res => {
                  resolve(res);
                });
            });
          },
          filter: ["key", "xb"],
          keys: {
            xm: "姓名",
            xb: "性别",
            nl: "年龄",
            sfzhm: "身份证",
            sjhm: "联系方式",
            rylb: "人员类型",
            sscj: "所属村居",
            ywzjnl: "有无自救能力"
          },
          formatter: {},
          tableFunctions: [
            {
              label: "查看服务情况",
              method: async ({ row: { _id } }) => {
                await getServiceReport(_id)
                  .then(res => {
                    _this.reportList = res.reverse();
                  })
                  .catch(e => {
                    _this.$message.error("获取数据失败");
                    console.log(e);
                  });
              }
            }
          ]
        }
      };
      return result;
    }
  },
  watch: {
    "areaAttribute.id": {
      immediate: true,
      handler(val) {
        this.initStatistic(val);
      }
    }
  },
  mounted() {
    // console.clear();
  },
  methods: {
    initStatistic(areaId) {
      apiList.forEach(api => {
        // console.log("api", api, areaId);
        this[api](areaId);
      });
    },
    getSealAreaById(areaId) {
      this.loadingDetail = true;
      getSealAreaById(areaId).then(sealAreaDetail => {
        this.sealAreaDetail = sealAreaDetail;
        //小于1平方公里的，显示为平方米
        if (sealAreaDetail.area > 1000000) {
          this.sealAreaDetail.area = parseFloat(
            (sealAreaDetail.area / 1000000).toFixed(2)
          );
          this.sealAreaDetail.areaUnit = "平方公里";
        } else {
          this.sealAreaDetail.area = parseInt(sealAreaDetail.area);
          this.sealAreaDetail.areaUnit = "平方米";
        }
        this.loadingDetail = false;
      });
    },
    getSealAreaPopulation(areaId) {
      this.loadingPopulation = true;
      getSealAreaPopulation(areaId).then(population => {
        this.population = [
          {
            name: "总人口",
            value: population.count
          },
          {
            name: "户籍人口",
            value: population.hjCount
          },
          {
            name: "流动人口",
            value: population.ldCount
          }
        ];
        this.loadingPopulation = false;
      });
    },
    getHealthCode(areaId) {
      this.loadingHealthCode = true;
      getHealthCode(areaId).then(healthCode => {
        this.healthCode = [
          {
            name: "红码",
            value: healthCode.homCount,
            color: "red",
            unit: "人"
          },
          {
            name: "黄码",
            value: healthCode.humCount,
            unit: "人"
          }
        ];
        this.loadingHealthCode = false;
      });
    },
    getSealAreaContact(areaId) {
      this.loadingContact = true;
      getSealAreaContact(areaId).then(contact => {
        this.contact = [
          {
            ...contact[0],
            color: "red"
          },
          contact[1]
        ];
        this.loadingContact = false;
      });
    },
    getSealAreaSpecial(areaId) {
      this.loadingSpeciaPeople = true;
      getSealAreaSpecial(areaId).then(special => {
        this.speciaPeople = special;
        this.loadingSpeciaPeople = false;
      });
    },
    getSealAreaThreeGroup(areaId) {
      if (this.areaAttribute?.type === "manage") return;
      this.loadingThreeGroupData = true;
      getSealAreaThreeGroup(areaId).then(threeGroupData => {
        // 空字段 => '---'
        threeGroupData.data.forEach(v =>
          Object.keys(v).forEach(key => {
            if (v[key] === null) v[key] = "---";
          })
        );
        this.tableListData.tableData = threeGroupData.data;

        this.filter.rowTotal = threeGroupData.total;
        this.threeGroupInfo = {
          groupNum: threeGroupData.extra,
          totalNum: threeGroupData.total
        };
        this.loadingThreeGroupData = false;

        // 说不足一页数据要隐藏掉分页
        this.$nextTick(() => {
          if (document.querySelector(".three-group-table .el-pagination"))
            document.querySelector(".three-group-table .el-pagination").hidden =
              threeGroupData.total < threeGroupData.pageSize;
        });
      });
    },
    getMaterial(areaId) {
      this.loadingMaterial = true;
      getMaterial(areaId).then(material => {
        this.material = material;
        this.loadingMaterial = false;
      });
    },
    getMaterialDistribution(areaId) {
      this.loadingMaterialDistribution = true;
      getMaterialDistribution(areaId).then(materialDistribution => {
        this.materialDistribution = materialDistribution;
        this.loadingMaterialDistribution = false;
      });
    },
    getSealAreaSpecialService(areaId) {
      this.loadingSpecialService = true;
      getSealAreaSpecialService(areaId).then(specialService => {
        this.specialService = specialService.split(",");
        this.loadingSpecialService = false;
      });
    },
    getSealAreaHsPoint(areaId) {
      this.loadingNucleicAcidSamples = true;
      getSealAreaHsPoint(areaId).then(nucleicAcidSamples => {
        this.nucleicAcidSamples = nucleicAcidSamples;
        this.loadingNucleicAcidSamples = false;
      });
    },
    handleFeedbackClick(event) {
      if (event.target.innerText === "防控区群众需求反馈")
        window.open("./index.html#/feedback/fkqqzxqfk", "_blank");
    },
    dispatchClose() {
      this.$emit("close");
    },
    handleChartClick({ name }) {
      this.dialogProp = name;
      this.dialogType = "demandDetailList";
      this.$refs.sealAreaDialog.showDialog();
    },
    checkPopulation(name) {
      const propMap = {
        总人口: "all",
        户籍人口: "household",
        流动人口: "flow"
      };
      this.dialogProp = {
        tag: propMap[name],
        areaId: this.areaAttribute.id,
        originTag: name
      };
      this.dialogType = "populationDetailList";
      this.$refs.sealAreaDialog.showDialog();
    },
    showDialog(dialogProp, dialogType) {
      this.dialogProp = dialogProp;
      this.dialogType = dialogType;
      this.$refs.sealAreaDialog.showDialog();
    },
    adoptAndPush(type) {
      const { id } = this.areaAttribute;
      pushMaterialInfo(id, type)
        .then(() => {
          this.getSealAreaById(id, true);
          this.$message.success("推送成功！");
        })
        .catch(e => {
          this.$message.error("推送失败！");
          console.log(e);
        });
    },
    getContactDetail(name) {
      const propMap = {
        密接: "密切接触者",
        次密接: "密接的密接"
      };
      this.dialogProp = {
        contactType: propMap[name],
        areaId: this.areaAttribute.id
      };
      this.dialogType = "contactDetailList";
      this.$refs.sealAreaDialog.showDialog();
    },
    getHealthCodeDetail(name) {
      this.dialogProp = {
        healthCode: name,
        areaId: this.areaAttribute.id
      };
      this.dialogType = "healthCodeDetailList";
      this.$refs.sealAreaDialog.showDialog();
    },
    checkNucleicPoint(name) {
      if (name === "可覆盖的采样规模") return;
      const nameMap = {
        大规模核酸采样点数量: {
          type: "massNucleicPoint",
          templateId: 10027
        },
        常规核酸采样点数量: {
          type: "conventionalNucleicPoint",
          templateId: 10055
        }
      };
      this.dialogType = "nucleicDetailList";
      this.dialogProp = {
        detailType: nameMap[name].type,
        dialogTitle: `${name.slice(0, -2)}`,
        areaId: this.areaAttribute.id,
        templateId: nameMap[name].templateId
      };
      this.$refs.sealAreaDialog.showDialog();
    },
    async handleCurrentChange(val) {
      this.filter.page = val;
      const threeGroupData = await getSealAreaThreeGroup(
        this.areaAttribute.id,
        this.filter
      );
      // 空字段 => '---'
      threeGroupData.data.forEach(v =>
        Object.keys(v).forEach(key => {
          if (v[key] === null) v[key] = "---";
        })
      );
      this.$set(this.tableListData, "tableData", threeGroupData.data);
      this.filter.rowTotal = threeGroupData.total;
      this.threeGroupInfo = {
        groupNum: threeGroupData.extra,
        totalNum: threeGroupData.total
      };
    },
    showData(type, extra) {
      this.fetchData = this.fetchDataList[type];
      if (extra) {
        this.fetchData.setExtra(extra);
      }
    }
  }
};
</script>

<style lang="scss" type="text/scss">
.c-sealarea-detail {
  position: fixed;
  top: 6em;
  right: 0.5em;
  z-index: 99;
  bottom: 1em;
  border-top-left-radius: 5px;
  overflow: hidden;
  padding-bottom: 100px;
  width: 700px;
  color: #fff;
  background-color: rgba(32, 40, 111, 0.9);
  &-material {
    line-height: 20px;
  }
  &-item__clickable {
    cursor: pointer;
  }
  &-header__count .folder-box-h {
    padding-bottom: 0;
  }
  .folder-box .folder-box-h {
    margin-top: 9px;
  }
  &-table {
    width: 100%;
    tr {
      margin-bottom: 16px;
    }
    td {
      min-width: 80px;
    }
  }

  .content {
    margin: 20px 0;
  }
  &-block {
    line-height: 2em;
    p {
      color: #fff;
    }
  }
  &-text__highlight {
    color: #dc1e00;
    font-weight: bold;
  }
  &-desc {
    font-size: 14px;
    font-weight: 500;
    color: #999999;
    margin-top: 24px;
  }
  &-push {
    text-align: right;
    margin-top: 20px;
  }
  &-table tr {
    vertical-align: text-top;
    display: flex;
  }
  &-panel__col-2 {
    flex: 1;
    display: flex;
    > tr,
    > div {
      flex: 1;
    }
  }
  &-header {
    padding: 1em;
    border-bottom: 1px solid #4060b2;

    .el-icon-close {
      position: absolute;
      top: 1em;
      right: 1em;
      cursor: pointer;
    }
  }
  &-bottom {
    padding: 1em 2em;
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
  }
  &-count {
    display: flex;
    &__col__1 > div,
    &__col__2 > div,
    &__col__3 > div {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
    }
    $cols: (1, 2, 3);

    @for $i from 1 through length($cols) {
      $item: nth($cols, $i);
      &__col__#{$item} {
        flex: #{$item};
        display: flex;
        flex-direction: column;
      }
    }
  }
  /*加载时遮罩层*/
  .loading-mask {
    background-color: rgba(0, 0, 0, 0);
  }
  // 覆盖样式
  .folder-box__link .folder-box-h {
    cursor: pointer;
  }
  .el-pagination {
    text-align: center;
    .el-pagination__total,
    .el-pagination__sizes {
      display: none;
    }
  }
  .pagination .jumper {
    display: none;
  }

  .table__dark .el-table__body-wrapper {
    background-color: transparent;
  }
  .el-table th,
  .el-table tr {
    background-color: transparent;
  }
  .table__dark .el-table__row td {
    background-color: transparent;
    border-right-color: transparent;
  }
  .table__dark .el-pagination .el-pager li {
    background-color: #333c93;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #335ef0;
  }

  // 数字上面的详情按钮
  .num-link {
    font-size: 14px;
    font-weight: bold;
    text-decoration: underline;
  }
}
</style>
