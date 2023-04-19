<template>
  <div class="grid">
    <template v-if="loadFail">
      <van-empty image="error" description="图表加载失败，请检查图表配置" v-if="loadFail">
        <template slot="description">
          <p>{{title}}</p>
          <p> 图表加载失败，请检查图表配置</p>
        </template>
      </van-empty>
    </template>
    <template v-else>

      <!--<div class="title">-->
        <!--<h3>{{title}}</h3>-->
        <!--<span>更新时间：{{updateTime}}</span>-->
      <!--</div>-->
      <table class="std">
        <thead>
        <th v-for="(item,index) in headerData" :key="index">{{item.label}}</th>
        </thead>
        <tbody>
        <tr v-for="(item,index) in gridData" :key="index">
          <td v-for="(node, i) in headerData" :key="i">
            <template v-if="node.name =='operate'">
              <a class="prim" :href="item[node.name].href">{{item[node.name].value}}</a>
            </template>
            <template v-else>
              {{item[node.name]}}
            </template>
          </td>
        </tr>
        </tbody>
      </table>

      <van-pagination v-model="page.pageNumber" :page-count="page.pagerCount" mode="simple" @change="handleCurrentChange" />

    </template>

  </div>
</template>

<script>
import { getPanelData } from '@/api/chart'
// import axios from 'axios'

export default {
  name: "GridChart",
  components: {},
  data() {
    return {
      // 头部
      headerData: [],
      // 表格主体
      gridData: [],
      // 页码信息
      page: {
        pageNumber: 1,
        pageSize: 5,
        rowTotal: 1,
        pagerCount: 15
      },
      updateTime: null,
      title: '',
      loadFail: false
    }
  },
  props: {
    id: { type: Number, String }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(){
      if (!this.id) {
        return
      }
      console.log('getData()')
      let {pageNumber, pageSize} = this.page

      getPanelData({
        id: this.id,
        pageNumber: pageNumber,
        pageSize: pageSize
      }).then((res) => {

        let data = res.panelItemData.data
        this.setData(data)

      }).catch(res => {
        this.loadFail = true
        console.log('图表加载失败：' + this.id)
      })
    },
    setData({data,page,update,title}) {
      this.headerData = data.xAxisDatas
      this.gridData = data.yAxisDatas
      this.updateTime = update
      this.title = title
      this.page = page
      this.page.pagerCount = Math.ceil(page.rowTotal / page.pageSize)
    },
    handleCurrentChange (newPageNumber) {
      this.page.pageNumber = newPageNumber
      this.getData()
    },
  }
}
</script>

<style lang="scss" scoped>
.grid{
  padding:10px 8px 4px;
  margin-bottom: 4vw;
  background-color: #f7f7f7;
}
.std{
  border-collapse: collapse;
  table-layout: fixed;
  width:100%;
  background-color: #fff;
  margin-bottom: 2vw;

  th,td{
    padding: 4px;
    border: 1px solid #ddd;
    text-align: center;
    font-size: 12px;
  }
  .prim{
    color: $theme-color;
  }
}
.title{
  padding: 0 0 2vw;
  color: #999;
  font-size: 12px;

  h3{
    color: #333;
    font-size: 18px;
  }
}
</style>
