<template>
  <div class="p-edit-epidemiological-survey-body">
    <!-- 本土病例 -->
    <el-form
      ref="baseInfoForm"
      :model="baseInfoForm"
      label-width="100px"
      class="p-edit-epidemiological-survey-form"
      :rules="baseInfoFormRules"
      v-if="$route.query.positiveType !== '入境病例'"
    >
      <el-form-item
        v-for="item in baseInfoFormKeys"
        :key="item.value"
        :label="item.label"
        :prop="item.value"
        class="p-edit-epidemiological-survey-basic"
      >
        <el-input
          v-model="baseInfoForm[item.value]"
          v-if="item.value !== 'xb' && item.value !== 'lnglat'"
          class="p-edit-epidemiological-survey-input"
        ></el-input>
        <section v-else-if="item.value === 'lnglat'">
          <location-picker
            v-model="isPickerVisible"
            :mapObject="mapObject"
            @input="setLocate"
          />
        </section>
        <el-select v-else v-model="baseInfoForm[item.value]">
          <el-option
            :value="item"
            :label="item"
            v-for="item in ['男', '女', '其他']"
            :key="item"
          />
        </el-select>
        <section
          v-if="
            baseInfoForm[`${item.voiceKey}wb`] &&
            baseInfoForm[`${item.voiceKey}wb`].length
          "
          class="p-edit-epidemiological-survey-voices"
        >
          <section
            v-for="voiceItem in baseInfoForm[`${item.voiceKey}wb`]"
            :key="voiceItem.mediaInfoId"
            class="p-edit-epidemiological-survey-voice-wrapper"
          >
            <section
              class="p-edit-epidemiological-survey-voice"
              @click="listenVoice(voiceItem.mediaInfoId, $event)"
            ></section>
            <section class="p-edit-epidemiological-survey-chat">
              {{ voiceItem.yyText }}
            </section>
          </section>
        </section>
      </el-form-item>
    </el-form>
    <!-- 入境病例 -->
    <el-form
      ref="baseInfoForm"
      :model="baseInfoForm"
      label-width="150px"
      class="p-edit-epidemiological-survey-form"
      v-else
    >
      <el-form-item
        v-for="item in baseInfoFormKeys.filter((item)=>item.value!=='scsfzzp')"
        :key="item.value"
        :label="item.label"
        :prop="item.value"
        class="p-edit-epidemiological-survey-basic"
        :required="item.required"
      >
        <el-select
          v-if="item.inputType === 'select'"
          v-model="baseInfoForm[item.value]"
        >
          <el-option
            v-for="opt in item.selectDate"
            :value="opt"
            :label="opt"
            :key="opt"
          />
        </el-select>
        <el-date-picker
          v-else-if="item.inputType === 'dateTime' || item.inputType === 'date'"
          :value-format="
            item.inputType === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
          "
          v-model="baseInfoForm[item.value]"
          :type="item.inputType === 'date' ? 'date' : 'datetime'"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-date-picker
          v-else-if="item.inputType === 'dateTimeRange'"
          v-model="baseInfoForm[item.value]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-input
          v-else-if="item.inputType === 'text'"
          class="p-edit-epidemiological-survey-input"
          v-model="baseInfoForm[item.value]"
        ></el-input>
        <section v-else-if="item.value === 'mqscwz'">
          <location-picker
            v-model="isPickerVisible"
            :mapObject="mapObject"
            @input="setLocate"
          />
        </section>
        <section
          v-if="
            baseInfoForm[`${item.voiceKey}wb`] &&
            baseInfoForm[`${item.voiceKey}wb`].length
          "
          class="p-edit-epidemiological-survey-voices"
        >
          <section
            v-for="voiceItem in baseInfoForm[`${item.voiceKey}wb`]"
            :key="voiceItem.mediaInfoId"
            class="p-edit-epidemiological-survey-voice-wrapper"
          >
            <section
              class="p-edit-epidemiological-survey-voice"
              @click="listenVoice(voiceItem.mediaInfoId, $event)"
            ></section>
            <section class="p-edit-epidemiological-survey-chat">
              {{ voiceItem.yyText }}
            </section>
          </section>
        </section>
      </el-form-item>
    </el-form>
    <section class="p-edit-epidemiological-survey-gallery">
      <header class="p-edit-epidemiological-survey-gallery-header">
        身份证照片
      </header>
      <section class="p-edit-epidemiological-survey-images">
        <div v-for="id in scsfzzpIds" :key="id" class="image-viewer">
          <el-image
            class="p-edit-epidemiological-survey-image"
            fit="contain"
            :src="getMediaUrl(id)"
            :z-index="1000"
            :preview-src-list="scsfzzpIds.map((id) => getMediaUrl(id))"
          >
          </el-image>
          <i @click="delScsfzzp(id)" class="el-icon-remove del-icon"></i>
        </div>
      </section>
      <el-upload
        action="#"
        class="p-edit-epidemiological-survey-upload"
        :before-upload="handleBeforeUpload"
        :http-request="uploadPictureReqest"
        :show-file-list="false"
      >
        <el-button
          size="small"
          type="primary"
          :disabled="disabledUpload"
          class="uploadBtn"
        >
          点击上传身份证照片
        </el-button>
      </el-upload>
    </section>
    <section
      class="p-edit-epidemiological-survey-gallery"
      v-if="baseInfoForm.zp"
    >
      <header class="p-edit-epidemiological-survey-gallery-header">照片</header>
      <section class="p-edit-epidemiological-survey-images">
        <el-image
          class="p-edit-epidemiological-survey-image"
          v-for="id in baseInfoForm.zp.split(',')"
          fit="contain"
          :key="id"
          :src="getMediaUrl(id)"
          :z-index="1000"
          :preview-src-list="
            baseInfoForm.zp.split(',').map((id) => getMediaUrl(id))
          "
        >
        </el-image>
      </section>
    </section>
  </div>
</template>

<script type="text/javascript">
import LocationPicker from "@/components/common/LocationPicker/Index.vue";
import { getMediaUrl, cloneNormalObject, listenVoice } from "@/utils/common";
import { uploadFile } from "@/api/mediaInfo";
import {
  baseInfoFormKeys,
  baseInfoFormRules,
  baseInfoFormTemplate,
} from "../config";
import { getBaseConfig } from "@/api/epidemiologicalSurvey";
export default {
  name: "BaseInfo",
  components: {
    LocationPicker,
  },
  props: ["baseInfo"],
  watch: {
    baseInfo: {
      handler(val) {
        this.baseInfoForm = cloneNormalObject(val);
        if (this.baseInfoForm.scsfzzp) {
          this.scsfzzpIds = this.baseInfoForm.scsfzzp.split(",");
        }
      },
      deep: true,
    },
    scsfzzpIds(newVal) {
      this.baseInfoForm.scsfzzp = newVal.join(",");
    },
  },
  computed: {
    mapObject() {
      const { baseInfoForm } = this;
      const { mqscwz, longitude, latitude } = baseInfoForm;
      return {
        name: mqscwz || "未选择位置",
        district: "南沙区", // 说现在写死
        lngLat: [longitude || "", latitude || ""],
      };
    },
  },
  data() {
    return {
      baseInfoFormKeys,
      baseInfoFormRules,
      baseInfoForm: cloneNormalObject(baseInfoFormTemplate),
      isPickerVisible: false,
      audio: null,
      audioTarget: null,
      file: null,
      scsfzzpIds: [],
      disabledUpload: false,
    };
  },
  mounted() {
    if (this.$route.query.positiveType === "入境病例") {
      this.getImmigrateKeys();
    }
  },
  methods: {
    async validate() {
      const validatePromise = this.$refs.baseInfoForm.validate();
      let validateResult;
      try {
        validateResult = await validatePromise;
      } catch (e) {
        validateResult = false;
      }
      return validateResult;
    },
    getMediaUrl(id) {
      return getMediaUrl(id);
    },
    setLocate(value) {
      const { district, lngLat, name: mqscwz } = value;
      const [longitude, latitude] = lngLat;
      this.baseInfoForm = {
        ...this.baseInfoForm,
        district,
        longitude,
        latitude,
        mqscwz,
      };
    },
    listenVoice(voiceId, { target }) {
      listenVoice(voiceId, target);
    },
    async getImmigrateKeys() {
      const baseInfoFromImmigrateKeys = await getBaseConfig(
        this.$route.query.id,
        {
          appType: "pc",
        }
      );

      this.baseInfoFormKeys = baseInfoFromImmigrateKeys.map((item) => {
        return {
          ...item,
          label: item.fieldName,
          value: item.storeFiled,
          voiceKey: item.storeFiled + "yy",
        };
      });
    },
    handleBeforeUpload(file) {
      console.log("file", file);
      if (file.type.indexOf("image") < 0) {
        console.log("imageerror");
        this.$message.error("上传文件只能是图片格式！！！");
        this.file = null;
        return;
      }
      this.file = file;
    },
    async uploadPictureReqest() {
      if (!this.file) return;
      this.disabledUpload = true;

      const fileDetail = await uploadFile("es", this.file);
      this.scsfzzpIds.push(fileDetail.id);
      this.disabledUpload = false;
    },
    delScsfzzp(id) {
      const idx = this.scsfzzpIds.indexOf(id);
      if (idx > -1) {
        this.scsfzzpIds.splice(idx, 1);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.p-edit-epidemiological-survey-images {
  margin-bottom: 10px;
  .image-viewer {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-right: 10px;
    margin-bottom: 10px;
    .del-icon {
      font-size: 20px;
      position: absolute;
      top: 5px;
      right: 5px;
      color: red;
      cursor: pointer;
    }
  }
}
</style>
