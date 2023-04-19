<template>
  <div class="community-panel">
    <data-panel :list="communityData.list" />

    <div class="chart">
      <bar-chart :data="chartData" :series="series" type="bar" :hideFooter="false" />
    </div>
  </div>
</template>

<script>
import {getCommunityCount, getCommunityChart, getRedCountList} from '@/api/allDataTotal.js'
import DataPanel from "@/components/allDataTotal/dataPanel.vue";
import BarChart from "@/components/allDataTotal/chart/barChart.vue";
import { StreetList } from "@/config/setting";
export default {
  name: "community-people",
  components: {
    DataPanel,
    BarChart
  },
  data() {
    return {
      series: {},
      communityData: {
        list: [
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人", bgColor: 'yellow' }
          ],
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" }
          ]
        ]
      },
      chartData: {
        title: {
          text: "肉菜市场统计"
        },
        xAxis: [
          {
            type: "value"
          }
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
              "肉类"
            ],
            type: "category"
          }
        ],
        series: [
          {
            data: [2148, 5165, 19442, 22457, 25154, 32316, 33017],
            type: "bar"
          }
        ],
        updateTime: "2022-06-01 19:36:17"
      }
    };
  },
  mounted() {
    this.getData()
    this.getChartData()
  },
  methods: {
    async getData(){
      const community = await getCommunityCount()
      let settedData = {}
      community.forEach(e=>{
          settedData[e.name] = e.value || e.count
      })
      let  dialogConfig = {
        requestName: getRedCountList,
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
            id: "sfzhm",
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
            id: "szxxdz",
            label: "详细居住地址",
          },
          {
            id: "ryzt",
            label: "人员状态"
          },
          {
            id: "updateTime",
            label: "更新时间",
          },
        ]
      }
      this.communityData = {
        list: [
          [
            { name: "累计社区监控重点人员",
              value: settedData.累计社区监控重点人员,
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: {
                    property: '累计社区监控重点人员'
                  }
                }
              },
              unit: "人"
            },
            { name: "现有社区监控重点人员",
              value: settedData.现有社区监控重点人员,
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: {
                    property: '现有社区监控重点人员'
                  }
                }
              },
              unit: "人",
              bgColor: 'yellow'
            }
          ],
          [
            {
              name: "待核查",
              value: settedData.待核查,
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: {
                    property: '待核查'
                  }
                }
              },
              unit: "人"
            },
            {
              name: "已核查监测中",
              value: settedData.已核查监测中,
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: {
                    property: '已核查监测中'
                  }
                }
              },
              unit: "人"
            },
            { name: "待接收",
              value: settedData.待接收,
              dialogConfig: {
                ...dialogConfig,
                fixedRequestData: {
                  condition: {
                    property: '待接收'
                  }
                }
              },
              unit: "人"
            }
          ]
        ].map(item => {
          return item.map(v => {
            return {
              ...v,
              dialogConfig: {...v.dialogConfig, title: `${v.name.replace('累计','所有').replace('社区监控重点人员', '')}社区监控重点人员明细`}
            }
          })
        }),
      }
    },
    async getChartData(){
      const chartRes = await getCommunityChart()
      this.chartData.yAxis[0].data = chartRes.xAxis[0].data
      this.chartData.series[0].data = chartRes.series[0].data
      this.series = {
        yAxis: [{data: chartRes.xAxis[0].data}],
        series: [{data: chartRes.series[0].data}],
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.community-panel {
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  .chart {
    height: 315px;
  }
}
</style>
