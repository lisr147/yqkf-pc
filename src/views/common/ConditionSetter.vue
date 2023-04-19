<template>
  <div class="condition-setter">
     <div v-if="readonly">
       <!--查看模式-->
       <el-table
           :data="dataList"
           border
           max-height="400"
           style="width: 100%">
         <el-table-column prop="name" label="采样部位" width="100"></el-table-column>
         <el-table-column prop="result" label="环境结果" width="80"></el-table-column>
         <el-table-column prop="desc" label="结果具体描述" ></el-table-column>
       </el-table>
     </div>

     <!--编辑模式-->
     <div class="condition-setter-m" v-if="!readonly">
       <div v-for="(item,index) in dataList" :key="index" class="item">
         <div>
           <span class="label">采样部位</span>
           <el-input  size="mini"  type="text" v-model="item.name" style="width:120px;" show-word-limit maxlength="50"/>

           <span class="label">环境结果</span>
           <el-select  size="mini"  v-model="item.result"  style="width:100px;">
             <el-option label="阴性" value="阴性"></el-option>
             <el-option label="阳性" value="阳性"></el-option>
           </el-select>
           <el-button icon="el-icon-minus" size="mini" type="primary" @click="removeItem" circle></el-button>
         </div>
         <div>
           <span class="label">具体描述</span>
           <el-input  size="mini" placeholder="请输入具体描述" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" v-model="item.desc" show-word-limit maxlength="500" style="width:290px;"/>
         </div>
       </div>
     </div>
    <div class="condition-setter-f" v-if="!readonly">
      <span v-if="dataList.length==0" style="float:left;">暂无数据</span>
      <el-button icon="el-icon-plus" size="mini" type="success" @click="addItem" circle></el-button>
    </div>
  </div>

</template>

<script>
export default {
  name: "ConditionSetter",
  components: {},
  props:{
    value: {type: String},//值
    mode: {type: String, default:'edit'}, //当前模式mode: 'new','edit','view'
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    dataList:{
      handler(val) {
        this.$emit('change', JSON.stringify(val))
      },
      deep: true
    }
  },
  computed:{
    readonly() {
      return !['new', 'edit'].includes(this.mode)
    }
  },
  methods: {
    getData(){
      try {
        this.dataList = JSON.parse(this.value || '[]')
      } catch (err) {
        console.error('ConditonSetter JOSN解析失败')
      }
    },
    addItem(){
      this.dataList.push({
        name: '未知',
        result: '阴性',
        desc: ''
      })
    },
    removeItem(index) {
      this.dataList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" type="text/scss">
.condition-setter {
  padding: 0 0 0 .5em;
  background-color: #f0f0f0;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  &-m {
    .item {padding: 0.5em 0;}
    .label {padding: 0 .5em; vertical-align:top;}
    .el-button {margin: 0 0.5em;}
  }
  &-f {padding: 0.5em 1.2em 0.5em 0.6em; text-align: right;}
}
</style>
