<template>
  <section class="p-edit-epidemiological-survey-body">
    <section class="p-edit-epidemiological-survey-body-header">
      <section>姓名：{{ nucleicAcidStatusForm.xm }}</section>
      <section>证件号码：{{ nucleicAcidStatusForm.sfzhm }}</section>
       <section>所属哨点类别：{{ sentinelInfo }}</section>
    </section>
    <section class="p-edit-epidemiological-survey-body-content">
      <ul
        class="p-edit-epidemiological-survey-body-list"
        ref="nucleicAcidStatus"
      >
        <li
          v-for="(item, index) in nucleicAcidStatusForm.data.filter(
            v => !v.isDeleted
          )"
          :key="index"
          class="p-edit-epidemiological-survey-body-item"
        >
          <el-form
            :model="item"
            label-width="120px"
            class="p-edit-epidemiological-survey-body-form"
            autofocus
            ref="nucleicAcidStatusForm"
          >
            <el-form-item
              v-for="key in Object.keys(item).filter(
                key => key in nucleicAcidMap
              )"
              :key="key"
              :label="nucleicAcidMap[key]"
              :prop="key"
              :rules="
                key === 'jcsj' || key === 'cyrq' || key === 'jcjg'
                  ? [
                      {
                        required: true,
                        message: '请选择',
                        trigger: 'blur',
                      },
                    ]
                  : [
                      {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur',
                      },
                    ]
              "
            >
              <el-date-picker
                v-if="key === 'jcsj' || key === 'cyrq'"
                v-model="item[key]"
                type="datetime"
                placeholder="选择时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="!item.addTag"
              >
              </el-date-picker>
              <el-select
                v-model="item[key]"
                placeholder="请选择"
                v-else-if="key === 'jcjg'"
                :disabled="!item.addTag"
              >
                <el-option
                  v-for="state in ['阴性', '阳性']"
                  :key="state"
                  :label="state"
                  :value="state"
                >
                </el-option>
              </el-select>
              <el-input v-model="item[key]" v-else :disabled="!item.addTag"/>
            </el-form-item>
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="p-edit-epidemiological-survey-body-delete"
              v-if="item.addTag"
              @click="deleteStatusItem(item, index)"
              circle
            ></el-button>
          </el-form>
        </li>
        <empty v-if="nucleicAcidStatusForm.data.filter(v => !v.isDeleted).length === 0"></empty>
      </ul>
      <section
        class="p-edit-epidemiological-survey-body-add"
        @click="addStatus"
      >
        + 新增核酸检测信息
      </section>
    </section>
    <template v-if="nucleicAcidStatusForm.hszp">
      <header class="p-edit-epidemiological-survey-gallery-header">
        核酸照片
      </header>
      <section class="p-edit-epidemiological-survey-images">
        <el-image
          class="p-edit-epidemiological-survey-image"
          v-for="(c, i) in nucleicAcidStatusForm.hszp.split(',')"
          fit="contain"
          :key="i"
          :src="getMediaUrl(c)"
          :z-index="1000"
          :preview-src-list="
            nucleicAcidStatusForm.hszp.split(',').map(c => getMediaUrl(c))
          "
        >
        </el-image>
      </section>
    </template>
  </section>
</template>

<script type="text/javascript">
import { enterAnimation, getMediaUrl, cloneNormalObject } from "@/utils/common";
import { nucleicAcidMap, nucleicAcidStatusTemplate, nucleicAcidStatusFormTemplate } from "../config";
import Empty from "@/components/common/Empty";
export default {
  name: "nucleicAcidStatus",
  data() {
    return {
      nucleicAcidStatusTemplate,
      nucleicAcidMap,
      nucleicAcidStatusForm: cloneNormalObject(nucleicAcidStatusFormTemplate),
    };
  },
  components: { Empty },
  props: ["nucleicAcidStatus"],
  computed:{
    sentinelInfo(){
      let info = '';
      const sdxx=this.nucleicAcidStatus.sdxx;
      // const sdxx= [{ztlx: "重点物流场所", hsgz: '两天一检'},{ztlx: "重点物流场所", hsgz: '两天一检'}]
      if(typeof sdxx === 'string'){
        info=sdxx;
      }else if(Array.isArray(sdxx)){
        sdxx.forEach((item,index)=>{
          info+=`${index>0?'；':''}${item.ztlx}（核酸规则：${item.hsgz?item.hsgz:'暂无设置'}）`
        })
      }
      return info;
    }
  },
  watch: {
    nucleicAcidStatus: {
      handler(val) {
        this.nucleicAcidStatusForm = cloneNormalObject(val);
      },
      deep: true,
    },
  },
  methods: {
    async validate() {
      const validatePromise = Promise.all(
          this.$refs.nucleicAcidStatusForm.map(v => v.validate())
        );
      let validateResult;
      try {
        validateResult = (await validatePromise).every(v => v);
      } catch (e) {
        validateResult = false;
      }
      return validateResult;
    },
    getMediaUrl(id) {
      return getMediaUrl(id);
    },
    addStatus() {
      const bindingDom = this.$refs.nucleicAcidStatus;
      this["nucleicAcidStatusForm"].data.push({
        ...this['nucleicAcidStatusTemplate'],
      });
      this.$nextTick(() => {
        enterAnimation(
          bindingDom,
          "p-edit-epidemiological-survey-body-item__highlight"
        );
      });
    },
    deleteStatusItem(item, index) {
      if(item.id) {
        // 数据库已存在的数据
        item.isDeleted = true;
      } else {
        // 用户新增的数据
        this.nucleicAcidStatusForm.data.splice(index, 1);
      }
    },
  },
};
</script>
