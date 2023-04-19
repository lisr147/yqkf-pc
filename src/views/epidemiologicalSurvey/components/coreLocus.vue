<template>
  <section class="p-edit-epidemiological-survey-body">
    <ul
      class="p-edit-epidemiological-survey-trajectories"
      v-if="coreLocusForm.locus.length"
    >
      <li
        class="p-edit-epidemiological-survey-trajectory"
        v-for="item in coreLocusForm.locus"
        :key="item.id"
      >
        <section class="p-edit-epidemiological-survey-trajectory-info">
          <section class="p-edit-epidemiological-survey-trajectory-info-time">
            {{ item.locusDate || "未填写日期" }}
          </section>
        </section>
        <section class="p-edit-epidemiological-survey-trajectory-bottom">
          <section class="p-edit-epidemiological-survey-trajectory-subject">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="item.locus"
            >
            </el-input>
            <section class="p-edit-epidemiological-survey-voices">
              <section
                v-for="voiceItem in item.locusYyWb"
                :key="voiceItem.id"
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
          </section>
          <section class="p-edit-epidemiological-survey-trajectory-aside">
            <section
              class="p-edit-epidemiological-survey-trajectory-place"
              @click="editKeyPlace(item)"
            >
              {{ `重点场所(${item.zdcs.length})` }}
            </section>
          </section>
        </section>
      </li>
    </ul>
    <empty v-else></empty>
    <key-place-dialog
      @submitKeyPlace="submitKeyPlace"
      :currentTrace="currentTrace"
      :keyPlaceDialogVisible.sync="keyPlaceDialogVisible"
    ></key-place-dialog>
  </section>
</template>

<script type="text/javascript">
import { listenVoice, getMediaUrl, cloneNormalObject } from "@/utils/common";
import Empty from "@/components/common/Empty";
import keyPlaceDialog from "./keyPlaceDialog";
import { coreLocusFormTemplate, currentTraceTemplate } from "../config";
export default {
  name: "CoreLocus",
  components: { Empty, keyPlaceDialog },
  props: ["coreLocus"],
  watch: {
    coreLocus: {
      handler(val) {
        this.coreLocusForm = cloneNormalObject(val);
      },
      deep: true,
    },
  },
  data() {
    return {
      coreLocusForm: cloneNormalObject(coreLocusFormTemplate),
      currentTrace: cloneNormalObject(currentTraceTemplate),
      keyPlaceDialogVisible: false,
      audio: null,
      audioTarget: null,
    };
  },
  methods: {
    async validate() {
      return Promise.resolve(true);
    },
    getMediaUrl(id) {
      return getMediaUrl(id);
    },
    listenVoice(voiceId, { target }) {
      listenVoice(voiceId, target);
    },
    editKeyPlace(item) {
      this.currentTrace = item;
      this.keyPlaceDialogVisible = true;
    },
    submitKeyPlace() {
      this.$emit("refresh");
      this.keyPlaceDialogVisible = false;
    },
  },
};
</script>
