<template>
  <section class="p-edit-epidemiological-survey-body">
    <section class="p-edit-epidemiological-survey-body-header">
      <section>姓名：{{ vaccinationStatusForm.xm }}</section>
      <section>证件号码：{{ vaccinationStatusForm.sfzhm }}</section>
    </section>
    <section class="p-edit-epidemiological-survey-body-content">
      <ul
        class="p-edit-epidemiological-survey-body-list"
        ref="vaccinationStatus"
        v-show="vaccinationStatusForm.data.length"
      >
        <li
          v-for="(item, index) in vaccinationStatusForm.data.filter(
            v => !v.isDeleted
          )"
          :key="index"
          class="p-edit-epidemiological-survey-body-item"
        >
          <el-form
            :model="item"
            ref="vaccinationStatusForm"
            label-width="80px"
            class="p-edit-epidemiological-survey-body-form"
            autofocus
          >
            <el-form-item
              v-for="key in Object.keys(item).filter(
                key => key in vaccinationFieldMap
              )"
              :key="key"
              :label="vaccinationFieldMap[key]"
              :prop="key"
              :rules="
                key === 'jzsj'
                  ? [
                      {
                        required: true,
                        message: '请选择日期',
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
                v-if="key === 'jzsj'"
                v-model="item[key]"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :disabled="!item.addTag"
              >
              </el-date-picker>
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
      </ul>
      <empty v-if="vaccinationStatusForm.data.filter(
            v => !v.isDeleted
          ).length === 0"></empty>
      <section class="p-edit-epidemiological-survey-body-add" @click="addStatus">
        + 新增针次信息
      </section>
    </section>
    <template v-if="vaccinationStatusForm.ymzp">
      <header class="p-edit-epidemiological-survey-gallery-header">
        疫苗照片
      </header>
      <section class="p-edit-epidemiological-survey-images">
        <el-image
          class="p-edit-epidemiological-survey-image"
          v-for="(c, i) in vaccinationStatusForm.ymzp.split(',')"
          fit="contain"
          :key="i"
          :src="getMediaUrl(c)"
          :z-index="1000"
          :preview-src-list="
            vaccinationStatusForm.ymzp.split(',').map(c => getMediaUrl(c))
          "
        >
        </el-image>
      </section>
    </template>
  </section>
</template>

<script type="text/javascript">
import { enterAnimation, getMediaUrl, cloneNormalObject } from "@/utils/common";
import { vaccinationFieldMap, vaccinationStatusTemplate, vaccinationStatusFormTemplate } from "../config";
import Empty from "@/components/common/Empty";
export default {
  name: "vaccinationStatus",
  components: { Empty },
  data() {
    return {
      vaccinationStatusTemplate,
      vaccinationFieldMap,
      vaccinationStatusForm: cloneNormalObject(vaccinationStatusFormTemplate),
    };
  },
  props: ["vaccinationStatus"],
  watch: {
    vaccinationStatus: {
      handler(val) {
        this.vaccinationStatusForm = cloneNormalObject(val);
      },
      deep: true,
    },
  },
  methods: {
    async validate() {
      const validatePromise = Promise.all(
          this.$refs.vaccinationStatusForm.map(v => v.validate())
        );
      let validateResult;
      try {
        validateResult = (await validatePromise).every(v => v);
      } catch (e) {
        validateResult = false;
      }
      return validateResult;
    },
    addStatus() {
      const bindingDom = this.$refs["vaccinationStatus"];
      this["vaccinationStatusForm"].data.push({
        ...this["vaccinationStatusTemplate"],
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
        this.vaccinationStatusForm.data.splice(index, 1);
      }
    },
    getMediaUrl(id) {
      return getMediaUrl(id);
    },
  },
};
</script>
