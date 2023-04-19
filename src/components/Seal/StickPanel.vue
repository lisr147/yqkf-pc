<template>
  <div class="el-dialog stick-dialog" ref="dialog" :style="styleObj" v-dialogDrag  >

    <div class="el-dialog__header" >
      <span class="el-dialog__title">{{ title }}</span>
      <b class="sticked" @click="closePanel"></b>
    </div>
    <div class="el-dialog__body">
      <component :is="module" :attributes="data"></component>
    </div>
  </div>
</template>

<script>
  import {DeviceMap} from "@/config/setting"
  export default {
    name: "StickPanel",
    components: {
  },
    props:{
      data: {
        type: Object,
        default: () => {}
      },
      id: {
        type: [String, Number]
      },
      myStyle: {
        type: Object
      }
    },
    data(){
      return {
        module: null,
        detail: {},
        loading: true
      }
    },
    watch:{
      data: {
        handler: function (obj) {
          if (Object.keys(obj).length <= 0) {
            return
          }
          const fn = DeviceMap[obj.deviceType].fn
          //根据设备类型加载对应组件
          this.module = ()=> import(`@/components/Seal/${fn}.vue`)
        },
        immediate: true
      }
    },
    computed: {
      styleObj () {
        let {top, left, zIndex, width, height} = this.myStyle
        return (top !== undefined && left !== undefined) ?
          {
            top: top + 'px',
            left: left + 'px',
            width: width + 'px',
            height: height + 'px',
            zIndex:zIndex
          } : {zIndex: zIndex}
      },
      title(){
        return this.data.deviceName  || '设备名称'
      }
    },
    mounted() {
      console.log(this.styleObj)
    },
    methods:{
      closePanel(){
        this.$store.commit('REMOVE_FLOATING', {id: this.id})
      },
      savePosition(event){
        const targetTop = parseInt(this.$el.style.top)
        const targetLeft = parseInt(this.$el.style.left)
        const targetZIndex = parseInt(this.$el.style.zIndex)

        let {top, left, zIndex} = this.myStyle

        // 保存位置
        if (targetTop !== top || targetLeft !== left || targetZIndex !== zIndex) {
          this.$store.commit('UPDATE_FLOATING', {
            id: this.id,
            top: targetTop,
            left: targetLeft,
            zIndex: targetZIndex
          })
        }

      }
    }
  }
</script>

<style lang="scss" type="text/scss">

  .stick-dialog {
    position: absolute !important;

    .stick,
    .sticked{
      position: absolute;
      top: -8px;
      right: 2.5em;
      width: 40px;
      height: 40px;
      cursor: pointer;
      background:url("~@/assets/image/ico-stick1.svg") center center no-repeat;
      opacity: 0.5;

      &:hover{
        opacity: 1;
      }
    }
    .sticked{
      background:url("~@/assets/image/ico-stick2.svg") center center no-repeat;
      right: 0.5em;
    }


  }
</style>
