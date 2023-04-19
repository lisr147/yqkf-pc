<template>
  <div class="scan-record-box">
    <div class="record-num">涉及场所数量：{{ recordInfo.cssl }}</div>
    <el-table
      :data="scanRecordData"
      :cell-style="{ color: '#fff' }"
      :header-cell-style="{ color: '#fff' }"
    >
      >
      <el-table-column
        v-for="(item, index) in tableKeys"
        :key="index"
        :prop="item.id"
        :label="item.label"
        :width="item.width"
      >
        <template scope="scope" v-if="item.id === 'jkmzt'">
          <div :style="{ color: getColorByJkmzt(scope) }">
            {{ scope.row.jkmzt }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="page.pageNum"
      :page-size="page.pageSize"
      layout="prev, pager, next, jumper"
      background
      :total="page.rowTotal"
    >
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
import { getCodeScanning } from "@/api/epidemiologicalSurvey";
import { mapState } from "vuex";
export default {
  name: "scanRecord",
  props: ["id"],
  data() {
    return {
      tableKeys: [
        {
          id: "csmc",
          label: "场所名称",
        },
        {
          id: "smsj",
          label: "扫码时间",
        },
        {
          id: "xxdz",
          label: "详细地址",
        },
        {
          id: "jkmzt",
          label: "穗康码状态",
        },
        // {
        //   id:'xm',
        //   label:'姓名'
        // },
        // {
        //   id:'age',
        //   label:'年龄'
        // },
        // {
        //   id:'jzd',
        //   label:'居住住址'
        // },
        // {
        //   id:'lxdh',
        //   label:'联系电话'
        // },
        // {
        //   id:'zjhm',
        //   label:'身份证号码',
        // }
      ],
      // 页码信息
      page: {
        pageNum: 1,
        pageSize: null,
        rowTotal: null,
      },
      scanRecordData: [],
    };
  },
  mounted() {},
  components: {},
  computed: {
    ...mapState("dispatch", ["recordInfo"]),
  },
  watch: {
    recordInfo(newVal) {
      this.scanRecordData = newVal.data ? newVal.data.slice() : [];
      this.page = {
        pageNum: newVal.pageNum,
        pageSize: newVal.pageSize,
        rowTotal: newVal.rowTotal,
      };
    },
  },
  methods: {
    handleCurrentChange() {
      this.queryScanRecordData();
    },
    queryScanRecordData() {
      getCodeScanning(this.id, {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
      }).then((res) => {
        this.scanRecordData = res.data;
      });
    },
    getColorByJkmzt(scope) {
      const jkmzt = scope.row.jkmzt || "";
      if (jkmzt === "黄码") {
        return "#e6a23c";
      } else if (jkmzt === "红码") {
        return "#f56c6c";
      } else {
        return "#fff";
      }
    },
  },
};
</script>
<style lang="scss" type="text/scss" scoped>
.scan-record-box {
  .record-num {
    color: #fff;
    margin: 10px 0px;
    font-weight: 600;
  }
  /*最外层透明*/
  ::v-deep .el-table,
  ::v-deep .el-table__expanded-cell {
    background-color: transparent !important;
  }
  /* 表格内背景颜色 */
  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent !important;
  }

  ::v-deep .el-pagination__jump{
    color: #fff !important;
  }
}
</style>>
