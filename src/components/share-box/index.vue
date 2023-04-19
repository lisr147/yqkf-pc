<template>
  <div>

    <div style="position:relative; margin:0 0 1em; height: 340px; background-color: #f0f0f0;">
      <div style="position: absolute;top:50%;left:50%; margin:-100px 0 0 -100px; width:200px;height:200px;"  ref="dom"></div>
      <div style="position:absolute; bottom:20px; left: 50%; transform:translateX(-50%); text-align:center; ">
        <el-button @click="download" size="mini">下载此二维码</el-button>
      </div>
    </div>
    <p>
      <el-input readonly :value="qrCodeText" style="width:82%;">
        <el-button slot="append" @click="copyUrl">复制</el-button>
      </el-input>
      <el-button type="primary" style="margin-left: .6em;" @click="openUrl">打开</el-button>
    </p>


  </div>
</template>

<script>
  import QRCode from './qrcode.js'

  export default {
    name: "share-box",
    components: {},
    props: {
      qrCodeText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        qrcode: null
      }
    },
    watch: {
      qrCodeText(val) {
        this.draw()
      }
    },
    mounted() {
      this.draw()
    },
    methods: {

      draw() {
        if (this.qrCodeText == '') {
          return
        }

        this.$nextTick(() => {

          if (this.qrcode == null) {
            this.qrcode = new QRCode(this.$refs['dom'], {
              text: this.qrCodeText,
              width: 200,
              height: 200,
              colorDark: "#000000",
              colorLight: "#ffffff",
            })
          } else {
            this.qrcode.clear()
            this.qrcode.makeCode(this.qrCodeText)
          }

        })
      },

      copyUrl(){

        let aux = document.createElement("input")
        aux.setAttribute("value", this.qrCodeText)
        document.body.appendChild(aux)
        aux.select()
        document.execCommand("copy")
        document.body.removeChild(aux)

        this.$message({
          type: 'success',
          message: '已复制地址'
        })

      },

      openUrl(){
        window.open(this.qrCodeText)
      },

      download(){
        const img = this.$refs['dom'].getElementsByTagName('img')[0]
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = img.src
        link.setAttribute('download', '表单二维码_' + new Date().getTime())
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

    }
  }
</script>

<style lang="scss" scoped>

</style>
