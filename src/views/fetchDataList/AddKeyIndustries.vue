<template>
    <div>
        <el-dialog :visible="true" top="5vh" title="新增" :close-on-click-modal="false" @close="$emit('close')"
            width="600px" custom-class="alarm-box">
            <template>
                <el-form :model="form" ref="form" :rules="rules" :validateOnRuleChange="true" label-width="150px">
                    <el-form-item label="责任单位类型" prop="zrdwlx">
                        <el-select style="width: 50%" v-model="form.zrdwlx" placeholder="请选择" @change="changeDutyType">
                            <el-option v-for="item in dutyTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="责任单位" prop="zrdw">
                        <el-select style="width: 50%" v-model="form.zrdw" placeholder="请选择" @change="$forceUpdate()"
                            v-if="form.zrdwlx === 'zj'">
                            <el-option v-for="item in sszjList" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-input style="width: 80%" placeholder="请输入" v-model="form.zrdw" v-else></el-input>
                    </el-form-item>

                    <el-form-item label="细类名称" prop="xlmc">
                        <el-input style="width: 80%" v-model="form.xlmc" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="检测对象" prop="jcdx">
                        <el-input style="width: 80%" v-model="form.jcdx" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item label="所属重点行业" prop="ztlx">
                        <el-select style="width: 50%" v-model="form.ztlx" placeholder="请选择" @change="changezdType">
                            <el-option v-for="item in zdTypeList" :key="item.label" :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="人员类别" prop="rylb">
                        <el-select multiple style="width: 50%" v-model="form.rylb" placeholder="请选择">
                            <el-option v-for="item in ryTypeOptions" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="核酸检测规则" v-if="Object.keys(editData).length !== 0">
                        <el-input style="width: 50%" :placeholder="jcRules" :disabled="true">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="备注" prop="bz">
                        <el-input style="width: 80%" v-model="form.bz" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item label="排序值" prop="num">
                        <el-input style="width: 80%" v-model.number="form.num" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save('form')">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getRyTypes, saveKeyIndustries, getAlarmZtlx } from "@/api/keyIndustryStat";
export default {
    name: "AddKeyIndustries",
    props: ["detailData"],
    async mounted() {
        // 判断this.editData是否为空对象
        if (Object.keys(this.editData).length !== 0) {
            this.form = this.editData;
            // 重新根据templateId获取人员列表数据
            this.ryTypeOptions = await getRyTypes(this.form.templateId);
        }
        // 获取所属重点行业数据
        let res = await getAlarmZtlx();
        this.zdTypeList = res.map((v) => {
            return {
                value: v.templateId,
                label: v.ztlx,
            };
        });
    },
    computed: {
        jcRules() {
            let jsRules = []
            if (this.form.hasOwnProperty('rylbDtos')) {
                this.form.rylbDtos.forEach(item => {
                    let str = item.days && item.times ? `${item.days}天${item.times}检` : ' - '
                    jsRules.push(str)
                })
                return jsRules.join(',')
            }
        }
    },
    data() {
        // 自定义排序的校验规则
        var checkNum = (rule, value, callback) => {
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error("请输入数字值"));
                } else {
                    if (value < 0 || value > 99999) {
                        callback(new Error("排序值的范围在0-99999之间"));
                    } else {
                        callback();
                    }
                }
            }, 1000);
        };

        return {
            // 编辑数据
            editData: this.detailData ? this.detailData : {},

            // 表单数据
            form: {
                zrdwlx: "", // 责任单位类型
                zrdw: "", // 责任单位
                xlmc: "", // 细类名称
                jcdx: "", // 检测对象
                ztlx: "", // 所属重点
                rylb: [], // 人员类别--支持多选
                bz: "", // 备注
                num: "", // 排序值
            },
            // 责任单位类型
            dutyTypeOptions: [
                {
                    value: "wbj",
                    label: "委办局",
                },
                {
                    value: "zj",
                    label: "镇街",
                },
                {
                    value: "other",
                    label: "其他",
                },
            ],
            // 所属重点行业
            zdTypeList: [],
            // 三街六镇数据
            sszjList: [
                "南沙街",
                "珠江街",
                "龙穴街",
                "大岗镇",
                "榄核镇",
                "黄阁镇",
                "东涌镇",
                "横沥镇",
                "万顷沙镇",
            ],
            // 人员类别数据
            ryTypeOptions: [],

            // 校验规则
            rules: {
                zrdwlx: [
                    {
                        required: true,
                        message: "请选择责任单位类型",
                        trigger: "change",
                    },
                ],
                zrdw: [

                ],
                ztlx: [
                    {
                        required: true,
                        message: "请选择所属重点行业",
                        trigger: "change",
                    },
                ],
                rylb: [],
                xlmc: [
                    {
                        required: true,
                        message: "请输入细类名称",
                        trigger: "change",
                    },

                    {
                        min: 0,
                        max: 100,
                        message: "长度在 0 到 100个字符",
                        trigger: "blur",
                    },
                ],
                jcdx: [
                    {
                        required: true,
                        message: "请输入检测对象",
                        trigger: "change",
                    },

                    {
                        min: 0,
                        max: 100,
                        message: "长度在 0 到 100个字符",
                        trigger: "blur",
                    },
                ],
                bz: [
                    {
                        min: 0,
                        max: 100,
                        message: "长度在 0 到 100个字符",
                        trigger: "blur",
                    },
                ],
                num: [
                    {
                        required: true,
                        message: "请输入排序值",
                        trigger: "change",
                    },
                    { validator: checkNum, trigger: "blur" },
                ],
            },
        };
    },
    methods: {
        // 选择的所属重点行业值发生变化时调用
        async changezdType() {
            // 清空选择框残留的数据
            this.form.rylb = [];
            // 人员类别的数据需要重新获取
            // 根据label查找对应的value


            let index = this.zdTypeList.findIndex((item) => {
                if (item.label === this.form.ztlx) {
                    return true;
                }
            });
            let templateId = this.zdTypeList[index].value;
            console.log("templateId", templateId);
            this.ryTypeOptions = await getRyTypes(templateId);
            // 自定义人员类别的规则
            // 当人员类别查询的结果为空时，为非必填字段
            // 当人员类别查询的结果不为空时，为必填字段
            if (this.ryTypeOptions.length !== 0) {
                this.rules.rylb.push({
                    required: true,
                    message: "请选择人员类别",
                    trigger: "change",
                });
            } else {
                this.form.rylb = [];
            }
        },
        // 责任单位类型改变
        changeDutyType() {
            // 清空责任单位的数据
            this.form.zrdw = "";
            if (['other', 'wbj'].includes(this.form.zrdwlx)) {
                // 更改责任单位的校验规则
                this.rules.zrdw = []
                this.rules.zrdw.push({
                    required: true,
                    message: "请填写责任单位类型",
                    trigger: 'blur',
                },
                    {
                        min: 0,
                        max: 100,
                        message: "长度在 0 到 100个字符",
                        trigger: "blur",
                    },
                )

            } else {
                this.rules.zrdw = []
                this.rules.zrdw.push({
                    required: true,
                    message: "请选择责任单位类型",
                    trigger: "change",
                })
            }

            // 移除表单项的校验结果
            this.$refs.form.clearValidate();
        },
        async saveKeyIndustriesPz() {
            if (this.form.hasOwnProperty('status')) {
                this.form.status = this.form.status ? '1' : '0'
            }
            await saveKeyIndustries(this.form);
            // 如果是编辑操作，需要把editData清空
            this.editData = {};
            this.form = {}
            this.$emit("close");
            this.$emit("change");
        },
        // 保存
        async save(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提交表单数据
                    this.saveKeyIndustriesPz();
                } else {
                    return false;
                }
            });
        },
        // 取消
        cancel() {
            // 清空输入框残留数据
            this.editData = {}
            this.form = {}
            this.$emit('close')
        }
    },
};
</script>
<style scoped lang="scss">

</style>
<style lang="scss">
.el-select__tags-text {
    display: inline-block;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.el-select .el-tag__close.el-icon-close {
    top: -6px;
}

.el-tag.el-tag--info {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.el-select-dropdown__list {
    width: 320px;
}

.el-select-dropdown__item {
    overflow: hidden;
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
    line-height: 18px;
    height: 100%;
    padding: 8px 20px;
}
</style>
