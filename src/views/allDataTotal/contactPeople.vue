<template>
  <div class="contact-panel">
    <div class="number-panel">
      <!-- <div class="filter">
        <div
          class="filter-option"
          v-for="(item, index) in options"
          :key="index"
          :class="(activeIndex === index ? 'active' : '')"
          @click="handleClick(index)"
        >
          {{ item.text }}
        </div>
      </div> -->

      <data-panel
        :list="contactData.list"
        :updateTime="contactData.updateTime"
        :source="contactData.source"
        :tipsInline="true"
      />
    </div>
    <div class="chart-panel">
      <div class="chart1">
        <ring-chart :series="series" />
      </div>
      <div class="chart2">
        <strip-chart :data="chartData" :series="series" type="bar" :hideFooter="true" />
      </div>
    </div>
  </div>
</template>

<script>
import {getConnectionCountstatistics, getContactCount, getConnectionCountList} from '@/api/allDataTotal'
import DataPanel from "@/components/allDataTotal/dataPanel.vue";
import RingChart from "@/components/allDataTotal/chart/ringChart.vue";
import StripChart from "@/components/allDataTotal/chart/stripChart.vue";
import {StreetList, PeopleStatusList} from "@/config/setting";
export default {
  name: "contact-people",
  components: {
    DataPanel,
    RingChart,
    StripChart,
  },
  props: {},
  data() {
    return {
      series: {},
      activeIndex: 0,
      options: [
        {
          text: "密切接触者",
          value: "contact",
        },
        {
          text: "密接的密接",
          value: "sec-contact",
        },
      ],
      contactData: {
        list: [
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
        ],
        // source: "卫健委",
        // updateTime: "2022-11-18 11:18:16",
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
    };
  },
  mounted() {
    this.getData()
    this.getBarChartData()
  },
  methods: {
    async getData(){
      const contact = await getConnectionCountstatistics()

        let settedData = {}
        if (this.activeIndex === 0){
            contact.密接接触者.forEach(e=>{
                settedData[e.name] = e.value
            })
        }
        else {
            contact.密接的密接.forEach(e=>{
                settedData[e.name] = e.value
            })
        }

      let  dialogConfig = {
        requestName: getConnectionCountList,
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
            id: "ssxxdz",
            label: "目前所在位置",
          },
          {
            id: "ryzt_label",
            label: "管控确认状态",
            formatter(row) {
              let current = PeopleStatusList.find(e => e.value === row.ryzt)
              if (current) {
                return current.label
              }else {
                return ''
              }
            }
          },
          {
            id: "relatedCases",
            label: "关联病例",
            isFilter: true,
            type: 'input',
          },
          {
            id: "relatedSite",
            label: "关联重点场所",
          },
          {
            id: "patientRelation",
            label: "与患者/密接关系",
          },
          {
            id: "contactLastDate",
            label: "最后接触时间",
          },
          {
            id: "medicalObservationMode",
            label: "医学观察方式",
          },
          {
            id: "medicalObservationSite",
            label: "医学观察场所名称",
          },
        ]
      }
      let list = [
        [
          {
            name: "累计密切接触者",
            value: settedData.累计密切接触者,
            unit: "人",
            dialogConfig: {
              ...dialogConfig,
              fixedRequestData: {
                condition: {
                  property: '累计密切接触者'
                }
              }
            },
          },
          {
            name: "现有密切接触者",
            value: settedData.现有密切接触者,
            unit: "人",
            dialogConfig: {
              ...dialogConfig,
              fixedRequestData: {
                condition: {
                  property: '现有密切接触者'
                }
              }
            },
            bgColor: "red"
          },
          {
            name: "待确认",
            value: settedData.待确认,
            dialogConfig: {
              ...dialogConfig,
              fixedRequestData: {
                condition: {
                  property: '待确认'
                }
              }
            },
            unit: "人"
          },
        ],
        [
          {
            name: "已确认待转运",
            value: settedData.已确认待转运,
            unit: "人",
            dialogConfig: {
              ...dialogConfig,
              fixedRequestData: {
                condition: {
                  property: '已确认待转运'
                }
              }
            },
          },
          {
            name: "已确认非本市",
            value: settedData.已确认非本市,
            unit: "人",
            dialogConfig: {
              ...dialogConfig,
              fixedRequestData: {
                condition: {
                  property: '已确认非本市'
                }
              }
            },
          },
          {
            name: "已确认管控中",
            value: settedData.已确认管控中,
            unit: "人",
            dialogConfig: {
              ...dialogConfig,
              fixedRequestData: {
                condition: {
                  property: '已确认管控中'
                }
              }
            },
          },
        ],
        [
          {
            name: "已确认结束管控",
            value: settedData.已确认结束管控,
            unit: "人",
            dialogConfig: {
              ...dialogConfig,
              fixedRequestData: {
                condition: {
                  property: '已确认结束管控'
                }
              }
            },
          },
          {
            name: "无需管控",
            value: settedData.无需管控,
            unit: "人",
            dialogConfig: {
              ...dialogConfig,
              fixedRequestData: {
                condition: {
                  property: '无需管控'
                }
              }
            },
          },
          {
            name: "无法落地",
            value: settedData.无法落实,
            unit: "人",
            dialogConfig: {
              ...dialogConfig,
              fixedRequestData: {
                condition: {
                  property: '无法落实'
                }
              }
            },
          },
        ],
      ].map(item => {
        return item.map(v => {
          return {
            ...v,
            dialogConfig: {...v.dialogConfig, title: `${v.name.replace('累计','所有')}密切接触者明细`}
          }
        })
      })
      this.contactData = {
        list
        // source: "卫健委",
        // updateTime: "2022-11-18 11:18:16",
      }
    },
    async getBarChartData() {
        const res = await getContactCount()
        this.series = {
            yAxis : res.xAxis[0].data,
            series : res.series[0].data
        }
    },
    handleClick(index){
        this.activeIndex = index
        this.getData()
    }
  }
};
</script>

<style lang="scss" scoped>
.contact-panel {
  display: flex;

  .number-panel {
    padding-top: 32px;
    flex: 1;
    position: relative;

    .filter {
      margin: -4px 0 16px 0;
      display: flex;
      padding: 0;

      &-option {
        padding: 7px 24px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 22px;
        background: #223e7e;
        border-radius: 4px 0 0 4px;
        border: 1px solid #5166ff;
        cursor: pointer;
      }
      &-option:last-child {
        border-radius: 0 4px 4px 0;
      }
      .active {
        background: #5166ff;
      }
    }
    &:before {
      content: "";
    }
  }

  .chart-panel {
    flex: 1;
    display: flex;
    .chart1 {
      flex: 1;
      margin-top: 40px;
    }
    .chart2 {
      height: 300px;
      flex: 1;
    }
  }
}
</style>
