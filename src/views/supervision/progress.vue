<template>
  <add v-model="editorVisible" :dialogConfig="dialogConfig" editType="view"></add>
</template>

<script>
import Add from "@/components/supervision/Add";
export default {
  name: "progress",
  components: {
    Add,
  },
  data () {
    return {
      editorVisible: true,
      dialogConfig: {
        showClose: false,
        fullscreen: true,
        token: '',
      },
    }
  },
  mounted() {
    this.dialogConfig.token = this.$route.query.token
  }
}
</script>

<style lang="scss">
</style>
