<template>
  <el-dialog
    @close="handleClose"
    append-to-body
    width="500px"
    :title="detail.title"
    :visible="showme"
    :modal="true"
    >

    <div class="loading" v-if="isLoading">
      <span>
        <i class="el-icon-loading"></i>
        <p>正在加载正文...</p>
      </span>
    </div>
    <div v-else>
      <h2 class="caption">{{detail.msgTitle}}</h2>
      <div class="about">
        <span>作者：{{detail.ownerName}}</span>
        <span>发布时间：{{detail.sendTime}}</span>
      </div>
      <div class="content" v-html="detail.msgContent">

      </div>

    </div>

  </el-dialog>
</template>

<script>
import { getNotices } from '@/api/notice'

export default {
  name: 'NoticeDetail',
  props: {
    showme: { type: Boolean },
    id: { type: Number}
  },
  model: {
    prop: 'showme',
    event: 'toggle'
  },
  data () {
    return {
      detail: {
        msgTitle: '',
        msgContent: '',
        ownerName: '',
        sendTime: ''
      }
    }
  },
  watch: {
    showme (newVal) {
      if (newVal && this.id) {
        this.getData()
      }
    }
  },
  computed: {
    isLoading () {
      return this.detail.msgTitle == ''
    }
  },
  mounted () {

  },
  methods: {
    getData () {
      if (this.id == void 0) {
        return
      }

      getNotices({
        id: this.id
      }).then(res => {

        const {msgTitle, msgContent, ownerName, sendTime} = res

        this.detail = {
          msgTitle,
          msgContent,
          ownerName,
          sendTime
        }
      })
    },

    // 派发关闭事件
    handleClose() {
      this.detail = {
        msgTitle: '',
        msgContent: '',
        ownerName: '',
        sendTime: ''
      }
      this.$emit('toggle', false)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.caption{
  font-size: 1.5em;
  text-align: center;
}
.about{
  padding: .8em 0 .5em;
  text-align: center;
  color: #999;
  span{ margin: 0 1em 0 0; }
}
.content{
  padding:1em 2em;
  line-height: 1.5em;
  max-height: 500px;
  overflow: auto;
}
.attachment{
  padding: 1em 2em;
}
.loading{
  text-align: center;

  i{
    font-size: 2em;
  }
}

</style>
