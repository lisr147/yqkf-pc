<template>
  <div class="p-seal-area">
    <table-page
        :data="tableListData"
        :filter="filter"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @search="search"
        @tableSelectionChange="tableSelectionChange"
        @resetSearch="resetSearch"
        ref="sealAreaTable"
        id="seal_area_table">

      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" label-width="60px" @keyup.enter.native="getData">
          <el-form-item label="封控管理区名称" :label-width="labelWidth">
            <el-input v-model="filter.name" placeholder="请输入任务名称"/>
          </el-form-item>
          <el-form-item label="类型" :label-width="labelWidth">
            <el-select v-model="filter.lx" @change="handleSelectChange">
              <el-option value="" label="全部" />
              <el-option :value="item" :label="item" v-for="item in sealAreaTypeList" :key="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <!--启用/停止-->
      <template v-slot:column_areaAble="row">
        <el-switch
            @change="handleSwitchChange(row)"
            :value="row.value.areaAble"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </template>
      
      <template slot="controler">
        <el-button icon="el-icon-circle-plus" type="primary" @click="add" >新建管理区</el-button>
        <el-button icon="el-icon-delete" type="primary" plain @click="deletePatch">批量删除</el-button>
      </template>
    </table-page>
    <area-edit :editorVisible.sync="editorVisible" :editFormData="editFormData"></area-edit>


  </div>
</template>

<script>
import TablePage from 'zkzc-table-page';
import TablePageFunc from "@/utils/tablepage.js";
import { getMapLayerData} from '@/api/mapData.js'
import { areaEnable, deleteSealArea } from "@/api/sealarea";
import AreaEdit from "@/components/sealArea/AreaEdit";

export default {
  name: "SealArea",
  components: {
    TablePage,
    AreaEdit
  },
  mixins: [TablePageFunc],
  data() {
    return {
      filter: {
        name: '',
        lx: '',
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100],
      },
      editorVisible: false,
      sealAreaTypeList: ['封闭区','封控区','防控区','健康管理区'],
      selectedIds: [],
      labelWidth: '100px',
      editFormData: null,
      tableListData: {
        selection: true,
        align: 'center',
        columnFunctionsWidth: 250, // 操作栏宽度
        tableData: [],  //表格内容
        eid: 0,
        tableKeys: [{
          id: "lx",
          label: "类型",
          width: 120,
        },{
          id: "fw",
          label: "名称",
          width:120,
        },{
          id: "sswg",
          label: "涉及网格",
          allways: true,
          minWidth: 150,
        },{
          id: "mj",
          label: "面积",
          width: 120,
        },{
          id: "registeredPopulation",
          label: "户籍人口",
          width: 100
        },{
          id: "floatingPopulation",
          label: "流动人口",
          width: 100
        },{
          id: "totalPopulation",
          label: "总人口",
          width: 100
        },{
          id: "areaAble",
          label: "启用/停止",
          width: 100
        }],  //表头
        tableFunctions: [{
          label: '编辑',
          method: this.edit
        },
        {
          label: '删除',
          method: this.remove
        }]
      },
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    editorVisible(val) {
        if(!val) this.getData();
    }
  },

  methods: {
    search() {
      this.filter.pageNum = 1
      this.getData();
    },
    handleSwitchChange({value: row}) {
        const status = row.sfqy;
        areaEnable(status? 0 : 1, row.id)
            .then(() => {
                this.$message.success('修改成功');
                this.getData();
            })
            .catch(e => {
                this.$message.error('修改失败')
                console.log(e);
            })
    },
    async getData() {
      const SEALAREAID = 10076;
      const { name, pageNum,pageSize, lx } = this.filter
      const params = {
        //模板id
        page: pageNum,
        pageSize,
        //查询条件
        templateId: SEALAREAID,
        condition: {
            fw: name,
            lx
        },
      }

      const res = await getMapLayerData(params)
      this.tableListData.tableData = res.data.map(item => ({
        ...item,
        registeredPopulation: `${item.hjrk} 人`,
        floatingPopulation: `${item.ldrk} 人`,
        totalPopulation: `${item.zrk} 人`,
        areaAble: item.sfqy === 0
      }))
      console.log(this.tableListData.tableData);
      this.filter.rowTotal = res.total
    },
    tableSelectionChange(data) {
      this.selectedIds = data.map(v => v.id);
    },
    resetSearch() {
      this.filter = {
        name: '',
        lx: '',
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100],
      }
      this.getData();
    },
    add(){
      this.editorVisible = true;
    },
    edit({row}) {
        console.log(row);
        const { eid } = this;
        this.eid++;
        this.editFormData = {
            ...row,
            eid,
            sswg: row.sswg ? row.sswg.split(',') : ''
        };
        this.editorVisible = true;
    },
    remove({row}) {
      this.$confirm('确定删除该区域?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSealArea(row.id)
            .then(() => {
                this.$message.success('删除成功');
                this.getData();
            })
            .catch(e => {
                this.$message.error('删除失败');
                console.log(e);
            })
      })
    },
    deletePatch() {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSealArea(this.selectedIds.join(','))
            .then(() => {
                this.$message.success('删除成功');
                this.getData();
            })
            .catch(e => {
                this.$message.error('删除失败');
                console.log(e);
            })
      })
    },
    handleSelectChange() {
        this.getData();
    }
  }
}
</script>
