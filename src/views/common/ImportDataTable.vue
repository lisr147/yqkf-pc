<template>
  <div class="import-data-table">
    <table-page
      :data="tableListData"
      :filter="filter"
      :hideSearch = "true"
      max-height = "400px"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      :id="`import_data_table_${conf.id}`"
    >

    </table-page>
  </div>
</template>

<script>

import TablePage from "zkzc-table-page";
import TablePageFunc from "@/utils/tablepage.js";
import {formatTime} from '@/utils/common'

export default {
  name: "ImportDataTable",
  components: {
    TablePage,
  },
  props: {
    conf: {
      type: Object,
      default() {
        return {}
      }
    }

  },
  mixins: [TablePageFunc],
  data() {
    return {
      filter:{
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100],
      },
      tableListData: {
        tableData: [],
        tableKeys: [],
        tableFunctions: [],
      },


    }
  },
  watch: {
    conf: {
      handler({id}) {
        if (id) {
          this.getHeader()
          this.getData()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    async getHeader(){
      const {id} = this.conf
      const {columns} = await this.$Api().ImportDataController.get_config.request({
        path: {id}
      })
      let arr = []
      columns.filter(v => v.header !== null).forEach(item => {
        const {show, storeFiled, fieldName, searchable} = item
        if (show) {
          arr.push({
            id: storeFiled,
            label: fieldName,
            minWidth: fieldName.length * 30,
            searchable,
            formatter: v => {
              let data
              if (v.hasOwnProperty(storeFiled)) {
                data = v[storeFiled]
              }
              if (['createTime', 'updateTime'].includes(storeFiled)) {
                data = formatTime(data)
              }
              return data
            }
          })
        }
      })
      this.tableListData.tableKeys = arr
    },

    async getData(){
      const {id, condition} = this.conf
      const {pageSize, pageNum} = this.filter
      const res = await this.$Api().ImportDataController.post_dataPage.request({
        path: {templateId: id},
        headers: {hideNotify: true},
        data: {
          condition,
          page: pageNum,
          pageSize
        }
      })

      this.tableListData.tableData = res.data
      this.filter.pageSize = res.pageSize
      this.filter.rowTotal = res.total

      this.$emit('getDataComplete', res)
    }
  }
}
</script>

<style lang="scss" type="text/scss">

</style>
