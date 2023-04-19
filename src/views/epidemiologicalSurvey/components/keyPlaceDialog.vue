<template>
  <el-dialog
    title="重点场所和人员"
    width="979px"
    :visible.sync="visible"
    :before-close="onClose"
    @close="resetKeyPlaceDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <section class="p-edit-epidemiological-survey-key-places" v-if="currentTrace.zdcs.length">
      <section
        v-for="item in currentTrace.zdcs"
        :key="item.id"
        class="p-edit-epidemiological-survey-key-place"
      >
        <section v-for="key in Object.keys(addKeyPlaceFormKeys)" :key="key">
          {{ key }}：{{ item[addKeyPlaceFormKeys[key]] || "-" }}
        </section>
      </section>
    </section>
    <empty v-else-if="addKeyPlaceFormList.length === 0"></empty>
    <section class="p-edit-epidemiological-survey-key-place-add">
      <ul
        class="p-edit-epidemiological-survey-body-list"
        ref="addKeyPlaceFormList"
      >
        <li
          v-for="(addKeyPlaceForm, addKeyPlaceFormIndex) in addKeyPlaceFormList"
          :key="addKeyPlaceFormIndex"
          class="p-edit-epidemiological-survey-body-item"
        >
          <el-form
            ref="addKeyPlaceForm"
            :rules="addKeyPlaceFormRules"
            :model="addKeyPlaceForm"
            label-width="100px"
            class="p-edit-epidemiological-survey-key-place-form"
          >
            <el-form-item
              label="场所名称"
              class="p-edit-epidemiological-survey-key-place-item"
              required
              prop="csmc"
            >
              <el-input
                v-model="addKeyPlaceForm.csmc"
                placeholder="请输入场所名称"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="场所地址"
              class="p-edit-epidemiological-survey-key-place-item"
              required
              prop="csdz"
            >
              <el-input
                v-model="addKeyPlaceForm.csdz"
                placeholder="请输入场所地址"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item label="活动时间" required prop="datetimerange">
              <el-date-picker
                v-model="addKeyPlaceForm.datetimerange"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              v-for="(person, personIndex) in addKeyPlaceForm.rydtos"
              :label="'新增人员' + (personIndex + 1)"
              :key="person.key"
              :prop="'rydtos.' + personIndex + '.value'"
            >
              <el-form
                ref="peopleForm"
                :inline="true"
                :model="person"
                label-width="100px"
                :rules="peopleRules"
              >
                <el-form-item label="姓名" prop="xm">
                  <el-input v-model="person.xm" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="lxfs">
                  <el-input v-model="person.lxfs" placeholder="电话"></el-input>
                </el-form-item>
                <el-form-item label="证件号码" prop="sfzhm">
                  <el-input
                    v-model="person.sfzhm"
                    placeholder="证件号码"
                  ></el-input>
                </el-form-item>
                <el-form-item label="人员类型" prop="rylx">
                  <el-select v-model="person.rylx" placeholder="人员类型">
                    <el-option label="密接人员" value="密切接触者"></el-option>
                    <el-option label="次密接人员" value="密接的密接"></el-option>
                    <el-option label="重点人群" value="重点人群"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button @click.prevent="removePerson(addKeyPlaceFormIndex, personIndex)">删除</el-button>
                </el-form-item>
              </el-form>
            </el-form-item>
            <el-form-item>
              <el-button @click="addPerson(addKeyPlaceForm)">新增人员</el-button>
              <el-button @click="resetKeyPlaceForm(addKeyPlaceFormIndex)">重置</el-button>
            </el-form-item>
          </el-form>
          <el-button
            type="danger"
            icon="el-icon-delete"
            class="p-edit-epidemiological-survey-body-delete"
            @click="deleteKeyPlaceFormItem(addKeyPlaceFormIndex)"
            circle
          ></el-button>
        </li>
      </ul>
    </section>
    <section class="p-edit-epidemiological-survey-key-place-operation">
      <el-button @click="addKeyPlaceAndPerson">+ 新增场所和人员</el-button>
      <el-button type="primary" @click="addKeyPlace">提交</el-button>
    </section>
  </el-dialog>
</template>

<script type="text/javascript">
import { enterAnimation, cloneNormalObject } from "@/utils/common";
import {
  addKeyPlaceFormKeys,
  addKeyPlaceFormRules,
  addKeyPlaceFormTemplate,
  peopleRules,
} from "../config";
import { addKeyPlace } from "@/api/epidemiologicalSurvey";
import Empty from "@/components/common/Empty";
export default {
  name: "KeyPlaceDialog",
  components: {
    Empty,
  },
  props: {
    currentTrace: {
      type: Object,
      default: () => ({
        zdcs: [],
        esId: "",
        locusYyWb: [],
        locusDate: "",
        locusYy: "",
        locus: null,
        id: "",
      }),
    },
    keyPlaceDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      addKeyPlaceFormRules,
      addKeyPlaceFormKeys,
      addKeyPlaceForm: cloneNormalObject(addKeyPlaceFormTemplate),
      peopleRules,
      peopleForm: [],
      visible: false,
      addKeyPlaceFormList: [],
    };
  },
  watch: {
    keyPlaceDialogVisible: {
      handler(val) {
        this.visible = val;
      },
      immediate: true,
    },
  },
  methods: {
    async validate() {
      let validateResult;
      try {
        validateResult = (await Promise.all([...this.$refs.addKeyPlaceForm.map(v => v.validate()), ...this.$refs.peopleForm.map(v => v.validate())])).every(v => v);
      } catch (e) {
        validateResult = false;
      }
      return validateResult;
    },
    async addKeyPlace() {
      if(this.addKeyPlaceFormList.length === 0) {
        if(this.currentTrace.zdcs.length !== 0) {
          this.$message.warning('信息未作修改');
          this.$emit("update:keyPlaceDialogVisible", false);
        } else {
          this.$message.error('请至少添加一个场所和人员');
        }
        return;
      }
      const { currentTrace, addKeyPlaceFormList } = this;
      const { esId: ldId, id: gjid } = currentTrace;
      const validateResult = await this.validate();
      if(validateResult) {
        try {
          addKeyPlace(addKeyPlaceFormList.map((item) => ({
            csmc: item.csmc,
            csdz: item.csdz,
            rydtos: item.rydtos,
            ldId,
            gjid,
            hdsj: item.datetimerange.join(',')
          }))).then(() => {
            this.$message.success("提交成功");
            this.$emit("submitKeyPlace");
            this.resetKeyPlaceDialog();
            this.$emit('refresh');
          });
        } catch (e) {
          return false;
        }
      }
    },
    resetKeyPlaceDialog() {
      this.addKeyPlaceFormList = [];
      this.peopleForm = [];
    },
    removePerson(addKeyPlaceFormIndex, personIndex) {
      if (personIndex === 0 || personIndex) {
        this.addKeyPlaceFormList[addKeyPlaceFormIndex].rydtos.splice(personIndex, 1);
      }
    },
    deleteKeyPlaceFormItem(index) {
      this.addKeyPlaceFormList.splice(index, 1);
    },
    addPerson(addKeyPlaceForm) {
      addKeyPlaceForm.rydtos.push({
        xm: "",
        lxfs: "",
        sfzhm: "",
        rylx: "",
        key: Date.now(),
      });
    },
    resetKeyPlaceForm(index) {
      this.$refs['addKeyPlaceForm'][index].resetFields();
      this.addKeyPlaceFormList[index].rydtos = [{
        xm: "",
        lxfs: "",
        sfzhm: "",
        rylx: "",
        key: Date.now(),
      }];
    },
    onClose() {
      this.$emit("update:keyPlaceDialogVisible", false);
    },
    addKeyPlaceAndPerson() {
      const bindingDom = this.$refs['addKeyPlaceFormList'];
      this['addKeyPlaceFormList'].push({
        ...cloneNormalObject(addKeyPlaceFormTemplate),
      });
      this.$nextTick(() => {
        enterAnimation(
          bindingDom,
          "p-edit-epidemiological-survey-body-item__highlight"
        );
      });
    },
  },
};
</script>
