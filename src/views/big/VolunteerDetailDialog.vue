<template>
  <el-dialog
      v-dialogDrag
      width="80vw"
      :visible="visible"
      :modal="false"
      :close-on-click-modal="false"
      @close="handleClose"
      :title="`${data.title}明细`"
      class="el-inner-dialog"
  >
    <div class="detail-wrapper">
      <table-page
          :data="tableListData"
          :filter="filter"
          :hideKeyFilter="true"
          :height="400"
          @search="search"
          @sizeChange="sizeChange"
          @tableSelectionChange="tableSelectionChange"
          @currentChange="currentChange"
          @resetSearch="resetSearch"
          customClass="staff_table"
      >
        <template slot="searchFilter">
          <el-form :inline="true" :model="filter" label-width="100px">
            <el-form-item label="所属镇街" prop="sszj" labelWidth="140px">
              <el-select v-model="filter.sszj" placeholder="请选择所属镇街">
                <el-option
                    label="不限"
                    :value="null"
                ></el-option>
                <el-option
                    :label="item"
                    :value="item"
                    :key="index"
                    v-for="(item, index) in streetList"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属社区">
              <el-input
                  v-model="filter.sssq"
                  placeholder="请输入所属社区"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属网格">
              <el-input
                  v-model="filter.sswg"
                  placeholder="请输入所属网格"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属志愿者机构" v-if="data.isDy === 0" labelWidth="140px">
              <el-input
                  v-model="filter.sszyzjg"
                  placeholder="请输入所属志愿者机构"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属网格党支部" v-if="data.isDy === 1" labelWidth="140px">
              <el-input
                  v-model="filter.dzbmc"
                  placeholder="请输入所属网格党支部"
              ></el-input>
            </el-form-item>
            <el-form-item label="党员类别" prop="dylb" v-if="data.isDy === 1" labelWidth="140px">
              <el-select v-model="filter.dylb" placeholder="请选择党员类别">
                <el-option
                    label="不限"
                    :value="''"
                ></el-option>
                <el-option
                    :label="item"
                    :value="item"
                    :key="index"
                    v-for="(item, index) in dylbList"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot="controler">
          <el-button
              type="primary"
              size="small"
              icon="el-icon-download"
              @click="exportData"
          >导出数据</el-button
          >
        </template>

      </table-page>
    </div>
  </el-dialog>
</template>

<script>
import TablePage from "zkzc-table-page";
import TablePageFunc from "@/utils/tablepage"
import {pageRange} from "@/config/setting";
import { getDetailList, exportDetailData } from '@/api/volunteer'

export default {
  name: "VolunteerDetailDialog",
  components: {
    TablePage,
  },
  mixins: [TablePageFunc],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    visible: {
      handler: function (val) {
        if (val) {
          this.init()
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      tableListData: {
        selection: true,
        tableData: [],
        tableKeys: [
          {
            id: "sszj",
            label: "所属镇街",
          },
          {
            id: "sssq",
            label: "所属社区",
          },
          {
            id: "sswg",
            label: "所属网格",
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
            label: "身份证号码",
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
            id: "isdyLabel",
            label: "是否党员",
          },
        ],
      },
      filter: {
        isDy: 1, //是否党员
        sszj: '',
        dylb: '',
        dzbmc: '',
        sssq: '',
        sswg: '',
        sszyzjg: '',
        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
      },
      streetList: [
        "南沙街",
        "黄阁镇",
        "东涌镇",
        "大岗镇",
        "榄核镇",
        "横沥镇",
        "万顷沙镇",
        "珠江街",
        "龙穴街"
      ],
      dylbList:['A类党员', 'B类党员','C类党员','D类党员','E类党员'],
    }
  },
  model:{
    prop: 'visible',
    event: 'toggle'
  },
  methods: {
    init () {
      const { filter, tableListData } = this.$options.data()
      this.tableListData = tableListData
      this.filter = {
        ...filter,
        sssq: this.data.sssq, sswg: this.data.sswg //查询条件带过来赋值
        }
      let _keys = []
      // 是否党员展示的table列是不一样的
      if (this.data.isDy === 1) {
        _keys = [
          {
            id: "dzbmc",
            label: "所属网格党支部",
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
          },
        ]
      }else {
        _keys = [
          {
            id: "sszyzjg",
            label: "所属志愿者机构",
          },

        ]
      }
      this.tableListData.tableKeys = [
        ...this.tableListData.tableKeys,
        ..._keys
      ]
      this.getData()
    },
    async getData() {
      let filterData = {...this.filter, condition: {...this.filter, isDy: this.data.isDy}}
      // for (let i in filterData.condition) {
      //   if (filterData.condition[i] === '' ) {
      //     delete filterData.condition[i]
      //   }
      // }
      filterData.page = filterData.pageNum
      getDetailList(filterData).then(res => {
        this.tableListData.tableData = (res.data || []).map(v=> {
          return {
            ...v,
            isdyLabel: v.isdy === 1 ? '是' : '否'
          }
        })
        this.filter.rowTotal = res.total
      }).catch(() => {

      })
    },
    handleClose(){
      this.$emit('toggle', false)
    },
    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    //导出表单数据
    async exportData () {
      let data = {}
      if (this.multiData.length === 0) {
        data = {...this.filter,  isDy: this.data.isDy}
      }else {
        data.ids = this.multiData.map(item => item._id)
      }
      await exportDetailData(data)
      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true,
      });

    }
  }
}
</script>

<style lang="scss" scoped>
.detail-wrapper {
  margin: 0px;
  width: 100%;
  max-height: calc(100vh - 200px);
  overflow: auto;
  overflow-x: hidden;
  display: block;
}
</style>
