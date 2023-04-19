import selectOptions from "@/components/f-render/config/selectOptions.vue";
export default {
    type: "checkbox-input",
    label: "复选(可输入)",
    sort: 5,
    config: {
        attrs: {
            // config: {
            //     size: {
            //         type: "select",
            //         label: "多选框组尺寸",
            //         options: [{ text: "默认", value: null }, "medium", "small", "mini"]
            //     },
            //     min: {
            //         type: "number",
            //         label: "可被勾选的 Checkbox 的最小数量",
            //         attrs: {
            //             min: 0
            //         }
            //     },
            //     max: {
            //         type: "number",
            //         label: "可被勾选的 Checkbox 的最大数量",
            //         attrs: {
            //             min: 0
            //         }
            //     }
            // },
            // data: {}
        },
        common: {
            config: {
                default: {
                    type: "checkbox-input",
                    label: "默认值",
                    prop: data => data.prop,
                    optionsLinkageFields: data => data.optionsLinkageFields,
                    options: data => data.options
                },
                options: {
                    label: '选项配置',
                    type: selectOptions
                }
            },
            data: {
                isOptions: true,
                options: [
                    { text: "选项1", value: 1 },
                    { text: "选项2", value: 2 },
                    { text: "选项3", value: 3 }
                ],
                inputAble: true
            }
        }
    }
}