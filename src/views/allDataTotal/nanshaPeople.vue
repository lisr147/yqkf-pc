<template>
  <div class="nansha-people">
    <data-panel
      title="人口情况"
      :list="populationData.list"
      :updateTime="populationData.updateTime"
      :source="populationData.source"
      :titleTips="populationData.titleTips"
    />
    <data-panel title="重点人员情况" :list="importantData.list" />
    <data-panel title="人力资源情况" :list="resourceData.list" />
  </div>
</template>

<script>
import {
  getRenkouCount,
  getResourceCount,
  getImportantCount, getRedCountList, getConnectionCountList,
} from "@/api/allDataTotal.js";
import DataPanel from "@/components/allDataTotal/dataPanel.vue";
import {StreetList, PeopleStatusList, DylbList} from "@/config/setting";
import {getHsFullScreenDetail, getRyTypes} from "@/api/keyIndustryStat";
import { getTemplateData } from "@/api/common";
import { getDetailList } from '@/api/volunteer'
export default {
  name: "nansha-people",
  components: {
    DataPanel,
  },
  data() {
    return {
      populationData: {
        list: [
          [{ name: "总人口", value: 0, unit: "人" }],
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
        ],
        source: "卫健委",
        updateTime: "2022-11-18 11:18:16",
      },
      importantData: {
        list: [
          [{ name: "总人口", value: 0, unit: "人", bgColor: "orange" }],
          [
            { name: "总人口", value: 0, unit: "人", bgColor: "red" },
            { name: "总人口", value: 0, unit: "人", bgColor: "yellow" },
          ],
          [{ name: "总人口", value: 0, unit: "人", bgColor: "orange" }],
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
        ],
      },
      resourceData: {
        list: [
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
          [
            { name: "总人口", value: 0, unit: "人" },
            { name: "总人口", value: 0, unit: "人" },
          ],
        ],
      },
    };
  },
  async mounted() {
    await this.getDict()
    this.getData();
  },
  methods: {
    async getDict () {
      // this.ryTypeOptions = await getRyTypes(templateId);
    },
    async getData() {
      const population = await getRenkouCount();

      this.populationData = {
        list: [
          [{ name: "总人口", value: population.zrk, unit: "人" }],
          [
            { name: "户籍人口", value: population.hjrk, unit: "人" },
            { name: "常住人口", value: population.ldrk, unit: "人" },
          ],
        ],
        titleTips: [
          "总人口=户籍人口+常住人口，其他逻辑与数据取值，与大屏的“南沙实有人口报表”统计图表一致",
          "更新时间：" + population.lastUpdateTime,
          "数据来源：卫健委"
        ],
        // source: "卫健委",
        // updateTime: population.lastUpdateTime,
      };

      const resource = await getResourceCount();
      let settedresourceData = {};
      resource.forEach((e) => {
        settedresourceData[e.name] = e.value || e.count;
      });

      this.resourceData = {
        list: [
          [
            {
              name: "网格党组织",
              value: settedresourceData.网格党组织,
              unit: "人",
              tips: [
                "网格党组织：该数据由区委组织部通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新。更新时间：2022-11-23 16:21:01。",
              ],
              dialogConfig: {
                requestName: getTemplateData,
                requestData: {
                  templateId: '10018'
                },
                tableKeys: [
                  {
                    id: "dzbmc",
                    label: "网格党支部名称",
                    isFilter: true,
                    type: 'input',
                  },
                  {
                    id: "fzrxm",
                    label: "党支部书记",
                  },
                  {
                    id: "fzrlxfs",
                    label: "联系方式",
                  },
                  {
                    id: "dyrs",
                    label: "党员人数",
                  },
                  {
                    id: "sszj",
                    label: "所属镇街",
                    isFilter: true,
                    type: 'select',
                    options: StreetList
                  },
                  {
                    id: "sq",
                    label: "所属社区",
                  },
                  {
                    id: "szxxdz",
                    label: "详细地址",
                  },
                ],
              },

            },
            {
              name: "志愿者机构",
              value: settedresourceData.志愿者机构,
              unit: "人",
              tips: [
                "志愿者机构：该数据由区民政局通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新。",
              ],
              dialogConfig: {
                requestName: getTemplateData,
                requestData: {
                  templateId: '10019'
                },
                tableKeys: [
                  {
                    id: "sfjg",
                    label: "志愿者机构名称",
                    isFilter: true,
                    type: 'input',
                  },
                  {
                    id: "fzr",
                    label: "负责人",
                  },
                  {
                    id: "fzrlxdh",
                    label: "联系方式",
                  },
                  {
                    id: "zyzs",
                    label: "志愿者数",
                  },
                  {
                    id: "sszj",
                    label: "所属镇街",
                    isFilter: true,
                    type: 'select',
                    options: StreetList
                  },
                  {
                    id: "sscj",
                    label: "所属村居",
                  },
                  {
                    id: "szxxdz",
                    label: "详细地址",
                  },
                ],
              },
            },
          ],
          [
            {
              name: "三人小组",
              value: settedresourceData.三人小组,
              unit: "人",
              tips: [
                "三人小组：该数据由区委政法委（网格中心）通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新。",
              ],
              dialogConfig: {
                requestName: getTemplateData,
                requestData: {
                  templateId: '10028'
                },
                labelWidth: '140px',
                tableKeys: [
                  {
                    id: "srxzzm",
                    label: "三小组组名",
                    isFilter: true,
                    type: 'input',
                  },
                  {
                    id: "xm",
                    label: "组员姓名",
                    isFilter: true,
                    type: 'input',
                  },
                  {
                    id: "lxfs",
                    label: "联系方式",
                  },
                  {
                    id: "sszj",
                    label: "所属镇街",
                    isFilter: true,
                    type: 'select',
                    options: StreetList
                  },
                  {
                    id: "sscj",
                    label: "所属村居",
                  },
                  {
                    id: "xzxz",
                    label: "小组性质",
                  },
                  {
                    id: "jzdz",
                    label: "居住地址",
                  },
                ],
              },
            },
            {
              name: "核酸检测小组",
              value: settedresourceData.核酸检测小组,
              unit: "人",
              tips: [
                "核酸检测小组：该数据由区卫健局通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新。",
              ],
              dialogConfig: {
                requestName: getTemplateData,
                requestData: {
                  templateId: '10022'
                },
                tableKeys: [
                  {
                    id: "hsjcxz",
                    label: "核酸检测小组名称",
                    isFilter: true,
                    type: 'input',
                  },
                  {
                    id: "cydz",
                    label: "采样点长",
                  },
                  {
                    id: "cydzlxdh",
                    label: "联系方式",
                  },
                  {
                    id: "zyzs",
                    label: "志愿者数",
                  },
                  {
                    id: "cyrys",
                    label: "采样人员数",
                  },
                  {
                    id: "cygws",
                    label: "采样工位数",
                  },
                  {
                    id: "abrys",
                    label: "安保人员数",
                  },
                  {
                    id: "sszj",
                    label: "所属镇街",
                    isFilter: true,
                    type: 'select',
                    options: StreetList
                  },
                  {
                    id: "sscj",
                    label: "所属村居",
                  },
                  {
                    id: "sswg",
                    label: "所属网格",
                  },
                  {
                    id: "szxxdz",
                    label: "详细地址",
                  },
                ],
              },
            },
          ],
          [
            {
              name: "党员志愿者",
              value: settedresourceData.党员人数,
              unit: "人",
              tips: [
                `
                党员志愿者：1、党员志愿者总数为疫情防控指挥平台数据台账管理系统党员明细模块总数+志愿者明细模块中党员志愿者总数；2、党员明细由区委组织部通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新，更新时间：2022-11-23 16:21:01；3、志愿者明细由区民政局通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新，更新时间：2022-12-6 15:09:03
                `
              ],
              dialogConfig: {
                requestName: getDetailList,
                fixedRequestData: {
                  condition: {
                    isDy: 1
                  }
                },
                tableKeys: [
                  {
                    id: "sszj",
                    label: "所属镇街",
                    isFilter: true,
                    type: 'select',
                    options: StreetList
                  },
                  {
                    id: "sssq",
                    label: "所属社区",
                    type: 'input',
                    isFilter: true
                  },
                  {
                    id: "sswg",
                    label: "所属网格",
                    type: 'input',
                    isFilter: true
                  },
                  {
                    id: "xm",
                    label: "姓名",
                  },
                  {
                    id: "xb",
                    label: "性别",
                  },
                  {
                    id: "sjhm",
                    label: "联系方式",
                  },
                  {
                    id: "sfzhm",
                    label: "证件号码"
                  },
                  {
                    id: "nl",
                    label: "年龄",
                  },
                  {
                    id: "szxxdz",
                    label: "居住地地址",
                  },
                  {
                    id: "dzbmc",
                    label: "所属网格党支部",
                    type: 'input',
                    isFilter: true
                  },
                  {
                    id: "dxzmc",
                    label: "所属网格党小组",
                  },
                  {
                    id: "dymwdmc",
                    label: "所在党群服务队",
                  },
                  {
                    id: "dytjdmc",
                    label: "所在党员突击队",
                  },
                  {
                    id: "dylb",
                    label: "党员类别",
                    isFilter: true,
                    type: 'select',
                    options: DylbList
                  },
                ],
              },
            },
            {
              name: "非党员志愿者",
              value: settedresourceData.志愿者人数,
              unit: "人",
              tips: [
                `非党员志愿者：1、非党员志愿者总数为疫情防控指挥平台数据台账管理系统志愿者明细模块中非党员志愿者总数；2、志愿者明细由区民政局通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新，更新时间：2022-12-6 15:09:03。`
              ],
              dialogConfig: {
                requestName: getDetailList,
                fixedRequestData: {
                  condition: {
                    isDy: 0
                  }
                },
                tableKeys: [
                  {
                    id: "sszj",
                    label: "所属镇街",
                    isFilter: true,
                    type: 'select',
                    options: StreetList
                  },
                  {
                    id: "sssq",
                    label: "所属社区",
                    type: 'input',
                    isFilter: true
                  },
                  {
                    id: "sswg",
                    label: "所属网格",
                    type: 'input',
                    isFilter: true
                  },
                  {
                    id: "xm",
                    label: "姓名",
                  },
                  {
                    id: "xb",
                    label: "性别",
                  },
                  {
                    id: "sjhm",
                    label: "联系方式",
                  },
                  {
                    id: "sfzhm",
                    label: "证件号码"
                  },
                  {
                    id: "nl",
                    label: "年龄",
                  },
                  {
                    id: "szxxdz",
                    label: "居住地地址",
                  },
                  {
                    id: "sszyzjg",
                    label: "所属志愿者机构",
                    isFilter: true,
                    type: 'input',
                  },
                ],
              },
            },
          ],
        ],
      };

      const important = await getImportantCount();

      let settedimportantData = {};
      important.forEach((e) => {
        settedimportantData[e.name] = e.value || e.count;
      });


      this.importantData = {
        list: [
          [
            {
              name: "现有社区监控重点人员",
              value: settedimportantData.现有社区监控重点人员,
              unit: "人",
              bgColor: "orange",
              dialogConfig: {
                requestName: getRedCountList,
                fixedRequestData: {
                  condition: {
                    property: '现有社区监控重点人员'
                  }
                },
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
                    label: "人员状态",
                    // isFilter: true,
                    // type: 'input'
                  },
                  {
                    id: "updateTime",
                    label: "更新时间",
                  },
                ]
              },
              tips: [
                "社区监控重点人员：该数据通过广州市疫情防控管理系统（防疫通）对接到本系统。更新时间：2022-11-23 14:27:40。",
              ],
            },
          ],
          [
            {
              name: "现有密切接触者",
              value: settedimportantData.现有密切接触者,
              unit: "人",
              bgColor: "red",
              dialogConfig: {
                requestName: getConnectionCountList,
                fixedRequestData: {
                  condition: {
                    property: '现有密切接触者'
                  }
                },
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
                ],
              },
              tips: [
                "密切接触者：该数据通过广州市疫情防控管理系统（防疫通）对接到本系统。更新时间：2022-11-23 14:27:40。",
              ],
            },
            // {
            //   name: "现有密接的密接",
            //   value: settedimportantData.现有密接的密接,
            //   unit: "人",
            //   bgColor: "yellow",
            //   tips: [
            //     "密接的密接：该数据通过广州市疫情防控管理系统（防疫通）对接到本系统。更新时间：2022-11-23 14:27:40。",
            //   ],
            // },
          ],
          [
            {
              name: "中高风险来粤返粤人员当天专项清零数量",
              value: settedimportantData.中高风险来粤返粤人员当天专项清零数量,
              unit: "人",
              bgColor: "orange",
              dialogConfig: {
                dialogType: 'mhRiskDetail', //
              },
              tips: [
                "与大屏的“中高风险地区来粤返粤人员核查情况”统计图表的一致。",
              ],
            },
          ],
          [
            {
              name: "重点行业人员",
              value: settedimportantData.重点行业人员,
              unit: "人",
              dialogConfig: {
                requestName: getHsFullScreenDetail,
                // fixedRequestData: {
                //   condition: {
                //     zgzt: ''
                //   }
                // },
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
              },
              tips: [
                "重点行业人员：该数据由各重点行业对应委办局统筹、企业配合，通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新。",
              ],
            },
            {
              name: "特殊人群",
              value: settedimportantData.特殊人群,
              unit: "人",
              dialogConfig: {
                requestName: getTemplateData,
                requestData: {
                  templateId: '11033'
                },
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
                    id: "nl",
                    label: "年龄",
                  },
                  {
                    id: "rylb",
                    label: "人员类别",
                    isFilter: true,
                    type: 'input',
                  },
                  {
                    id: "sscj",
                    label: "所属村居",
                  },
                  {
                    id: "sswg",
                    label: "所属网格",
                    isFilter: true,
                    type: 'input'
                  },
                  {
                    id: "szxxdz",
                    label: "详细地址",
                  },
                ],
              },
              tips: [
                "特殊人群：该数据由区委政法委 (网格中心)负责、区民政局和各镇街配合，通过在疫情防控指挥平台数据台账管理系统上传数据方式每月更新。更新时间：2022-11-23 15:32:21。",
              ],
            },
          ],
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.nansha-people{
    max-height: 100%;
    overflow: auto;
}
</style>
