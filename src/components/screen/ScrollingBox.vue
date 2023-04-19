<template>
  <div class="scrolling-box">
    <div class="content">
      <div class="null-wrap" v-if="data.length===0">
        <img src="../../assets/image/icon-null.svg"/>
        <p>{{emptyMsg}}</p>
      </div>
     <div v-else>
       <div class="item-wrap" :class="{'item-wrap-move': isAnimate}" :style="{marginTop: mt +'px', transitionDuration: duration+'s', transitionProperty: isAnimate?'all':'none'}">
         <div v-for="(item,index) in data" :key="index" class="item" ref="item">
           <slot name="listItem" v-bind="item"></slot>
         </div>
       </div>
       <!--以下为重复数据，用于实现滚动效果-->
       <div class="item-wrap" v-if="isRolling">
         <div v-for="(item,index) in mirrorList" class="item" :key="index">
           <slot name="listItem" v-bind="item"></slot>
         </div>
       </div>
     </div>
    </div>
  </div>
</template>

<script>
  //后续考虑将条目内容也改为可配置

  export default {
    name: 'scrolling-box',
    components: {},
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      maxRow: {
        //允许最大条目数
        type: Number,
        default: 5
      },
      delay:{
        //每项停顿时间(秒)
        type: Number,
        default: 3
      },
      duration:{
        //每项过渡时间(秒)
        type: Number,
        default: 1
      },
      emptyMsg: {
        //空数据内容
        type: String,
        default: `暂无数据`
      },
      hoverStop: {
        //鼠标悬停则停止滚动
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        //镜像内容
        mirrorList: [],
        //y轴偏移量
        mt: 0 ,
        //是否动画过渡
        isAnimate: false,
        //是否在滚动中
        isRolling: false,
        //定时器
        clock: null,
        //计数器
        count: 0,
        //当前是否鼠标悬浮中
        isHover: false
      }
    },
    mounted () {
      this.initInteract()
    },
    watch: {
      data:{
        handler() {

          // 复制一份数据
          this.mirrorList = this.data.slice(0, this.maxRow)

          if (!this.clock) {

            //如果条目数没超过允许的最大值，则不需要滚动
            if (this.data.length <= this.maxRow) {
              return
            }
            this.$nextTick(() => {
              this.initRolling()
            })
          }
        },
        immediate: true
      },
    },
    methods: {
      initInteract(){
        this.$el.addEventListener('mouseover',(e)=>{
          this.isHover = true
        })
        this.$el.addEventListener('mouseleave',(e)=>{
          this.isHover = false
        })
      },

      getItemHeight(index) {
        const dom = this.$refs['item'][index % this.data.length]
        if (dom) {
          const {height, marginTop, marginBottom} = window.getComputedStyle(dom)
          return parseFloat(height) + parseFloat(marginTop) + parseFloat(marginBottom)
        } else {
          return 0
        }
      },

      initRolling() {

        this.count = 0
        const len = this.data.length
        this.isAnimate = true
        this.isRolling = true

        this.clock = setInterval(() => {

          if (this.hoverStop && this.isHover) {
            //鼠标悬浮则暂停
            return
          }
          if (this.count >= len) {
            this.isAnimate = false
            this.mt = 0
            this.count = 0
          } else {
            this.isAnimate = true
            this.mt += -this.getItemHeight(this.count)
            this.count++
          }
        }, this.delay * 1000)

      },

      stop(){
        if (this.clock) {
          this.clearClock()
          this.isAnimate = false
          this.mt = 0
          this.count = 0
        }
      },
      start(){
        if (!this.clock) {
          this.initRolling()
        }
      },
      clearClock () {
        clearInterval(this.clock)
        this.clock = null
      }
    }
  }
</script>

<style lang="scss" type="text/scss" >
  .scrolling-box {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;

    .content {
      margin: 0;
      padding: 0;

      .null-wrap {
        display: flex;
        align-items: center;
        flex-direction: column;
        p {
          color: #fff;
          margin: 5px 0;
        }
      }
    }
  }
</style>
