<template>
  <div style=" padding-right: 6px; max-height: 400px; overflow: auto;" class="iscroll">
    <div class="rolebox" v-for="(app,index) in setting" :key="app.appInfoId">
      <div class="rolebox-head">
        <h4>{{appMap[app.appInfoId]}}</h4>
      </div>
      <div class="rolebox-body">
        <ul >
          <li v-for="item in app.roleList" :key="item.id"><el-checkbox :label="item.roleName" v-model="item.selected"></el-checkbox></li>
        </ul>
        <div class="foot">
          <el-button type="primary" size="mini" @click="handleSaveSetting(index)">保存配置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoleSetting, saveRoleSetting } from '@/api/role'

export default {
  name: 'RoleSettingBox',
  data () {
    return {
      // 所有应用的id
      appIds: null,
      // 所有应用及其对应角色配置
      setting: [],
      // 当前用户id
      userId: null
    }
  },
  computed: {
    appMap () {
      return this.$store.getters['appMap']
    }
  },
  methods: {

    // 获取数据
    getData (id) {
      this.$store.dispatch('app/getIds').then(res => {
        this.appIds = res
        this.getRoleSetting(id)
      })
    },

    // 获得当前用户的角色配置
    getRoleSetting (id) {
      this.userId = id
      getRoleSetting({
        userId: id,
        appInfoIds: this.appIds.join(',')
      }).then(res => {
        // console.log(res)
        this.setting = res
      })
    },

    handleSaveSetting (index) {
      let params = {
        userId: this.userId,
        appInfoId: this.setting[index].appInfoId,
        roleIds: []
      }

      this.setting[index].roleList.forEach(item => {
        if (item.selected) {
          params.roleIds.push(item.id)
        }
      })
      params.roleIds = params.roleIds.join(',')

      this.setRoleSetting(params)
    },

    // 保存当前的角色配置
    setRoleSetting (params) {
      saveRoleSetting(params)
        .then(res => {
          // 保存角色配置成功，刷新配置表
          this.$message({
            message: '保存配置成功',
            type: 'success'
          })
          this.getRoleSetting(this.userId)
        }).catch(error => {
          // 保存失败， 刷新配置表
          this.getRoleSetting(this.userId)
        })
    }
  }
}
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
  .rolebox {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    .rolebox-head {
      padding: 0px 6px 6px;
      border-bottom: 1px solid #dcdfe6;
    }
    .rolebox-body {
      padding-top: 10px;
      ul {
        overflow: hidden;
      }
      li {
        padding: 6px 0;
        display: inline-block;
        width: 33.3%;
        .el-checkbox__label{
          padding-right: 10px;
          vertical-align: top;
          white-space: normal;
        }
      }
      .foot {
        text-align: right;
      }
    }
  }
</style>
