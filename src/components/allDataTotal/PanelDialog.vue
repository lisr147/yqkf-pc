<template>
  <el-dialog
      v-dialogDrag
      width="80vw"
      :visible="visible"
      :modal="false"
      :close-on-click-modal="false"
      @close="handleClose"
      :show-close="true"
      :title="dialogTitle"
  >
    <div class="detail-wrapper">
      <mh-risk-detail :data="{street: '', onlyTable: false, index: 1}" v-if="dialogConfig.dialogType === 'mhRiskDetail'"></mh-risk-detail>

      <div v-else>
        <table-page
            :data="tableListData"
            :filter="filter"
            :hideKeyFilter="true"
            :height="400"
            @search="search"
            @sizeChange="sizeChange"
            @tableSelectionChange="tableSelectionChange"
            @currentChange="currentChange"
            @resetSearch="resetSearch"
            customClass="staff_table"
        >
          <template slot="searchFilter">
            <el-form :inline="true" :model="filter" :label-width="`${dialogConfig.labelWidth || '120px'}`">
              <el-form-item v-for="item in searchKeys" :label="item.label" :key="item.id">
                <el-select v-model="filter[item.id]" :placeholder="`请选择${item.label}`"  v-if="item.type === 'select'" clearable>
                  <el-option
                      :label="option.label || option"
                      :value="option.value || option"
                      :key="optionIndex"
                      v-for="(option, optionIndex) in item.options"
                  >
                  </el-option>
                </el-select>
                <el-input
                    v-else
                    v-model="filter[item.id]"
                    :placeholder="`请输入${item.label}`"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
          <!--        <template slot="controler">-->
          <!--          <el-button-->
          <!--              type="primary"-->
          <!--              size="small"-->
          <!--              icon="el-icon-download"-->
          <!--              @click="exportData"-->
          <!--          >导出数据</el-button-->
          <!--          >-->
          <!--        </template>-->

        </table-page>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import TablePage from "zkzc-table-page";
import TablePageFunc from "@/utils/tablepage"
import {pageRange} from "@/config/setting";
import { getDetailList, exportDetailData } from '@/api/volunteer'
import mhRiskDetail from "@/components/screen/mhRiskDetail";
export default {
  name: "VolunteerDetailDialog",
  components: {
    TablePage,
    mhRiskDetail
  },
  mixins: [TablePageFunc],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {
          dialogConfig: {
            dialogType: '', //弹窗类型 默认没有 mhRiskDetail 中高风险来粤返粤人员当天专项清零数量
            requestName: '', //请求函数名方法
            fixedRequestData: {}, // 固定请求参数
            tableKeys: [
              {
                id: "xm",
                label: "姓名",
                isFilter: true, //是否作为筛选条件
                type: 'input', // 筛选类型 input 输入框 select 选择框  后面可能有时间范围等等 跟ele-form配置同步
              }
            ] //table配置
          }
        }
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.dialogConfig.title || (this.data.name + '明细')
    },
  },
  watch: {
    visible: {
      handler: function (val) {
        if (val) {
          this.init()
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: [],
      },
      filter: {
        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
      },
      dialogConfig: {},
      searchKeys: [],
    }
  },
  model:{
    prop: 'visible',
    event: 'toggle'
  },
  methods: {
    init () {

      let { filter, tableListData } = this.$options.data()
      let { dialogConfig } = this.data
      this.dialogConfig = {...dialogConfig}
      this.tableListData = tableListData
      if (dialogConfig.dialogType) {
        return
      }

      this.tableListData.tableKeys = [...dialogConfig.tableKeys]
      this.searchKeys = dialogConfig.tableKeys.filter(v => v.isFilter)
      let _filter = this.searchKeys.reduce((pre, cur) => {
        pre[cur.id] = ''
        return pre
      }, {})
      this.filter = { ..._filter, ...filter }
      this.getData()
    },
    async getData() {
      const {pageNum, pageSize} = this.filter
      let filterData = {pageNum, page: pageNum, pageSize, condition: {...this.filter} }
      // for (let i in filterData.condition) {
      //   if (filterData.condition[i] === '' ) {
      //     delete filterData.condition[i]
      //   }
      // }
      if (this.dialogConfig.requestData) {
        filterData = {...filterData, ...this.dialogConfig.requestData}
      }
      // 固定传参 不变的
      if (this.dialogConfig.fixedRequestData && this.dialogConfig.fixedRequestData.condition) {
        filterData.condition = {...filterData.condition, ...this.dialogConfig.fixedRequestData.condition}
      }
      this.dialogConfig.requestName(filterData).then(res => {
        let formatterKeys = this.tableListData.tableKeys.filter(v => v.formatter)
        this.tableListData.tableData = (res.data || []).map(v=> {
          let formatterObj = {}
          if (formatterKeys && formatterKeys.length) {
            formatterKeys.forEach((item) => {

              formatterObj[item.id] = item.formatter(v)
            })
          }

          return {
            ...v,
            ...formatterObj
          }
        })
        this.filter.rowTotal = res.total
      }).catch(() => {

      })
    },
    handleClose(){
      this.$emit('toggle', false)
    },
    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    //导出表单数据
    async exportData () {
      let data = {}
      if (this.multiData.length === 0) {
        data = {...this.filter,  isDy: this.data.isDy}
      }else {
        data.ids = this.multiData.map(item => item._id)
      }
      await exportDetailData(data)
      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true,
      });

    }
  }
}
</script>

<style lang="scss" scoped>
.detail-wrapper {
  margin: 0px;
  width: 100%;
  max-height: calc(100vh - 200px);
  overflow: auto;
  overflow-x: hidden;
  display: block;
}
</style>
