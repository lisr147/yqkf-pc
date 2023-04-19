<template>
  <div>
    <table-page
      :data="vdata"
      :filter="filterData"
      :hideSearch="true"
      @search="search"
      @resetSearch="resetSearch"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    ></table-page>
  </div>
</template>

<script>
  import TablePage from 'zkzc-table-page'
  import {pageRange} from '@/config/setting'

  export default {
    name: "templateTable",
    components: {TablePage},
    data() {
      return {
        filterData:{
          pageNum: 1,
          pageSize: pageRange[0],
          rowTotal: 0,
          pageSizes: pageRange,
        },
        vdata:{
          tableData: [],
          tableKeys: [
            {
              id: "name",
              label: '模板名称'
            }
          ],
          tableFunctions:[{
            label: '预览',
            method: this.previewTemp
          },{
            label: '创建',
            method: this.createForm
          }]
        },
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData(){
        this.vdata.tableData = [
          {
            name: '流行病调查问卷',
            id: 1
          },{
            name: '疫情上报-学生返校调查表',
            id: 2
          },{
            name: '疫情上报-春节假期去向调查表',
            id: 3
          }
        ]
      },
      previewTemp({row}) {
        window.open(`${location.origin}${process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : ''}/index.html?#/preview?id=${row.id}`)
      },
      createForm({row}) {
        this.$emit('selected', {id: row.id})
      },
      search(){

      },
      resetSearch(){

      },
      sizeChange(){

      },
      currentChange(){

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
