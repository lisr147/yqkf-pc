<template>
  <div>
    <!-- <div class="path" v-if="pageName">{{pageName}}</div> -->
    <div class="content" :class="customClass || ''">
      <div class="tab-panel">
        <div class="wrapper">
          <slot name="info" />
          <!-- 搜索栏 -->
          <div class="searchFilter showMore-searchFilter" v-if="!hideSearch">
            <div
              id="searchInput"
              class="searchInput"
              ref="searchInput"
              :open="searchMore"
            >
              <slot name="searchFilter" />
            </div>
            <div class="searchControl">
              <el-button
                type="text"
                @click="searchMore = !searchMore"
                v-if="searchMoreButton"
              >
                <i
                  :class="
                    searchMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                  "
                />
                {{ searchMore ? "收起" : "展开" }}
              </el-button>
              <el-button type="primary" @click="$emit('search')"
                >查询</el-button
              >
              <el-button @click="$emit('resetSearch')">重置</el-button>
            </div>
          </div>

          <!-- 控制栏 -->
          <div
            class="button-group"
            :style="isKeyFilter ? 'min-height: 40px;' : ''"
          >
            <slot name="controler" />
            <!-- 右侧表格显示列筛选 -->
            <div style="float: right" v-if="isKeyFilter">
              <el-button
                type="primary"
                @click="checkAllKeys"
                class="tableKeys-all"
                >全部显示</el-button
              >
              <el-popover
                v-model="popoverStatus"
                trigger="click"
                @show="popoverStatus = true"
                @hide="popoverStatus = false"
              >
                <el-button slot="reference" class="tableKeys-select">
                  分类显示
                  <i class="el-icon-arrow-down" v-if="!popoverStatus" />
                  <i class="el-icon-arrow-up" v-else />
                </el-button>
                <div class="table-page-key-list">
                <draggable v-model="tableKeys" @end="dragEnd">
                  <template v-for="item in tableKeys">
                    <div :key="'checker_' + item.id" style="cursor: move">
                      <el-checkbox
                        v-model="item.checked"
                        :disabled="item.allways"
                        @change="keysCheckChange"
                        style="cursor: move"
                        >{{ item.label }}</el-checkbox
                      >
                    </div>
                  </template>
                </draggable>
                </div>
              </el-popover>
            </div>
          </div>

          <!-- 列表 -->
          <div class="device-table">
            <el-table
              :data="tableData"
              ref="typeTable"
              border
              @selection-change="handleSelect"
              @sort-change="sortChange"
              :cell-class-name="customClass || ''"
              :row-class-name="customClass || ''"
              :header-row-class-name="customClass || ''"
              v-loading="loading"
              :height="height"
              :show-summary="!!this.data.statistics"
              :summary-method="getSummaries"
              :span-method="getSpanMethod"
            >
              <el-table-column
                type="selection"
                width="40"
                align="center"
                fixed="left"
                v-if="data.selection"
                :selectable="
                  data.selectable
                    ? data.selectable
                    : () => {
                        return true;
                      }
                "
              />
              <!-- <el-table-column type="index" label="#" fixed="left" width="40" align="center" :index="rowIndex" /> -->
              <template v-for="item in tableKeys">
                <!-- 默认列 -->
                <template>
                  <el-table-column
                    :prop="item.id"
                    :key="item.id"
                    :min-width="item.minWidth ? item.minWidth : ''"
                    :width="item.width ? item.width : ''"
                    :label="item.label"
                    v-if="item.checked"
                    :show-overflow-tooltip="true"
                    :sortable="item.sortable"
                  >
                    <slot
                      :name="`column_${item.id}`"
                      slot-scope="scope"
                      :value="scope.row"
                    >
                      <div
                        v-if="item.formatter"
                        v-html="item.formatter(scope.row)"
                      />
                      <template v-else>{{
                        rowValue(scope, item.id) + ""
                          ? rowValue(scope, item.id)
                          : "-"
                      }}</template>
                    </slot>
                  </el-table-column>
                </template>
              </template>

              <el-table-column
                label="操作"
                :width="data.columnFunctionsWidth"
                align="center"
                v-if="data.tableFunctions && data.tableFunctions.length"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div>
                    <template v-for="item in data.tableFunctions">
                      <el-button
                        :key="item.label"
                        @click="item.method(scope)"
                        :disabled="item.disabled && item.disabled(scope)"
                        v-if="!item.hidden || !item.hidden(scope)"
                        type="text"
                        >{{ item.label }}</el-button
                      >
                    </template>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filter.pageNum"
            :page-sizes="filter.pageSizes"
            :page-size="filter.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filter.rowTotal"
            :customClass="customClass"
            background
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from './pageination.vue'
import draggable from 'vuedraggable'

export default {
  components: { pagination, draggable },
  props: [
    'data', // 表格数据
    'filter', // 页码和条数数据
    'pageName', // 表格名称
    'hideSearch', // 是否隐藏搜索栏
    'id', // 表格id，用于表格顺序本地保存的key
    'customClass', // 用于自定义样式
    'hideKeyFilter', // 用于隐藏分类显示按钮
    'loading',//显示加载中
    'height', //表格高度
    'defaultSearchMore', //默认是否展开更多
    'isMergeCell' //是否合并单元格
  ],
  name: 'TablePage',
  data () {
    return {
      tableKeys: [], // 表格列是否显示
      searchMoreButton: false, // 是否显示更多搜索按钮
      searchMore: true, // 是否显示更多搜索
      tableData: [], // 表格数据
      popoverStatus: false, // 分类显示状态
      isKeyFilter: false, // 是否显示分类显示按钮
      tableIndex: []// 表格自定义排序
    }
  },
  watch: {
    searchMore(value){

      let searchItems = this.$refs.searchInput.children[0].children
      console.log('searchMore',value,searchItems)
      if(!value){
        // 折叠
        let initTop = searchItems[0].offsetTop
        for(let i=0;i<searchItems.length;i++){
          if(searchItems[i].offsetTop>initTop){
            searchItems[i].style['display'] = 'none'
          }
        }
      }
      else{
        for(let i=0;i<searchItems.length;i++){
            searchItems[i].style['display'] = ''
          }
        }
    },
    // 'data.tableData': {
    //   async handler (v) {
    //     if (!v) {
    //       return
    //     }
    //     console.log('tableData change', v)
    //     this.tableData = v
    //     await this.$nextTick()
    //     this.tableData.forEach(row => {
    //       this.$refs.typeTable.toggleRowSelection(row, !!row.defaultSelect)
    //     })
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // 'data.tableKeys': {
    //   handler (v, oldVal) {
    //     if (!v) {
    //       return
    //     }
    //     this.tableKeys = v
    //     if (!oldVal && v.length > 4) {
    //       this.isKeyFilter = true
    //     }
    //     if (this.hideKeyFilter) {
    //       this.isKeyFilter = false
    //     }
    //     this.setTableKeys()
    //   },
    //   deep: true,
    //   immediate: true
    // },
    data: {
      async handler (v, oldVal) {
        console.log('tablePage data Change',v,oldVal)
        if (!v) {
          return
        }
        this.tableData = v.tableData
        await this.$nextTick()
        this.tableData.forEach(row => {
          this.$refs.typeTable.toggleRowSelection(row, !!row.defaultSelect)
        })
        this.tableKeys = v.tableKeys
        if (!oldVal && v.tableKeys.length > 4) {
          this.isKeyFilter = true
        }
        if (this.hideKeyFilter) {
          this.isKeyFilter = false
        }
        if(v.tableIndex){
          // 有表头选择记录
          this.tableIndex = v.tableIndex
        }
        this.setTableKeys ()
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    if (!this.hideSearch) {
    // 搜索框折叠
      let searchInput = this.$refs.searchInput
      if (searchInput.clientHeight > 65) {
      // 超过一行的时候，显示折起按钮
        this.searchMoreButton = true
        this.searchMore = this.defaultSearchMore
      }
      let self = this
      window.onresize = function () {
        if (searchInput.clientHeight > 80) {
          self.searchMoreButton = true
          return
        }
        if (self.searchMore) {
          self.searchMoreButton = false
        }
      }
    }
  },
  methods: {

    async setTableKeys () {
      let tableKeys = this.data.tableKeys.map(v => {
        v.checked = true
        this.tableKeys.forEach(t2 => {
          if (v.id === t2.id) {
            v.checked = t2.checked
          }
        })
        return v
      })

      if (this.id && this.tableIndex.length) {
        // 表格缓存字段排序
        let tableKeyIndex = {}
        tableKeys.forEach(v => {
          tableKeyIndex[v.id] = v
        })

        tableKeys = []
        this.tableIndex.forEach(v => {
          if (tableKeyIndex[v.id]) {
            tableKeyIndex[v.id].checked = v.checked
            tableKeys.push(tableKeyIndex[v.id])
          }
        })
      }
      await this.$nextTick()
      this.tableKeys = tableKeys
    },
    rowValue (scope, id) {
      return eval(`scope.row.${id}`)
    },
    /**
     *@Description:分页切换
     *@params {String}:每页条数
     */
    handleSizeChange (val) {
      this.$emit('sizeChange', val)
    },
    /**
     *@Description:当前页切换
     *@params {String}:页码
     */
    handleCurrentChange (val) {
      this.$emit('currentChange', val)
    },
    /**
     *@Description:多选
     *@params {Object}:多选数据
     */
    handleSelect (data) {
      this.$emit('tableSelectionChange', data)
    },
    /**
     * 排序
     */
    sortChange ({ column, prop, order }) {
      this.$emit('sortChange', { column, prop, order })
    },
    /**
     * 表头拖动排序
     */
    dragEnd () {
      // 重新渲染表格
      let tableKeys = Array.from(this.tableKeys)
      this.tableKeys = []
      let self = this
      this.$nextTick().then(() => {
        self.tableKeys = tableKeys
        self.saveKeys()
      })
    },
    checkAllKeys () {
      this.tableKeys.map(v => { v.checked = true })
      this.keysCheckChange()
    },
    keysCheckChange () {
      this.$forceUpdate()
      this.saveKeys()
    },
    async saveKeys () {
      // 保存表格顺序到本地缓存
      let tableIndex = this.tableKeys.map(v => {
        return { id: v.id, checked: v.checked }
      })
      this.$emit('setTableKeys', tableIndex)
    },
    rowIndex (index) {
      return index + 1 + (this.filter.pageNum - 1) * this.filter.pageSize
    },
    getSummaries(params){
      let res = []
      let tableKeysIndex = this.tableKeys.map(v=>v.id)
      for(let i in this.data.statistics){
        if(tableKeysIndex.indexOf(i)>=0){
        res[tableKeysIndex.indexOf(i)]=this.data.statistics[i]
        }
      }
      return res
    },
    //合并单元格
    getSpanMethod ({ row, columnIndex }) {
      if(!this.isMergeCell) return
      if (columnIndex === 0) {
        return [row.rowSpan, 1]
      } else {
        return [1, 1]
      }
    },
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
/**
* 表格
*/
.el-table {
  .el-button {
    padding: 0px 5px;
  }
}
.el-table th {
  background-color: #f7f7f7;
  color: #666;
}
.el-table-column--selection .cell {
  text-overflow: unset;
}
.el-table__expanded-cell[class*="cell"] {
  padding: 5px;
}
/*防止表头会出现填充不满问题*/
.el-table td.gutter,
.el-table th.gutter {
  display: block !important;
}

// 搜索栏样式
.searchFilter {
  min-height: 60px;
  .el-input {
    width: 180px;
  }
}

.showMore-searchFilter {
  display: flex;
  justify-content: space-between;
  .searchInput {
    // height: 56px;
    width: 100%;
    overflow: hidden;
    .el-form--inline {
      .el-form-item {
        margin-right: 0px;
        white-space: nowrap;
        // width: 280px;
        display: inline-flex;
        .el-form-item__content {
          flex-grow: 1;
        }
      }
      .search2x {
        width: 560px;
        .el-input__inner {
          width: 100%;
        }
      }
    }
    @media screen and (max-width: 1600px) {
      .el-form--inline .el-form-item {
        min-width: 300px;
        width: 32%;
        // background-color: #aabbcc;
        white-space: nowrap;
        .el-form-item__content {
          width: calc(100% - 100px);
          .el-input {
            width: 100%;
          }
        }
      }
      .el-form--inline .search2x {
        min-width: 600px;
        width: 64%;
      }
    }
  }
  .searchInput[open] {
    height: auto;
  }
  .searchControl {
    width: 200;
    text-align: right;
    flex-shrink: 0;
  }
}
.path {
  height: 56px;
  line-height: 56px;
  margin: 0 20px;
  border-bottom: 1px solid #dddddd;
  font-size: 16px;
  color: #666666;
  font-weight: bold;
  text-align: left;
}
.el-main-body {
  position: relative;
  margin: 6px;
  border: 1px solid #ddd;
  background-color: #fff;
  min-height: 95%;
  box-sizing: border-box;
}
.content {
  margin: 20px;
  text-align: left;
  box-sizing: border-box;
  .wrapper .button-group {
    margin-bottom: 22px;
    // min-height: 40px;

  }
}
.table-page-key-list{
      max-height: 50vh;
      overflow: auto;
    }
// 全部显示和分类显示
.tableKeys-all {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.tableKeys-select {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-color: #409eff;
  color: #409eff;
  i {
    display: inline-block;
    width: 0px;
  }
}

// 全局样式
.el-table td,
.el-table th {
  height: 44px;
  line-height: 44px;
  padding: 0px;
}
.el-table th > .cell {
  font-size: 14px;
  font-weight: 600;
}
</style>
