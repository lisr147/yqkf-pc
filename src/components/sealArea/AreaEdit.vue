<template>
  <div>
    <el-dialog
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        @close="close"
        width="600px"
        :title="title"
        :visible="editorVisible"
        :modal="true"
        class="supervision-dialog"
    >

      <el-form class="supervision-form" label-width="auto" ref="areaEditForm" :rules="editType === 'add' ? formRules : {}" :model="form">
        <el-form-item label="类型" prop="lx" >
          <el-select size="small" v-model="form.lx" placeholder="请选择" style="width: 100%;z-index:200;">
            <el-option :value="item" :label="item" v-for="item in sealAreaTypeList" :key="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="fw" >
          <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="form.fw">
            </el-input>
        </el-form-item>
        <el-form-item label="涉及网格" prop="sswg">
          <el-select
            v-model="form.sswg"
            multiple
            filterable
            remote
            reserve-keyword
            v-loadmore="loadMore"
            placeholder="请输入关键词"
            @change="handleSelectChange"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.code"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面积(平方米)" prop="mj">
          <el-input type="text" size="small" placeholder="请输入"  v-model="form.mj" />
        </el-form-item>
        <el-form-item label="流动人口(人)" prop="ldrk">
          <el-input type="text" :disabled="true" size="small" placeholder="请输入"  v-model="form.ldrk" />
        </el-form-item>
        <el-form-item label="户籍人口(人)" prop="hjrk">
          <el-input type="text" :disabled="true" size="small" placeholder="请输入"  v-model="form.hjrk" />
        </el-form-item>
        <el-form-item label="总人口(人)" prop="zrk">
          <el-input type="text" :disabled="true" size="small" placeholder="请输入"  v-model="form.zrk" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addSealArea, editSealArea, getGridList, getPeopleSum } from "@/api/sealarea";
  export default {
    name: "AreaEdit",
    directives: {
      'loadmore': {
        bind(el, binding, vnode) {
          const SELECT_DOM = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap'
          )
          let _this = vnode.context;
          SELECT_DOM.addEventListener('scroll', function() {
            if (this.scrollHeight - this.scrollTop <= this.clientHeight) {
              const { page, totalPage } = _this;
              if(page < totalPage) binding.value();
            }
          })
        }
      }
    },
    data() {

      return {
        pageSize: 10, // 每页条数
        page: 1, // 当前页
        totalPage: 1,
        query: '',
        options: [],
        form: {
          lx : '',
          fw : '',
          sswg : [],
          mj: null,
          ldrk: null,
          hjrk: null,
          zrk: null
        },
        title: '',
        loading: false,
        // 表单校验
        formRules: {
          lx: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          fw: [
            { required: true, message: '请选择', trigger: 'blur' },
          ],
          sswg: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
        },
        editType: 'add',
        sealAreaTypeList: ['封闭区','封控区','防控区','健康管理区'],
      }
    },
    props: {
      editorVisible: Boolean,
      editFormData: Object
    },
    watch: {
      editFormData: {
        handler(val) {
          if(val) {
            this.form = val;
            this.title = "编辑管理区";
          }
          else {
            this.form = {
              lx : '',
              fw : '',
              sswg : [],
              mj: null,
              ldrk: null,
              hjrk: null,
              zrk: null
            };
          }
        },
        immediate: true,
        deep: true
      }
    },
    mounted() {
      if(this.editFormData) this.form = this.editFormData;
      this.init();
    },
    methods: {
        close() {
            this.form = {
                lx : '',
                fw : '',
                sswg : '',
                mj: null,
                ldrk: null,
                hjrk: null,
                zrk: null
            }
            this.$emit('update:editorVisible', false);
        },
        init() {
          this.remoteMethod();
          // this.options = data;
        },
        submit() {
          const { form } = this;
          const { id, lx, fw, sswg, mj, ldrk, hjrk, zrk, sfqy = 0 } = form;
          this.$refs['areaEditForm'].validate(valid => {
          // 表单校验失败则退出
            if (valid === false) {
              return false
            }
            if(id) {
              editSealArea(id, {
                lx, fw, mj, ldrk, hjrk, zrk, sfqy,
                sswg: sswg.join(',')
              })
                .then(() => {
                  this.$emit('update:editorVisible', false);
                })
            } else {
              addSealArea({
                lx, fw, mj, ldrk, hjrk, zrk, sfqy,
                sswg: sswg.join(',')
              })
                .then(() => {
                  this.$emit('update:editorVisible', false);
                })
            }
          })
          
        },
        async handleSelectChange(selected) {
          const data = await getPeopleSum({
            sswg: selected.join(',')
          });
          const { form } = this;
          const { hjrk, lsrk, zjrk } = data;
          console.log(data);
          this.form = {
            ...form,
            hjrk,
            ldrk: lsrk,
            zrk: zjrk
          }
        },
        loadMore() {
          ++this.page;
          this.remoteMethod(this.query);
        },
        async remoteMethod(query) {
            const { page, query: oldQuery } = this;
            this.loading = true;
            const params = {
              condition: {
                name: query
              },
              page: query !== oldQuery ? 1 : page
            }
            const { data, totalPage, page: pageNum } = await getGridList(params);
            if(query !== oldQuery) {
              this.options = data;
            } else {
              this.options = this.options.length === 0 ? data : [...this.options, ...data];
            }
            this.page = pageNum;
            this.totalPage = totalPage;
            this.query = query;
            this.loading = false;
        }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>

</style>
