<template>
  <el-dialog
      width="1000px"
      title="选择人员"
      :visible="userVisible"
      @close="close"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="true"
      style="z-index: 7000;"
      >
    <div>
      <div class="el-main-body">
        <div class="area-sub">
          <group-tree-box  @chooseGroupNode="chooseGroupNode" @dataReady="initRootId" ref="groupTree"/>
        </div>
        <div class="area-main flex2">
          <section>
            <div class="area-main-head">
              <h4>{{groupName}}</h4>
            </div>
            <div class="area-main-box">

              <el-form :inline="true" :model="filterData" class="area-main-filter" @keyup.enter.native="filterUsersList">
                <el-form-item label="姓名">
                  <el-input v-model="filterData.name" placeholder="请输入关键词"  size="small"></el-input>
                </el-form-item>
                <el-form-item label="账号名">
                  <el-input v-model="filterData.username" placeholder="请输入关键词"  size="small"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="filterUsersList"  size="small">搜索</el-button>
                </el-form-item>
              </el-form>

              <el-table ref="multipleTable" :data="usersListData" tooltip-effect="dark" style="width: 99.6%" border  @selection-change="onSelectRowsChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="fullName"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="账号名">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号码">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱">
                </el-table-column>
                <el-table-column
                    prop="departmentName"
                    label="部门">
                </el-table-column>
              </el-table>

              <el-pagination
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  :current-page.sync="page.pageNumber"
                  :page-sizes="$store ? $store.getters.pageRange : 10"
                  :page-size="page.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  background
                  :total="page.rowTotal">
              </el-pagination>

            </div>

          </section>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {queryUser, getUser} from '@/api/users'
import { getAllApps } from '@/api/apps'
import GroupTreeBox from '@/components/GroupTreeBox'
import { parseTime, unique } from '@/utils/common'
export default {
  name: "User",
  components: {

    GroupTreeBox,

  },
  props: {
    userVisible: { type: Boolean },
    showme: { type: Boolean },
    selectedUsers: { type: Array },
  },

  model: {
    prop: 'userVisible',
    event: 'toggle'
  },
  data () {
    return {
      // 当前部门id
      groupId: 1,
      // 当前部门名称
      groupName: '',
      initGroupId: '', //原始值
      initGroupName: '', //原始值
      // 父部门id
      groupParentId: '',

      currUserId: null,

      groupTree: [],
      defaultProps: {
        children: 'children',
        label: 'nodeText'
      },
      usersListData: [
      ],
      // 页码信息
      page: {
        pageNumber: 1,
        pageSize: null,
        rowTotal: null
      },
      // 已选的用户信息
      selectedRows: [],

      descDict: {
        title: { add: '添加用户', edit: '编辑用户', see: '用户详情' },
        allStatus: [
          { text: '正常', value: true },
          { text: '禁用', value: false }
        ]
      },
      appId: '',
      // 用户过滤表单
      filterData: {
        name: null,
        username: null,
        enabled: true
      },
      // 请求过滤参数
      filterData_params: {},
      currentPage: 1,
      // 弹窗当前Tab
      dialogActiveTab: 'base',
      formLabelWidth: '100px',
      appList: [],
      // 用户表单校验
      userRules: {},
      isLoad: false //是否加载过
    }
  },
  computed: {
    disableAdd () {
      return this.groupId < 0 || this.groupParentId < 0
    },
    selectedRowIds() {
      return this.selectedRows.map(item=>item.id)
    },
    usersIdsListData () {
      return this.usersListData.map(item=>item.id)
    }
  },
  watch: {
    // 重新打开新建表单时需要重置数据
    showme (val) {
      if (val && this.isLoad) {
        this.initGroupId = 1
        this.groupId = this.initGroupId
        this.groupName = this.initGroupName
        // 重置数据
        this.filterData =  {
          name: null,
          username: null,
          enabled: true
        }
        this.filterUsersList()
      }
    },
    userVisible (val) {
      if (val) {
        this.selectedRows = this.selectedUsers
        this.$nextTick(() => {
          this.checkedSelection()
        })
      }
    }
  },
  mounted() {
  },
  methods: {
    //  初始化应用系统Select
    async initAppSelect () {
      await getAllApps({
        rp: 100
      }).then(res => {
        this.appId = res.dataList.find(item => item.appCode === 'YQFK').id
      })
    },
    // 初始化当前部门信息
    async initRootId (node) {
      this.groupId = node.rootId
      this.initGroupId = node.rootId
      this.initGroupName = node.nodeText
      this.groupName = node.nodeText
      await this.initAppSelect()
      // 获取用户列表
      this.getGridData()
    },
    // 选择组织树节点
    chooseGroupNode (data) {
      this.groupId = data.id
      this.groupName = data.departmentName
      this.getGridData()
    },

    handleGradeChange (val) {
      this.baseForm.departmentGrade = val
    },
    //分页切换等重新获取table数据的时候需要默认勾选之前勾选过的值
    checkedSelection () {
      let checkedList = this.usersListData.filter(item => this.selectedRowIds.includes(item.id))
      if ( checkedList) {
        // 先清空原来的值
        this.$refs.multipleTable.clearSelection();
        checkedList.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    // 获取用户列表数据
    getGridData () {
      // console.log('this.groupId:' + this.groupId)
      // console.log(JSON.stringify(this.filterData))
      queryUser({
        // keyword: '',
        // enabled: '',
        // departmentName: '',
        // appId: this.appId,
        username: this.filterData_params.username,
        enabled: this.filterData_params.enabled,
        departmentId: this.groupId,
        keyword: this.filterData_params.name,
        rp: this.page.pageSize || 10,
        page: this.page.pageNumber

      }).then(res => {
        this.isLoad = true
        this.usersListData = res.dataList

        // 格式化修改时间
        this.usersListData.forEach(item => {
          if (item.objectModificationTime) {
            item.objectModificationTimeValue = parseTime(item.objectModificationTime)
          }
        })

        this.page.pageNumber = res.pageNumber
        this.page.pageSize = res.pageSize
        this.page.rowTotal = res.rowTotal

        this.$nextTick(() => {
          this.checkedSelection()
        })
      })
    },
    // 搜索用户
    filterUsersList () {
      this.page.pageNumber = 1
      this.filterData_params = Object.assign({}, this.filterData)
      this.getGridData()
    },
    // 更改每页数量
    handleSizeChange (newValue) {
      this.page.pageSize = newValue
      this.getGridData()
    },
    // 翻页
    handleCurrentChange (newPageNumber) {
      this.page.pageNumber = newPageNumber
      this.getGridData()
    },
    validDepartment () {
      // 0级和1级部门不能放置用户
      if (this.baseForm.departmentGrade <=1 ) {
        this.$message({
          message: '根目录和一级部门不能直接放置用户',
          type: 'warning'
        })
        return false
      }else{
        return true
      }
    },

    // 每次有表格行被选状态改变时，记录被选行id
    onSelectRowsChange (rows) {
      console.log('rows',rows)

      // 先清空当前页的所有勾选了的选项
      this.selectedRows = this.selectedRows.filter(item => !this.usersIdsListData.includes(item.id))


      // 再把当前页的勾选项加上
      rows.forEach(item => {
        this.selectedRows.push(item)
      })
      console.log('this.selectedRows',this.selectedRows)

    },
    close () {
      this.$emit('toggle', false)
    },
    handleConfirm () {

      this.$emit('chooseUser',this.selectedRows)
      this.close()
    },

  }
}
</script>

<style scoped>

</style>
