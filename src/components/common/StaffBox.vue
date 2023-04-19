<template>

  <div class="staff-box" >
    <div class="staff-box-main" >
      <el-tag v-for="(item,index) in value" type="success" :key="item.id" :closable="!disabled" @close="dropSel(index)">{{item.fullName||item.username}}</el-tag>
    </div>
    <el-button type="primary" @click="staffDialogVisible=true" size="mini" :disabled="disabled">添加对象</el-button>
    <el-button type="primary" @click="clear" size="mini" :disabled="disabled">清空</el-button>

    <el-dialog
      title="添加对象"
      :visible.sync="staffDialogVisible"
      :append-to-body="true"
      :close-on-click-modal="true"
      width="600px">
      <user-tree-box  v-model="seledUsers" ref="userTreeBox"></user-tree-box>
      <div slot="footer" class="dialog-footer">
        <el-button @click="staffDialogVisible=false">取消</el-button>
        <el-button @click="pushToSelection" type="primary">确定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import UserTreeBox from "@/components/common/UserTreeBox"

  export default {
    name: "StaffBox",
    components: {
      UserTreeBox
    },
    props: {
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
        seledUsers: [],

        //是否显示选择面板
        staffDialogVisible: false
      }
    },
    mounted() {
    },
    methods: {
      pushToSelection(){

        if (this.seledUsers.length <= 0) {
          this.$message({
            message: '请选择至少一个成员',
            type: 'warning'
          })
          return
        }

        this.$emit('change', this.mergeData(this.seledUsers))
        this.seledUsers = []

        this.staffDialogVisible = false
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

      clear(){
        this.$emit('change', [])
      },

      dropSel(index) {
        let arr = [].concat(this.value)
        arr.splice(index, 1)
        this.$emit('change', arr)
      }

    }

  }
</script>

<style lang="scss" scoped>
.staff-box{
  padding:0 0 0 1.5em;
  font-size: 12px;

  &-main {
    margin:1em 0;
    padding: 1em;
    width: 500px;
    max-height: 150px;
    min-height: 50px;
    overflow: auto;
    background-color: #f6f6f6;
    border:1px solid #d9ecff;

    .el-tag{
      margin: .2em 0.2em;
    }
  }
}
</style>
