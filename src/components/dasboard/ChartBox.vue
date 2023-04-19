<template>
  <div class="box">
    <i v-if="showMagnifying" class="el-icon-zoom-in big-icon" @click="showBigChart"></i>
    <van-empty image="error" v-if="loadFail">
      <template slot="description">
        <p>图表加载失败，请检查图表配置</p>
      </template>
    </van-empty>
    <div class="chart" ref="chart" v-else></div>


  </div>
</template>

<script>
import echarts from "@/plugins/echarts";
import { getPanelItemDataByCode, getRjPanelItemDataByCode } from "@/api/chart";
import { adorn } from "@/config/adornChart";

export default {
  name: "ChartBox",
  components: {},
  inject: ["handleItemChoosed"],
  props: {
    code: { type: String, required: true },
    period: { type: Array },
    title: { type: String },
    showTitle:{
      type:Boolean,
      default:true
    },
    showMagnifying:{
      type:Boolean,
      default:true
    },
  },
  data() {
    return {
      isLoading: false,
      loadFail: false,
    };
  },
  async mounted() {
    this.isLoading = true;
    let data = await this.getData();
    this.isLoading = false;

    this.initChart(data);
  },
  methods: {
    getData() {
      let self = this;
      return new Promise((resolve, reject) => {
        let request = getPanelItemDataByCode;

        // if(this.code == 'getRjryjzDay' || this.code == 'getRjryjzWeek' || this.code == 'getRjryjzMonth'){
        //   request = getRjPanelItemDataByCode
        // }
      
        request({ code: this.code }).then((res) => {
          let _res = res;
          if (_res.updateTime && _res.updateTime != "null") {
            self.$emit("updateTime", {
              updateTime: _res.updateTime,
              code: this.code,
            });
          }

          // if(this.code == 'getRjryjzDay' || this.code == 'getRjryjzWeek' || this.code == 'getRjryjzMonth'){
          //   _res = {
          //     itemType:'BAR',
          //     panelItemData:res,
          //     title:''

          //   }
          // }
          resolve(_res);
          this.data= res

        });
      });
    },
    showBigChart(){
      let period = []
      this.period.map((i)=>{
        period.push(i.value)
      })
      this.data.info =  {
        code:this.code,
        title:this.title,
        hasTabs:true,
        period
      }
      this.handleItemChoosed(this.data,'chart')
    },
    initChart(item) {
      if (item == undefined || item == null) {
        console.log(`显示数据加载失败`);
        return;
      }

      const { code, title, itemType, panelItemData, data, optionData } = item;

      try {
        let apiOptionData = panelItemData.optionData;
        if (!apiOptionData) {
          this.loadFail = true;
          return;
        }

        Object.assign(apiOptionData, {
          color: this.$store.getters.chartColorStyle,
          textStyle: {
            color: "#fff",
          },
          legend: {
            textStyle: {
              color: "#fff",
            },
          },
          grid: {
            top: "24%",
            right: "4%",
            bottom: "2%",
            left: "4%",
            containLabel: true,
          },
          title: {
            show:this.showTitle,
            top: "3%",
            left: "2%",
            text: title,
            subtext: apiOptionData.title ? apiOptionData.title.subtext : null,
            textStyle: {
              fontSize: 14,
            },
          },
          nameGap: 8,
        });

        //调整样式
        apiOptionData = adorn({
          option: apiOptionData,
          code,
          updateTime: panelItemData.updateTime,
        });

        const instance = echarts.init(this.$refs["chart"]);
        this.$emit("initChart", instance);
        // 根据接口数据渲染图表
        // console.log("apiOptionData", apiOptionData);
        apiOptionData.xAxis[0].axisLine = {
          lineStyle: { color: "#fff" },
        };
        apiOptionData.yAxis[0].axisLine = {
          lineStyle: { color: "#fff" },
        };
        apiOptionData.yAxis[0].splitLine ={
          show:false,
        }
        instance.setOption(apiOptionData);

        // 渲染定制化的图表配置
        if (optionData) {
          const customerOptionData = eval("(" + optionData + ")");
          delete customerOptionData.title;
          instance.setOption(customerOptionData);
        }
      } catch (err) {
        console.error(`${item.title} ${item.id}`);
        console.error(err);
        // debugger
      }
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.box {
  position: relative;
  width: 100%;
  height: 100%;
  .big-icon{
    position: absolute;
    top: -12px;
    right: 12px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    z-index: 999;
    transition:opacity 1s;
    opacity:0;
  }
  .chart {
    width: 100%;
    height: 100%;
  }
}
.box:hover .big-icon{
  display: block;
  opacity:1;
  transition:opacity 1s;
}
</style>
