<template>
  <el-dialog
      :visible="true"
      top="10vh"
      title="关联人员"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="800px">

    <el-tabs v-model="currTab" type="card">

      <el-tab-pane label="阳性病例" name="positive">
        <div class="base-info">
          <table>
            <tr><td>姓名：</td><td>{{positiveInfo.xm}}</td></tr>
            <tr><td>性别：</td><td>{{positiveInfo.xb}}</td></tr>
            <tr><td>年龄：</td><td>{{positiveInfo.nl}}</td></tr>
            <tr><td>联系电话：</td><td>{{positiveInfo.lxdh}}</td></tr>
            <tr><td>身份证号码：</td><td>{{positiveInfo.sfzhm}}</td></tr>
            <tr><td>职业：</td><td>{{positiveInfo.zy}}</td></tr>
            <tr><td>户籍地址：</td><td>{{positiveInfo.hjdz}}</td></tr>
            <tr><td>现住址：</td><td>{{positiveInfo.xzz}}</td></tr>
            <tr><td>核心轨迹：</td><td>{{positiveInfo.hxgj}}</td></tr>
          </table>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="`密接次密接人员(${relateDateCount})`" name="relate">
        <import-data-table :conf="relateDataConf" @getDataComplete="handleRelateGetDataComplete"></import-data-table>
      </el-tab-pane>

    </el-tabs>

  </el-dialog>
</template>

<script>

import ImportDataTable from "../common/ImportDataTable";
export default {
  name: "KeyPlaceRelation",
  components: {ImportDataTable},
  props: {
    cond: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currTab: 'positive',
      //阳性病例
      positiveInfo: {},
      //密接次密接人员
      relateDataConf: {},
      relateDateCount: 0
    }
  },
  async mounted() {
    await this.init()
    await this.getPositiveData()
    await this.getRelateData()
  },
  methods: {

    async init(){
      //密接次密接人员 表头
      const {columns} = await this.$Api().ImportDataController.get_config.request({
        path: { id: 10097 }
      })

      this.relateTableKeys = columns.filter(v => v.header !== null)
      this.relateTableKeys.forEach(item => {
        item.minWidth = Math.max(80, item.header.length * 20)
      })
    },

    //阳性人员
    async getPositiveData() {
      const {id, glbl, ldId} = this.cond
      const res = await this.$Api().ImportDataController.post_dataPage.request({
        path: {templateId: 10096},
        data: {
          condition: {
            // glzdcs: id, //关联重点场所
            ldId
          },
          page: 1
        }
      })
      if (res.data[0]) {
        this.positiveInfo = res.data[0]
      }
    },

    //密接次密接人员 数据
    async getRelateData() {
      const {id, glbl} = this.cond
      this.relateDataConf = {
        id: 10097,
        condition: {
          glzdcs: id, //关联重点场所
          // glbl, //关联病例
        }
      }
    },

    handleRelateGetDataComplete(event){
      this.relateDateCount = event.total || 0
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.base-info{
  padding: 0 1em;
  table{
    width: 100%;
    tr {
      td{
        padding: .3em .5em;
      }
      td:first-child {
        width: 100px;
      }
    }
  }
}
</style>
