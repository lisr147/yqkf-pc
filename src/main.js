import "@babel/polyfill";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


import {
    Pagination,
    Dialog,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Input,
    Radio,
    RadioGroup,
    RadioButton,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Switch,
    Select,
    Option,
    OptionGroup,
    Button,
    Table,
    TableColumn,
    DatePicker,
    Popover,
    Tooltip,
    Breadcrumb,
    BreadcrumbItem,
    Form,
    FormItem,
    Tabs,
    TabPane,
    Tag,
    Tree,
    Alert,
    Slider,
    Icon,
    Row,
    Col,
    Upload,
    Progress,
    Spinner,
    Steps,
    Step,
    Carousel,
    CarouselItem,
    Collapse,
    CollapseItem,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Timeline,
    TimelineItem,
    Link,
    Divider,
    Image,
    Loading,
    MessageBox,
    Message,
    Notification,
    TimePicker,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Card,
} from "./plugins/element";

import "./assets/css/common.scss";
import './assets/css/screen.scss'
import "./permission";

localStorage.token = "";
import "@/directives/drag";
import "@/directives/cellphone";

//图片浏览器
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
import Api from "@/api/api";
Vue.use(Viewer);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Alert);
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Spinner);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Link);
Vue.use(Divider);
Vue.use(Image);
Vue.use(TimePicker);
Vue.use(RadioButton);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Card);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$ELEMENT = { size: "small", zIndex: 3000 };
Viewer.setDefaults({
    Options: {
        inline: true,
        button: true,
        navbar: true,
        title: true,
        toolbar: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true,
        url: "data-source",
    },
});
if (process.env.NODE_ENV != 'production') {
    //预生产
    localStorage.token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6IjEiLCJkZXBhcnRtZW50SWQiOiJudWxsIiwidGVuYW50SWQiOiJudWxsIiwiZW50aXR5QXV0aG9yaXR5IjoiU1lTX0FETUlOIn0.gF4EpY_FBLqBEu3wt0TfuVB_XY4AMG7Yz6XQiSqv-666C_HuJ3Iv3FATuqNNvgaTx1fP-bWjtuznGkaKzZiLEQ'
    // localStorage.token='eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaXpoZSIsInVzZXJJZCI6IjMzMzAwNjciLCJkZXBhcnRtZW50SWQiOiIyODczODA0IiwidGVuYW50SWQiOiIxMTIxMDIiLCJlbnRpdHlBdXRob3JpdHkiOiJVU0VSIiwianRpIjoiMzMzMDA2NyJ9.VExrfrxTevw3UopUBeno3Ecy2ApcyBxvjPng6zn-Gj-aMY4n4CgwWhQAVx7pZc6Z73FYLzV7qg_mdxFszhCQ2w'
    // localStorage.token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5zaGFveWFuIiwidXNlcklkIjoiMjIxMTQ0NCIsImRlcGFydG1lbnRJZCI6IjM1NzQ2NjEiLCJ0ZW5hbnRJZCI6IjExMjEwMiIsImVudGl0eUF1dGhvcml0eSI6IlVTRVIiLCJqdGkiOiIyMjExNDQ0In0.tjT9FbbTWcY3wpKqAhn-14kahHD2OLHP4x6t7SWIFL2ZOX0Bq7cwzBS_cwR1fr11pJgnofk-E0y0FfbJ7Vasbw'
}

console.log('location', location.href)
// 跳转拦截
if (location.href.includes('#/url=')) {
    // 单点登录跳转的地址
    const url = location.href.split('#/url=')[1]

    let href = decodeURIComponent(url)
    // console.log(href)
    location.href = href
    setTimeout(() => {
        location.reload()
    }, 300);
}
else {
  if( process.env.NODE_ENV !== 'development'){
    // #禁止右键
    document.oncontextmenu = function () {
      return false;
    }

    // #禁止选中文字
    document.onselectstart = function () {
      return false;
    }

    document.body.oncopy = function () {
      // alert('禁止复制')
      return false;
    }
  }
    Vue.prototype.$Api = Api;

    Vue.config.productionTip = false;

    window.app = new Vue({
        router,
        store,
        render: (h) => h(App),
    }).$mount("#app");

}
