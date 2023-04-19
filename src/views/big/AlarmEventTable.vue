<template>
  <div class="alarm-event-table">

    <table-page
      :data="tableListData"
      :filter="filter"
      :hideKeyFilter="true"
      :height="400"
      @search="search"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @resetSearch="resetSearch"
      customClass="staff_table"
    >
      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" label-width="100px">
          <template v-for="item in dataKeys">
            <el-form-item
              :label="item.fieldName"
              :key="`filter_${item.storeFiled}`"
              :title="item.fieldName"
            >
              <template v-if="item.fieldType === 'date'">
                <el-date-picker
                  v-model="filter[item.storeFiled]"
                  type="daterange"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </template>
              <template v-else-if="item.fieldType === 'datetime'">
                <el-date-picker
                  v-model="filter[item.storeFiled]"
                  type="datetimerange"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </template>
              <template v-else-if="item.fieldType === 'select'">
                <el-select v-model="filter[item.storeFiled]">
                  <el-option label="不限" :value="null"></el-option>
                  <el-option v-for="(sitem,index) in item.list" :key="index" :label="sitem.label" :value="sitem.value" ></el-option>
                </el-select>
              </template>
              <el-input v-else v-model="filter[item.storeFiled]" />
            </el-form-item>
          </template>
        </el-form>
      </template>

    </table-page>

  </div>
</template>

<script>
  import TablePage from "zkzc-table-page";
  import TablePageFunc from "@/utils/tablepage"
  import SETTING from '@/config/MapSetting'
  import {getHighRiskDictionary} from '@/api/alarm'
  import { formatDate} from '@/utils/common'

  export default {
    name: "AlarmEventTable",
    components: {
      TablePage,
    },
    mixins: [TablePageFunc],
    props: {
      setting: {
        type: Object,
        default() {
          return {}
        }
      },
      visible: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        filter:{
          sszj: '',
          pageNum: 1,
          pageSize: 15,
          rowTotal: 1,
          pageSizes: [15, 50, 100, 200],
        },

        tableListData: {
          selection: false,
          tableData: [],
          tableKeys: [],
        },
        dataKeys: null, // 所有的KEY

        imgList: [],

      }
    },
    computed: {
      town() {
        return this.$store.state.common.alarmTown
      }
    },
    created() {

    },
    async mounted(){
      await this.getTableSetting()
      await this.getData()
    },
    methods: {

      //根据id获取表格相关配置
      async getTableSetting(){

        const tableId = this.setting.id
        //初始化表头
        await this.getTableKeys([], tableId, false)

        //如果所属镇街有默认值，其他筛选条件也尝试设置默认值
        if (this.town) {
          this.initFilterDefaultValue()
        }

        this.tableListData.tableKeys = this.tableListData.tableKeys.filter(v => {
          return !['longitude', 'latitude', 'creator', 'creatorName', 'createTime', 'updateTime',].includes(v.id)
        })

      },

      initFilterDefaultValue(){

        console.log(this.filter)

        var date = formatDate(date)

        //默认告警时间为当天
        if (this.filter.hasOwnProperty('alarmDate')) {
          this.filter.alarmDate = [date, date]
        }
        if (this.filter.hasOwnProperty('alarmTime')) {
          this.filter.alarmTime = [`${date} 00:00:00`, `${date} 23:59:59`]
        }
      },

      async getData(){
        // var t = this

        const tableId = this.setting.id

        if (!this.setting || !tableId) {
          this.$message({
            message: `暂无数据模板`,
            type: "warning",
            duration: 5 * 1000,
            showClose: true,
          })
          return
        }

        let condition = {
          usePlaintext: false, //信息脱敏
        }

        for (let i in this.filter) {
          if (!["pageNum", "pageSize", "rowTotal", "pageSizes"].includes(i) && this.filter[i]) {
            condition[i] = this.filter[i]
          }
        }

        let res = await this.$Api().ImportDataController.post_dataPage.request({
          path: {
            templateId: tableId,
          },
          data: {
            condition: condition,
            page: this.filter.pageNum,
            pageSize: this.filter.pageSize,
          },
          headers: {
            hideNotify: true,
          },
        })
        res.data.map((item,index)=>{
          for (const key in item) {
            if(!item[key]) item[key]='-'
          }
        })
        this.tableListData.tableData = res.data
        this.filter.pageNum = res.page
        this.filter.pageSize = res.pageSize
        this.filter.rowTotal = res.total

      },

      async getTableKeys(index = [], tableId = '10001', search = true) {
        var t = this
        this.tableListData = this.$options.data().tableListData;
        let res = await this.$Api().ImportDataController.get_config.request({
          path: {id: tableId},
        })

        // 表头配置
        let tableThArr = [
          ...[{fieldName: '所属镇街', fieldType: 'select', storeFiled: 'sszj'}],
          ...res.columns.filter(v => {
            return v.searchable && !['sszj', 'alarmType'].includes(v.storeFiled)
          })
        ]

        for (let i = 0; i < tableThArr.length; i++) {

          let item = tableThArr[i]
          if (item.storeFiled == 'sszj') {
            //所属镇街
            item.list = SETTING.getTownList().map(v => {
              return {label: v, value: v}
            })
            //初始化所属镇街
            this.$set(this.filter, 'sszj',this.town )
          }
          if (item.storeFiled == "fxgwlx") {
            //风险岗位类型
            item.fieldType = 'select'
            item.list = await this.getDangerWorkTypeList()
          }
        }
        this.dataKeys = tableThArr

        res.columns.forEach((v) => {

          if (v.storeFiled == 'alarmType') {
            //密接人员 告警类型
            v.searchable = false
          }

          if (v.show) {
            this.tableListData.tableKeys.push({
              id: v.storeFiled,
              label: v.fieldName,
              minWidth: ((v.fieldName || '').length || 2) * 15 + 40,
              searchable: v.searchable,

              formatter: (item) => {
                let data
                if (item.hasOwnProperty(v.storeFiled)) {
                  data = item[v.storeFiled]
                }
                return data;
              },
            })
          }
          //过滤区参数
          if (v.searchable && !['sszj'].includes(v.storeFiled)) {
            this.$set(this.filter, v.storeFiled, "")
          }
        })

        this.tableListData.tableKeys.sort((a, b) => {
          return index.indexOf(b.id) - index.indexOf(a.id)
        })

        if (search) {
          this.resetSearch()
        }
      },

      //获取高风险岗位类型列表
      async getDangerWorkTypeList() {
        let res = await getHighRiskDictionary()
        let arr = res.fxgwlx.map(({id, label}) => {
          return {
            label: label,
            value: label
          }
        })
        return arr
      },

      resetSearch() {
        this.filter = this.$options.data().filter
        this.filter.pageNum = 1
        this.filter.pageSize = 15
        this.filter.rowTotal = 1
        this.getData()
      },
      search(){
        this.filter.pageNum = 1;
        this.getData()
      },

    }
  }
</script>

<style lang="scss" type="text/scss">
  .alarm-event-table {
    a {
      color: #4E7CFC;
    }
  }
</style>
