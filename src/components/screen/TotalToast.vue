<template>
  <div class="total-btn-wrapper act">
        <span class="t1">{{ toastItem.title }}</span>
        <span class="t2" :style="{ color: toastItem.color }">
            <span>{{ toastItem.data.total }}</span>
            <span v-if="toastItem.data.detail && toastItem.data.detail.length !==0" :title='this.toastItem.detail ? `(${this.toastItem.detail.map(v=>`${v.name} ${v.num} `)})` : ""'>
                 <span>(</span>
                 <span v-for="item in toastItem.data.detail" :key="item.name">{{item.name}}{{item.num}}</span>
                 <span>)</span>
            </span>
            <!-- <el-tooltip placement="right" v-if="toastItem.about">
              <div slot="content" v-html="toastItem.about"></div>
              <i slot="reference" class="el-icon-question"></i>
            </el-tooltip> -->
            <el-popover
                popper-class="screen-popover"
                v-if="toastItem.about"
                width="360"
                trigger="hover">
                <div v-html="toastItem.about"></div>
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
        </span>
      </div>
</template>

<script>

  export default {
    name: "TotalToast",
    props: {
      toastItem: {
        type: Object,
        default: () => ({
            title: '',
            color: '',
            data: {
                total: 0,
                detail: []
            },
            about: ''
        })
      }
    },
    data() {
      return {
        title: ''
      }
    },
  }
</script>

<style lang="scss" type="text/scss">
  .total-btn {
      &-wrapper {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;
            background: url(../../assets/image/ry-all-btn.png) no-repeat;
            min-width: 380px;
            height: 50px;
            line-height: 40px;
            background-size: 100% 100%;
            .t1 {
            font-size: 18px;
            color: #fff;
            margin-right: 4px;
            margin-left: 20px;
            }
            .t2 {
            font-size: 15px;
            font-weight: 600;
            }
        }
      &-detail-unit {
          margin-right: 5px;
      }
  }
  .total-btn-wrapper {
    .t2 span {
      margin-right: 5px;
    }
  }
</style>
