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
      <el-select v-model="region" placeholder="请选择区/县" :disabled="readonly" v-show="regionVisible">
        <el-option v-for="(name, code) in region_options" :key="code" :label="name" :value="code"></el-option>
      </el-select>
    </div>

    <div class="item-gap" v-if="!attrs.unNeedInputAddress">
      <el-select v-model="town" placeholder="请选择镇街" :disabled="readonly" v-show="townVisible"  >
        <el-option v-for="(name, code) in town_options" :key="code" :label="name" :value="code"></el-option>
      </el-select>
    </div>

    <div class="item-gap" v-if="!attrs.unNeedInputAddress">
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


   <!--{{ [province_cn,city_cn,region_cn,town_cn,comm_cn,door].filter(v=>!!v).join(',')}}-->
   <!--<br/>-->
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

        city_options:{},
        city:null,

        region_options: {},
        region: null,

        town_options:{},
        town: null,

        comm_options:{},
        comm: null,

        door: '', //详细地址门牌号
        full: '', //完整地址

        city_org: null,
        region_org: null,
        town_org: null,
        comm_org: null,
        initValue: true
      }
    },
    computed:{
      cityVisible() {
        return this.city !== null
      } ,
      regionVisible(){
        return this.region !== null
      },
      townVisible(){
        return this.town !== null
      },
      commVisible(){
        return this.comm !== null
      },
      province_cn(){
        return this.province ? PROVINCE_MAP[this.province] : ''
      },
      city_cn(){
        return this.province && this.city ? CITY[this.province][this.city] : ''
      },
      region_cn() {
        if (!this.region) return
        if (['1', '2', '3', '4', '52993'].includes(this.province)) {
          return this.region_options[this.region]
        } else {
          return this.city ? this.region_options[this.region] : ''
        }
      },
      town_cn() {
        return this.region && this.town_options ? this.town_options[this.town] : ''
      },
      comm_cn() {
        return this.town && this.comm_options ? this.comm_options[this.comm] : ''
      }
    },
    watch:{

      async value({code, door}, oldVal) {

        if (this.readonly) {
          const [province, city, region, town, comm] = code.split(',')

          this.province = province || null
          this.city = city || null
          this.region = region || null
          this.town = town || null
          this.comm = comm || null
          this.door = door || null

          if (['1', '2', '3', '4', '52993'].includes(province)) {
            this.city_options = []
            this.region_options = REGION[province]
          } else {
            this.city_options = CITY[province]
            this.region_options = REGION[this.city]
          }
          if (town) {
            this.town_options = await this.getTowns(region)
            this.comm_options = COMM[town]
          }


        }
        if (this.attrs.editabel && !oldVal) {
          console.log('init')
          const [province, city, region, town, comm] = code.split(',')
          this.province = province || null
          this.city = city || null
          this.region = region || null
          this.town = town || null
          this.comm = comm || null
          this.door = door || null
          console.log(province, city, region, town, comm, door)
          if (['1', '2', '3', '4', '52993'].includes(province)) {
            //北京市、天津市、上海市、重庆市为直辖市 港澳
            this.region_options = REGION[province]
          } else {
            this.city_options = CITY[province]
            this.region_options = REGION[city]
          }
          if (region) {
            this.town_options = await this.getTowns(region)
          }
          this.comm_options = COMM[town]
          this.handleChange()
          setTimeout(() => {
            this.initValue = false
          }, 100)
        }
      },

      // 完整地址有变化时，派发value
      full(val) {

        const {province, city, region, town, comm} = this

          this.$emit('input', {
            code: [province, city, region, town, comm].join(',') ,
            door: this.door,
            desc: this.full,
            verify: this.verify
          })
      },

      async province(code, oldVal){
        if (this.attrs.editabel) {
          if (!oldVal && this.initValue) {
            setTimeout(() => {
              this.initValue = false
            }, 100)
          }
           // 处理编辑
          if (!this.initValue) {
            if (['1', '2', '3', '4', '52993'].includes(code)) {
              //北京市、天津市、上海市、重庆市为直辖市 港澳
              this.region_options = REGION[code]
              this.city = null
              this.region = ''
              console.log(code)
              this.town_options = await this.getTowns(code)
            } else {
              this.city_options = CITY[code]
              this.region = null
              this.city = ''
            }
            this.town = null
            this.comm = null
          }
          // 处理新增
          if (['1', '2', '3', '4', '52993'].includes(code)) {
            //北京市、天津市、上海市、重庆市为直辖市 港澳
            this.region_options = REGION[code]
          } else {
            this.city_options = CITY[code]
          }
          if (code !== null) {
            if (['1', '2', '3', '4', '52993'].includes(code)) {
            //北京市、天津市、上海市、重庆市为直辖市 港澳
              this.region = this.region ? this.region : ''
            } else {
              this.city = this.city ? this.city : ''
            }
          }
          this.handleChange()
          return
        }
        if (this.readonly) {
          return
        }
        if (!code) {
          this.reset()
        } else if (['1', '2', '3', '4', '52993'].includes(code)) {
          //北京市、天津市、上海市、重庆市为直辖市 港澳
          this.region_options = REGION[code]
          this.city = null
          this.region = ''
        } else {
          this.city_options = CITY[code]
          this.city = ''
          this.region = null
        }
        this.town = null
        this.comm = null
        this.handleChange()

      },
      city(code, oldVal){
        if (this.attrs.editabel) {
          this.region_options = REGION[code]
          if (!this.initValue && code !== null) {
            this.region = ''
            this.town = null
            this.comm = null
          }
          if (code === '') {
            this.region = null
          }
          this.handleChange()
          return
        }
        if (!code || this.readonly) {
          return
        }
        this.region_options = REGION[code]
        this.region = ''
        this.town = null
        this.comm = null
        this.handleChange()

      },
      async region  (code, oldVal) {
        if (this.attrs.editabel) {
          if (!this.initValue) {
            if (code) {
              this.town_options = await this.getTowns(code)
              this.town = ''
            }
            if (code === '') {
              this.town = null
            }
            this.comm = null
          }
          this.handleChange()
          return
        }
        if (!code || this.readonly) {
          return
        }
        this.town_options = await this.getTowns(code)

        if (this.town_options) {
          this.town = ''
        } else {
          this.town = null
        }
        this.comm = null

        this.handleChange()

      },
      town(code, oldVal) {
        if (this.attrs.editabel) {
          // console.log(code)
          // if (code === '') {
          //   this.town = null
          // }
          this.comm_options = COMM[code]
          if (this.comm_options && oldVal) {
            //有社区数据
            this.comm = ''
          } else {
            this.comm = null
          }
          this.handleChange()
          return
        }
        if (this.readonly) {
          return
        }
        if(!code || !this.town_options ){
          this.comm = null
          return
        }

        this.comm_options = COMM[code]
        if (this.comm_options) {
          //有社区数据
          this.comm = ''
        } else {
          this.comm = null
        }

        this.handleChange()
      },
      comm(code) {
        if (!code || this.readonly) {
          return
        }
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
      },

      reset() {
        this.city = null
        this.region = null
        this.town = null
        this.comm = null
      },

      handleChange() {
        const arr = [this.province_cn,this.city_cn,this.region_cn,this.town_cn,this.comm_cn,this.door].filter(v=>!!v)
        //改变完整地址，触发full监听
        this.full = arr.join(',')
      },

      // 校验组件的填写情况
      verify(callback) {
        const {province, city, region, town, comm} = this

        const opts = [true, city !== null, region !== null, town !== null, comm !== null] //选择框显示情况
        const sels = [!!province , !!city , !!region, !!town, !!comm] //选择框选择情况

        if (this.door && opts.toString() !== sels.toString()) {
          callback(new Error("请选择行政区域"))
          return
        }
        if (province && this.door == '' && !this.attrs.unNeedInputAddress) {
          callback(new Error("请填写详细地址"))
          return
        }
        callback()

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
  padding: 0 .3em .5em 0;
}
@media screen  and (max-width: 460px){
  .item-gap{
    display: block;
  }
}
</style>
