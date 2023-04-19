import store from '@/store'
import chartSkinDark from '@/config/chartTheme/ChartSkinDark.json'
import ChartSkinLight from '@/config/chartTheme/ChartSkinLight.json'

// 获取主题数据
const getTheme = () => {
  return new Promise(async (resolve) => {
    // 模拟请求皮肤
    let themeData = {
      // 原黑色皮肤暂时取消
      light: () => {
        // import('@/assets/css/cyLight.scss')
        return {
          id: 'light',
          mapStyle: 'amap://styles/8f6e4fd8e511a83e01e44eb560fa30c5',
          mapLineColor: ['#55E', '#393'],
          chartSkin: ChartSkinLight
        }
      },
      dark: () => {
      // import('@/assets/css/cy.scss')
      return {
        id: 'dark',
        mapStyle: 'amap://styles/8f6e4fd8e511a83e01e44eb560fa30c5',
        mapLineColor: ['#FFF', '#399'],
        chartSkin: chartSkinDark
      }
      }

    }
    store.commit('global/SET_THEMEDATA', themeData.dark())
    resolve()
  })
}

export default getTheme
