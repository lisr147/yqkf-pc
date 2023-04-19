<template>
  <div class="p-public-opinion">
    <iframe src="https://cb.gzns.gov.cn/yq-public-opinion/index.html#/analysis/internet"></iframe>
  </div>
</template>
<script>

export default {
  name: "publicOpinion",
};
</script>

<style lang="scss" type="text/scss">
.p-public-opinion {
  width: 100%;
  height: calc(100vh - 170px);
  >iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
