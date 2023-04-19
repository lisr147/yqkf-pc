<template>
  <div class="checkbox">
    <!-- <div class="checkbox-check" ref="checkboxCheck">
      <el-tag v-for="(item, index) in checkData" :key="item.id" style="margin-right: 8px" closable @close="handleClose(index)">{{ item.name }}</el-tag>
    </div> -->
    <div class="checkbox-filter" style="width:200px;">
      <el-input
        placeholder="请输入名称搜索"
        suffix-icon="el-icon-search"
        v-model="checkKeyword"
      ></el-input>
    </div>
    <div class="checkbox-box iscroll" >
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="check">
            <el-checkbox
              v-for="item in copyData"
              :key="item.id"
              :label="item.id"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupCheckBox',
  props: ['data', 'checkList', 'height'],
  data () {
    return {
      // 当前选中 只包含ID
      check: [],
      // 过滤
      checkKeyword: '',
      copyData: [],
      // 选中数组 包含 ID 和 name
      checkData: [],
      checkAll: false,
      isIndeterminate: false
    }
  },
  watch: {
    check (val) {
      this.checkData = []
      for (let i = 0; i < val.length; i++) {
        const id = val[i]
        for (let j = 0; j < this.data.length; j++) {
          const item = this.data[j]
          if (id === item.id) {
            this.checkData.push(item)
            break
          }
        }
      }
      if (!val.length || val.length === this.data.length) {
        this.isIndeterminate = false
      } else {
        this.isIndeterminate = true
      }
      console.log(val.length, this.data.length)
      if (val.length === this.data.length) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
      this.$emit('check', val)
    },
    checkKeyword (val) {
      this.copyData = this.data.filter(item => {
        return ~item.name.indexOf(val)
      })
    }
  },
  mounted () {
    this.check = [...this.checkList]
    this.copyData = JSON.parse(JSON.stringify(this.data))
  },
  methods: {
    handleClose (index) {
      this.check.splice(index, 1)
    },
    handleCheckAllChange (val) {
      this.check = val ? this.data.map(v => v.id) : []
      this.isIndeterminate = false
    }
  }
}
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
.checkbox {
  overflow: hidden;
  .checkbox-header {
    padding: 8px;
  }

  .checkbox-box {
    overflow: auto;
  }

}
</style>
