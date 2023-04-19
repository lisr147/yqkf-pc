import { addSealArea, editSealArea, deleteSealArea } from '@/api/sealarea2.js'

var SealMapForm = {

    data() {
        return {
            form: {
                id: null,
                name: "",
                type: null,
                unitName: "",
                remark: "",
                town: "",
                polygon: "",
                area: "",
            },
            rules: {
                name: [
                    { required: true, message: "请输入区域名称", trigger: "blur" },
                    { min: 2, max: 50, message: "长度在2到50个字符", trigger: "blur" },
                ],
                type: [
                    { required: true, message: "请选择区域类型", trigger: "change" },
                ],
                town: [
                    { required: true, message: "请选择所属镇街", trigger: "change" },
                ],
                remark: [
                    {
                        min: 0,
                        max: 10,
                        message: "描述内容需要在1000个字符串长度内",
                        trigger: "blur",
                    },
                ],
            },

            typeList: [
                { label: "高风险区", value: "seal" },
                // { label: "中风险区", value: "manage" },
                { label: "低风险区", value: "prevention" },
                { label: "管控网格", value: "managewga" },
                { label: "识别网格", value: "managewgb" },
            ],
        };
    },

    methods: {
        //删除区域
        async handleRemoveArea() {
            const { id } = this.form
            await deleteSealArea({ ids: [id] })
            this.$message.success(`删除操作成功`)
        },


        async handleSaveArea(data) {
            const { id } = data
            if (id) {
                //编辑
                await editSealArea(data)
            } else {
                //新增
                await addSealArea(data)
            }

            if (this.$refs['baseForm']) {
                this.$refs['baseForm'].clearValidate()
            }

            this.$message.success(`保存成功`)

        },

        validForm() {
            return new Promise(resolve => {
                const form = this.$refs['baseForm']
                if (form) {
                    form.validate(valid => {
                        resolve(valid)
                    })
                } else {
                    const { name, type } = this.form
                    const res = name !== '' && type !== null ? true : false
                    resolve(res)
                }
            })
        }
    }
}

export default SealMapForm
