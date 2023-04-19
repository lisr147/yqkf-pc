import "@babel/polyfill";
import Vue from "vue";
import App from "@/views/helpDocument/index.vue";
import router from "@/router/help-document";

import {
  Tree
} from "@/plugins/element";

console.log(11);
import "@assets/css/common.scss";
import "@assets/css/screen.scss";

Vue.use(Tree);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#helpDocument");
