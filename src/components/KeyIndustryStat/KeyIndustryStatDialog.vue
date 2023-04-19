<!-- 密接、次密接人员明细 -->
<template>
  <div>
    <el-dialog
      :visible="true"
      top="10vh"
      :title="`查看${type === 'more' ? '更多' : '详情'}`"
      :close-on-click-modal="false"
      @close="$parent.isKeyIndustryDialogOpen = false"
      width="80vw"
    >
      <table-page
        :data="tableListData"
        :filter="filter"
        :defaultSearchMore="true"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @search="search"
        @resetSearch="resetSearch"
        customClass="three-group-table"
        :id="`key_industry_${tableId}`"
      >
        <template slot="searchFilter">
          <el-form :inline="true" :model="filter" label-width="180px">
            <template v-for="item in dataKeys">
              <el-form-item
                :label="item.fieldName"
                :key="`filter_${item.storeFiled}`"
                :title="item.fieldName"
                v-if="item.searchable"
              >
                <template v-if="item.fieldType === 'date'">
                  <el-date-picker
                    v-model="filter[item.storeFiled]"
                    type="daterange"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :disabled="item.disabled"
                  />
                </template>
                <template v-else-if="item.fieldType === 'datetime'">
                  <el-date-picker
                    v-model="filter[item.storeFiled]"
                    type="datetimerange"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="item.disabled"
                  />
                </template>
                <el-select
                  v-else-if="['sszj', 'streetName'].includes(item.storeFiled)"
                  v-model="filter[item.storeFiled]"
                  :disabled="item.disabled"
                  :placeholder="`请选择${item.fieldName}`"
                >
                  <el-option
                    v-for="option in sszjList"
                    :key="item.storeFiled + option"
                    :value="option"
                  />
                </el-select>
                <el-select
                  v-else-if="specialOptions[tableId][item.storeFiled]"
                  v-model="filter[item.storeFiled]"
                  :disabled="item.disabled"
                  :placeholder="`请选择${item.fieldName}`"
                >
                  <el-option
                    v-for="option in specialOptions[tableId][item.storeFiled]"
                    :key="item.storeFiled + option"
                    :value="option"
                  />
                </el-select>
                <el-input
                  v-else
                  v-model="filter[item.storeFiled]"
                  :placeholder="`请输入${item.fieldName}`"
                  :disabled="item.disabled"
                />
              </el-form-item>
            </template>
          </el-form>
        </template>
        <template slot="controler">
          <el-button
            icon="el-icon-download"
            type="primary"
            @click="exportFile"
            v-if="zdhytjTemplateIds.includes(tableId)"
            >导出统计数据
          </el-button>
        </template>
        <template
          v-slot:[linkSlotPrefix+key]="row"
          v-for="key in linkKeys[tableId]"
        >
          <el-link
            class="link"
            @click="showKeyIndustryStatDetail(key, row)"
            :key="key"
          >
            {{ row.value[key] }}
          </el-link>
        </template>
        <template v-slot:[linkSlotPrefix+sumKey]="row" v-if="sumKey">
          <span v-if="row.value.isSum">合计</span>
          <span v-else>{{ row.value[sumKey] }}</span>
        </template>
      </table-page>
    </el-dialog>
    <!-- 重点行业统计-查看更多弹窗 -->
    <key-industry-stat-dialog
      v-if="isKeyIndustryDialogOpen"
      :data="keyIndustryStatData"
      type="detail"
      :tableId="tableId"
      :industryTypes="specialOptions[tableId].ztlx"
    />
  </div>
</template>
<script>
import TablePage from "zkzc-table-page";
import {
  getYmsStatistic,
  getYmDetailPage,
  getHsStatistic,
  getHsDetailPage,
  getHsHgRyDetail,
  getYjRyDetail,
  exportYmStatistic,
  exportYmDetailStatistic,
  exportHsStatistic,
  exportHsDetailStatistic,
  exportHsHgStatistic,
  exportHsHgDetailStatistic,
  exportHsYjStatistic,
  exportHsYjDetailStatistic,
  getHsHgStatistic,
  getHsyjStatistic,
} from "@/api/keyIndustryStat";
import moment from "moment";
import { getUseZjDetail } from "@/api/autoCount";

// 查询字段过滤
const whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];

// 统计类型对应的筛选条件默认key
const filterKeyWithType = {
  azjtj: "sszj",
  azdhytj: "ztlx",
  aqyzttj: "qymc",
  azrdwtj: "zrdw",
};

export default {
  name: "KeyIndustryStatDialog",
  components: { TablePage },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    // 弹窗类型，more 查看更多，detail 查看详情
    type: {
      type: String,
      default: "more",
    },
    tableId: {
      type: [Number, String],
    },
    industryTypes: {
      type: Array,
    },
    timePick: {
      type: Array,
    },
  },
  data() {
    return {
      dataObj: this.data,
      isKeyIndustryDialogOpen: false, //重点行业统计 查看更多/详情窗口
      keyIndustryStatData: {}, // 重点行业统计 列表行信息
      linkSlotPrefix: "column_", // 下钻插槽key前缀
      linkKeys: {
        // table需要下钻的key
        12130: ["gzrysl", "whsjcrs", "hsjcrs", "yxrs", "wcjgrs"],
        12131: [
          "gzrysl",
          "hscyrs",
          "cjgrs",
          "wagzhsjcrs",
          "yxrs",
          "whsjcgzryrs",
        ],
        12228: [
          "gzrysl",
          "dyzkjzrs",
          "dyzjzrs",
          "dezkjzrs",
          "dezjzrs",
          "dszkjzrs",
          "dszjzrs",
        ],
        12132: ["gzrysl", "yjrs", "whsjcgzryrs"],
      },
      zdhytjTemplateIds: [12228, 12130, 12131, 12132], //重点行业统计模板ID集
      dataKeys: [], // 所有key
      sszjList: [
        "南沙街",
        "珠江街",
        "龙穴街",
        "大岗镇",
        "榄核镇",
        "黄阁镇",
        "东涌镇",
        "横沥镇",
        "万顷沙镇",
      ], //3街6镇列表
      specialOptions: {
        12228: {
          ztlx: [],
          zgzt: ["全部", "在岗", "放假"],
        },
        12130: {
          ztlx: [],
          zgzt: ["全部", "在岗", "放假"],
        },
        12131: {
          ztlx: [],
          zgzt: ["全部", "在岗", "放假"],
        },
        12132: {
          ztlx: [],
          zgzt: ["全部", "在岗", "放假"],
        },
        12235: {
          // 可视化分析-镇街下钻
          useState: ["使用过", "未使用"],
        },
      }, // 下拉框选项
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
      },
      tableListData: {
        selection: false,
        columnFunctionsWidth: 60, // 操作栏宽度
        tableData: [],
        tableKeys: [],
        tableFunctions: [],
      },
      tableIdMap: {
        // 模板id映射
        12228: {
          // 疫苗接种统计
          detail: 12229,
          more: 12230,
        },
        12130: {
          // 核酸检测统计
          detail: 12133,
          more: 12134,
        },
        12131: {
          // 核酸合规统计
          detail: 12232,
          more: 12231,
        },
        12132: {
          // 核酸预警统计
          detail: 12234,
          more: 12233,
        },
        12235: {
          // 使用情况分析-镇街使用情况
          detail: 12235,
        },
      },
    };
  },
  computed: {
    // 重点行业统计 获取需要更改值为"合计"的key
    sumKey() {
      return this.tableListData.tableData[0]?.sumKey || "";
    },
  },
  async created() {
    await this.getTableKeys();
    this.initSpecialOption();
    this.initDataObj();
    this.getData();
  },
  mounted() {},
  methods: {
    // 初始化当点击的详情是合并时，对data的处理
    initDataObj() {
      // 如果点击的是合并行，需要清空相应的字段
      if (this.dataObj.isSum) {
        this.dataObj.sszj =
          this.dataObj.sszj === "合计" ? "" : this.dataObj.sszj;
        this.dataObj.qymc =
          this.dataObj.qymc === "合计" ? "" : this.dataObj.qymc;
      }
    },
    // 初始化下拉框选项
    initSpecialOption() {
      this.specialOptions[this.tableId].ztlx = this.industryTypes;
    },
    // 获取统计列表数据
    async getData() {
      let fetchFn;
      let condition = {};
      let params = {
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      };
      switch (this.tableId) {
        case 12228:
        case 12131:
        case 12130:
        case 12132: {
          if (this.type === "more") {
            // 按照统计类型,添加对应参数
            const { tjlx } = this.data;
            const additionalKey = filterKeyWithType[tjlx];
            condition[additionalKey] = this.data[additionalKey];

            condition.tjlx = "aqyzttj";
            if (this.tableId === 12228) {
              fetchFn = getYmsStatistic;
            } else if (this.tableId === 12130) {
              condition.sjxz = this.data.sjxz;
              fetchFn = getHsStatistic;
            } else if (this.tableId === 12131) {
              condition = {
                ...this.data,
                tjlx: "aqyzttj",
              };
              fetchFn = getHsHgStatistic;
            } else if (this.tableId === 12132) {
              condition = {
                ...this.data,
                tjlx: "aqyzttj",
              };
              fetchFn = getHsyjStatistic;
            }
          } else {
            condition = {
              ...this.data,
              ...condition,
            };
            if (this.tableId === 12228) {
              fetchFn = getYmDetailPage;
            } else if (this.tableId === 12130) {
              fetchFn = getHsDetailPage;
            } else if (this.tableId === 12131) {
              fetchFn = getHsHgRyDetail;
            } else if (this.tableId === 12132) {
              fetchFn = getYjRyDetail;
            }
          }
          break;
        }
        case 12235:
          condition = {
            start: this.timePick[0],
            end: this.timePick[1],
            zj: this.data.name,
          };
          fetchFn = getUseZjDetail;
          break;
      }
      params.condition = condition;
      if (!fetchFn) {
        return;
      }
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      const res = await fetchFn(params);
      this.tableListData.tableData = res.data;
      this.$set(this.tableListData, "tableData", res.data);
      this.filter.pageNum = res.page;
      this.filter.pageSize = res.pageSize !== 0 ? res.pageSize : 10;
      this.filter.rowTotal = res.total;
    },
    // 获取列表表头字段
    async getTableKeys() {
      const tableId = this.tableIdMap[this.tableId][this.type];
      const res = await this.$Api().ImportDataController.get_config.request({
        path: { id: tableId }, // 移动运营商特殊处理
      });
      const { columns } = res;
      this.dataKeys = columns;
      columns.forEach((v) => {
        if (v.show) {
          let key = {
            id: v.storeFiled,
            label: v.fieldName,
            minWidth: ((v.fieldName || "").length || 2) * 15 + 40,
            searchable: v.searchable,
            formatter: (item) => {
              let data;
              if (v.storeFiled in item) {
                data = item[v.storeFiled];
              }
              return data;
            },
          };
          if (tableId === 12231) {
            if (["hscyrs", "cjgrs", "cyrszb", "yxrs"].includes(v.storeFiled)) {
              if (!key.label.includes("."))
                key.label = `${moment().subtract(1, "day").format("MM.DD")}${
                  key.label
                }`; //取当前日期前一天
            }
          }
          this.tableListData.tableKeys.push(key);
        }

        if (v.searchable) {
          let initialVal = this.data[v.storeFiled] || "";
          if (this.zdhytjTemplateIds.includes(this.tableId)) {
            if (this.type === "more") {
              // 更多弹窗中,根据统计类型,初始化对应筛选条件默认值
              const { tjlx } = this.data;
              if (filterKeyWithType[tjlx] === v.storeFiled) {
                initialVal = this.data[filterKeyWithType[tjlx]] || "";
              }
              if (tjlx === "azjtj" && v.storeFiled === "sszj") {
                // 查看更多,按镇街统计,所属镇街不可编辑
                v.disabled = true;
              } else {
                v.disabled = false;
              }
            }
          }
          this.$set(this.filter, v.storeFiled, initialVal);
        }
      });
    },
    // 导出统计数据
    async exportFile() {
      let exportFn;
      let condition = {};
      let params = {};
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      switch (this.tableId) {
        case 12228: {
          if (this.type === "more") {
            condition = { ...condition, tjlx: "aqyzttj" };
            params = {
              condition,
              page: this.filter.pageNum,
              pageSize: this.filter.pageSize,
            };
            exportFn = exportYmStatistic;
          } else {
            const pageSize = 50000;
            condition = { ...this.data, ...condition };
            params = { condition };
            const requestTimes = Math.ceil(this.filter.rowTotal / pageSize);
            for (let i = 1; i <= requestTimes; i++) {
              params.page = i;
              params.pageSize = pageSize;
              await exportYmDetailStatistic(params);
            }
          }
          break;
        }
        case 12130: {
          if (this.type === "more") {
            const { sjxz, tjlx } = this.data;
            params = {
              ...condition,
              tjlx: "aqyzttj",
              more: tjlx,
              sjxz,
            };

            exportFn = exportHsStatistic;
          } else {
            params = { ...this.data, ...condition };
            exportFn = exportHsDetailStatistic;
          }
          break;
        }
        case 12131: {
          if (this.type === "more") {
            condition.tjlx = "aqyzttj";
            params = {
              condition,
            };
            exportFn = exportHsHgStatistic;
          } else {
            condition = {
              ...this.data,
              bm: true,
            };
            params = {
              condition,
              page: 1,
              pageSize: 100000,
            };
            exportFn = exportHsHgDetailStatistic;
          }
          break;
        }
        case 12132: {
          if (this.type === "more") {
            condition.tjlx = "aqyzttj";
            params = {
              condition,
              page: 1,
              pageSize: 100000,
            };
            exportFn = exportHsYjStatistic;
          } else {
            condition = {
              ...this.data,
              bm: true,
            };
            params = {
              condition,
              page: 1,
              pageSize: 100000,
            };
            exportFn = exportHsYjDetailStatistic;
          }
          break;
        }
      }
      if (!exportFn) {
        return;
      }
      await exportFn(params);
      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true,
      });
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
    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    resetSearch() {
      for (let i in this.filter) {
        if (!whiteList.includes(i)) {
          this.filter[i] = "";
        } else {
          this.filter[i] = this.$options.data().filter[i];
        }
      }
      this.getData();
    },
    // 下钻详情
    showKeyIndustryStatDetail(key, row) {
      if (row.value[key] === 0) {
        return;
      }
      this.isKeyIndustryDialogOpen = true;
      // 判断是否是合计列
      let obj = {};
      if (row.value.isSum) {
        // 统计类型为aqyzttj
        obj = {
          sszj: this.data.sszj,
          ztlx: this.data.ztlx,
          qymc: this.data.qymc,
          zrdw: this.data.zrdw,
          rylb: this.data.rylb,
        };
      }
      // 获取在岗状态
      row.value.zgzt = this.data.zgzt;
      this.keyIndustryStatData = {
        ...row.value,
        ...obj,
        property: key,
        tjlx: "aqyzttj",
        ...(this.tableId === 12130 && { sjxz: this.data.sjxz }),
      };
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 85vh;
  overflow-y: auto;
}

.link {
  color: #409eff;
  font-size: 12px;
}
</style>
