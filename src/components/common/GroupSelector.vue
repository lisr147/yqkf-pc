<template>
  <div>
    <el-popover
        ref="layer"
        placement="bottom-start"
        popper-class="screen-popover"
        :visible-arrow="false"
        width="420"
        trigger="click">
      <el-tree
          lazy
          :load="getTreeDataByNode"
          :props="defaultProps"
          @node-click="handleSelect"
          ref="groupTree"
          class="iscroll"
          style="max-height: 200px;"
          node-key="id"></el-tree>

      <el-input slot="reference"
                placeholder="请选择"
                v-model="inputValue"
                clearable
                :readonly="!inputable"
                @clear="clearValue">
      </el-input>
    </el-popover>
  </div>
</template>

<script>
import { getTree, getSubTree, getDepartment } from '@/api/department'
export default {
  name: 'GroupSelector',
  components: {},
  props:{
    value: { type: [String, Number] },
    valueMode: {type:String, default: 'name'}, //name:value值为部门名称， id: value值为部门id
    inputable: { type: Boolean, default: true }, //是否支持手动输入
  },
  model:{
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      // 组织树数据映射字段名
      defaultProps: {
        children: 'subDepartmentDTOs',
        label: 'departmentName',
        isLeaf: 'leaf'
      },
      rootNodeId: null,
      // 输入框内容
      inputValue: '',
      // 选中项的描述值
      labelValue: '',

      // 选中项的部门级别
      grade: null
    }
  },
  watch:{

    inputValue (val) {
      if (this.valueMode !== 'id') {
        this.$emit('change', val)
      }
    },
    value:{
      async handler(val){
        if (this.valueMode == 'id') {
          if (this.value > 0) {
            // let res = await getDepartment({ departmentId: this.value, showModal: false })
            // this.grade = this.value
            // this.inputValue = res.departmentName
          } else {
            this.grade = 0
            this.inputValue = ''
          }
        }
        if(this.valueMode =='name'){
          this.inputValue = this.value
        }
      },
      immediate: true
    },
    grade(val){
      this.$emit('gradeChange', val)
    },
  },
  async mounted () {
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

    handleSelect (data, node) {
      const { id, departmentName, relationCode} = data
      this.inputValue = departmentName

      if (this.valueMode == 'id') {
        this.grade = relationCode ? relationCode.match(/[0-9]+#/g).length : 0
        this.labelValue = departmentName
        this.$emit('change', id)
      } else {
        this.$emit('change', departmentName)
      }
      this.$refs['layer'].doToggle()
    },

    clearValue(){
      this.$emit('change', '')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
