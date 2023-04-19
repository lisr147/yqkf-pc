<!-- 导入文件选择 -->
<template>
  <el-dialog
    :visible="true"
    append-to-body
    width="1300px"
    :modal="false"
    :close-on-click-modal="false"
    @close="$emit('close')"
    top="8vh"
    title="批量导入"
  >
    <table-page
      :data="tableListData"
      :hideSearch="true"
      :filter="filter"
      @tableSelectionChange="tableSelect"
      ref="table"
      id="importFile"
    >
      <template v-slot:column_templateName="row">
        <a :href="`./template/${row.value.templateUrl}`" target="_self">{{row.value.templateName}}</a>
      </template>
      <template v-slot:column_upload="row">
        dsafasdfasdff
        <el-upload class="upload-demo" action="#" :file-list="row.value.fileList" :show-file-list="false" :before-upload="uploadCheck" >
          <el-button type="text" @click="uploadId = row.value.id">{{row.value.fileName?'重新上传':'点击上传'}}</el-button>
        </el-upload>
      </template>
    </table-page>

    <div slot="footer" class="dialog-footer">
      <el-checkbox v-model="isSelectAll" @change="changeSelectAll">全选</el-checkbox>
      <el-button icon="el-icon-upload2" type="info" @click="importData">导入</el-button>
    </div>
  </el-dialog>
</template>
<script>
import TablePage from 'zkzc-table-page'
import { MessageBox } from '@/plugins/element'

export default {
  name: 'ImportFile',
  components: { TablePage },
  data () {
    return {
      tableData: [], // 主页面表格数据
      filter: {
        name: '',
        code: ''
      },
      uploadId: null,
      isSelectAll: false,
      selectData: []
    }
  },
  computed: {
    tableListData () {
      let tableData = {
        selection: true,
        columnFunctionsWidth: 120, // 操作栏宽度
        tableData: this.tableData,
        selectable: (row, index) => {
          return row.uploadSucceed
        },
        rowStyle: (row, index) => {
          let style = {}
          if (row.row.uploadFailMsg && !row.row.uploadSucceed) {
            style.backgroundColor = 'rgb(37, 23, 87)'
          }
          return style
        },

        tableKeys: [
          // 表格标签
          {
            id: 'name',
            label: '数据类型',
            width: '150',
            allways: true
          },
          {
            id: 'templateName',
            label: '模板文件',
            minWidth: '150'
          },
          {
            id: 'fileName',
            label: '上传文件',
            minWidth: '150'
          },
          {
            id: 'uploadFailMsg',
            label: '校验状态',
            minWidth: '300'
          },
          {
            id: 'upload',
            label: '选择文件',
            minWidth: '120'
          }
        ],
        tableFunctions: [
          // {
          //   label: '回滚',
          //   method: this.revent
          // }
        ]
      }
      return tableData
    }
  },
  async mounted () {
    // let res = await this.$Api().ImportDataController.post_list.request({
    //   data: {
    //     // useCurrentDept: true
    //   },
    //   headers: {
    //     hideNotify: true
    //   }
    // })
    // this.tableData = res.map(v => {
    //   v.fileName = ''
    //   v.uploadSucceed = false
    //   v.uploadFailMsg = null
    //   v.uploadId = null
    //   return v
    // })
  },
  methods: {
    uploadCheck (file) {
      // console.log('uploadCheck', file, this.uploadId)
      // 更新导入列表文件名
      let tableData = this.tableData.filter(v => v.id === this.uploadId)[0]
      tableData.fileName = file.name
      this.$Api().ImportDataController.post_checkData.request({
        data: {
          uploadFile: file
        },
        path: {
          id: this.uploadId
        },
        headers: {
          hideNotify: true
        }
      }).then(res => {
        if (!res.code && res.code !== 0) {
          tableData.uploadSucceed = true
          tableData.uploadFailMsg = '校验成功'
          tableData.uploadId = res
        } else {
          tableData.uploadFailMsg = res.msg
          tableData.uploadSucceed = false
        }
      })
      return false
    },
    changeSelectAll (v) {
      this.$refs.table.checkAll(v)
    },
    tableSelect (data) {
      this.selectData = data
      this.isSelectAll = !(this.selectData.length < this.tableData.filter(v => v.uploadSucceed).length)
    },
    async importData () {
      if (!this.selectData.length) {
        this.$message({
          message: `请先选择数据再进行操作。`,
          type: 'info',
          duration: 5 * 1000,
          showClose: true
        })
        return
      }
      let res = await this.$Api().ImportDataController.post_import.request({
        data: this.selectData.map(v => { return v.uploadId }),
        headers: {
          hideNotify: true,
          returnRawMsg: true
        }
      })
      console.log(res)
      if (!res.data.unusualUnits) {
        this.$message({
          message: res.msg || '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.$emit('close')
      } else {
        MessageBox.alert(res.msg, '警告', {
          onfirmButtonText: '查看详情',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          console.log('异常企业跳转')
          this.$store.commit('global/SET_UNUSUALUNITS', res.data.unusualUnits)
          this.$emit('closeAll')
        })
      }

      this.selectData.forEach(v => {
        v.uploadSucceed = false
        v.uploadFailMsg = null
        v.uploadId = null
        v.fileName = null
      })
      this.changeSelectAll(false)
      this.isSelectAll = false
      this.$emit('update')
    },
    revent (scope) {
      MessageBox.alert('请确认回滚操作，该操作将导致本数据恢复到上一次导入的数据值', '警告', {
        onfirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        showCancelButton: true,
        type: 'warning'
      }).then(async () => {
        await this.$Api().ImportDataController.post_rollback.request({
          path: {
            id: scope.row.id
          }
        })
        this.$emit('update')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer{
  display: flex;
  justify-content: space-between;
  margin: 0px 10px;
}
</style>
