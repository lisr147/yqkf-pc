export default {
    // 组件标签名
    type: "mobile-input",
    // 默认标签名（必填）
    label: "手机号码",
    // 用于排序，值越小，越靠前
    sort: 1,
    // 属性配置
    config: {
        // 组件属性配置
        attrs: {
            // 默认值，如果在配置文件里设置了，则每个组件都会携带
            data: {
                minlength:11,
                maxlength:11
            }
        },
        // 表单项配置，是 FormDesc 中非 attrs 的其它配置，
        // 具体可看：https://www.yuque.com/chaojie-vjiel/vbwzgu/iw5dzf#hl4pm
        common: {
            // config: {
            //     // 默认值
            //     default: {
            //         type: "input",
            //         label: "默认值",
            //         disabled: true
            //     },
            //     rules: {
            //         label: '数据校验-默认配置',
            //     }
            // },
            data: {
                rules: [
                    {
                        trigger: "blur",
                        validator: function (rule, value, callback) {
                            if (value &&( !/^1\d{10}$/.test(value) || value.length !== 11)) {
                                callback(new Error('手机号码不正确'))
                            return
                            }
                            callback()
                        }
                    }
                ]
            }
        }
    }
};

