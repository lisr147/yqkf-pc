<template>
  <div>
    <el-dialog
      :visible="true"
      top="10vh"
      :title="`查看${type === 'more' ? '更多' : '详情'}`"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="80vw"
    >
      <el-popover
        slot="title"
        placement="bottom-start"
        width="600"
        trigger="hover">
        <div>
          <template v-if="countType==='疫苗接种'">
            <p>疫苗接种：</p>
            <p>系统根据广东省疫苗流通与接种管理信息系统下发的疫苗接种数据（只含在南沙区接种的疫苗）通过人员身份证号码进行匹配。</p>
            <p>第一针可接种人数：指没有疫苗接种记录的人员数。</p>
            <p>第二针可接种人数：指已经接种第一针且已到第二针接种时间的人员数。</p>
            <p>第三针可接种人数：指已经接种第二针，按疫苗类型是需要接种第三针且已到第三针接种时间的人员数。</p>
            <p>若系统匹配到人员已接种第三针次，则默认第二针和第一针已接种；若匹配到已接种第二针次，则默认第一针已接种。</p>
          </template>
        </div>
        <span slot="reference">
        {{ type==='detail'? data.currentLabel: '数据统计'}}({{ countType }})
          <b class="el-icon-warning-outline"></b>
        </span>
      </el-popover>
      <table-page
        :data="tableListData"
        :filter="filter"
        hideSearch="true"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        :id="`key_industry_${tableId}`"
      >
        <template slot="controler">
          <el-button
            icon="el-icon-download"
            type="primary"
            plain
            @click="exportFile"
          >导出
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
    <!-- 下钻弹窗 -->
    <PopulaStat
      v-if="PopulaCountDataVisible"
      :data="PopulaCountData"
      type="detail"
      :tableId="tableId"
      countType="疫苗接种"
      @close="PopulaCountDataVisible=false"
    />
  </div>
</template>
<script>
import TablePage from "@/components/TablePage/TablePage.vue";
import {
  getYmStatistic,
  getYmDetailPage,
  exportYmStatistic,
  exportYmDetailStatistic,
} from "@/api/PopulaStat";

// 查询字段过滤
const whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];


export default {
  name: "PopulaStatDialog",
  components: {
    TablePage,
    PopulaStat: () => import("@/components/Population/PopulaStat")
  },
  props: {
    countType: { type: String },
    data: {
      type: Object,
      default: () => {
      },
    },
    // 弹窗类型，more 查看更多，detail 查看详情
    type: {
      type: String,
      default: "more",
    },
    tableId: {
      type: [Number, String],
    },
  },
  computed: {
    // 重点行业统计 获取需要更改值为"合计"的key
    sumKey() {
      return this.tableListData.tableData[0]?.sumKey || "";
    },
  },
  data() {
    return {
      dataObj: this.data,
      PopulaCountDataVisible: false, // 人口统计（常住、户籍）
      PopulaCountData: {}, // 列表行信息
      linkSlotPrefix: "column_", // 下钻插槽key前缀
      linkKeys: {
        // table需要下钻的key
        hjrk: [
          "gzrysl",
          "dyzkjzrs",
          "dyzjzrs",
          "dezkjzrs",
          "dezjzrs",
          "dszkjzrs",
          "dszjzrs"],
        ldrk: [
          "gzrysl",
          "dyzkjzrs",
          "dyzjzrs",
          "dezkjzrs",
          "dezjzrs",
          "dszkjzrs",
          "dszjzrs"
        ],
      },
      dataKeys: [], // 所有key
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
        hjrk: {
          detail: 12249,
          more: 12248,
        },
        ldrk: {
          detail: 12249,
          more: 12248,
        },
      },
      rylx: null,
    };
  },
  async created() {
    await this.getTableKeys();
    this.initDataObj();
    this.getData();
  },
  mounted() {
  },
  methods: {
    // 初始化当点击的详情是合并时，对data的处理
    initDataObj() {
      // 如果点击的是合并行，需要清空相应的字段
      if (this.dataObj.isSum) {
        this.dataObj.sszj = this.dataObj.sszj === "合计" ? "" : this.dataObj.sszj;
        this.dataObj.qymc = this.dataObj.qymc === "合计" ? "" : this.dataObj.qymc
      }
      if (this.tableId === 'hjrk') {
        this.rylx = '户籍'
      } else {
        this.rylx = '流动'
      }
    },
    // 获取统计列表数据
    async getData() {
      let fetchFn;
      let condition = {
        tjlx: 'azjtj',
        rylx: this.rylx
      };
      switch (this.tableId) {
        case 'hjrk':
        case 'ldrk':
          if (this.type === "more") {
            fetchFn = getYmStatistic;
          } else {
            condition = {
              ...this.data,
              ...condition,
            };
            fetchFn = getYmDetailPage;
          }
          break;
      }
      if (!fetchFn) {
        return;
      }
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      const params = {
        condition: condition,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      };
      const res = await fetchFn(params);
      this.tableListData.tableData = res.data;
      this.$set(this.tableListData, "tableData", res.data);
      this.filter.pageNum = res.page;
      this.filter.pageSize = res.pageSize !== 0 ? res.pageSize : 10;
      this.filter.rowTotal = res.total;
    },
    // 获取列表表头字段
    async getTableKeys() {
      const tableId = this.tableIdMap[this.tableId][this.type]
      const res = await this.$Api().ImportDataController.get_config.request({
        path: { id: tableId },
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
          this.tableListData.tableKeys.push(key);
        }
      });
    },
    // 导出统计数据
    async exportFile() {
      let exportFn;
      let condition = {
        tjlx: 'azjtj',
        rylx: this.rylx
      };
      let params = {};
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      switch (this.tableId) {
        case 'hjrk':
        case 'ldrk': {
          if (this.type === "more") {
            params = {
              condition,
            };
            exportFn = exportYmStatistic;
          } else {
            params = {
              condition:{
                ...this.data,
                ...condition
              }
            };
            let pageSize =  50000
            if (this.filter.rowTotal) {
              let num = Math.ceil(this.filter.rowTotal / pageSize)
              for (let i = 1; i <= num; i++) {
                params.page = i
                params.pageSize = pageSize
                await exportYmDetailStatistic(params);
              }
            }
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
      this.PopulaCountDataVisible = true;

      // 判断是否是合计列
      let obj = {}
      if (row.value.isSum) {
        obj = {
          sszj: this.data.sszj,
          ztlx: this.data.ztlx,
          rylx: this.data.rylx,
          rylb: this.data.rylb
        }
      }
      let currentLabel = this.tableListData.tableKeys.find(v => v.id === key).label
      this.PopulaCountData = {
        ...row.value,
        ...obj,
        property: key,
        currentLabel:currentLabel
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
