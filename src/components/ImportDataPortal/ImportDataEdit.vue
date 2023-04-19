<!-- 新增、编辑、查看详细数据-->
<template>
  <el-dialog
    :visible="true"
    top="4vh"
    :title="title"
    append-to-body
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="500px"
  >
    <div class="editForm">
      <el-form
        :model="dataForm"
        ref="dataForm"
        label-width="200px"
        v-if="dataType"
      >
      <template v-for="item in this.keys">
                  <!-- {{item.storeFiled}} -->

        <el-form-item
          v-if="item.header"
          :key="item.storeFiled"
          :label="item.fieldName"
          :prop="item.storeFiled"
          :rules="{
            required: dataType[item.storeFiled].required || false,
            validator: validateRule,
            trigger: 'change',
          }"
        >
          <span v-if="type === 'view'" class="view">{{
            dataForm[item.storeFiled] || "暂无数据"
          }}</span>
          <!-- 酒店选择 -->
          <template v-else-if="item.storeFiled === 'jdid'">
            <el-select
              v-model="dataForm[item.storeFiled]"
            >
              <el-option
                v-for="hotel in hotelList"
                :key="hotel.id"
                :value="hotel.id"
                :label="hotel.jkgcjd"
                >{{ hotel.jkgcjd }}</el-option
              >
            </el-select>
          </template>
          
          <template v-else-if="item.storeFiled === 'jdmc'">
            <el-input
              v-model="dataForm[item.storeFiled]"
              :disabled="true"
              placeholder="请输入"
            ></el-input>
          </template>
          <!-- 关联病例选择 -->
<template v-else-if="item.storeFiled === 'sgkrxm'">
            <el-select
              v-model="dataForm[item.storeFiled]"
              @change="selectHotel"
            >
            <el-option
                v-for="gxbl in gaglblList"
                :key="gxbl"
                :value="gxbl"
                />
              
            </el-select>
          </template>

          <template v-else-if="item.fieldName.includes('日期')">
            <!-- <el-input
              v-model="dataForm[item.storeFiled]"
              :disabled="true"
              placeholder="请输入"
            ></el-input> -->
            <el-date-picker
            v-model="dataForm[item.storeFiled]"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
          </template>
          <template v-else-if="item.fieldName.includes('时间')">
            <!-- <el-input
              v-model="dataForm[item.storeFiled]"
              :disabled="true"
              placeholder="请输入"
            ></el-input> -->
            <el-date-picker
            v-model="dataForm[item.storeFiled]"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          </template>
          <template v-else-if="item.storeFiled==='gfxrylb'&& tableId==='10002'">
            <el-select v-model="dataForm[item.storeFiled]">
                <el-option value="密切接触者" />
                <el-option value="密接的密接" />
                <el-option value="一般接触者" />
                <el-option value="公安反馈未定密级数" />
            </el-select>
          </template>
          <el-input
            v-model="dataForm[item.storeFiled]"
            :disabled="type !== 'new' && !dataType[item.storeFiled].editable"
            v-else
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </template>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button v-if="type !== 'view'" type="info" @click="save"
        >保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import moment from 'moment'
export default {
  name: "ImportDataEdit",
  props: ["keys", "data", "type", "tableId"],
  data() {
    return {
      dataForm: {},
      dataType: null, // 数据类型校验
      hotelList: [],//酒店列表
      gaglblList:[]//公安关联确诊人员列表
    };
  },
  computed: {
    title() {
      let type = {
        edit: "编辑",
        new: "新建",
        view: "查看",
      };
      let name = this.tableId === '10001'?'人员':'数据'
      return `${type[this.type]}${name}`;
    },
  },
  async mounted() {
    this.dataType = {};
    this.keys.forEach((v) => {
      this.dataType[v.storeFiled] = v;
      // console.log(v)
      let data = this.data?this.data[v.storeFiled] || '':''
      if(this.type!=='new' &&( v.fieldName.includes('日期'))){
        data = data? moment(data).format('YYYY-MM-DD'):''
      }
      if(this.type!=='new' &&( v.fieldName.includes('时间'))){
        data = data? moment(data).format('YYYY-MM-DD HH:mm:ss'):''
      }
      this.$set(
        this.dataForm,
        v.storeFiled,
        this.type === "new" ? "" : data
      );
    });
    if(this.tableId === '10001'){
    this.hotelList = await this.$Api().HotelController.get_getHotelList.request();
    }
    if(this.tableId === '10002'){
      this.gaglblList = await this.$Api().ConnectionController.get_gaglblList.request()
      this.dataForm.sgkrxm = this.gaglblList[0]
    }

    
  },
  methods: {
    validateRule(rule, value, callback) {
      // console.log(rule, value, this.dataType[rule.field])
      let dataType = this.dataType[rule.field];
      if (dataType.required && !(value + "").trim()) {
        return callback(new Error("请输入内容"));
      }
      if (!value) {
        return callback();
      }
      // 数据类型判断
      if (dataType.fieldType === "int" && isNaN(value)) {
        return callback(new Error("请输入数值"));
      }
      if (dataType.fieldType === "double" && isNaN(value)) {
        return callback(new Error("请输入数值"));
      }
      if (dataType.fieldType === "date" && !new Date(value).getTime()) {
        return callback(new Error("请输入正确的日期，格式2020-01-01"));
      }
      if (dataType.fieldType === "time" && !new Date(value).getTime()) {
        return callback(new Error("请输入正确的时间，格式2020-01-01 00:00:00"));
      }

      return callback();
    },
    async save() {
      await this.$refs.dataForm.validate();
      let data = JSON.parse(JSON.stringify(this.dataForm))
      for(let i in data){
        if(data[i]){
          data[i] = data[i].trim()
        }
        if(!this.dataType[i].editable){
          delete data[i]
        }
      }
      delete data.creator
      delete data.creatorName
      delete data.updateTime
      delete data.createTime
      if (this.type === "new") {
        await this.$Api().ImportDataController.post_data.request({
          data: data,
          path: {
            templateId: this.tableId,
          },
        });
      }
      if (this.type === "edit") {
        await this.$Api().ImportDataController.put_data.request({
          data: data,
          path: {
            id: this.data.id,
          },
        });
      }
      this.$emit("update");
      this.$emit("close");
    },
    selectHotel(val) {
      this.dataForm.jdmc = this.hotelList.filter((v) => v.id === val)[0].jkgcjd;
    },
  },
};
</script>
<style lang="scss" scoped>
.view {
  // border-bottom: 1px solid $input-border-color;
  width: 100%;
  display: inline-block;
  // color: $font-color;
}
</style>
