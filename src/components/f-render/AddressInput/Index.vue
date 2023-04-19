<template>
  <div :class="desc.class" v-on="desc.on">
    <div class="item-gap">
      <el-select v-model="province" placeholder="请选择省份/市" :disabled="readonly"  >
        <!--<el-option :key="-1" :value="null" label="不选"></el-option>-->
        <el-option-group v-for="group in province_options" :key="group.label" :label="group.label">
          <el-option v-for="item in group.options" :key="item.code" :label="item.address" :value="item.code"></el-option>
        </el-option-group>
      </el-select>
    </div>

    <div class="item-gap">
      <el-select v-model="city" placeholder="请选择市"  :disabled="readonly" v-show="cityVisible" >
        <el-option v-for="(name, code) in city_options" :key="code" :label="name" :value="code"></el-option>
      </el-select>
    </div>

    <div class="item-gap">
      <el-select v-model="region" placeholder="请选择区/县" :disabled="readonly" >
        <el-option v-for="(name, code) in region_options" :key="code" :label="name" :value="code"></el-option>
      </el-select>
    </div>

    <div class="item-gap">
      <el-select v-model="town" placeholder="请选择镇街" :disabled="readonly" v-show="townVisible"  >
        <el-option v-for="(name, code) in town_options" :key="code" :label="name" :value="code"></el-option>
      </el-select>
    </div>

    <div class="item-gap">
      <el-select v-model="comm" placeholder="请选择社区" :disabled="readonly" v-show="commVisible">
        <el-option v-for="(name, code) in comm_options" :key="code" :label="name" :value="code"></el-option>
      </el-select>
    </div>


    <el-input type="textarea" @input="handleChange"
              :readonly="readonly"
              :autosize="{ minRows: 2, maxRows: 6}"
              v-model="door" placeholder="请输入详细住址，门牌号"
              v-if="!attrs.unNeedInputAddress">
    </el-input>


   <!--{{[province_cn,city_cn,region_cn,town_cn,comm_cn,door].filter(v=>!!v).join(',')}}-->

   <!--{{[province,city,region,town,comm].join(',')}}-->

  </div>
</template>

<script>
  import formMixin from 'vue-ele-form/lib/mixins/formMixin'
  import {getTownById} from '@/api/address-input'

  import {PROVINCE, PROVINCE_MAP} from './data/province.js'
  import CITY from './data/city.js'
  import REGION from './data/region.js'
  import COMM from './data/comm.js'


  export default {
    name: "AddressInput",
    mixins: [formMixin], // 必须引入mixin
    props:{
      readonly: {
        type: Boolean
      },
      value: Object,
      desc: {
        type: Object
      }
    },
    components: {},
    data() {
      return {
        newValue: this.value,

        province_options: [],
        province: '',
        province_cn: '',

        city_options:{},
        city:null,
        city_cn:'',

        region_options: {},
        region: null,
        region_cn: '',

        town_options:{},
        town: null,
        town_cn: '',

        comm_options:{},
        comm: null,
        comm_cn: '',

        door: '', //详细地址门牌号
        full: '', //完整地址

        city_org: null,
        region_org: null,
        town_org: null,
        comm_org: null
      }
    },
    computed:{
      cityVisible() {
        return this.city
      } ,
      townVisible(){
        return this.town
      },
      commVisible(){
        return this.comm
      }
    },
    watch:{

      value({code, door}, oldVal) {

        if (oldVal == undefined && this.readonly) {
          const [province, city, region, town, comm] = code.split(',')
          this.city_org = city
          this.region_org = region
          this.town_org = town
          this.comm_org = comm
          this.door = door

          this.province = province
        }

      },

      // 完整地址有变化时，派发value
      full(val) {
        this.$emit('input', {
          code: this.province ? [this.province, this.city, this.region, this.town, this.comm].join(',') : '',
          door: this.door,
          desc: this.full
        })

        // console.log({
        //   code: this.province ? [this.province, this.city, this.region, this.town, this.comm].join(',') : '',
        //   door: this.door,
        //   desc: this.full
        // })
      },

      province(code){
        // console.log('province change' + code)
        this.province_cn = PROVINCE_MAP[code]
        if (!code) {
          this.reset()
        } else if (['1', '2', '3', '4', '52993'].includes(code)) {
          //北京市、天津市、上海市、重庆市为直辖市 港澳 钓鱼岛
          this.region_options = REGION[code]
          if (this.region_org) {
            this.region = this.region_org
            this.region_org = null
          } else {
            this.region = Object.keys(this.region_options)[0]
          }
          this.city = null
          this.city_cn = ''
        } else {
          this.city_options = CITY[code]
          if (this.city_org) {
            this.city = this.city_org
            this.city_org = null
          } else {
            this.city = Object.keys(this.city_options)[0]
          }
        }
        this.handleChange()

      },
      city(code){
        // console.log('city ' + code)
        if (!code) {
          return
        }
        this.city_cn = this.city_options[code]

        this.region_options = REGION[code]
        if (this.region_org) {
          this.region = this.region_org
          this.region_org = null
        } else {
          this.region = Object.keys(this.region_options)[0]
        }
        this.handleChange()

      },
      async region  (code) {
        // console.log('region ' + code)
        this.region_cn = this.region_options[code]

        this.town_options = await this.getTowns(code)

        if (this.town_options) {
          if(this.town_org){
            this.town = this.town_org
            this.town_org = null
          }else{
            this.town = Object.keys(this.town_options)[0]
          }
        } else {
          this.town = null
          this.town_cn = ''
          this.comm = null
          this.town_cn = ''
        }

        this.handleChange()

      },
      town(code) {
        // console.log('town ' + code)
        if(!code || !this.town_options){
          this.comm = null
          this.comm_cn = ''
          return
        }

        this.town_cn = this.town_options[code]

        this.comm_options = COMM[code]
        if (this.comm_options) {
          //有社区数据
          if (this.comm_org) {
            this.comm = this.comm_org
            this.comm_cn = this.comm_options[this.comm_org]
            this.comm_org = null
          } else {
            this.comm = Object.keys(this.comm_options)[0]
            this.comm_cn = Object.values(this.comm_options)[0]
          }
        } else {
          this.comm = null
          this.comm_cn = ''
        }

        this.handleChange()
      },
      comm(code){
        if(!code){
          return
        }
        this.comm_cn = this.comm_options[code]

        this.handleChange()
      }

    },
    mounted() {
      this.initProvince()
    },
    methods: {

      initProvince(){
        // 初始化省份
        const arr = Object.keys(PROVINCE)

        this.province_options = arr.map(key=>{
          return {
            label: key,
            options: PROVINCE[key]
          }
        })
        //选择默认省份
        // this.province = this.province_options[0].options[0].code
      },

      reset() {
        this.province_cn = ''
        this.city = null
        this.region = null
        this.town = null
        this.comm = null
        this.city_cn = ''
        this.region_cn = ''
        this.town_cn = ''
        this.comm_cn = ''
      },

      handleChange() {

        this.$nextTick(()=>{
          const arr = [this.province_cn,this.city_cn,this.region_cn,this.town_cn,this.comm_cn,this.door].filter(v=>!!v)
          this.full = arr.join(',')
        })

      },

      getTowns(id){
        return new Promise(resolve => {

          getTownById({id}).then(res => {

            if (!res || res.length <= 0) {
              resolve(null)
            } else {
              const obj = {}
              res.forEach(item => {
                obj[item.id] = item.name
              })
              resolve(obj)
            }

          })

        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.item-gap{
  display: inline-block;
  padding: 0 .5em .5em 0;
}
@media screen  and (max-width: 460px){
  .item-gap{
    display: block;
  }
}
</style>
