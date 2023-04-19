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
          <template v-if="tableId==='shyyy'">
            <p> 1、数据统计：基于核酸检测记录情况，提供近14天计划入/出区或到场/离场的货车数据统计。</p>
            <p> 2、核酸数据：系统根据广东省新冠病毒检测信息系统下发的核酸检测数据（含全广州数据）通过人员身份证号码按照核酸采样时间进行匹配。</p>
            <p> 3、未做核酸统计：</p>
            <p>（1）未入场货车司机未做核酸总数：即未入场的货车中，存在当前时间前{{ setTime }}小时内没有核酸记录乘车人的货车总数；</p>
            <p>（2）已进场货车司机未做核酸总数：即已进场的货车中，存在到场时间前{{ setTime }}小时内没有核酸记录乘车人的货车总数；</p>
            <p>（3）已离场货车司机未做核酸总数：即已离场的货车中，存在离场时间前{{ setTime }}小时内没有核酸记录的乘车人，则视为不符合要求。</p>
          </template>
          <template v-eles-if="tableId===12129">
            <p>数据来源于广州市疫情防控管理系统下发的密接次密管理模块的密接次密接人员数据，其中检索条件的“录入时间”指密接次密接人员的录入时间</p>
          </template>
        </div>
        <span slot="reference">数据统计<b class="el-icon-warning-outline"></b> </span>
      </el-popover>
      <el-tabs v-if="[12129].includes(tableId)" class="tab-box" v-model="activeName" type="card"
               @tab-click="handleTabClick">
        <el-tab-pane :label="item.label" :name="item.label" v-for="(item,index) in tabList" :key="index"></el-tab-pane>
      </el-tabs>
      <template>
        <div class="searchControl">
          <template v-if="tableId==='shyyy'">
            计划入/出区时间：
            <el-date-picker
              v-model="searchApplyTime"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              style="margin-right:20px"
            />
          </template>
          <span>{{ searchTimeName }}：</span>
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          />
          <el-button style="margin-left: 20px " type="primary" @click="search">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="primary" @click="exportAllTruck">导出</el-button>
        </div>
        <el-table
          :data="tableListData.tableData"
          border
          @cell-click="handle"
          style="width: 100%">
          <el-table-column :label="tableListData.title" align="center">
            <el-table-column
              v-for="(item,index) in tableListData.tableKey"
              :key="index"
              :prop="item.key"
              :label="item.name"
              align="center"
              :width="item.width"
            >
              <template slot-scope="scope">
                <template v-if="['所属镇街'].includes(item.name)">{{ scope.row[item.key] }}</template>
                <el-link v-else class="link">
                  {{ scope.row[item.key] }}
                </el-link>

              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div class="count-time" v-if="tableListData.tableData.length>0">统计时间：{{ updateTime }}</div>
      </template>
    </el-dialog>

    <!--货车数量详情-->
    <el-dialog
      :visible="childTableShow"
      top="5vh"
      :title="`${currentAttr.label}情况`"
      :close-on-click-modal="false"
      @close="childTableShow=false"
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
        :data="tableListDataChild.tableData"
        border
        style="width: 100%">
        <el-table-column v-for="item in tableListDataChild.tableKey" :key="item.index"
                         :prop="item.key"
                         :label="item.name"
                         align="center"
                         show-overflow-tooltip
        >
          <template slot-scope="{}" slot="header">
            <span>{{ item.name }}</span>
            <el-popover
              v-if="['hsInvalidDrivers','hsValid'].includes(item.key)"
              slot="title"
              placement="left-start"
              width="300"
              trigger="hover">
              <div>
                <template v-if="item.key==='hsValid'">
                  <p> 1、未入场的货车，只要存在当前时间前{{ setTime }}小时内没有核酸记录的乘车人，则视为不符合要求；</p>
                  <p> 2、已进场的货车，只要存在到场时间前{{ setTime }}小时内没有核酸记录的乘车人，则视为不符合要求；</p>
                  <p> 3、已离场的货车，只要存在离场时间前{{ setTime }}小时内没有核酸记录的乘车人，则视为不符合要求；</p>
                  <p> 4、其他状态的货车，不做核酸检测核查。</p>
                </template>
                <template v-if="item.key==='hsInvalidDrivers'">
                  <p v-if="currentAttr.label==='未入场货车司机未做核酸总数'"> 未入场的货车，当前时间前{{ setTime }}小时内没有核酸记录的乘车人，则视为不符合要求人员</p>
                  <p v-else-if="currentAttr.label==='已进场货车司机未做核酸总数'"> 已进场的货车，到场时间前{{
                      setTime
                    }}小时内没有核酸记录的乘车人，则视为不符合要求人员</p>
                  <p v-else> 已离场的货车，离场时间前{{ setTime }}小时内没有核酸记录的乘车人，则视为不符合要求人员</p>
                </template>
              </div>

              <span slot="reference">数据统计<b class="el-icon-warning-outline"></b> </span>
            </el-popover>
          </template>
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
  getShyStatistic,
  getTruckNumData,
  getWzhsData,
  exportAllTruck,
  getTruckConfig,
  exportChildTruck,
  exportChildTruckHs
} from "@/api/freight";
import {
  getFytStatistic,
  getFytMjcmjData,
  exportFytStatistic,
  exportFytChildStatistic
} from "@/api/closeContactControl";
import Pagination from '@/components/form/Pagination'
import moment from 'moment'


export default {
  name: 'TemplateCountData',
  components: { Pagination },
  props: {
    showme: { type: Boolean },
    tableId: { type: [String, Number], required: true },
  },
  model: {
    prop: 'showme',
    event: 'toggle'
  },
  data () {
    return {
      searchTimeName: '录入时间',
      searchApplyTime: null,
      searchTime: null,
      pickerOptions: {
        disabledDate (time) {  //只能选今天往前14天日期
          let curDate = (new Date()).getTime();
          let days = 14 * 24 * 3600 * 1000;
          return time.getTime() > Date.now() || time.getTime() < (curDate - days);
        }
      },
      tabList: [
        { label: '密切接触者' },
        { label: '密接的密接' },
      ],
      activeName: '密切接触者',
      childTableShow: false, //下钻列表
      currentAttr: '', //当前点击单元格
      // 疫苗接种情况人员列表
      tableListDataChild: {
        tableData: [],
        tableKey: [],
      },
      tableListData: {
        title: null,
        tableData: [],
        tableKey: [],
      },
      updateTime: null,
      page: {
        pageNum: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        rowTotal: 0
      },
      setTime: null,
      type: null
    }
  },
  watch: {},

  mounted () {
    this.initData(this.tableId)
  },
  methods: {
    initData (tableId) {
      switch (tableId) {
        case 'shyyy': //穗货运预约数据
          this.tableListData = {
            title: '货车入区核酸检测情况',
            tableKey: [
              { name: '所属镇街', key: 'sszj' },
              { name: '货车总数', key: 'hczs' },
              { name: '未入场货车总数', key: 'wrchczs' },
              { name: '未入场货车司机未做核酸总数', key: 'wrchcsjwzhszs' },
              { name: '已进场货车总数', key: 'yjchczs' },
              { name: '已进场货车司机未做核酸总数', key: 'yjchcsjwzhszs' },
              { name: '已离场货车总数', key: 'ylchczs' },
              { name: '已离场货车司机未做核酸总数', key: 'ylchcwzhszs' },
              { name: '其他状态货车总数', key: 'qtzthczs' }
            ],
            tableData: [],
          }
          this.searchTimeName = '到达 / 离场时间'
          let timeDefault = [moment(new Date() - 24 * 60 * 60 * 1000 * 14).format("YYYY-MM-DD HH:mm:ss"), moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]
          this.searchApplyTime = this.searchTime = timeDefault
          this.getShyStatistic()
          this.getTruckConfig()
          break
        case 12129: // 防疫通密接次密接人员
          this.searchTime = [moment(new Date() - 24 * 60 * 60 * 1000 * 14).format("YYYY-MM-DD HH:mm:ss"), moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]
          this.tableListData = {
            title: `${this.activeName}管控情况`,
            tableKey: [
              { name: '所属镇街', key: 'streetName' },
              { name: `${this.activeName}总数`, key: 'closeContactNum' },
              { name: `当前${this.activeName}`, key: 'currCloseContactNum' },
              { name: `历史${this.activeName}`, key: 'historyCloseContactNum' },
              { name: '待确认', key: 'confirmingNum' },
              // { name: '已确认非本市', key: 'notInAreaNum' },
              { name: '已确认待转运', key: 'willBeTransferredNum' },
              { name: '已确认管控中', key: 'controllingNum' },
              // { name: '无需管控', key: 'notBeControlledNum' },
              // { name: '无法落实', key: 'unableToImplementNum' }
            ],
            tableData: [],
          }
          this.getTemplateCount()
          break
      }
    },
    handleTabClick (tab) {
      this.activeName = tab.label
      this.initData(this.tableId)
    },
    // 获取数据统计信息
    async getTemplateCount (data) {
      let params = data || {}
      let fn
      if (this.searchTime) params.rangeTime = this.searchTime.join(',').replace(',', '~')
      switch (this.tableId) {
        case 12129:
          params.closeContactDegree = this.activeName
          fn = getFytStatistic
          break
      }
      let res = await fn(params)
      this.tableListData.tableData = res
      this.updateTime = res[res.length - 1].updateTime
    },
    // 穗货运配置设置
    async getTruckConfig () {
      let res = await getTruckConfig()
      if (res) {
        this.setTime = res
      }
    },
    // 穗货运统计
    async getShyStatistic () {
      let params = {}
      if (this.searchApplyTime) {
        params.applyElStartDate = this.searchApplyTime[0]
        params.applyElEndDate = this.searchApplyTime[1]
      }
      if (this.searchTime) {
        params.elStartDate = this.searchTime[0]
        params.elEndDate = this.searchTime[1]
      }
      let res = await getShyStatistic(params)
      this.tableListData.tableData = res
      this.updateTime = res[0].lastDataTime
    },
    //货车数量情况(下钻明细)
    async getTruckNumData () {
      const { property, sszj, label } = this.currentAttr
      let data = {
        condition: {
          needHs: true,
          property,
          sszj: sszj !== '合计' ? sszj : '',
        },
        page: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      if (this.searchApplyTime) {
        data.condition.applyElStartDate = this.searchApplyTime[0]
        data.condition.applyElEndDate = this.searchApplyTime[1]
      }
      if (this.searchTime) {
        data.condition.elStartDate = this.searchTime[0]
        data.condition.elEndDate = this.searchTime[1]
      }
      getTruckNumData(data).then((res) => {
        res.data.map((item) => {
          item.ccrxm = item.drivers.map(v => v.name).join(',')
          item.ccrlxdh = item.drivers.map(v => v.mobile).join(',')
          item.ccrzjh = item.drivers.map(v => v.idNo).join(',')
          for (const key in item) {
            if (!item[key]) item[key] = '-'
          }
        })
        this.tableListDataChild.tableData = res.data
        this.page.pageNum = res.page
        this.page.pageSize = res.pageSize
        this.page.rowTotal = res.total
      })
    },


    //未做核酸统计(下钻明细)
    async getWzhsData () {
      const { property, sszj } = this.currentAttr
      let data = {
        condition: {
          property,
          sszj: sszj !== '合计' ? sszj : '',
        },
        page: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      if (this.searchApplyTime) {
        data.condition.applyElStartDate = this.searchApplyTime[0]
        data.condition.applyElEndDate = this.searchApplyTime[1]
      }
      if (this.searchTime) {
        data.condition.elStartDate = this.searchTime[0]
        data.condition.elEndDate = this.searchTime[1]
      }
      getWzhsData(data).then((res) => {
        res.data.map((item) => {
          item.ccrxm = item.drivers.map(v => v.name).join(',')
          item.ccrlxdh = item.drivers.map(v => v.mobile).join(',')
          item.ccrzjh = item.drivers.map(v => v.idNo).join(',')
          item.hsInvalidDrivers = item.hsInvalidDrivers.join(',')
          for (const key in item) {
            if (!item[key]) item[key] = '-'
          }
        })
        this.tableListDataChild.tableData = res.data
        this.page.pageNum = res.page
        this.page.pageSize = res.pageSize
        this.page.rowTotal = res.total
      })
    },
    //下钻明细
    async getChildData () {
      const { property, sszj, streetName,label } = this.currentAttr
      let data = {
        condition: {
          property,
          sszj: sszj !== '合计' ? sszj : '',
          streetName: streetName !== '合计' ? streetName : '',
        },
        page: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      let fn
      switch (this.tableId) {
        case 'shyyy': //穗货运预约数据
          if (this.searchTime) {
            data.condition.elStartDate = this.searchTime[0]
            data.condition.elEndDate = this.searchTime[1]
          }
          fn = getWzhsData
          break
        case 12129:
          Object.assign(data.condition,{
            closeContactDegree:this.activeName,
            rangeTime: this.searchTime.join(',').replace(',', '~'),
            statistic:1
          })
          // data.condition[property] = label
          fn = getFytMjcmjData
          break
      }
      fn(data).then((res) => {
        res.data.map((item) => {
          for (const key in item) {
            if (!item[key]) item[key] = '-'
          }
        })
        this.tableListDataChild.tableData = res.data
        this.page.pageNum = res.page
        this.page.pageSize = res.pageSize
        this.page.rowTotal = res.total
      })
    },
    //下钻导出
    async exportFile () {
      // 导出数据
      // console.log(this.currentAttr, this.searchTime);
      const { property, sszj, name, label, streetName } = this.currentAttr
      let data = {
        property,
        name,
        needHs: true,
        sszj: sszj !== '合计' ? sszj : '',
        streetName: streetName !== '合计' ? streetName : '',
        pageSize: this.page.rowTotal
      }
      let fn
      switch (this.tableId) {
        case 'shyyy': //穗货运预约数据
          if (this.searchApplyTime) {
            data.applyElStartDate = this.searchApplyTime[0]
            data.applyElEndDate = this.searchApplyTime[1]
          }
          if (this.searchTime) {
            data.elStartDate = this.searchTime[0]
            data.elEndDate = this.searchTime[1]
          }
          fn = label.includes('货车总数') ? exportChildTruck : exportChildTruckHs
          break
        case 12129:
          if (this.searchTime) data.rangeTime = this.searchTime.join(',').replace(',', '~')
          data.closeContactDegree =  this.activeName
          fn = exportFytChildStatistic
          break
      }
      let res = await fn(data)
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
    async exportAllTruck () {
      let params = {}
      let fn
      switch (this.tableId) {
        case 'shyyy': //穗货运预约数据
          if (this.searchApplyTime) {
            params.applyElStartDate = this.searchApplyTime[0]
            params.applyElEndDate = this.searchApplyTime[1]
          }
          if (this.searchTime) {
            params.elStartDate = this.searchTime[0]
            params.elEndDate = this.searchTime[1]
          }
          fn = exportAllTruck
          break
        case 12129:
          if (this.searchTime) params.rangeTime = this.searchTime.join(',').replace(',', '~')
          params.closeContactDegree = this.activeName
          fn = exportFytStatistic
          break
      }
      let res = await fn(params)
      if (res) {
        this.$message({
          message: `导出成功`,
          type: "success",
          duration: 3 * 1000,
          showClose: true,
        });
      }
    },
    search () {
      // if (!this.searchTime) return this.$message({ message: '请选择时间段', type: 'error' })
      switch (this.tableId) {
        case 'shyyy':
          this.getShyStatistic();
          break
        default:
          this.getTemplateCount()
          break
      }
    },

    resetSearch () {
      this.searchTime = null
      this.searchApplyTime = null
      this.getShyStatistic();
    },
    handle (row, column, cell, event) {
      this.currentAttr = {
        sszj: row.sszj,
        streetName: row.streetName,
        label: column.label,
        property: column.property,
        name: row.name,
        value: row[column.property]
      }
      this.page.pageNum = 1
      this.page.pageSize = 10
      if (row[column.property] === 0) return;
      this.tableListDataChild.tableData = []
      switch (this.tableId) {
        case 'shyyy': // 穗货运预约
          if (column.label.includes('未做核酸总数')) {
            this.type = '未做核酸总数'
            this.tableListDataChild.tableKey = [
              { name: '车牌', key: 'vehicleNo' },
              { name: '出发地省名称', key: 'originProvinceName' },
              { name: '出发地市名称', key: 'originCityName' },
              { name: '出发地区名称', key: 'originDistrictName' },
              { name: '到访公司名称', key: 'corpName' },
              { name: '到访公司地址', key: 'corpAddress' },
              { name: '计划到达时间', key: 'applyEnterTime' },
              { name: '计划离场时间', key: 'applyLeaveTime' },
              { name: '到达时间', key: 'enterTime' },
              { name: '离场时间', key: 'leaveTime' },
              { name: '乘车人姓名', key: 'ccrxm' },
              { name: '乘车人联系电话', key: 'ccrlxdh' },
              { name: '乘车人证件号', key: 'ccrzjh' },
              { name: '核酸检测不符合要求人员', key: 'hsInvalidDrivers' },
            ]
          } else {
            this.type = '货车总数'
            this.tableListDataChild.tableKey = [
              { name: '车牌', key: 'vehicleNo' },
              { name: '出发地省名称', key: 'originProvinceName' },
              { name: '出发地市名称', key: 'originCityName' },
              { name: '出发地区名称', key: 'originDistrictName' },
              { name: '到访公司名称', key: 'corpName' },
              { name: '到访公司地址', key: 'corpAddress' },
              { name: '计划到达时间', key: 'applyEnterTime' },
              { name: '计划离场时间', key: 'applyLeaveTime' },
              { name: '车辆管控状态', key: 'controlStatus' },
              { name: '到达时间', key: 'enterTime' },
              { name: '离场时间', key: 'leaveTime' },
              { name: '乘车人姓名', key: 'ccrxm' },
              { name: '乘车人联系电话', key: 'ccrlxdh' },
              { name: '乘车人证件号', key: 'ccrzjh' },
              { name: '乘车人核酸检测是否符合要求', key: 'hsValid' },
            ]
          }
          this.childTableShow = true
          if (this.type === '未做核酸总数') {
            this.getWzhsData()
          } else {
            this.getTruckNumData()
          }
          break
        case 12129: // 防疫通密接次密接
          this.childTableShow = true
          this.tableListDataChild.tableKey = [
            { name: '姓名', key: 'name' },
            { name: '联系方式', key: 'phone' },
            { name: '证件号码', key: 'identityNum' },
            { name: '所属区', key: 'areaName' },
            { name: '所属社区', key: 'areaName' },
            { name: '目前所在位置', key: 'currentLocation' },
            { name: '密接类型', key: 'closeContactDegree' },
            { name: '是否核心密接', key: 'contactRiskType' },
            { name: '管控确认状态', key: 'controlStatus' },
            { name: '录入时间', key: 'createTime' },
            { name: '最后更新时间', key: 'updateTime' },
          ]
          this.getChildData()
          break

      }
    },
    handleSizeChange (v) {
      this.page.pageSize = v
      this.page.pageNum = 1
      if (this.tableId === 'shyyy') {
        this.type === '未做核酸总数' ? this.getWzhsData() : this.getTruckNumData()
      }else {
        this.getChildData()
      }
    },
    handleCurrentChange (v) {
      this.page.pageNum = v
      if (this.tableId === 'shyyy') {
        this.type === '未做核酸总数' ? this.getWzhsData() : this.getTruckNumData()
      }else {
        this.getChildData()
      }
    },
    //合并单元格
    arraySpanMethod ({ row, columnIndex }) {
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
  .tab-box {
    margin-bottom: 10px;
  }

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
