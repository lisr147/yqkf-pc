<template>
  <div class="moniter-panel">
    <data-panel title="扫码监控" :titleTips="codeData.titleTips" :list="codeData.list" />
    <data-panel title="疫苗监控" :titleTips="vaccineData.titleTips" :list="vaccineData.list" />
    <data-panel title="核酸监控" :titleTips="nucleicData.titleTips" :list="nucleicData.list" />
    <div class="chart">
      <pie-chart :data="chartData" :series="seriesData" type="bar" :hideFooter="false" />
    </div>
  </div>
</template>

<script>
import { getMoniterCount } from "@/api/allDataTotal.js";
import DataPanel from "@/components/allDataTotal/dataPanel.vue";
import PieChart from "@/components/allDataTotal/chart/pieChart.vue";
import {StreetList} from "@/config/setting";
import {getPageCodeScanDetail} from "@/api/epidemicM";
export default {
  name: "moniter-panel",
  components: {
    DataPanel,
    PieChart,
  },
  data() {
    return {
      codeData: {
        list: [
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人", bgColor: "red" },
            { name: "总人口", value: 0, unit: "人", bgColor: "yellow" },
          ],
        ],
      },
      vaccineData: {
        list: [
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
        ],
      },
      nucleicData: {
        list: [[{ name: "总人口", value: 0, unit: "人" }]],
      },
      chartData: {
        title: {
          text: "肉菜市场统计",
        },
        xAxis: [
          {
            type: "value",
          },
        ],
        yAxis: [
          {
            data: [
              "鸡蛋类",
              "食用油类",
              "大米类",
              "其他类",
              "水产类",
              "蔬菜类",
              "肉类",
            ],
            type: "category",
          },
        ],
        series: [
          {
            data: [2148, 5165, 19442, 22457, 25154, 32316, 33017],
            type: "bar",
          },
        ],
        updateTime: "2022-06-01 19:36:17",
      },
      seriesData: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const moniter = await getMoniterCount();
      let  dialogConfig = {
        requestName: getPageCodeScanDetail,
        tableKeys: [
          {
            id: "xm",
            label: "姓名",
            isFilter: true,
            type: 'input',
          },
          {
            id: "lxfs",
            label: "联系方式",
          },
          {
            id: "zjhm",
            label: "证件号码",
            isFilter: true,
            type: 'input',
          },
          {
            id: "jkmlx",
            label: "健康码类型",
            isFilter: true,
            type: 'input',
          },
          {
            id: "csmc",
            label: "场所名称",
            isFilter: true,
            type: 'input',
          },
          {
            id: "xxdz",
            label: "详细地址",
          },
          {
            id: "jldcsj",
            label: "记录导出时间",
          },
        ]
      }
      this.codeData = {
        list: [
          [
            {
              name: "昨日扫码总数",
              value: moniter.codeScan.ytdCodeScanNum,
              unit: "人次",
            },
            {
              name: "红码人员总数",
              value: moniter.codeScan.redCodeNum,
              unit: "人次",
              bgColor: "red",
              dialogConfig: {
                ...dialogConfig,
                title: '红码人员扫码记录明细',
                fixedRequestData: {
                  condition: { jkmlx: "红码", }
                }
              },
            },
            {
              name: "黄码人员总数",
              value: moniter.codeScan.yellowCodeNum,
              unit: "人次",
              bgColor: "yellow",
              dialogConfig: {
                ...dialogConfig,
                title: '黄码人员扫码记录明细',
                fixedRequestData: {
                  condition: { jkmlx: "黄码", }
                }
              },
            },
          ],
        ],
        titleTips: [
            "1、昨日扫码总数：扫码数据含穗康码扫码记录与微警扫码记录，该数据定期从区视频共享平台对接到本系统；",
            "2、红黄码人员：红黄码人员指扫码人员进行扫码时，健康码类型为红码/黄码的人员；",
            "3、更新时间：2022-11-23 18:12:22；",
            "4、数据来源：区视频共享平台。"
        ]
      };
      (this.vaccineData = {
        list: [
          [
            {
              name: "累计接种",
              value: moniter.vaccines.cumulativeVaccination,
              unit: "万剂次",
            },
            {
              name: "全程免疫接种数",
              value: moniter.vaccines.vaccinationNum,
              unit: "万人",
            },
            {
              name: "全程疫苗接种率",
              value: moniter.vaccines.vaccinationRate,
              unit: "%",
            },
          ],
        ],
        titleTips: [
            "1、疫苗接种数来源于在后台管理系统”废苗接种每日全市排名情况“模块上传xls已经计算好的统计数和接种率，每天统计更新一次，本平台不做数据清洗加工；",
            "2、累计接种（万剂次）：是统计时间当天全南沙区累计接种万剂次；",
            "3、全程疫苗接种率:“全人群全程接种数 /全区常住人口总数 X100%；",
            "4、统计时间：" + moniter.vaccines.lastUpdateTime,
            "5、数据来源：区卫生健康局。"
        ]
        }),
        (this.nucleicData = {
          list: [
            [
              {
                name: "昨日核酸检测总人次",
                value: moniter.nucleicAcid.ytdSamplingNum,
                unit: "人次",
              },
            ],
          ],

        titleTips: [
            "1、昨日核酸检测总人次以“核酸采样时间”属于昨日的统计为准；",
            "2、核酸数据定期通过区共享平台对接到本系统；",
            "3、更新时间：2022-11-23 18:17:26；",
            "4、数据来源：区共享平台。"
        ]
        });

        this.seriesData = moniter.nucleicAcid
    },
  },
};
</script>

<style lang="scss" scoped>
.moniter-panel {
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  .chart {
    margin-top: 20px;
    height: 300px;
  }
}
</style>
