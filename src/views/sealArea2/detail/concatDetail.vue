<!-- 密接、次密接人员明细 -->
<template>
  <div>
    <el-dialog
      destroy-on-close
      append-to-body
      class="screen-dialog screen-wrap c-seal-area-dialog"
      :visible="true"
      width="1400px"
      :title="title"
      @close="$parent.isConcatDetailVisible = false"
    >
      <table-page
        :data="tableListData"
        :filter="filter"
        :defaultSearchMore="true"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @search="search"
        @resetSearch="resetSearch"
        customClass="table__dark three-group-table"
      >
        <template slot="searchFilter">
            <el-form :inline="true" :model="filter">
              <el-form-item label="姓名" style="margin-right: 40px">
                <el-input
                  v-model="filter.xm"
                  placeholder="请输入姓名"
                  style="width: 180px"
                ></el-input>
              </el-form-item>
              <el-form-item label="镇街" style="margin-right: 40px">
                <el-select
                  v-model="filter.sszj"
                  style="width: 180px"
                  placeholder="请选择镇街"
                >
                  <el-option
                    v-for="(item, key) in townList"
                    :key="key"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="人员状态" style="margin-right: 40px">
                <el-select
                  v-model="filter.ryzt"
                  style="width: 180px"
                  placeholder="请选择人员状态"
                >
                  <el-option
                    v-for="(item, key) in Object.values(peopleStatus)"
                    :key="key"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="关联密接"
                v-if="title.indexOf('次') > -1"
                style="margin-right: 40px"
              >
                <el-input
                  v-model="filter.relateContact"
                  placeholder="请输入关联密接"
                  style="width: 180px"
                ></el-input>
              </el-form-item>
              <el-form-item label="关联病例" style="margin-right: 40px">
                <el-input
                  v-model="filter.relateName"
                  placeholder="请输入关联病例"
                  style="width: 180px"
                ></el-input>
              </el-form-item>
            </el-form>
        </template>

        <template v-slot:column_sex="row">
          <span>
            {{ sexMap[row.value.sex] || "-" }}
          </span>
        </template>

        <template v-slot:column_ryzt="row">
          <span>
            {{ peopleStatus[row.value.ryzt].label || "-" }}
          </span>
        </template>
      </table-page>
    </el-dialog>
  </div>
</template>
  <script>
import TablePage from "zkzc-table-page";
import SETTING from "@/config/MapSetting";
import { queryConnection } from "@/api/sealarea2";
import { mapState } from "vuex";

export default {
  name: "ConcatDetial",
  components: { TablePage },
  props: {
    title: {
      type: String,
      default: "",
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      townList: [], //镇街列表
      peopleStatus: {
        1: {
          label: "待确认",
          value: 1,
        },
        // 2: {
        //   label: "已确认非本市",
        //   value: 2,
        // },
        3: {
          label: "已确认待转运",
          value: 3,
        },
        4: {
          label: "已确认管控中",
          value: 4,
        },
        // 6: {
        //   label: "无法落实",
        //   value: 6,
        // },
      },
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        xm: "",
        sszj: "",
        ryzt: "",
        relateName: "",
        relateContact: "",
      },
      tableListData: {
        selection: false,
        columnFunctionsWidth: 60, // 操作栏宽度
        tableData: [],
        tableKeys: [
          {
            id: "name",
            label: "姓名",
          },
          {
            id: "relate_contact",
            label: "关联密接",
          },
          {
            id: "related_cases",
            label: "关联病例",
          },
          {
            id: "sex",
            label: "性别",
          },
          {
            id: "identity_num",
            label: "身份证号码",
          },
          {
            id: "phone",
            label: "手机号码",
          },
          {
            id: "current_location",
            label: "当前所在地",
            minWidth: 220,
          },
          {
            id: "sszj",
            label: "所属镇街",
          },
          {
            id: "sssq",
            label: "所属社区",
          },
          {
            id: "ryzt",
            label: "人员状态",
          },
        ],
        tableFunctions: [],
      },
      sexMap: {
        0: "未知性别",
        1: "男",
        2: "女",
        9: "未说明的性别",
      },
    };
  },
  computed: {
    ...mapState("common", ["dispatchData"]),
  },
  created() {
    //初始化所属镇街
    this.townList = SETTING.getTownList();
    this.getData();
  },
  mounted() {
    // 密接人员列表不展示关联密接列
    if (this.title.indexOf("次") < 0) {
      const removeKeyIdx = this.tableListData.tableKeys.findIndex(
        (item) => item.id === "relate_contact"
      );
      if (removeKeyIdx > -1) {
        this.tableListData.tableKeys.splice(removeKeyIdx, 1);
      }
    }
  },
  methods: {
    async getData() {
      const name = this.dispatchData.map((v) => v.name);
      const { xm, sszj, ryzt, pageSize, pageNum, relateName, relateContact } =
        this.filter;
      const params = {
        pageSize,
        page: pageNum,
        condition: {
          xm,
          sszj,
          ryzt,
          name,
          type: this.type,
          relateName,
          ...(this.title.indexOf("次") > -1 && { relateContact }),
        },
      };
      const res = await queryConnection(params);
      this.$set(this.tableListData, "tableData", res.dataList);
      this.filter.rowTotal = res.count;
      this.filter.pageSize = res.pageSize;
      this.filter.pageNum = res.pageNumber;
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
      this.filter = this.$options.data().filter;
      this.getData();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 75vh;
}
</style>
  