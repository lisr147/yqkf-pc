<template>
  <div class="staff-detail-list">
    <div class="">

      <table-page
        :data="tableListData"
        :filter="filter"
        @search="search"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @resetSearch="resetSearch"
        :hideKeyFilter="true"
        ref="tablePage"
        :customClass="'staff_table'"
        :height="400">

        <template slot="searchFilter">
          <div class="search-box">
            <!--党员明细-->

            <el-form :inline="true" :model="filter" label-width="60px">
              <template v-if="cond.layerId==='party'">
                <el-form-item label="姓名">
                  <el-input style="width: 100px;" v-model="filter.xm" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别" label-width="60px">
                  <el-select v-model="filter.xb">
                    <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                  <el-input v-model="filter.nl" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="党员类别" style="margin-right:20px">
                  <el-select v-model="filter.dylb" placeholder="请选择" >
                    <el-option v-for="item in dylbList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="党员类型">
                  <el-select v-model="filter.dylx" placeholder="请选择" >
                    <el-option v-for="item in dylxList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="">
                  <el-input style="width: 240px;" v-model="filter.keyWord" placeholder="请输入姓名或身份证号码"></el-input>
                </el-form-item>
                <el-form-item label="性别" label-width="60px" style="margin:0 10px" v-if="!['email','importedMaterial'].includes(cond.layerId)">
                  <el-select v-model="filter.sex">
                    <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄" label-width="60px"  v-if="cond.layerId=='volunteer'">
                  <el-select v-model="filter.age">
                    <el-option v-for="item in ageList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </template>

        <template v-slot:column_skmStatus="row">
          <span :style="`color:${row.value.skmStatus === '3' ? '#FFFF00' : (row.value.skmStatus==='2'?'#F42A34':'#32C416') }`">
            {{row.value.skmStatus==='3'?'黄码':(row.value.skmStatus==='2'?'红码':'绿码')}}</span>
        </template>
        <template v-slot:column_jzmzt="row">
          <span :style="`color:${row.value.jzmzt === '黄码' ? '#FFFF00' : (row.value.jzmzt==='红码'?'#F42A34':'#32C416') }`">
            {{row.value.jzmzt}}</span>
        </template>
        <template v-slot:column_phoneNumber="row">
          <span v-cellphone>{{row.value.phoneNumber}}</span>
        </template>

        <template v-slot:column_lxdh="row">
          <span v-cellphone>{{row.value.lxdh}}</span>
        </template>

      </table-page>

    </div>
  </div>
</template>

<script>
  import TablePage from "zkzc-table-page";
  import TablePageFunc from "@/utils/tablepage";
  import {getCommonPeopleList} from '@/api/mapData.js'
  import {getMapLayerData} from '@/api/mapData.js'
  import {getTemplateData} from '@/api/common.js'
  import SETTING from '@/config/MapSetting.js'

  export default {
    name: "StaffDetailList",
    components: {
      TablePage
    },
    props: {
      cond: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    mixins: [TablePageFunc],
    watch: {
      cond(val) {
        this.getData()
      }
    },
    data() {
      return {
        filter: {
          keyWord: null,
          sex: null,
          age: null,
          pageNum: 1,
          pageSize: 15,
          rowTotal: 1,
          pageSizes: [15, 50, 100, 200],
          xm:null,
          xb:null,
          nl:null,
          dylb:null,
          dylx:null,
        },
        tableListData: {
          selection: false,
          tableData: [],
          tableKeys: (function(cond){

            let res = [
              {id: 'name', label: '姓名',width: 80},
              {id: 'phoneNumber', label: '手机号码',width: 100},
              {id: 'idcard', label: '身份证号码',width: 150},
              {id: 'address', label: '住址',minWidth: 150},
            ]

            switch(cond.layerId){

              case 'coldWarehouse':
                res = res.concat([
                  {id: 'sex', label: '性别',width: 80},
                  {id: 'coldChainWarehouse', label: '所属冷链仓库',minWidth: 200},
                  {id: 'skmStatus', label: '健康码状态', width: 120},
                  {id: 'nucleicAcidResult', label: '最近一次核酸检测结果',width: 200},
                  {id: 'nucleicAcidTime', label: '最近一次核酸检测时间',width: 200},
                ])
                break;
              case 'driverWorkPoint':
                res = res.concat([
                  {id: 'sex', label: '性别',width: 80},
                  {id: 'visitingPlace', label: '来访地'},
                  {id: 'driverOperationPoint', label: '跨境司机作业点',minWidth: 150},
                  {id: 'skmStatus', label: '健康码状态', width: 120},
                  {id: 'nucleicAcidResult', label: '最近一次核酸检测结果',width: 200},
                  {id: 'nucleicAcidTime', label: '最近一次核酸检测时间',width: 200},
                ])
                break;
              case 'transitWarehouse':
                res = res.concat([
                  {id: 'sex', label: '性别',width: 80},
                  {id: 'logisticsTransitWarehouse', label: '所属物流中转仓库名称', minWidth: 160},
                  {id: 'deliveryPersonnelSource', label: '派送人员来源', minWidth: 140},
                  {id: 'skmStatus', label: '健康码状态', width: 120},
                  {id: 'nucleicAcidResult', label: '最近一次核酸检测结果',width: 200},
                  {id: 'nucleicAcidTime', label: '最近一次核酸检测时间',width: 200},
                ])
                break;
              case 'volunteer':
                res = res.concat([
                  {id: 'age', label: '年龄',width: 80},
                  {id: 'isDy', label: '是否党员',width: 120},
                  {id: 'skmStatus', label: '健康码状态', width: 120},
                  {id: 'nucleicAcidResult', label: '最近一次核酸检测结果',width: 200},
                  {id: 'nucleicAcidTime', label: '最近一次核酸检测时间',width: 200},
                ])
                break;
              case 'email':
                res = res.concat([
                  {id: 'gzlx', label: '工作类型',width: 80},
                  {id: 'hsjcsj', label: '核酸检测情况(检测时间、结果)',width: 150},
                  {id: 'szxxdz', label: '工作地点',width: 150},
                  {id: 'ymjzsj', label: '疫苗接种情况(接种时间)',width: 180},
                  {id: 'mtcl', label: '每天处理快件数量',width: 150},
                ])
                break;
              case 'importedMaterial':
                res = [
                  {id: 'ygxm', label: '姓名',width: 80},
                  {id: 'sfzhm', label: '身份证号码',width: 150},
                  {id: 'fgsj', label: '复工时间',minWidth: 150},
                  {id: 'fgsfhsjc', label: '复工是否核酸检测',minWidth: 150},
                  {id: 'fgjcsj', label: '复工检测时间',minWidth: 150},
                  {id: 'sfjzdyz', label: '是否接种第一针',minWidth: 150},
                  {id: 'sfjzdrz', label: '是否接种第二针',minWidth: 150},
                  {id: 'sfjzjqz', label: '是否接种加强针',minWidth: 150},
                  {id: 'qylxr', label: '企业联系人',minWidth: 150},
                  {id: 'lxdh', label: '企业联系电话',minWidth: 150},
                ]
                break;
              case 'party':
                res = [
                  {id: 'xm', label: '姓名',width: 80},
                  {id: 'xb', label: '性别',width: 80},
                  {id: 'nl', label: '年龄',width: 80},
                  {id: 'sjhm', label: '手机号码',width: 100},
                  {id: 'sfzhm', label: '身份证号码',width: 150},
                  {id: 'szxxdz', label: '居住地地址',minWidth: 150},
                  {id: 'dzbmc', label: '所属网格党支部', width: 120},
                  {id: 'dxzmc', label: '所属网格党小组', width: 120},
                  {id: 'dytjdmc', label: '所在党员突击队', width: 120},
                  {id: 'dymwdmc', label: '所在党员服务队',width: 120},
                  {id: 'dylb', label: '党员类别',width: 80},
                  {id: 'dylx', label: '党员类型',width: 80},
                  {id: 'jzmzt', label: '健康码状态', width: 80},
                  {id: 'nucleicAcidResult', label: '最近一次核酸检测结果',width: 200},
                  {id: 'nucleicAcidTime', label: '最近一次核酸检测时间',width: 200},
                ]
                break;
              default:
                break;
            }


            return res

          })(this.cond),

          tableFunctions: [],
        },
        sexList: [
          {label: '不限', value: null},
          {label: '男', value: '男'},
          {label: '女', value: '女'},
        ],
        ageList: [
          {label: '不限', value: null},
          {label: '18岁-45岁', value: '18-45'},
          {label: '46岁-59岁', value: '46-59'},
        ],
        dylbList:['A类党员', 'B类党员','C类党员','D类党员','E类党员'],
        dylxList:['出国留学', '其他','退休','在职'],

      }
    },
    created() {
    },
    mounted() {
      this.$refs.tablePage.searchMoreButton = false
      this.getData()
    },
    methods: {
      async getData(){
        const { layerId,qyscmc,kjsjzydmc,sfjg,zzckmc , street, grid, qy, qymc, dzbmc} = this.cond
        // 以下图层有人员列表
        // 冷链仓库 跨境司机作业点 物业中转仓库 志愿者机构  国际进口邮件快件处理场所
        const layerSetting = SETTING.getLayerInfo(layerId)

        if (!layerSetting) {
          console.error('没有获取到图层${layerId} 的人员列表id')
          return
        }

        const {keyWord, sex, age, pageNum,pageSize} = this.filter
        var params = {
          //模板id
          // templateId: layerSetting.staffListId,
          page: pageNum,
          pageSize,
          //查询条件
          condition:{
            templateId: layerSetting.staffListId,
            searchInfo:keyWord,
            condition: {
              xb: sex ? sex : undefined,
              sszj: street,
              sswg: grid
            },
          }
        }

        var fn

        switch (layerId) {
          //党组织（党员明细）
          case 'party':
            params.templateId = '10181'
            params.condition.dzbmc = dzbmc
            Object.assign(params.condition,
              this.filter
            )
            fn = getTemplateData
            break;
          //冷链仓库
          case 'coldWarehouse':
            params.condition.condition.ssllck = qyscmc
            fn = getCommonPeopleList
            break;
          //跨境司机作业点
          case 'driverWorkPoint':
            params.condition.condition.kjsjzydmc = kjsjzydmc
            fn = getCommonPeopleList
            break;
          //物流中转仓库
          case 'transitWarehouse':
            params.condition.condition.zzckmc = zzckmc
            fn = getCommonPeopleList
            break;
          //志愿者机构
          case 'volunteer':
            params.condition.condition.sszyzjg = sfjg
            fn = getCommonPeopleList
            if(this.filter.age){
              params.condition.condition.nl = this.filter.age.split('-')
            }
            break;
          //国际进口邮件快件处理场所
          case 'email':
            params.condition.condition.qy = qy
            fn = getCommonPeopleList
            break;
          //进口物料企业
          case 'importedMaterial':
            params = {
              page: pageNum,
              pageSize,
              templateId: layerSetting.staffListId,
              condition:{
                qymc,
                searchInfo: keyWord || ''
              }
            }
            fn = getMapLayerData
            break;
          default:
            fn = getCommonPeopleList
            break;
        }
        var res = await fn(params)
        this.tableListData.tableData = res.data
        this.filter.rowTotal = res.total
      },
      resetSearch() {
        this.filter.pageNum = 1;
        this.filter.pageSize = 15
        this.filter.keyWord = null
        this.filter.sex = null
        this.filter.age = null
        this.filter.rowTotal = 1

        this.filter.xm = null
        this.filter.xb = null
        this.filter.nl = null
        this.filter.dylb = null
        this.filter.dylx = null
        // console.log(345,this.$options.data())
        this.getData();
      },
      search(){
        this.filter.pageNum = 1;
        this.getData()
      }

    }
  }
</script>

<style lang="scss" type="text/scss">
  .staff-detail-list {

    .content {
      .wrapper{
        .button-group{
          margin: 0;
        }
      }
    }
  }
</style>

