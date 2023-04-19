// import { verifySmsCode } from "@/api/fRander.js";

export default {
  // 组件标签名
  type: "mobile-validator",
  // 默认标签名（必填）
  label: "手机号码验证",
  // 用于排序，值越小，越靠前
  sort: 1,
  // 属性配置
  config: {
    // 属性配置说明地址（可省略）
    // url: "https://www.xxx.com",

    // 组件属性配置
    attrs: {
      // config 配置 参考 FormDesc:
      // https://www.yuque.com/chaojie-vjiel/vbwzgu/iw5dzf#KOPkD
      config: {
        name: {
          type: "input",
          label: "原生 name",
          // 必填
          required: true,
        },
        required: {
          type: "number",
          label: "必填",
          default: '1',
        },

        // ....
      },
      // 默认值，如果在配置文件里设置了，则每个组件都会携带
      data: {
        name: "mobile"
      }
    },
    // 表单项配置，是 FormDesc 中非 attrs 的其它配置，
    // 具体可看：https://www.yuque.com/chaojie-vjiel/vbwzgu/iw5dzf#hl4pm
    common: {
      config: {
        // 默认值
        // default: {
        //   type: "input",
        //   label: "默认值",
        //   disabled:true
        // },
        // componentType: {
        //   type: "text",
        //   label: '组件type',
        // },
        // rules: {
        //   label:'数据校验-默认配置',
        // },
        // valueFormatter:{
        //   label:'格式处理-默认配置',
        // }
      },
      data: {
        componentType:'MobileValidator',
        rules: [
          {
            trigger: "blur",
            validator: function (rule, value, callback) {
              // bug 如果手机验证未曾输入任何值，value是空，value.verify也不存在
              if(!value){
                callback()
                return
              }
              value.verify(callback)
              return 
            }
          }
        ],
        // valueFormatter:function(val) {
        //       console.log(val)
        //       return val.phone
        //     }
      }
    }
  }
};
