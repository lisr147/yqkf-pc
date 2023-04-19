<template>
  <el-dialog
    title="人员分组名单"
    :visible="true"
    :append-to-body="true"
    width="800px"
    top="4vh"
    @close="$emit('close')"
  >
    <div class="group-list area-main">
      <table-page
        :data="vdata"
        :filter="filter"
        @search="search"
        @resetSearch="resetSearch"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      >
        <!--搜索栏-->
        <template slot="searchFilter">
          <el-form :inline="true" :model="filter" label-width="80px" class="area-main-filter"  @keyup.enter.native="search">
            <el-form-item label="手机号码">
              <el-input
                type="text"
                v-model="filter.mobile"
                placeholder="请输入手机号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input
                type="text"
                v-model="filter.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
      </table-page>

      <el-dialog
        title="编辑人员信息"
        :visible="true"
        v-if="!!editItem"
        :append-to-body="true"
        width="400px"
        @close="editItem = null"
      >
        <el-form label-width="80px" ref="baseForm" :model="editItem">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editItem.name" type="text"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号码"
            prop="mobile"
            :rules="{
              required: true,
              validator: this.checkMobile,
              trigger: 'blur',
            }"
          >
            <el-input v-model="editItem.mobile" type="text"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="text" v-model="editItem.remark" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="editItem = null">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
import { getSubmitUser,putSubmitUser,delSubmitUser } from "@/api/submitUser.js";
import TablePageFunc from "@/utils/tablepage.js";

export default {
  name: "GroupList",
  components: {
    TablePage,
  },
  mixins: [TablePageFunc],
  props: {
    groupId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      // isLoading: false,
      editItem: null,
      filter: {
        groupId: null,
        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
      },
      vdata: {
        tableData: [],
        tableKeys: [
          {
            id: "index",
            width: "60",
            label: "序号",
          },
          {
            id: "mobile",
            label: "手机号码",
          },
          {
            id: "name",
            label: "姓名",
          },
          {
            id: "remark",
            label: "备注",
          },
        ],
        tableFunctions: [
          // 操作栏
          {
            label: "编辑",
            method: this.edit,
          },
          {
            label: "删除",
            method: this.removeItem,
          },
        ],
      },
    };
  },
  watch: {
    groupId(val) {
      if (val) {
        this.resetFilter();
        this.getData();
      }
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      // this.isLoading = true;
      let params = JSON.parse(JSON.stringify(this.filter));
      delete params.rowTotal;
      delete params.pageSizes;
      params.groupId = this.groupId;
      let res = await getSubmitUser(params);
      res.content.forEach((v, i) => {
        v.index = i + 1 + res.pageable.pageNumber * res.pageable.pageSize;
      });
      this.vdata.tableData = res.content;
      this.filter.pageNum = res.pageable.pageNumber + 1;
      this.filter.pageSize = res.pageable.pageSize;
      this.filter.rowTotal = res.totalElements;
      // this.isLoading = false;
    },
    edit({ row }) {
      this.$set(this,'editItem',JSON.parse(JSON.stringify(row)))
      // this.editItem = JSON.parse(JSON.stringify(row));
    },
    async removeItem({ row }) {
      await this.$confirm(
        "该操作将会删除该人员信息，确认要继续吗？",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      await delSubmitUser(this.groupId,row.id);
      this.$message({
        type: "success",
        message: "删除成功",
      });
      this.getData();
      this.$emit('update')
    },
    async handleSave() {
      await this.$refs.baseForm.validate();
      await putSubmitUser(this.editItem)
      this.$message({
        type: "success",
        message: "编辑成功",
      });
      this.getData()
      this.editItem = null
      this.$emit('update')//分组更新，刷新人员数量
    },
    checkMobile(rule, value, callback) {
      value = parseInt(value)
      value = value+''
      if (value.length!==11) {
        callback(new Error("请输入正确的手机号"));
      }
      callback();
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
::v-deep {
  .showMore-searchFilter .searchInput .el-form--inline .el-form-item{
    width: 260px;
  }
  .showMore-searchFilter .searchInput .el-form--inline .el-form-item .el-form-item__content{
    width: auto; 
  }
  .showMore-searchFilter .searchInput .el-form--inline .el-form-item .el-form-item__content .el-input{
    width: 180px;
  }
}
</style>
