<template>
  <div>
    <table-page
      :data="tableListData"
      :filter="filter"
      @search="search"
      @resetSearch="resetSearch"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @tableSelectionChange="tableSelectionChange"
      v-if="tableListData.tableKeys.length"
    >
      <!--搜索栏-->
      <template slot="searchFilter">
        <el-form
          :inline="true"
          :model="filter"
          label-width="150px"
          class="area-main-filter"
          @keyup.enter.native="search"
        >
          <el-form-item label="密接类型">
            <el-select v-model="filter.mjlx">
              <el-option value="" label="全部" />
              <el-option value="密切接触者" />
              <el-option value="密接的密接" />
              <el-option value="一般接触者" />
              <el-option value="重点人群" />
              <el-option value="一般人群" />
              <el-option value="其他" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否运转">
            <el-select v-model="filter.yz">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否分配隔离酒店">
            <el-select v-model="filter.fpgljd">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>

          <el-form-item label="隔离酒店">
            <el-select v-model="filter.jdid">
              <el-option value="" label="全部">全部</el-option>
              <el-option
                v-for="item in hotelList"
                :key="item.id"
                :value="item.id"
                :label="item.jkgcjd"
                >{{ item.jkgcjd }}</el-option
              >
            </el-select>
          </el-form-item>

          <el-form-item label="房间人数">
            <el-select v-model="filter.fjrs">
              <el-option value="" label="全部" />
              <el-option value="1" label="1" />
              <el-option value="2" label="2" />
              <el-option value="3" label="2个以上" />
            </el-select>
          </el-form-item>

          <el-form-item label="相同身份证数">
            <el-select v-model="filter.xtsfzh">
              <el-option value="" label="全部" />
              <el-option value="1" label="1" />
              <el-option value="2" label="2" />
              <el-option value="3" label="2个以上" />
            </el-select>
          </el-form-item>

          <el-form-item label="相同人员是否合并">
            <el-select v-model="filter.xtrysfhb">
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <!-- 操作栏 -->
      <template slot="controler">
        <el-button icon="el-icon-download" type="primary" @click="exportFile"
          >导出筛选结果</el-button
        >
        <label style="margin-left:10px;">共有{{count}}人在公安流调库和疾控流调库中</label>
      </template>
    </table-page>
  </div>
</template>
<script>
import TablePageFunc from "@/utils/tablepage.js";
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
// import HealtyInfo from "./hotel/healtyInfo.vue";
// import Timeline from "./hotel/timeLine.vue";
import getTableKeys from "@/views/dataManage/getTableKeys.js";
import moment from 'moment'
export default {
  name: "same-person",
  components: {
    TablePage,
    // HealtyInfo,
    // Timeline,
  },
  mixins: [TablePageFunc, getTableKeys],
  data() {
    return {
      dialog: null, //弹出框控制
      // isLoading: true,
      filter: {
        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
        mjlx: "",
        yz: "",
        fpgljd: "",
        jdid: "",
        fjrs: "",
        xtsfzh:'',
        xtrysfhb:'0',
        bm:true
      },
      tableListData: {
        selection: false,
        columnFunctionsWidth: 220,
        tableData: [],
        tableKeys: [],
        tableFunctions: [],
      },
      hotelList: [],
      detail: null,
      dataKeys: [],
        count:-1
    };
  },
  async mounted() {
    this.hotelList = await this.$Api().HotelController.get_getAllHotelList.request();
    await this.getTableKeys(["sfzhzhm", "lxdh", "xm"],'10001',false);
    let keys = JSON.parse(JSON.stringify(this.tableListData.tableKeys))
    this.tableListData.tableKeys = []
    await this.getTableKeys([],'10002',false)
    this.tableListData.tableKeys = this.tableListData.tableKeys.map(v=>{
        v.id = 'GAData.'+v.id
        return v
    })
    keys = keys.map(v=>{
        v.label = '(疾控)'+v.label
        v.minWidth += 40
        return v
    })
    
    this.tableListData.tableKeys = this.tableListData.tableKeys.concat(keys)
    // console.log('表头',this.tableListData.tableKeys,keys)
    this.resetSearch()
    // this.getData();
    // this.tableListData.tableFunctions.push({
    //   label: "查看健康信息",
    //   method: this.viewInfo,
    // });
    // this.tableListData.tableFunctions.push({
    //   label: "时间轴查看",
    //   method: this.viewTL,
    // });
  },
  methods: {
    async getData() {
      let params = JSON.parse(JSON.stringify(this.filter));
      delete params.rowTotal;
      delete params.pageSizes;
      //   let res = await getSubmitUserGroup(params);
      let res = await this.$Api().ConnectionController.post_searchMjInGa.request(
        {
          data: params,
          heaaders: {
            hideNotify: true,
          },
        }
      );
      res.data.forEach(v=>{
        v.createTime = moment(v.createTime).format('YYYY-MM-DD HH:mm:ss')
        v.updateTime = moment(v.updateTime).format('YYYY-MM-DD HH:mm:ss')
        v.GAData.createTime = moment(v.GAData.createTime).format('YYYY-MM-DD HH:mm:ss')
        v.GAData.updateTime = moment(v.GAData.updateTime).format('YYYY-MM-DD HH:mm:ss')
      })
      this.tableListData.tableData = res.data;
      this.filter.pageNum = res.pageNum;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.rowTotal;
      if(this.count===-1){
        this.count = res.rowTotal
      }
    },
    // async submit(data) {
    //   this.dialog = null;

    //   console.log(data);
    //   if (!this.multiData.length) {
    //     this.$message({
    //       type: "warn",
    //       message: "请先选择人员",
    //     });
    //     return;
    //   }

    //   await this.$Api().RoomController.post_assignByRoom.request({
    //     data: {
    //       ids: this.multiData.map((v) => v._id),
    //       fjh: data.fjh,
    //       ksglsj: data.ksglsj,
    //     },
    //   });
    //   this.getData();
    // },
    // viewInfo(scope) {
    //   this.detail = scope.row;
    //   this.dialog = "healty";
    // },
    // viewTL(scope) {
    //   this.detail = scope.row;
    //   this.dialog = "timeline";
    // },
    async exportFile() {
      // 导出数据
      // eslint-disable-next-line no-unused-vars
      let res = await await this.$Api().ConnectionController.post_exportDatanGa.request(
        {
          data: this.filter,
          responseType: "blob",
        }
      );
      // console.log(res)
      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true,
      });
    },
  },
};
</script>
