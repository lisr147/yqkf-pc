<template>
    <div>
        {{newValue?newValue.name:'请选择所在位置'}}
        <br>
        <el-button @click="dialog='picker'" type="primary" :disabled="disabled" v-if="!readonly" >{{newValue?'重新':''}}选择位置</el-button>
        <div class="picker-window" v-if="dialog==='picker'">
            <picker @choosed="choosed" @close="dialog=null" class="picker" :lngLat="newValue?newValue.lngLat:null" />
        </div>
    </div>
</template>
<script>
import Picker from './Picker.vue'
import formMixin from "vue-ele-form/lib/mixins/formMixin";
export default {
    name:'location-picker',
    components:{Picker},
    mixins: [formMixin], // 必须引入mixin
    data(){
        return{
            dialog:null,
            newValue:null
        }
    },
    methods:{
        choosed(data){
            this.$emit('input',data)
            this.newValue = data
        }
    }
}
</script>
<style lang="scss" scoped>
.picker-window{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    background-color: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    .picker{
        position: relative;
        width: 600px;
        height: 80%;
    }
}
@media only screen and (max-width: 768px) {
  .picker-window{
      .picker{
        position: relative;
        width: 100%;
        height: 100%;
    }
  }
}
</style>