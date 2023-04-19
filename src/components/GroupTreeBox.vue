<template>
  <div class="treebox">
    <div class="treebox-filter">
      <el-tooltip  effect="dark" content="刷新组织结构树" placement="bottom">
        <el-button size="small" @click="refreshLazyTree">
          <i class="el-icon-refresh"></i>
        </el-button>
      </el-tooltip>
      <el-input placeholder="请输入关键词" prefix-icon="el-icon-search" v-model="treeKeyword" size="small" style="margin-left: 6px;width: 180px;" ></el-input>
    </div>
    <div class="treebox-box ">
      <el-tree  :props="defaultProps"
                @node-click="handelClickNode"
                lazy
                :load="getTreeDataByNode"
                ref="groupTree"
                :filter-node-method="filterNode"
                :default-expanded-keys="expandedKeys"
                class="iscroll"
                node-key="id" >
      </el-tree>
    </div>
  </div>

</template>

<script>
import { getTree, getSubTree } from '@/api/department'
export default {
  name: 'GroupTreeBox',
  props: {
    nodeText: { type: String, default: 'departmentName' }
  },
  data () {
    return {
      // 组织树关键词
      treeKeyword: '',
      // 默认展开的节点集
      expandedKeys: [],
      // 组织树数据映射字段名
      defaultProps: {
        children: 'subDepartmentDTOs',
        label: 'departmentName',
        isLeaf: 'leaf'
      }
    }
  },
  watch: {
    treeKeyword (val) {
      this.$refs.groupTree.filter(val)
    }
  },
  mounted () {
  },
  methods: {

    // 通过节点id获取下属节点数据
    getTreeDataByNode (node, resolve) {
      // 加载根节点
      if (node.level === 0) {
        getTree().then(res => {
          resolve([res])
          // 赋值根节点id
          this.rootNodeId = res.id
          // 展开一级节点
          this.expandedKeys.push(this.rootNodeId)
          this.$emit('dataReady', { rootId: res.id, nodeText: res.departmentName, parentDepartmentId:res.parentDepartmentId })
        })
        return
      }

      getSubTree({
        departmentId: node.data.id,
        limit: 9999
      }).then(res => {
        let arr = res
        arr.forEach(item => {
          item.leaf = (item.isParent === false)
        })
        return resolve(arr)
      })
    },

    // 刷新树根节点下级节点的数据
    refreshLazyTree () {
      if (!this.rootNodeId) {
        return
      }
      // 清除根节点的子节点
      var RootNode = this.$refs['groupTree'].getNode(this.rootNodeId)
      let theChildren = RootNode.childNodes
      theChildren.splice(0, theChildren.length)

      // 重新获取一级节点并渲染
      getSubTree({
        departmentId: this.rootNodeId,
        limit: 9999
      }).then(res => {
        let arr = res
        arr.forEach(item => {
          item.leaf = (item.isParent === false)
        })
        RootNode.doCreateChildren(arr)
      })
    },
    // 节点被点击
    handelClickNode (data) {
      this.$emit('chooseGroupNode', data)
    },
    // 筛选组织树
    filterNode (value, data) {
      if (!value) return true
      return data[this.nodeText].indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>

  .treebox {
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

</style>
