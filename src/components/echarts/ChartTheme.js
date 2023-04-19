/**
 * 自定义图表样式
 * 附加皮肤放在config/chartTheme目录下
 * 在config/theme.js中引入
 * 通过reportLayer传入皮肤颜色属性
 */

import echarts from '@/plugins/echarts'
import defaultThemeData from './DefaultThemeColor'

let option = (optionData, panelItemOptionData = {}, chart) => {
  // let themeData = defaultThemeData
  let themeData = defaultThemeData
  // 公共部分样式
  let colorList = themeData.colorList
  // 自动生成渐变色
  let color = []
  colorList.forEach((v, i) => {
    let endColor = v.replace('#', '')
    let endColorList = [
      parseInt(endColor.substring(0, 2), 16),
      parseInt(endColor.substring(2, 4), 16),
      parseInt(endColor.substring(4, 6), 16)
    ]
    let scale = 0.4
    color.push(
      new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [
          { offset: 0, color: v },
          { offset: 1, color: `rgb(${endColorList[0] + endColorList[1] * scale},${endColorList[1] + endColorList[2] * scale},${endColorList[2] + endColorList[0] * scale})` }
        ]
      )
    )
  })
  let result = {
    textStyle: {
      color: themeData.textStyle
    },
    title: {
      show: false,
      textStyle: {
        color: themeData.textStyle,
        fontSize: '1.2em'
      }
    },
    legend: {
      textStyle: {
        color: themeData.textStyle,
        fontSize: 12
      },
      icon: 'circle',
      type: 'scroll',
      itemWidth: 10, // 图例图形宽度
      itemHeight: 10, // 图例图形高度,
      // bottom: '0em',
      pageTextStyle: {
        color: themeData.textStyle
      }
    },
    color
  }

  return result
}

export default option
