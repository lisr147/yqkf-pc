let infoWin = null
let tableDom = null

export default {
  data () {
    return {}
  },
  methods: {
    /**
         * 渲染区域
         * @param {Object} data 区域数据
         */
    openInfoWin (map, event, content) {
      if (!infoWin) {
        infoWin = new AMap.InfoWindow({
          autoMove: false,
          isCustom: true // 使用自定义窗体
          // offset: new AMap.Pixel(130, 100)
        })
      }

      let x = event.offsetX
      let y = event.offsetY
      let lngLat = map.containerToLngLat(new AMap.Pixel(x, y))

      if (!tableDom) {
        let infoDom = document.createElement('div')
        infoDom.className = 'info'
        tableDom = document.createElement('table')
        infoDom.appendChild(tableDom)
        infoWin.setContent(infoDom)
      }

      let trStr = ''
      for (let name in content) {
        let val = content[name]
        trStr +=
                    '<tr>' +
                    '<td class="label">' + name + '</td>' +
                    '<td>&nbsp;</td>' +
                    '<td class="content">' + val + '</td>' +
                    '</tr>'
      }

      tableDom.innerHTML = trStr
      infoWin.open(map, lngLat)
    },

    /**
         * 设置图层
         */
    closeInfoWin () {
      if (infoWin) {
        infoWin.close()
      }
    }
  }
}
