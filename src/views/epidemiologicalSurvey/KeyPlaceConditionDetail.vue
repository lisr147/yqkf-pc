<template>
  <el-dialog
      :visible="true"
      top="10vh"
      title="环境信息"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="600px">

    <el-table
        :data="dataList"
        border
        max-height="500"
        style="width: 100%">
      <el-table-column prop="name" label="采样部位" width="180"></el-table-column>
      <el-table-column prop="result" label="环境结果" width="120"></el-table-column>
      <el-table-column prop="desc" label="结果具体描述" ></el-table-column>
    </el-table>

  </el-dialog>
</template>

<script>
export default {
  name: "KeyPlaceConditionDetail",
  components: {},
  props: {
    data: {
      type: String,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      try {
        this.dataList = JSON.parse(this.data)
      } catch (err) {
        console.error('keyPlaceConditionDetail JOSN解析失败')
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss">

</style>
