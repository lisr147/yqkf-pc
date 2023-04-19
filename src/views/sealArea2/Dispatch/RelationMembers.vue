<template>
  <div class="relation-member-box">
    <div class="member-num">同住址（{{ page.rowTotal }}人）</div>
    <el-table
      :data="relationMemberData"
      :cell-style="{ color: '#fff' }"
      :header-cell-style="{ color: '#fff' }"
    >
      <el-table-column
        v-for="(item, index) in tableKeys"
        :key="index"
        :prop="item.id"
        :label="item.label"
        :width="item.width"
      />
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
import { getRelatedPersonnel } from "@/api/epidemiologicalSurvey";
import { mapState } from "vuex";
export default {
  name: "relationMember",
  props: ["id"],
  data() {
    return {
      tableKeys: [
        {
          id: "xm",
          label: "姓名",
        },
        {
          id: "age",
          label: "年龄",
          width: "120",
        },
        {
          id: "jzd",
          label: "居住地址",
        },
        {
          id: "lxdh",
          label: "联系电话",
        },
        {
          id: "zjhm",
          label: "身份证号码",
          width: "200",
        },
      ],
      // 页码信息
      page: {
        pageNum: 1,
        pageSize: null,
        rowTotal: null,
      },
      relationMemberData: [],
    };
  },
  mounted() {},
  components: {},
  computed: {
    ...mapState("dispatch", ["relationMembers"]),
  },
  watch: {
    relationMembers(newVal) {
      this.relationMemberData = newVal.data ? newVal.data.slice() : [];
      this.page = {
        pageNum: newVal.pageNum,
        pageSize: newVal.pageSize,
        rowTotal: newVal.rowTotal,
      };
    },
  },
  methods: {
    handleCurrentChange() {
      this.queryRelationMember();
    },
    queryRelationMember() {
      getRelatedPersonnel(this.id, {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
      }).then((res) => {
        this.relationMemberData = res.data;
      });
    },
  },
};
</script>
<style lang="scss" type="text/scss" scoped>
.relation-member-box {
  .member-num {
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

  ::v-deep .el-pagination__jump {
    color: #fff !important;
  }
}
</style>>
