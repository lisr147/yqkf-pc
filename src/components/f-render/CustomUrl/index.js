export default {
  // 假如这个组件叫 url（必填）
  type: "custom-url",
  // 默认标签名（必填）
  label: "URL",
  // 用于排序，值越小，越靠前
  sort: 1,
  // 属性配置
  config: {
    // 属性配置说明地址（可省略）
    url: "https://www.xxx.com",
    // 组件属性配置（不知道啥是组件属性，可以看一下界面右侧）
    attrs: {
      // config 配置 参考 FormDesc:
      // https://www.yuque.com/chaojie-vjiel/vbwzgu/iw5dzf#KOPkD
      config: {
        // max 为属性名
        max: {
          type: "number",
          label: "最大输入长度"
        },
        name: {
          type: "input",
          label: "原生 name",
          // 必填
          required: true
        }
        // ....
      },
      // 默认值，如果在配置文件里设置了，则每个组件都会携带
      data: {
        name: "url"
      }
    },
    // 表单项配置，是 FormDesc 中非 attrs 的其它配置，
    // 具体可看：https://www.yuque.com/chaojie-vjiel/vbwzgu/iw5dzf#hl4pm
    common: {
      config: {
        // 默认值
        default: {
          type: "input",
          label: "默认值"
        }
      },
      data: {}
    }
  }
};
