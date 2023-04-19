export default {
    type: "date-time-range2",
    label: "日期和时间范围",
    sort: 11,
    config: {
        url:
            "https://element.eleme.cn/#/zh-CN/component/datetime-picker#ri-qi-he-shi-jian-fan-wei",
        attrs: {
            config: {
                startPlaceholder: {
                    type: "input",
                    label: "范围选择时开始日期的占位内容"
                },
                endPlaceholder: {
                    type: "input",
                    label: "范围选择时结束日期的占位内容"
                },
                rangeSeparator: {
                    type: "input",
                    label: "选择范围时的分隔符"
                },
                timeArrowControl: {
                    type: "switch",
                    label: "是否使用箭头进行时间选择"
                },
                format: {
                    type: "input",
                    label: "显示在输入框中的格式"
                },
                valueFormat: {
                    type: "input",
                    label: "绑定值的格式, 不指定则绑定值为 Date 对象",
                    attrs: {
                        clearable: true
                    }
                },
                clearable: {
                    type: "switch",
                    label: "是否显示清除按钮"
                },
                editable: {
                    type: "switch",
                    label: "文本框可输入"
                },
                size: {
                    type: "select",
                    label: "输入框尺寸",
                    options: [{ text: "默认", value: null }, "medium", "small", "mini"]
                },
                unlinkPanels: {
                    type: "switch",
                    label: "在范围选择器里取消两个日期面板之间的联动"
                },
                align: {
                    type: "select",
                    label: "对齐方式",
                    options: ["left", "center", "right"]
                },
                popperClass: {
                    type: "input",
                    label: "DateTimePicker 下拉框的类名"
                },
                prefixIcon: {
                    type: "input",
                    label: "自定义头部图标的类名"
                },
                clearIcon: {
                    type: "input",
                    label: "自定义清空图标的类名"
                },
                readonly: {
                    type: "switch",
                    label: "完全只读"
                },
                validateEvent: {
                    type: "switch",
                    label: "输入时是否触发表单的校验"
                }
            },
            data: {}
        },
        common: {
            config: {
                default: {
                    type: "date-time-range2",
                    label: "默认值"
                }
            },
            data: {
                rules: [
                    {
                        trigger: "blur",
                        validator: function (rule, value, callback) {
                            console.log('validator', value)
                            if (value) {
                                if (!value[0]) {
                                    callback(new Error('请选择开始时间'))
                                }
                                if (!value[1]) {
                                    callback(new Error('请选择结束时间'))
                                }
                                if (value[0] > value[1]) {
                                    callback(new Error('结束时间不能早于开始时间'))
                                }
                            }
                            callback()
                        }
                    }
                ]
            }
        }
    }
}