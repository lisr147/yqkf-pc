<template>
  <div class="target-box" >
    <div class="target-box-main">
      <el-table
      border
      height="200px"
      :data="value">
        <!--<el-table-column prop="id" label="id"></el-table-column>-->
        <el-table-column prop="name" label="人员类别"></el-table-column>
        <el-table-column prop="count" label="人数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="dropSel(scope.$index)" :disabled="disabled">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button type="primary" @click="crowdPanelVisible=true" size="mini" :disabled="disabled">添加分组</el-button>
    <el-button type="primary" @click="clear" size="mini" :disabled="disabled">清空</el-button>


    <el-dialog
      append-to-body
      title="添加特定对象分组"
      :visible.sync="crowdPanelVisible">
      <table-page
        ref="crowdTable"
        :data="crowd"
        :filter="page"
        :hideSearch="true"
        @tableSelectionChange="handleSelChange"
        >
      </table-page>
      <div slot="footer" class="dialog-footer">
        <el-button @click="crowdPanelVisible = false">取消</el-button>
        <el-button type="primary" @click="pushToSelection">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import TablePage from "zkzc-table-page"
  import {getSubmitUserGroup} from "@/api/submitUser"
  export default {
    name: "TargetBox",
    components: {
      TablePage
    },
    props:{
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      disabled: {
        type: Boolean
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {

        //显示所有特定对象组
        crowdPanelVisible: false,

        //待选分组
        crowd: {
          selection: true,
          tableData: [],
          tableKeys:[
            {
              id: "groupName",
              label: "人员类别"
            },{
              id: "submitUserCount",
              label: "人数"
            },{
              id: "createUser",
              label: "创建人"
            },{
              id: "updateTime",
              label: "更新时间"
            },
          ],
          tableFunctions: [{
            label: '查看详情',
            method: this.gotoCrowdDetail,
          }]
        },

        //页码
        page: {
          pageNum: 1,
          pageSize: 10,
          rowTotal: 0
        },

        //已勾选表格数据
        selectedData: []

      }
    },
    watch:{
      crowdPanelVisible(val, oldVal){
        if(!oldVal && val){
          this.$nextTick(() => {
            this.getCrowd()
          })
        }
      }
    },
    mounted() {

    },
    methods: {
      getCrowd() {
        getSubmitUserGroup({
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize
        }).then(res => {

          const {number, size, totalElements, content} = res
          this.crowd.tableData = content
          this.page = {
            pageNum: number + 1,
            pageSize: size,
            rowTotal: totalElements
          }

        })
      },

      handleSelChange(data) {
        this.selectedData =  data.map(item=>{
          return {
            id: item.id,
            name: item.groupName,
            count: item.submitUserCount
          }
        })
      },

      //放到已选特定对象分组里
      pushToSelection(){

        if (this.selectedData.length <= 0) {
          this.$message({
            message: '请选择至少一个分组',
            type: 'warning'
          })
          return
        }

        this.$emit('change', this.mergeData(this.selectedData))
        this.selectedData = []

        this.crowdPanelVisible = false
      },

      mergeData(data) {

        let arr = []
        data.forEach(item => {
          let match = this.value.find(o => {
            return o.id == item.id
          })
          if (!match) {
            arr.push(item)
          }
        })
        return this.value.concat(arr)
      },

      dropSel(index) {
        let arr = [].concat(this.value)
        arr.splice(index, 1)
        this.$emit('change', arr)
      },

      clear(){
        this.$emit('change', [])
      },

      gotoCrowdDetail({row}){
        window.open(`${location.origin}${process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : ''}/index.html?#/crowd/list?groupId=${row.id}`)
      }


    }
  }
</script>

<style lang="scss" scoped>
.target-box{

  &-main {
    margin:1em 0;
    padding: 1em;
    width: 500px;
    /*max-height: 150px;*/
    min-height: 50px;
    overflow: auto;
    background-color: #f0f0f0;

    .el-tag{
      margin: 0 .2em;
    }
  }
}
</style>
