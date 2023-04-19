<template>
  <div class="red-yellow-list-dialog">
    <table-page
        :data="tableListData"
        :filter="filter"
        @search="search"
        @resetSearch="resetSearch"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @tableSelectionChange="tableSelectionChange"
        v-if="tableListData.tableKeys.length"
        :customClass="'staff_table'"
        :hideKeyFilter="true"

    >
      <template slot="searchFilter">
        <div class="search-box">
          <!--<span class="tip">红黄码人员信息</span>-->
          <el-form :inline="true" :model="filter" label-width="80px" @keyup.enter.native="getData">
            <el-form-item
              :label='`${ryType}人员姓名`'>
              <el-input
                style="width: 150px;margin: 0 20px"
                v-model="filter.keyWord"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="镇街">
              <el-select v-model="filter.jz" placeholder="请选择镇街" style="width: 150px;margin: 0 20px">
                <el-option label="不限" value=""></el-option>
                <el-option v-for="(item,index) in streetList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-slot:column_hs_check_time="row">
        <span>{{row.value.hs_check_time || '无'}}</span>
      </template>
      <template v-slot:column_first_inject_time="row">
        <span>{{row.value.first_inject_time || '无'}}</span>
      </template>
      <template v-slot:column_second_inject_time="row">
        <span>{{row.value.second_inject_time || '无'}}</span>
      </template>
      <template v-slot:column_third_inject_time="row">
        <span>{{row.value.third_inject_time || '无'}}</span>
      </template>
      <template v-slot:column_hs_check_result="row">
        <span>{{row.value.hs_check_result || '无'}}</span>
      </template>
    </table-page>
  </div>
</template>

<script>
import TablePage from "zkzc-table-page";
import "@/assets/css/screenDialog.scss";
import TablePageFunc from "@/utils/tablepage";
import {getHealthCodeScreen, getYellowList} from '@/api/mapData'
import SETTING from '@/config/MapSetting'

export default {
  name: "RyList",
  components: {
    TablePage,
  },
  props: {
    cond: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  mixins: [TablePageFunc],
  watch : {
    data () {
      this.getData()
    },
  },
  data () {
    return {
      filter: {
        pageNum: 1,
        pageSize: 15,
        rowTotal: 1,
        keyword: '',
        jz: '',
        pageSizes: [15, 50, 100, 200],
      },
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: [
          {
            id: "jz",
            label: "镇街",
            minWidth: 100,
          },
          {
            id: "USERNAME",
            label: "姓名",
            minWidth: 100,
          },
          {
            id: "hs_check_time",
            label: "7天内最后一次核酸检测时间",
            width: 150,
          },
          {
            id: "hs_check_result",
            label: "最近一次核酸检测结果",
            width: 180,
          },
          {
            id: "first_inject_time",
            label: "第一针接种时间",
            width: 150,
          },
          {
            id: "second_inject_time",
            label: "第二针接种时间",
            width: 150,
          },
          {
            id: "third_inject_time",
            label: "第三针接种时间",
            width: 150,
          }
        ],
        tableFunctions: (function (vm) {

          if (vm.cond.type == 'red') {
            return {
              label: '查看详情',
              method: vm.editRow
            }
          } else {
            return []
          }

        })(this),
      },

      streetList: []
    }
  },
  computed:{
    town(){
      return this.$store.state.common.town
    },
    ryType() {
      return this.cond.type == 'red' ? '红码' : (this.cond.type == 'yellow' ? '黄码' : '')
    }
  },
  mounted() {
    //初始化镇街筛选
    this.streetList = SETTING.getTownList().map(v => {
      return {label: v, value: v}
    })
    if (this.cond.street) {
      this.filter.jz = this.cond.street
    }

    this.getData()
  },
  methods: {
    resetSearch() {
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"]
      for (let i in this.filter) {
        if (!whiteList.includes(i)) {
          this.filter[i] = "";
        }
      }
      this.filter.pageNum = 1;
      this.getData();
    },
    getData() {

      const { type, grid } = this.cond;
      const { jz } = this.filter;
      let params = {};

      switch (type) {

        case 'red':
          params.healthCode = '红码'
          break;

        case 'yellow':
          params.healthCode = '黄码'
          break;

        default:
          break;
      }

      params.street = jz || this.town || ''
      if (grid) {
          params.sswg = grid
        }
      if (this.filter.keyWord) {
            params.keyword = this.filter.keyWord
          }
      Object.assign(params, {
        pageNum: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      })
      getHealthCodeScreen(params).then(res => {
        this.tableListData.tableData = res.data
        this.filter.rowTotal = res.rowTotal
      })
    },
    editRow({row}) {

      this.$emit('showRyDetail', row)
    }
  }
}
</script>

<style scoped lang="scss">
.red-yellow-list-dialog {
  height: calc(70vh);
  overflow-y: auto;
  ::v-deep .showMore-searchFilter{
    margin-top: 20px;
    padding-right: 10px;
    min-height: 40px;
  }
}
</style>
