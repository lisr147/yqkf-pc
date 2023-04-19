<!-- 新增、编辑、查看详细数据-->
<template>
  <el-dialog
    :visible="true"
    top="4vh"
    :title="title"
    append-to-body
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="600px"
  >
    <el-tabs v-if="[12129].includes(tableId)" class="tab-box" v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="item.label" :name="item.label" v-for="(item,index) in tabList" :key="index"></el-tab-pane>
    </el-tabs>
    <div class="editForm">
      <el-form
        :model="dataForm"
        ref="dataForm"
        label-width="140px"
        v-if="dataType"
      >
        <template v-for="item in this.optionsKeys">
          <!-- {{item.storeFiled}} -->

          <el-form-item
            v-if="item.header&&item.storeFiled!=='ztlx'"
            v-show="isShow(item)"
            :key="item.storeFiled"
            :label="item.fieldName"
            :prop="item.storeFiled"
            :rules="{
              required: dataType[item.storeFiled].required || false,
              validator: validateRule,
              trigger: 'change',
            }"
          >
            <span v-if="type === 'view'" class="view">{{
              dataForm[item.storeFiled] || "暂无数据"
            }}</span>
            <template
              v-else-if="
                templateSpecial[tableId] &&
                  templateSpecial[tableId][item.storeFiled]
              "
            >
              <el-select
                v-if="
                  templateSpecial[tableId][item.storeFiled].type === 'select'
                "
                v-model="dataForm[item.storeFiled]"
                placeholder="请选择"
                @change="handleChange"
              >
                <el-option
                  v-for="(option,index) in templateSpecial[tableId][item.storeFiled]
                    .options"
                  :key="tableId + item.storeFiled + index"
                  :label="option.label|| option"
                  :value="option.value || option"
                />
              </el-select>
            </template>
            <template v-else-if="item.fieldType === 'date'">
              <el-date-picker
                v-model="dataForm[item.storeFiled]"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"

              />
            </template>
            <template v-else-if="item.fieldType === 'datetime'">
              <el-date-picker
                v-model="dataForm[item.storeFiled]"
                type="datetime"
                placeholder="选择日期时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="type !== 'new' && !dataType[item.storeFiled].editable"
              />
            </template>
            <template
              v-else-if="
                item.fieldName.includes('类别') &&
                  optionsKeys[0].fieldName.includes('出入口')
              "
            >
              <el-select v-model="dataForm[item.storeFiled]">
                <el-option label="区出入口" value="区出入口"></el-option>
                <el-option label="镇街出入口" value="镇街出入口"></el-option>
                <el-option label="高速出入口" value="高速出入口"></el-option>
              </el-select>
            </template>
            <template v-else-if="item.fieldName.includes('主体类型')&&type==='new'" >
              <el-input disabled  v-model="dataForm.ztlx"></el-input>
            </template>
            <!--流调信息-重点场所-环境信息-->
            <condition-setter v-else-if="['hjxx'].includes(item.storeFiled)" v-model="dataForm[item.storeFiled]"/>
            <el-input
              v-else
              v-model="dataForm[item.storeFiled]"
              :disabled="type !== 'new' && !dataType[item.storeFiled].editable || item.fieldName.includes('许可证发放日期')&&!hasXkz"
              placeholder="请输入"
              :type="item.storeFiled==='czsjx'?'textarea':''"
              :rows="item.storeFiled==='czsjx'?5:1"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button v-if="type !== 'view'" type="primary" @click="save"
        >保存</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
// import moment from 'moment'
import ConditionSetter from "./ConditionSetter";
import {getAllGlsj, getAllGlbl} from "@/api/epidemiologicalSurvey";
import {addInspector, updateInspector} from '@/api/PopulaStat'
export default {
  name: "ImportDataEdit",
  components: {ConditionSetter},
  props: ["keys", "data", "type", "tableId",'ztlxType','sszjList'],
  data() {
    return {
      dataForm: {},
      dataType: null, // 数据类型校验
      hasXkz:false,
      templateSpecial: {
        6006:{
          sszj:{
            type:'select',
            options:[
              '南沙街','珠江街','龙穴街','大岗镇','榄核镇','黄阁镇','东涌镇','横沥镇','万顷沙镇'
            ]
          },
          zjlx: {
            type: "select",
            options: ['居民身份证','护照','台湾居民来往内地通行证（俗称台胞证）','港澳台居民居住证','港澳居民来往内地通行证（俗称回乡证）','出生医学证明','外国人永久居留身份证']
          },
          jobState: {
            type: "select",
            options: ['在岗','放假']
          },
        },
        10001: {
          sszj:{
            type:'select',
            options:[
              '南沙街道','珠江街道','龙穴街道','大岗镇','榄核镇','黄阁镇','东涌镇','横沥镇','万顷沙镇'
            ]
          },
          sfjwsrbl: {
            type: "select",
            options: ["是", "否"],
          },
          mjlx: {
            type: "select",
            options: ["密切接触者", "密接的密接"],
          },
          xb: {
            type: "select",
            options: ["男", "女"],
          },
          zjlx: {
            type: "select",
            options: [
              "内地居民身份证",
              "护照",
              "港澳居民来往内地通行证",
              "港澳居民居住证",
              "其他",
            ],
          },
          zy: {
            type: "select",
            options: [
              "幼托儿童",
              "散居儿童",
              "学生",
              "教师",
              "保育员及保姆",
              "餐饮食品业",
              "商业服务",
              "工人",
              "民工",
              "牧民",
              "渔(船)民",
              "干部职员",
              "离退人员",
              "家务待业",
              "医护人员",
              "不详",
              "其他",
            ],
          },
          sfrjry: {
            type: "select",
            options: ["是", "否"],
          },
          jcfs: {
            type: "select",
            options: [
              "同餐",
              "同住",
              "同屋",
              "同床",
              "同室工作学习",
              "同机/车",
              "诊疗",
              "护理",
              "同病房",
              "娱乐活动",
              "其他",
            ],
          },
          fxtj: {
            type: "select",
            options: ["主动甄别", "外省协查", "本省外市协查", "本市外区协查"],
          },
          yxgcfs: {
            type: "select",
            options: ["居家", "集中", "医院隔离", "不详"],
          },
          sfjcyxgc: {
            type: "select",
            options: ["是", "否"],
          },
          gz: {
            type: "select",
            options: ["继续观察", "转为确诊", "转为阳性", "解除观察"],
          },
        },
        10089: {
          sszj:{
            type:'select',
            options:[
              '南沙街','珠江街','龙穴街','大岗镇','榄核镇','黄阁镇','东涌镇','横沥镇','万顷沙镇'
            ]
          },
          zgbm:{
            type:'select',
            options: ['区住建局（质监站）', '区水务局', '市港务局海港分局', '南沙供电局', '其他'],
          },
          xkz:{
            type:'select',
            options: ['有许可证', '无许可证'],
          },
          jsdwmc:{
            type:'select',
            options: ['产业园管理局', '建设中心','明珠湾管理局', '土发中心']
          }
        },
        10091: {
          dwlx: {
            type: "select",
            options: ['区直机关事业、法人、单位', '国企', '各镇街']
          },
          zjlx: {
            type: "select",
            options: ['居民身份证','护照','台湾居民来往内地通行证（俗称台胞证）','港澳台居民居住证','港澳居民来往内地通行证（俗称回乡证）','出生医学证明','外国人永久居留身份证']
          },
          jobState: {
            type: "select",
            options: ['在岗','放假']
          },
        },
        10097: {
          //流调信息-密接次密接人员
          glbl: {
            //关联病例
            type: 'select',
            options: []
          },
          glsj: {
            //关联事件
            type: 'select',
            options: []
          }
        },
        10098: {
          //流调信息-重点场所
          glbl: {
            //关联病例
            type: 'select',
            options: []
          },
          glsj: {
            //关联事件
            type: 'select',
            options: []
          }
        },
        10181: {
          dylb: {
            type: 'select',
            options: ['A类党员', 'B类党员','C类党员','D类党员','E类党员']
          },
          dylx: {
            type: 'select',
            options:  ['出国留学', '其他','退休','在职']
          }
        }
      },
      tabList: [
        { label: '基本信息'},
        { label: '涉疫情况' },
        { label: '隔离转归情况'},
        { label: '管控确认信息'},
      ],
      activeName: '基本信息',
      optionsKeys:[]
    };
  },
  computed: {
    title() {
      let type = {
        edit: "编辑",
        new: "新建",
        view: "查看",
      };
      let name = this.tableId === "10001" ? "人员" : "数据";
      return `${type[this.type]}${name}`;
    },
  },
  watch:{
    async 'dataForm.glsj'(newVal){
      if([10098].includes(this.tableId)){
         const glblList = await getAllGlbl(newVal)
         const glblListOpts = glblList.map(v=>{
           return {
             label: v.value,
             value: v.value
           }
         })
         this.templateSpecial[this.tableId].glbl.options = glblListOpts
         this.dataForm.glbl = '';
      }
    }
  },
  async mounted() {
    if([10097,10098].includes(this.tableId)) await this.initFormItem()
    this.dataType = {};
    this.optionsKeys = Object.assign([],this.keys)
    if(this.tableId===12129) this.initKeys()
    this.keys.forEach((v) => {
      if (!v.fieldName) {
        return;
      }
      this.dataType[v.storeFiled] = v;
      let data = this.data ? this.data[v.storeFiled] || "" : "";
      this.$set(this.dataForm, v.storeFiled, this.type === "new" ? "" : data);
      if(this.ztlxType)  this.dataForm.ztlx =this.ztlxType
      if( v.fieldName ==='许可证'&& data === '有许可证'){
        this.hasXkz = true
      }
    });
  },
  methods: {
    handleChange(value) {
      if(value=== '有许可证'){
        this.hasXkz = true
      }else {
        this.hasXkz = false
        this.dataForm.xkzffrq= ''
      }
    },
    validateRule(rule, value, callback) {
      // console.log(rule, value, this.dataType[rule.field])
      let dataType = this.dataType[rule.field];
      if (dataType.required && !(value + "").trim()) {
        return callback(new Error("请输入内容"));
      }
      if (!value) {
        return callback();
      }
      // 数据类型判断
      if (rule.fieldType === "int" && isNaN(value)) {
        return callback(new Error("请输入数值"));
      }
      if (dataType.fieldType === "double" && isNaN(value)) {
        return callback(new Error("请输入数值"));
      }
      if (dataType.fieldType === "date" && !new Date(value).getTime()) {
        return callback(new Error("请输入正确的日期，格式2020-01-01"));
      }
      if (dataType.fieldType === "time" && !new Date(value).getTime()) {
        return callback(new Error("请输入正确的时间，格式2020-01-01 00:00:00"));
      }

      return callback();
    },
    async save() {
      await this.$refs.dataForm.validate();
      let data = JSON.parse(JSON.stringify(this.dataForm));
      for (let i in data) {
        if (data[i] && typeof data[i] === "string") {
          data[i] = data[i].trim();
        }
        // if (!this.dataType[i]?.editable) {
        //   delete data[i];
        // }
      }
      delete data.creator;
      delete data.creatorName;
      delete data.updateTime;
      delete data.createTime;
      if(this.ztlxType) data.ztlx =this.ztlxType
      if (this.type === "new") {
        if (this.tableId === 12139) {
          await addInspector(data)
        }else {
          await this.$Api().ImportDataController.post_data.request({
            data: data,
            path: {
              templateId: this.tableId,
            },
          });
        }

      }
      if (this.type === "edit") {
        if (this.tableId === 12139) {
          data.id = this.data.id
          await updateInspector(data)
        }else {
          await this.$Api().ImportDataController.put_data.request({
            data: data,
            path: {
              id: this.data.id,
            },
          });
        }
      }
      this.$emit("update");
      this.$emit("close");
    },
    selectHotel(val) {
      this.dataForm.jdmc = this.hotelList.filter((v) => v.id === val)[0].jkgcjd;
    },
    isShow({storeFiled,editable}){
      //轨迹id 流调id不可编辑
      if ([10097].includes(this.tableId) && ['gjid', 'ldId'].includes(storeFiled)) {
        return false
      } else if([10089, 10098, 10125, 12124, 10123, 10122].includes(this.tableId)&&!editable){
        return false
      }
      else {
        return true
      }
    },

    async initFormItem(){

      //关联事件
      const glsjList = await getAllGlsj()
      const glsjListOptions = glsjList.map(v=>{
        return {
          label: v.sjmc,
          value: v._id
        }
      })
      this.templateSpecial[10097].glsj.options = glsjListOptions
      this.templateSpecial[10098].glsj.options = glsjListOptions

      //关联病例
      const glblList = await getAllGlbl()
      const glblListOpts = glblList.map(v=>{
        return {
          label: v.value,
          value: v.value
        }
      })
      this.templateSpecial[10097].glbl.options = glblListOpts
      this.templateSpecial[10098].glbl.options = glblListOpts
    },
    handleTabClick(tab,event){
      this.activeName = tab.label
      this.initKeys()
    },
    // 有tab切换处理
    initKeys(){
      let newKeys = []
      switch (this.activeName) {
        case '基本信息':
          newKeys = this.keys.filter(v=>['name','sex','age','phone','identityNum','job', 'isMedicalStaff','areaName','streetName',
            'communityName','currentLocation','curLiveAddress','workUnit','healthRisksState','controlStatus'].includes(v.storeFiled))
          break
        case '涉疫情况':
          newKeys = this.keys.filter(v=>['closeContactDegree','discoveryPath','isExclude','closeContactDate','contactRiskType','suggestMonitorCase',
            'relatedCases', 'patientRelation','relationType', 'contactAddress','contactWay','trafficTool','relatedKeySite','contactFrequency',
            'contactLastDate','liftObservationEstimatedDate'].includes(v.storeFiled))
          break
        case '隔离转归情况':
          newKeys = this.keys.filter(v=>['isTrace','observationStartTime','medicalObservationMode','medicalObservationSite',
            'homeQuarantineReason', 'dcbIsSingleRoom', 'dcbStartTime','dcbEndTime','isLiftMedicalObservation',
            'liftObservationRealDate','isOnset','onsetDate','onsetSymptoms','turnOver'].includes(v.storeFiled))
          break
        case '管控确认信息':
          newKeys = this.keys.filter(v=>['isControlInArea','locationDetail','unableDetermineReason','controlMeasures','isolationSite','homeIsolationReason',
            'isSingleRoom','remark','isolationStartTime', 'isolationEstimateEndTime','isolationRealEndTime','endIsolation'].includes(v.storeFiled))
          break
      }
      this.optionsKeys = newKeys
    },
  },
};
</script>
<style lang="scss" scoped>
.view {
  // border-bottom: 1px solid $input-border-color;
  width: 100%;
  display: inline-block;
  // color: $font-color;
}
</style>
