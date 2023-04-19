<!-- 新增、编辑、查看详细数据-->
<template>
  <el-dialog
      :visible="true"
      top="4vh"
      title="预约详情"
      append-to-body
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="800px"
  >
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="基本信息">
        <div class="editForm">
          <el-form
              :model="dataForm"
              ref="dataForm"
              label-width="200px"
              v-if="dataType"
          >
            <template v-for="item in this.keys">
              <el-form-item
                  v-if="item.header"
                  :key="item.storeFiled"
                  :label="item.fieldName"
                  :prop="item.storeFiled"
               >
            <span v-if="type === 'view'" class="view">
              <template v-if="item.storeFiled==='lyd'">{{dataForm[item.storeFiled].slice(dataForm[item.storeFiled].indexOf('desc=') + 5, dataForm[item.storeFiled].indexOf('}'))}}</template>
              <template v-else>{{dataForm[item.storeFiled] || "暂无数据"}}</template>
            </span>
              </el-form-item>
            </template>
          </el-form>
        </div>

      </el-tab-pane>
      <el-tab-pane label="乘车人信息" name="乘车人信息">
        <div class="editForm" style="max-height: 65vh;overflow-y: auto">
          <el-form class="item-card" v-for="item in PassengerList" :key="item.id" label-width="200px">
            <el-form-item label="人员类别">
              {{ item.rylb }}
            </el-form-item>
            <el-form-item label="姓名">
              {{ item.xm }}
            </el-form-item>
            <el-form-item label="身份证号码">
              {{ item.sfzhm }}
            </el-form-item>
            <el-form-item label="手机号码">
              {{ item.sjhm }}
            </el-form-item>
            <el-form-item label="穗康码/粤康码状态">
              {{ item.skm }}
            </el-form-item>
            <el-form-item label="穗康码/粤康码截图">
              <img alt="" :src="`${imgURL}${item.skmid}`" @click="handleImagePreview(item.skmid)">
            </el-form-item>
            <el-form-item label="行程码截图">
              <img alt="" :src="`${imgURL}${item.xcmjtid}`" @click="handleImagePreview(item.xcmjtid)">
            </el-form-item>
            <el-form-item label="核酸情况">
              {{ item.hsqk }}
            </el-form-item>
            <el-form-item label="核酸情况截图">
              <img alt="" :src="`${imgURL}${item.hsjtid}`" @click="handleImagePreview(item.hsjtid)">
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="imagePreviewVisible">
      <img width="100%" :src="previewUrl" alt=""/>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>

import {getTemplateData} from "@/api/common";


export default {
  name: "ImportDataEdit",
  props: ["keys", "data", "type", "tableId", 'ztlxType'],
  data() {
    return {
      imgURL:'/vform/file/download/',
      activeName: "基本信息",
      dataForm: {},
      PassengerForm: {}, //乘车人信息
      PassengerList: [],
      dataType: null, // 数据类型校验
      templateSpecial: {},
      previewUrl: "",
      imagePreviewVisible: false,
    };
  },
  computed: {},
  async mounted() {
    this.dataType = {};
    let filterKey = ['来源地', '到访地', '计划到达高速路口', '计划到达时间', '计划离场时间', '是否在南沙过夜', '预计过夜居住地点']
    this.keys.forEach((v) => {
      if (!filterKey.includes(v.header)) {
        v.header = ''
      }
      if (!v.fieldName) {
        return;
      }
      this.dataType[v.storeFiled] = v;
      let data = this.data ? this.data[v.storeFiled] || "" : "";
      this.$set(this.dataForm, v.storeFiled, this.type === "new" ? "" : data);
      if (this.ztlxType) this.dataForm.ztlx = this.ztlxType
    });

  },
  methods: {
    //乘车人信息
    async getPassenger() {
      let condition = {
        yydid: this.data.id
      }
      const res = await getTemplateData({templateId: 10112, condition});
      this.PassengerList = res.data
    },
    handleImagePreview(url) {
      this.previewUrl = `${this.imgURL}${url}`;
      this.imagePreviewVisible = true;
    },
    handleClick(tab, event) {
      this.activeName = tab.label
      if (tab.label === '乘车人信息') {
        this.getPassenger()
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.editForm{
  img{
    height: 300px;
  }
}
.item-card {
  background: #edeeefc7;
  padding: 20px 0;
  margin: 20px 0;
  width: 98%;
}
</style>
