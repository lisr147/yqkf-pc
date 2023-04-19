<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import watermark from "watermark-dom";
import moment from "moment";
import request from "@/utils/request";
export default {
  name: "App",
  async mounted() {},
  watch: {
    "$store.state.user": {
      async handler(val) {
        if (!val.username) return;
        //添加水印
        // const {fullName, username, mobile, email}  =  await this.$store.dispatch('user/getInfo')
        // console.log(this.$store.state.user)
        // let user = val
        let res = await request({
          url: `/portal/rest/org/user/getCurrentUser`,
          method: "get",
        });
        // console.log(res);
        let { fullName, username, departmentName,mobile} = res;
        this.$store.commit('user/SET_NAME',fullName);
        this.$store.commit('user/SET_DEPARTMENT',departmentName);
        this.$store.commit('user/SET_MOBILE',mobile);
        let dt = moment().format("YYYY-MM-DD HH:mm:ss");
        watermark.load({
          watermark_txt: `${fullName ? fullName : ""} ${mobile} ${dt}`,
          watermark_x: 0,
          watermark_y: 0,
          watermark_color: "#999",
          watermark_fontsize: "16px",
          watermark_width: 300,
          watermark_height: 200,
        });
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
