export default {
  // 假如这个组件叫 url（必填）
  type: "address-input",
  // 默认标签名（必填）
  label: "住址",
  // 用于排序，值越小，越靠前
  sort: 10,
  // 属性配置
  config: {
    // 组件属性配置（不知道啥是组件属性，可以看一下界面右侧）
    attrs: {
      config: {
        name: {
          type: "input",
          label: "原生 name"
        }
      },
      // 默认值，如果在配置文件里设置了，则每个组件都会携带
      data: {
        name: "addressval"
      }
    },
    common: {
      config: {
        // 默认值
        default: {
          type: "input",
          label: "默认值"
        },
        rules:{
          label: '数据校验-默认配置',
          // type: 'data-editor' 隐藏校验规则输入框
        }
      },
      data: {
        componentType: 'AddressInput',
        rules:[{
          trigger: "change",
          validator: function (rule, value, callback){
            if (value && typeof value.verify == 'function') {
              value.verify(callback)
            } else {
              callback();
            }
          }
        }]
      }
    }
  }
};
