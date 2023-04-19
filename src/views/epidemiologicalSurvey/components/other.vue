<template>
  <section class="p-edit-epidemiological-survey-body">
    <section class="p-edit-epidemiological-survey-gallery">
      <template v-if="other.qtzp">
        <header class="p-edit-epidemiological-survey-gallery-header">
          其他照片
        </header>
        <section class="p-edit-epidemiological-survey-images">
          <el-image
            class="p-edit-epidemiological-survey-image"
            v-for="(c, i) in other.qtzp.split(',')"
            fit="contain"
            :key="i"
            :src="getMediaUrl(c)"
            :z-index="1000"
            :preview-src-list="other.qtzp.split(',').map(c => getMediaUrl(c))"
          >
          </el-image>
        </section>
      </template>
      <empty v-else></empty>
    </section>
  </section>
</template>

<script type="text/javascript">
import { getMediaUrl } from "@/utils/common";
import Empty from "@/components/common/Empty";
export default {
  name: "other",
  components: { Empty },
  props: ["other"],
  methods: {
    validate() {
      return Promise.resolve(true);
    },
    getMediaUrl(id) {
      return getMediaUrl(id);
    },
  },
};
</script>
