<template>

  <div style="" class="setuser">

    <div style="" class="setuser-tree">
      <div class="treebox">
        <div class="treebox-header">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="treeKeyword" size="small" >
          </el-input>
          <!--组织结构-->
        </div>
        <div class="treebox-box iscroll">
          <el-tree  :props="defaultProps"
                    @node-click="handleNodeClick"
                    lazy
                    :load="getTreeDataByNode"
                    :show-checkbox="false"
                    ref="userTree"
                    :filter-node-method="filterNode"
                    node-key="id" >
          </el-tree>
        </div>
      </div>
    </div>
    <div class="setuser-achive iscroll">
      <el-tag
        :key="index"
        v-for="(tag, index) in currUsers"
        @close="handleDropUser(tag, index)"
        closable>
        {{tag.fullName}}
      </el-tag>
    </div>

  </div>

</template>

<script>
import { queryUsersByDepartment, getSubTree2 } from '@/api/department'

export default {
  name: 'UserTreeBox',
  data () {
    return {
      treeKeyword: '',
      defaultProps: {
        children: 'children',
        label: 'departmentName',
        isLeaf: 'leaf'
      },
      // 根节点id
      rootNodeId: null,
      selectedItems: []
    }
  },
  props: {
    // 当前已选的用户信息
    currUsers: {type: Array}
  },
  model: {
    prop: 'currUsers',
    event: 'change'
  },
  mounted () {
  },
  watch: {
    treeKeyword (newValue) {
      this.$refs['userTree'].filter(newValue)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data['departmentName'].indexOf(value) !== -1
    },

    // 通过节点id获取下属节点数据
    getTreeDataByNode (node, resolve) {
      if (node.level === 0) {
        getSubTree2({
          departmentId: -10000,
          showModal: false,
        }).then(res => {
          resolve(res)
          // 赋值根节点id
          this.rootNodeId = res[0].id
        })
        return
      }

      getSubTree2({
        roleId: this.roleId,
        departmentId: node.data.id
      }).then(res => {
        return resolve(res)
      })
    },
    handleNodeClick(node) {

      queryUsersByDepartment({
        departmentId: node.id
      }).then(res=>{

        let arr = []

        // 如果用户已存在则不加入
        res.forEach(({username, fullName, id})=>{
          let match = this.currUsers.find(item=>{
            return item.id == id
          })
          if (!match) {
            arr.push({username, fullName, id})
          }
        })

        this.$emit('change', [].concat(this.currUsers, arr))
      })
    },

    handleDropUser(tag, index) {
      let arr = [].concat(this.currUsers)
      arr.splice(index,1)
      this.$emit('change', arr)
    },

    clear(){
      this.$emit('change', [])
    }


  }
}
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
.setuser {
  position: relative;
  height: 400px;
  overflow: hidden;
  .treebox {
    box-sizing: border-box;
    border: 1px solid #dae3ec;
    height:100%;
    .treebox-header{
      padding: 8px;
    }
    .treebox-filter {
      padding: 8px;
    }
    .treebox-box {
      position: absolute;
      top: 50px;
      left: 8px;
      right: 8px;
      bottom: 8px;
      overflow: auto;
    }
  }
  .setuser-tree {
    position: relative;
    float: left;
    background-color: #fcfcfc;
    width: 300px;
    height: 100%;
  }
  .setuser-achive {
    box-sizing: border-box;
    padding: 8px 8px;
    margin-left: 310px;
    height: 100%;
    background-color: #fcfcfc;
    border: 1px solid #dae3ec;
    overflow: auto;

    .el-tag{
      margin:0 4px 6px 0;
    }
    .add_input{
      width:70px;
      border:transparent;
      outline:none;
      -webkit-tap-highlight-color:rgba(0,0,0,0);
    }
  }
}
</style>
