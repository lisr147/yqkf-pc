
<template>
  <div class="count-data-box">
    <el-dialog
      :visible="true"
      top="10vh"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="80vw"
    >
      <el-popover
        slot="title"
        placement="bottom-start"
        width="600"
        trigger="hover">
        <div>
          <template v-if="countType==='疫苗接种'">
            <p>疫苗接种：</p>
            <p>系统根据广东省疫苗流通与接种管理信息系统下发的疫苗接种数据（只含在南沙区接种的疫苗）通过人员身份证号码进行匹配。</p>
            <p>第一针可接种人数：指没有疫苗接种记录的人员数。</p>
            <p>第二针可接种人数：指已经接种第一针且已到第二针接种时间的人员数。</p>
            <p>第三针可接种人数：指已经接种第二针，按疫苗类型是需要接种第三针且已到第三针接种时间的人员数。</p>
            <p>若系统匹配到人员已接种第三针次，则默认第二针和第一针已接种；若匹配到已接种第二针次，则默认第一针已接种。</p>
          </template>
          <template v-else>
            <p>核酸检测：</p>
            <p>系统根据广东省新冠病毒检测信息系统下发的核酸检测数据（含全广州数据）通过人员身份证号码按照核酸采样时间进行匹配。若在查询的时间内查询到人员核酸采样记录，则认为已检测。</p>
          </template>
        </div>

        <span slot="reference">数据统计 ({{ this.countType }})<b class="el-icon-warning-outline"></b> </span>
      </el-popover>

      <template v-if="countType==='疫苗接种'">
        <div class="searchControl" v-if="isCommonType">
          批次：
          <el-select v-model="batchIds" placeholder="请选择批次" multiple style="margin-right:1em; width: 400px;">
            <el-option v-for="(item,index) in batchList" :label="item.label" :value="item.value"
                       :key="index"></el-option>
          </el-select>

          主体名称：
          <el-select v-model="ztIds" placeholder="请选择主体名称" multiple filterable style="margin-right:1em; width: 400px;">
            <el-option v-for="(item,index) in ztList" :label="item.label" :value="item.value"
                       :key="index"></el-option>
          </el-select>
          <el-button type="primary" @click="getCountData()">查询</el-button>
          <p style="margin: 8px 0px;" v-if="progress">
            所选主体/批次疫苗数据获取进度：{{ progress.ymtbjd || '统计中' }}
          </p>

        </div>

        <template v-if="rylb !== '旅客'">
          <el-button type="primary" @click="exportStatisticFile('YM')"
                     style="margin:8px;z-index: 9;position: absolute;">导出
          </el-button>
          <el-table
            :data="tableListData.tableData"
            border
            @cell-click="handle"
            style="width: 100%">
            <el-table-column :label="`${typeTitle}疫苗接种情况`" align="center">
              <el-table-column
                v-for="(item,index) in tableListData.tableKey"
                :key="index"
                :prop="item.key"
                :label="item.name"
                align="center"
                :width="item.width"
              >
                <template slot-scope="scope">
                  <el-link class="link" v-if="!['所属镇街','主体数量','完成第一针接种率','完成第二针接种率','完成第三针接种率'].includes(item.name)">
                    {{ scope.row[item.key] }}
                  </el-link>
                  <template v-else>{{ scope.row[item.key] }}</template>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <div class="count-time" v-if="tableListData.tableData.length>0">统计时间：{{ updateTime }}</div>
        </template>
      </template>

      <template v-if="['核酸检测','按最近一次核酸地址'].includes(this.countType)">

        <div class="searchControl">
          <div v-if="isCommonType" style="margin-bottom: 10px">
            批次：
            <el-select v-model="batchIds" placeholder="请选择批次" multiple style="margin-right:1em; width: 400px;">
              <el-option v-for="(item,index) in batchList" :label="item.label" :value="item.value"
                         :key="index"></el-option>
            </el-select>
            主体名称：
            <el-select v-model="ztIds" placeholder="请选择主体名称" multiple filterable
                       style="margin-right:1em; width: 400px;">
              <el-option v-for="(item,index) in ztList" :label="item.label" :value="item.value"
                         :key="index"></el-option>
            </el-select>
          </div>
          查询时间段：
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
          />

          <el-button style="margin-left: 20px " type="primary" @click="search">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <p style="margin: 8px 0px;" v-if="progress">
            所选主体/批次核酸数据获取进度：{{ progress.hstbjd || '统计中' }}
          </p>
          <el-button type="primary" @click="exportStatisticFile('HS')">导出</el-button>
        </div>
        <el-table
          :data="tableListData2.tableData"
          border
          :span-method="arraySpanMethod"
          style="width: 100%">
          <el-table-column :label="`${typeTitle}核酸检测情况`" align="center">
            <el-table-column v-for="item in tableListData2.tableKey" :key="item.index"
                             :prop="item.key"
                             :label="item.name"
                             align="center"
            >
              <template slot-scope="scope">
                <el-link @click="handle(scope.row, scope.column, scope.cell, $event,'HS')" class="link"
                         v-if="['人员数量','在岗人员数量','未核酸检测人数','核酸检测人数','阴性人数','未出结果人数'].includes(item.name)">
                  {{ scope.row[item.key] }}
                </el-link>
                <template v-else>{{ scope.row[item.key] }}</template>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </template>

    </el-dialog>

    <!--   人员下钻详情-->
    <el-dialog
      :visible="vaccShow"
      top="5vh"
      :title="`${currentAttr.label}情况`"
      :close-on-click-modal="false"
      @close="vaccShow=false"
      width="85vw"
    >
      <el-button
        style="margin-bottom:20px"
        icon="el-icon-download"
        type="primary"
        plain
        @click="exportFile"
      >导出
      </el-button>
      <el-table
        :data="tableListData3.tableData"
        border
        style="width: 100%">
        <el-table-column v-for="item in tableListData3.tableKey" :key="item.index"
                         :prop="item.key"
                         :label="item.name"
                         align="center"
        >
          <template slot-scope="scope">
            {{ scope.row[item.key] }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.rowTotal"
        background
        style="margin:0px 15px;"
      />
    </el-dialog>
  </div>

</template>

<script>
import {
  getCountData,
  getsSatisticHsData,
  getPeoData,
  exportFile,
  getHsPeople,
  exportFileByHs,
  getBatchListData,
  exportStatisticHs,
  exportStatisticYm,
  getZTListData,
  getProgress,
  getHsLastArr,
  getHsLastDetailArr,
  exportHsLastArr,
  exportHsLastArrAll
} from "@/api/collect";

import {formatDate} from '@/utils/common'
import Pagination from '@/components/form/Pagination'

const rylb = {
  nonStarHotelStaff: "工作人员",
  nonStarHotelTourist: "旅客",
};

export default {
  name: 'CountData',
  components: { Pagination },
  props: {
    showme: { type: Boolean },
    tableId: { type: Number, required: true },
    countType: { type: String },
    schoolRylb: { type: String }
  },
  model: {
    prop: 'showme',
    event: 'toggle'
  },
  computed: {
    // 默认时间
    timeDefault() {
      //获取当前时间
      let defalutStartTime = formatDate(new Date(new Date() - 24 * 60 * 60 * 1000)) + ' 00:00'
      // let defalutStartTime = formatDate(new Date(new Date() - 24 * 60 * 60 * 1000))
      let defalutEndTime = formatDate(new Date(new Date() - 24 * 60 * 60 * 1000)) + ' 23:59'
      return [defalutStartTime, defalutEndTime] //默认前一天数据
    },
    isCommonType() {
      return [6006].includes(this.tableId)
    },
    departmentName() {
      return this.$store.getters.departmentName
    },
    isAdmin() {
      // 6006模板 creator参数控制
      return this.tableId === 6006 && !['admin', 'admin1', 'yqfk_admin'].includes(this.$store.state.user.username)
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {  //只能选今天往前14天日期
          let curDate = (new Date()).getTime();
          let days = 14 * 24 * 3600 * 1000;
          return time.getTime() > Date.now() || time.getTime() < (curDate - days);
        }
      },
      sszjList: ['南沙街', '珠江街', '龙穴街', '大岗镇', '榄核镇', '黄阁镇', '东涌镇', '横沥镇', '万顷沙镇'],//3街6镇列表
      vaccShow: false, //接种详情
      currentAttr: '', //当前点击单元格
      typeTitle: "",
      tableListData: {
        tableData: [],
        tableKey: [
          { name: '所属镇街', key: 'sszj', width: 85 },
          { name: '主体数量', key: 'ztsl', width: 85 },
          { name: '工作人员数量', key: 'workers' },
          { name: '第一针可接种人数', key: 'canOneInject', width: 135 },
          { name: '第一针接种人数', key: 'oneInject' },
          { name: '完成第一针接种率', key: 'oneInjectPercent', width: 135 },
          { name: '第二针可接种人数', key: 'canTwoInject', width: 135 },
          { name: '第二针接种人数', key: 'twoInject' },
          { name: '完成第二针接种率', key: 'twoInjectPercent', width: 135 },
          { name: '第三针可接种人数', key: 'canThreeInject', width: 135 },
          { name: '第三针接种人数', key: 'threeInject' },
          { name: '完成第三针接种率', key: 'threeInjectPercent', width: 135 },
        ],
      },

      tableListData2: {
        tableData: [],
        tableKey: [
          { name: '所属镇街', key: 'sszj' },
          { name: '人员类别', key: 'name' },
          { name: '在岗人员数量', key: 'rysl' },
          { name: '未核酸检测人数', key: 'whsjcrs' },
          { name: '核酸检测人次', key: 'hsjcrc' },
          { name: '核酸检测人数', key: 'hsjcrs' },
          { name: '覆盖率', key: 'fgl' },
          { name: '阴性人数', key: 'yxrs' },
          { name: '未出结果人数', key: 'wcjgrs' }
        ],
      },

      // 疫苗接种情况人员列表
      tableListData3: {
        tableData: [],
        tableKey: [],
      },
      updateTime: null,
      searchTime: null,
      batchIds: [],
      batchList: [],
      ztIds: [],
      ztList: [],//主体信息
      progress: null,
      page: {
        pageNum: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        rowTotal: 0
      },
      rylb: this.tableId === 6002 ? rylb[this.$route.name] : '',
      isNuclein: false, //是否核酸情况弹窗

      //当前选择的快捷时间段 24,48,72,73
      currHourTag: null
    }
  },

  async created() {
    // console.log(this.isCommonType, this.tableId, this.countType)
    if (this.isCommonType) {
      this.tableListData2.tableKey[2].name = '人员数量'
      await this.getBatchList()

      const res = await getZTListData({ templateId: this.tableId })
      this.ztList = res.map(v => {
        return {
          label: v.ztmc,
          value: v.ztmc
        }
      })
      // console.log('主体列表', this.ztList)
    }
  },
  mounted() {
    this.searchTime = this.timeDefault
    this.init()
    if (this.countType === '疫苗接种') {
      this.getCountData()
    } else {
      this.getsSatisticHsData()
    }
  },
  methods: {
    init() {
      //通用人员页面 去除人员类型列
      if (this.isCommonType) {
        this.tableListData2.tableKey.splice(1, 1)
      }
    },
    //获取批次列表
    async getBatchList() {
      const res = await getBatchListData({ templateId: this.tableId })
      this.batchList = res.map(v => {
        return {
          label: v.analysisId,
          value: v.analysisId
        }
      })
    },

    //统计数据（疫苗接种情况）
    async getCountData() {
      let rylb = undefined
      switch (this.tableId) {
        case 6002:
          rylb = this.rylb
          break
        case 6049:
          rylb = this.schoolRylb
          break
      }
      getCountData(this.tableId, {
        //批次号的集合
        analysisIdList: this.batchIds.join(','),
        ztmcList: this.ztIds.join(','),
        templateId: this.tableId,
        //非星级酒店-人员类型: 工作人员 旅客
        rylb: rylb,
        creator: this.isAdmin ? this.$store.state.user.id : undefined,
      }).then((res) => {
        this.tableListData.tableData = res.data
        this.updateTime = res.updateTime
      })
      if (this.batchIds.length || this.ztIds.length) {
        let res = await getProgress(this.tableId, {
          //批次号的集合
          analysisIdList: this.batchIds.join(','),
          ztmcList: this.ztIds.join(','),
          templateId: this.tableId,
          //非星级酒店-人员类型: 工作人员 旅客
          rylb: rylb,
          creator: this.isAdmin ? this.$store.state.user.id : undefined,
        })
        this.progress = res
        console.log('进度数据', res)
      } else {
        this.progress = null
      }

    },

    //核酸检测情况
    async getsSatisticHsData() {
      const { tableId } = this;
      let [startDate, endDate] = this.searchTime
      let params = {
        templateId: tableId,
        startDate,
        endDate,
        creator: this.isAdmin ? this.$store.state.user.id : undefined,
      }

      switch (tableId) {
        case 6002:
          params.rylb = this.rylb
          break
        case 6006:
          params.analysisIdList = this.batchIds.join(',')
          params.ztmcList = this.ztIds.join(',')
          break
        case 6017:
        case 6061:
          params.gwlx = ''
          this.tableListData2.tableKey.splice(1, 1, { name: '岗位类型', key: 'name' })
          break
        case 6049:
          params.rylb = this.schoolRylb
          break
        case 6062:
          params.gwlx = ''
          this.tableListData2.tableKey.splice(1, 1, { name: '风险类型', key: 'name' })
          break
        case 6063:
          params.jzlx = ''
          this.tableListData2.tableKey.splice(1, 1, { name: '人员类别', key: 'name' })
          break
      }
      if (this.countType === '按最近一次核酸地址') {
        this.tableListData2.tableKey = this.tableListData2.tableKey.filter(v => !['yxrs', 'wcjgrs'].includes(v.key))
      }
      let getData = this.countType === '按最近一次核酸地址' ? getHsLastArr : getsSatisticHsData
      getData(params).then((res) => {
        let arr = res
        //合并单元格
        let tempCount = [] //合并的行
        let tempIndex = 0 //合并的行的索引
        arr.forEach((item, index) => {
          if (index === 0) {
            tempCount.push(1)
            tempIndex = 0
          } else {
            if (arr[index].sszj == arr[index - 1].sszj) {
              tempCount[tempIndex] += 1
              tempCount.push(0)
            } else {
              tempCount.push(1)
              tempIndex = index
            }
          }
        })
        tempCount.forEach((v, index) => {
          arr[index].rowSpan = v
        })
        this.tableListData2.tableData = arr

      })
      if (this.batchIds.length || this.ztIds.length) {
        let res = await getProgress(this.tableId, {
          //批次号的集合
          analysisIdList: this.batchIds.join(','),
          ztmcList: this.ztIds.join(','),
          templateId: this.tableId,
          //非星级酒店-人员类型: 工作人员 旅客
          rylb: rylb,
          creator: this.isAdmin ? this.$store.state.user.id : undefined,
        })
        this.progress = res
        // console.log('进度数据', res)
      } else {
        this.progress = null
      }
    },

    //疫苗接种情况(下钻人员明细)
    async getPeoData() {
      const { property, sszj, tableId } = this.currentAttr
      let data = {
        condition: {
          templateId: tableId,
          property,
          sszj: sszj !== '合计' ? sszj : '',
          creator: this.isAdmin ? this.$store.state.user.id : undefined,
        },
        page: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      if (tableId === 6049 && this.schoolRylb) {
        data.condition.name = this.schoolRylb
      }
      if (tableId === 6006) {
        data.condition.analysisIdList = this.batchIds.join(',')
        data.condition.ztmcList = this.ztIds.join(',')
      }
      getPeoData(data).then((res) => {
        res.data.map((item) => {
          item = Object.assign(item, {
            dyzComName: item.dyzComName,
            dezComName: item.dezComName,
            dszComName: item.dszComName,
            dyzInjectDate: item.dyzInjectDate,
            dezInjectDate: item.dezInjectDate,
            dszInjectDate: item.dszInjectDate,
          })
          for (const key in item) {
            if (!item[key]) item[key] = '-'
          }
        })
        this.tableListData3.tableData = res.data
        this.page.pageNum = res.page
        this.page.pageSize = res.pageSize
        this.page.rowTotal = res.total
      })
    },

    //核酸检测下钻人员
    async getHsPeople() {
      const { property, sszj, tableId, name } = this.currentAttr
      let [startDate, endDate] = this.searchTime
      let data = {
        condition: {
          templateId: tableId,
          property,
          name,
          sszj: sszj !== '合计' ? sszj : '',
          startDate,
          endDate,
          creator: this.isAdmin ? this.$store.state.user.id : undefined,
          analysisIdList: tableId == 6006 ? this.batchIds.join(',') : undefined,
          ztmcList: tableId == 6006 ? this.ztIds.join(',') : undefined
        },
        page: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      let getDetailData = this.countType === '按最近一次核酸地址' ? getHsLastDetailArr : getHsPeople
      getDetailData(data).then((res) => {
        this.tableListData3.tableData = res.data
        this.page.pageNum = res.page
        this.page.pageSize = res.pageSize
        this.page.rowTotal = res.total
      })
    },

    search() {
      if (!this.searchTime) return this.$message({ message: '请选择时间段', type: 'error' })
      this.getsSatisticHsData();
    },
    resetSearch() {
      this.searchTime = null
    },
    handle(row, column, cell, event, type) {
      this.tableListData3.tableKey = [
        { name: '姓名', key: 'xm' },
        { name: '手机号码', key: 'sjhm' },
        { name: '身份证号码', key: 'sfzhm' },
        { name: this.tableId === 6063 ? '项目名称' : '企业名称', key: 'ztmc' },
        { name: '居住地址', key: 'jzdz' },
        { name: '所属镇街', key: 'sszj' },
      ]
      this.currentAttr = {
        sszj: row.sszj,
        label: column.label,
        property: column.property,
        tableId: this.tableId,
        name: row.name,
        value: row[column.property]
      }
      if (row[column.property] === 0) return;
      if (['name', 'sszj', 'ztsl', 'oneInjectPercent', 'twoInjectPercent', 'threeInjectPercent', 'fgl', 'hsjcrc',].includes(column.property)) return
      this.vaccShow = true
      this.page.pageNum = 1
      this.page.pageSize = 10
      if (type === 'HS') { //核酸检测情况
        this.isNuclein = true
        this.tableListData3.tableKey.push(
          { name: '核酸检测次数', key: 'hsjccs' },
          { name: '最后一次核酸采样时间', key: 'CYRQ' },
          { name: '最后一次核酸检测时间', key: 'JCSJ' },
          { name: '最后一次核酸检测结果', key: 'JCJIEGUO' },
          { name: '检测机构', key: 'JCJG' },
          { name: '采样地点', key: 'CYDD' }
        )
        this.getHsPeople()
      } else {
        this.isNuclein = false
        this.tableListData3.tableKey.push(
          { name: '第一针厂家名称', key: 'dyzComName' },
          { name: '第一针接种时间', key: 'dyzInjectDate' },
          { name: '第二针厂家名称', key: 'dezComName' },
          { name: '第二针接种时间', key: 'dezInjectDate' },
          { name: '第三针厂家名称', key: 'dszComName' },
          { name: '第三针接种时间', key: 'dszInjectDate' },
        )
        this.getPeoData()
      }
    },
    //下钻人员导出
    async exportFile() {
      // 导出数据
      // console.log(this.currentAttr, this.searchTime);
      const { property, sszj, tableId, name } = this.currentAttr
      let [startDate, endDate] = []
      let data = {
        condition: {
          templateId: tableId,
          property,
          name,
          sszj: sszj !== '合计' ? sszj : ''
        },
        pageSize: this.page.rowTotal
      }
      if (tableId === 6006) {
        data.condition.analysisIdList = this.batchIds.join(',')
        data.condition.ztmcList = this.ztIds.join(',')
      }
      if (this.isNuclein) {
        [startDate, endDate] = this.searchTime
        data.condition.startDate = startDate
        data.condition.endDate = endDate
      }

      let res
      if (this.isNuclein) {
        this.countType === '按最近一次核酸地址' ? res = await exportHsLastArr(data) : res = await exportFileByHs(data)
      } else {
        res = await exportFile(data)
      }
      if (res) {
        this.$message({
          message: `导出成功`,
          type: "success",
          duration: 3 * 1000,
          showClose: true,
        });
      }
    },

    //合计的导出
    async exportStatisticFile(type) {
      const { tableId, rylb } = this
      let params = {
        templateId: tableId,
        // bm:true
      }
      if (rylb) params.rylb = rylb
      if (this.schoolRylb) params.rylb = this.schoolRylb
      if (tableId === 6006) {
        params.analysisIdList = this.batchIds.join(',')
        params.ztmcList = this.ztIds.join(',')
      }
      if (type === 'HS') {
        let [startDate, endDate] = this.searchTime
        params.startDate = startDate
        params.endDate = endDate
      }
      let res
      if (type === 'YM') { // 合计疫苗的导出
        res = await exportStatisticYm(params)
      } else { // 核酸的导出
        this.countType === '按最近一次核酸地址' ? res = await exportHsLastArrAll(params) : res = await exportStatisticHs(params)
      }
      if (res) {
        this.$message({
          message: `导出成功`,
          type: "success",
          duration: 3 * 1000,
          showClose: true,
        });
      }
    },

    handleSizeChange(v) {
      this.page.pageSize = v
      this.page.pageNum = 1
      this.isNuclein ? this.getHsPeople() : this.getPeoData()
    },
    handleCurrentChange(v) {
      this.page.pageNum = v
      this.isNuclein ? this.getHsPeople() : this.getPeoData()
    },
    //合并单元格
    arraySpanMethod({ row, columnIndex }) {
      if (columnIndex == 0) {
        return [row.rowSpan, 1]
      } else {
        return [1, 1]
      }
    },
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.count-data-box {

  .searchControl {
    margin: 0 0 15px;
  }

  ::v-deep.el-dialog__body {
    padding: 10px 20px;
  }

  .count-time {
    margin: 10px 0 50px;
  }

  .link {
    color: #409EFF;
  }
}


</style>
