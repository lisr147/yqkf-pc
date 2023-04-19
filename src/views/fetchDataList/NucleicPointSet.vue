<template>
  <el-dialog
    :visible="true"
    top="5vh"
    title="关联核酸点"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="600px"
    custom-class="alarm-box"
  >
    <template>
      <el-form :model="form" ref="form">
        <el-form-item label="核酸点名称：" prop="nucleicIds">
          <el-select
            style="width: 50%"
            v-model="form.nucleicIds"
            multiple
            filterable
            :loading="loading"
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>


import {getNucleicPointList, setNucleicPointList} from '@/api/commonPlace'

export default {
  name: "NucleicPointSet",
  props: ['stationIds', 'linkNucleicPointIds'],
  data () {
    return {
      nucleicList:[],
      stationIdList:  this.stationIds,
      options:[],
      form: {
        nucleicIds: null
      },
      loading: false,
      // 场所关联核酸点信息
      ggcsLinkNucleicList: [],
      linkNucleicIdList: this.linkNucleicPointIds
    };
  },
  computed: {
    
  },
  mounted () {
    this.getNucleicPointList()
    this.initHasOptions()
  },
  methods: {
    async getNucleicPointList () {
      let res = await getNucleicPointList()
      this.nucleicList = res.map(v=>{
          return {
          label:v.templateId===10027?`${v.yljg}（大规模）`:`${v.cghsjcd}（常规）`,
          value:v._id,
          id:v._id,
          dz:v.szxxdz,
          templateId:v.templateId,
        }
      })
      this.options = this.nucleicList
    },
    // 初始化已经选择的核酸检测点
    initHasOptions(){
      this.form.nucleicIds = this.linkNucleicIdList
    },
    async save () {
      // 封装已经选择的核酸点
      let mapItem = []
      let obj = {
        stationId: [],
        mapList: []
      }
      // 将场所id加入
      obj.stationId = this.stationIdList
      for(let i = 0; i < this.form.nucleicIds.length; i++){
        mapItem = this.nucleicList.find(item => item.id === this.form.nucleicIds[i])
        let hsdInfo = {}
        hsdInfo._id = mapItem.id;
        hsdInfo.templateId = mapItem.templateId;
        if(hsdInfo.templateId===10027){
          hsdInfo.yljg =  mapItem.label.replace('（大规模）','')
        }else {
          hsdInfo.cghsjcd = mapItem.label.replace('（常规）','')
        }
        obj.mapList.push(hsdInfo)
      }
      this.ggcsLinkNucleicList = obj

      let res = await setNucleicPointList(this.ggcsLinkNucleicList)
      if(res === '设置成功'){
        this.$emit('close')
        this.$emit('change')
        this.linkNucleicIdList = []
        this.stationIdList = []

      }
    },
  }
};
</script>
