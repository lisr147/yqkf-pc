<template>
  <div class="f-render-left">
    <!-- 搜索 -->
    <!--<div class="f-render-header f-render-comp-searcher">-->
      <!--<el-input-->
        <!--clearable-->
        <!--placeholder="请输入关键字查找组件"-->
        <!--v-model.trim="keyword"-->
      <!--&gt;</el-input>-->
    <!--</div>-->

    <!-- 组件列表 -->
    <perfect-scrollbar class="f-render-scrollarea">
      <h3 class="f-render-head">常规组件</h3>
      <vue-draggable
        :disabled="!editable"
        :clone="handleAddFormItem"
        :group="{ name: 'form', pull: 'clone', put: false }"
        :list="defaultComps"
        class="f-render-comps"
        :sort="false"
        tag="ul">
        <li
          v-for="item of defaultComps"
          :key="item.type"
          :title="item.label"
          @click="handleDoubleClick(item)"
          class="f-render-comp">
          <div>{{ item.label }}</div>
        </li>
      </vue-draggable>

      <h3 class="f-render-head">业务组件</h3>
      <vue-draggable
        :disabled="!editable"
        :clone="handleAddFormItem"
        :group="{ name: 'form', pull: 'clone', put: false }"
        :list="plusComps"
        class="f-render-comps"
        :sort="false"
        tag="ul">
        <li
          v-for="item of plusComps"
          :key="item.type"
          :title="item.label"
          @click="handleDoubleClick(item)"
          class="f-render-comp">
          <div>{{item.label}}</div>
        </li>
      </vue-draggable>

    </perfect-scrollbar>
  </div>
</template>

<script>

  import comps from "@/components/f-render/config/comps.js"

  export default {
    inject: ["frender"],
    props: {
      editable: {
        type: Boolean,
        default: true
      }
    },
    computed: {

    },
    data() {
      return {
        keyword: "",
        defaultComps: [], //常用组件
        plusComps: [] //业务组件
      };
    },
    created(){
      this.defaultComps = this.getCompsListByOrder([
        'input',
        'textarea',
        'select',
        'checkbox',
        'radio',
        'rate',

        'number',
        'switch',
        'date',
        'daterange',
        'datetime',
        // 'datetimerange',
        'date-time-range2',
        // 'time',
        'time-picker',
        'timerange',
        'dates',
        'week',
        'month',
        'monthrange',
        'year',
        'slider',
        'image',
        'text',
        // 'radio-input', //完成，暂不启用
        // 'checkbox-input' //完成，暂不启用
      ])
      this.plusComps =  this.getCompsListByOrder([
        'mobile-validator',
        'image-uploader',
        'upload-file',
        'id-card-no',
        'mobile-input',
        'address-input',
        'location-picker'
      ])
    },
    methods: {

      getCompsListByOrder(order) {
        let arr = []
        order.forEach(key => {
          let match = comps.find(o => o.type == key)
          if (match) {
            arr.push(match)
          } else {
            console.log(`不存在 ${o.type}`)
          }
        })
        return arr
      },

      getFormItemByConfig({ type, label }) {
        const formItemData = this.frender.getFormItemByType(type);
        return {
          label,
          field: "key_" + Date.now(),
          ...formItemData
        };
      },
      // 双击添加表单
      handleDoubleClick(config) {
        const formItemData = this.getFormItemByConfig(config);
        this.frender.formItemList = [...this.frender.formItemList, formItemData];
      },
      // 拖拽后新增表单项
      handleAddFormItem(config) {
        return this.getFormItemByConfig(config);
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .f-render-left{
    width: 300px;
    padding: 24px;
    padding-left: 0px;
  }
  /* 搜索框 */
  .f-render-comp-searcher {
    padding: 0 10px;
  }

  /* 组件列表 */
  .f-render-head{
    padding: 0.4em;
  }
  .f-render-comps {
    padding: 0;
    margin-top: 0;

    .f-render-comp {
      width: calc(50% - 10px);
      min-width: 90px;
      line-height: 1.5em;
      overflow: hidden;
      cursor: move;
      white-space: nowrap;
      display: inline-block;
      text-overflow: ellipsis;
      border-radius: 3px;
      padding: 6px 8px;
      box-sizing: border-box;
      margin: 5px;
      font-size: 12px;

      background-color: $theme-color2;
      border: 1px solid $theme-color2;
      color: #fff;
      
    }

    .f-render-comp-title {
      font-weight: bold;
      color: #fff;
    }
  }


</style>
