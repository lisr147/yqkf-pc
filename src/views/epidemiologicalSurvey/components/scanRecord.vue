<template>
  <div class="scan-record-box">
    <div class="record-num">涉及场所数量：{{ scanRecord.cssl }}</div>
    <el-table :data="scanRecordData" style="width: 100%">
      <el-table-column v-for="(item, index) in tableKeys" :key="index" :prop="item.id" :label="item.label"
        :width="item.width">
        <template slot-scope="scope">
          <div :style="{ color: getColorByJkmzt(scope) }" v-if="item.id==='jkmzt'">
            {{ scope.row.jkmzt }}
          </div>
          <template v-else>
            {{scope.row[item.id]}}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="page.pageNum" :page-size="page.pageSize"
      layout="prev, pager, next, jumper" background :total="page.rowTotal">
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
import { getCodeScanning } from "@/api/epidemiologicalSurvey";
export default {
  name: "scanRecord",
  props: ["scanRecord", "personnelId"],
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
  mounted() {
    this.getScanRecordFirst();
  },
  components: {},
  watch: {
    scanRecord() {
     this.getScanRecordFirst();
    },
  },
  methods: {
    getScanRecordFirst() {
      if(!this.scanRecord || Object.keys(this.scanRecord).length===0){
        return;
      }
      this.scanRecordData = this.scanRecord.data ? this.scanRecord.data.slice() : [];
      const {pageNum,pageSize,rowTotal}=this.scanRecord;
      this.page = {
        pageNum,
        pageSize,
        rowTotal,
      };
    },
    handleCurrentChange() {
      this.queryScanRecordData();
    },
    queryScanRecordData() {
      getCodeScanning(this.personnelId, {
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
        return "#606266";
      }
    },
  },
};
</script>
<style lang="scss" type="text/scss" scoped>
.scan-record-box {
  .record-num {
    margin: 10px 0px;
    font-weight: 600;
  }
}
</style>>
