// 黑色皮肤的图表默认样式
import echarts from '@/plugins/echarts'

let defaultThemeData = {
  'colorList': [
    '#2F54EB',
    '#1EE7E7',
    '#71E7A2',
    '#71AC5E',
    '#37d7ff',
    '#43baf2',
    '#f35b5a',
    '#ffca24'
  ],
  'textStyle': '#fff',
  'lineColor': [
    '#ffffff',
    '#1cfa4b'
  ],
  'markPointColor': [
    '#3971f0',
    '#666'
  ],
  'markPointFontColor': [
    '#ffffff',
    '#ffffff'
  ],
  lineStyle: {
    color: '#2c3d48'
  }
}

let option = (optionData, panelItemOptionData = {}, chart, themeData = defaultThemeData) => {
  if(panelItemOptionData?.series[0]){
    panelItemOptionData.series[0].barMaxWidth = '50%';
  }
  // 公共部分样式
  let colorList = themeData.colorList

  const lineColor = themeData.lineStyle.color
  const fontColor = '#fff'
  const seriesLabelColor = themeData.textStyle.seriesLabelColor

  // 自动生成渐变色
  let gradualColor = colorList
  // colorList.forEach((v, i) => {
  //   let endColor = v.replace('#', '')
  //   let endColorList = [
  //     parseInt(endColor.substring(0, 2), 16),
  //     parseInt(endColor.substring(2, 4), 16),
  //     parseInt(endColor.substring(4, 6), 16)
  //   ]
  //   let scale = 0.7
  //   gradualColor.push(
  //     new echarts.graphic.LinearGradient(
  //       0, 0, 0, 1,
  //       [
  //         { offset: 1, color: v },
  //         { offset: 1, color: v },
  //         // { offset: 1, color: `rgb(${endColorList[0] + endColorList[1] * scale},${endColorList[1] + endColorList[2] * scale},${endColorList[2] + endColorList[0] * scale})` }
  //       ]
  //     )
  //   )
  // })
  let splitNumber = 1
  let result = {
    tooltip: {
      show: true,
      textStyle:{
        fontSize: 10
      },
      // position:{
      //   right: '0',
      //   bottom:'0'
      // }
    },
    textStyle: {
      color:location.href.includes('/big')||location.href.includes('/sealarea.html' )?themeData.textStyle.color:'#555',
      // color: themeData.textStyle.color,
    },
    title: {
      show: false,
      textStyle: {
        color: themeData.textStyle.color,
        fontSize: '1.2em'
      }
    },
    legend: {
      textStyle: {
        // color: themeData.textStyle.color,
        color:location.href.includes('/big')||location.href.includes('/sealarea.html' )?themeData.textStyle.color:'#555',
        fontSize: 12
      },
      right: 10,
      itemWidth: 10, // 图例图形宽度
      itemHeight: 10, // 图例图形高度,
      top: 0,
      containLabel: true
    },
    grid: {
      "top":"15%",
      "right": "9%",
      "bottom": "4%",
      "left": "2%",
      "containLabel":true
    },
    xAxis: [],
    yAxis: [],
    color: gradualColor
  }

  if (panelItemOptionData.xAxis && panelItemOptionData.xAxis.length) {
    panelItemOptionData.xAxis.forEach((v, i) => {
      result.xAxis[i] = {
        splitLine: {
          show: false
        },
        axisLine:{
          lineStyle: {
            color: lineColor
          }
        },
        // splitNumber
      }
    })
  }
  // y轴调整max和min，如果y轴全是文字，则不处理
  if (panelItemOptionData.yAxis && panelItemOptionData.yAxis.length && panelItemOptionData.yAxis[0].data == undefined) {

    panelItemOptionData.yAxis.forEach((v, i) => {
      result.yAxis[i] = {
        max: function (value) {
          return Math.ceil(value.max * 1.2)
        },
        min: function (value){
          let min = value.min
          if (min > 0) {
            return Math.floor(min * 0.9)
          } else {
            return parseInt(min * 1.1)
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: lineColor
          }
        },
        axisLine:{
          lineStyle: {
            color: lineColor
          }
        },
        name: v.name ? `(${v.name})` : null,
        nameTextStyle: {
          align: 'right',
          fontSize: '.6em'
        },
        // splitNumber
      }
    })
  }


  return result
}

export default option
