<template>
  <div class="relation-member-box">
    <div class="member-num">同住址（{{ page.rowTotal }}人）</div>
    <el-table :data="relationMemberData" style="width: 100%">
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
export default {
  name: "relationMember",
  props: ["relationMember", "personnelId"],
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
          label: "证件号码",
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
  watch: {
    relationMember(newVal) {
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
      getRelatedPersonnel(this.personnelId, {
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
    margin: 10px 0px;
    font-weight: 600;
  }
}
</style>>
