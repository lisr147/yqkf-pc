// import DISTRICTS from './../config/districts.json'

// export default {
//   data () {
//     return {
//       texts: []
//     }
//   },
//   methods: {
//     /**
//          * 渲染区域
//          * @param {Object} data 区域数据
//          */

//     renderText (data = {
//     }) {
//       DISTRICTS.forEach(v => {
//         let config = Object.assign(data, {
//           text: v.name,
//           map: this.config.AMap,
//           position: v.center,
//           anchor: 'center'
//         })
//         /* eslint-disable no-new */
//         this.texts.push(new window.AMap.Text(config))
//       })
//     },

//     /**
//          * 设置图层
//          */
//     // setGon(config = {
//     //     strokeColor: 'red',
//     //     strokeWeight: 1
//     // }) {
//     //     this.gonObjs.forEach(v => {
//     //         v.setOptions(config)
//     //     })
//     // },

//     /**
//          * 删除图层
//          */
//     deleteText () {
//       this.texts.forEach(v => {
//         this.config.AMap.remove(v)
//       })
//       this.texts = []
//     }
//   }
// }
