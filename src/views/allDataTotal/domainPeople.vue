<template>
  <div class="domain-panel">
    <data-panel :list="domainData.list" />
    <div class="chart">
      <bar-chart :data="chartData" :series="series" type="bar" :hideFooter="false" />
    </div>
  </div>
</template>

<script>
import { getDomainCount } from '@/api/allDataTotal.js'
import DataPanel from "@/components/allDataTotal/dataPanel.vue";
import BarChart from "@/components/allDataTotal/chart/barChart.vue";
import {PeopleStatusList, StreetList} from "@/config/setting";
import {getHsFullScreenDetail} from "@/api/keyIndustryStat";
export default {
  name: "domain-people",
  components: {
    DataPanel,
    BarChart,
  },
  data() {
    return {
      series: {},
      domainData: {
        list: [
          [
            { name: "总人口", value: 0, unit: "人", bgColor: 'orange' },
            { name: "总人口", value: 0, unit: "人", bgColor: 'orange' },
          ],
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
        ],
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
            data: [],
            type: "category",
          },
        ],
        series: [
          {
            data: [],
            type: "bar",
          },
        ],
        updateTime: "2022-06-01 19:36:17",
      },
    };
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    async getData(){
      const domain = await getDomainCount()
      let  dialogConfig = {
        requestName: getHsFullScreenDetail,
        tableKeys: [
          {
            id: "xm",
            label: "姓名",
            isFilter: true,
            type: 'input',
          },
          {
            id: "sjhm",
            label: "联系方式",
          },
          {
            id: "sfzjhm",
            label: "证件号码",
            isFilter: true,
            type: 'input',
          },
          {
            id: "sszj",
            label: "所属镇街",
            isFilter: true,
            type: 'select',
            options: StreetList
          },
          {
            id: "jzdz",
            label: "详细居住地址",
          },
          {
            id: "qymc",
            label: "企业名称",
            isFilter: true,
            type: 'input',
          },
          {
            id: "rylb",
            label: "人员类别",
            isFilter: true,
            type: 'input',
          },
          {
            id: "zgzt",
            label: "在岗状态",
          },
          {
            id: "jychscysj",
            label: "近一次核酸采样时间",
            width: 160
          },
          {
            id: "jychsjcsj",
            label: "近一次核酸检测时间",
            width: 160
          },
          {
            id: "jychsjcjg",
            label: "近一次核酸结果",
          },

        ]
      }
      this.domainData = {
        list: [
          [
            {
              name: "重点行业在岗人员",
              value: domain.zgrs,
              unit: "人",
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: { zgzt: '在岗' }
                }
              },
              bgColor: 'orange'
            },
            {
              name: "重点行业放假人员",
              value: domain.fjrs,
              unit: "人",
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: { zgzt: '放假' }
                }
              },
              bgColor: 'orange'
            },
          ],
          [
            {
              name: "今日未做核酸人数",
              value: domain.jrwzhsrs,
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: { sjxz: 'jt', property: 'whsjcrs' }
                }
              },
              unit: "人"
            },
            {
              name: "近3天未做核酸人数",
              value: domain.j3twzhsrs,
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: { sjxz: 'j3t', property: 'whsjcrs' }
                }
              },
              unit: "人"
            },
            {
              name: "近7天未做核酸人数",
              value: domain.j7twzhsrs,
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: { sjxz: 'j7t', property: 'whsjcrs' }
                }
              },
              unit: "人"
            },
          ],
        ],
      }

      domain.list.forEach(e => {
        this.chartData.yAxis[0].data.push(e.sszj)
        this.chartData.series[0].data.push(e.gzrysl)
        this.series = {
          yAxis: [{data: this.chartData.yAxis[0].data}],
          series: [{data: this.chartData.series[0].data}],
        }
      })

    }
  }
};
</script>

<style lang="scss" scoped>
.domain-panel {
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  .chart {
    height: 315px;
  }
}
</style>
