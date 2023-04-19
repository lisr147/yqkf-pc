<template>
  <el-dialog custom-class="stream-warp" :modal="false" top="15vh" :visible="true" width="45vw"
             @close="$emit('closeStreamUser')">
    <template slot="title">
      <div class="risk-title">选择会议成员
      </div>
    </template>
    <div class="setuser">

      <div class="setuser-tree">
        <div class="treebox">
          <div class="treebox-header">
            <el-input placeholder="请输入关键词搜索" prefix-icon="el-icon-search" v-model="treeKeyword" size="small">
            </el-input>
            <!--组织结构-->
          </div>
          <div class="treebox-box iscroll">
            <el-tree :data="merberList"
                     show-checkbox
                     node-key="id"
                     :default-expanded-keys="[templateId]"
                     :default-checked-keys="checkedKeys"
                     ref="tree"
                     :props="defaultProps"
                     :filter-node-method="filterNode"
                     @node-click="handleNodeClick"
                     @check-change="checkChange"
            >
            </el-tree>
            <div class="footer">
              <el-button size="medium" type="primary" @click="getCheckedNodes">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>


</template>

<script>
import {getSampPointList, postPlayVideo} from "@/api/stream";

export default {
  name: 'StreamUserTree',
  data() {
    return {
      treeKeyword: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedItems: [],
      merberList: [
        {id: 10055, templateId: 10055, label: '常规核酸采样点', children: []},
        {id: 10027, templateId: 10027, label: '大规模核酸检采样点', children: []}
      ],
      natPrincipals: [],
      // 默认选中的节点集
      checkedKeys: [],
    }
  },
  props: {
    roomId: {type: Number, require: true},
    cydData: {type: Object},//采样点数据
    templateId: {type: Number},
  },
  model: {
    prop: 'currUsers',
    event: 'change'
  },
  computed: {
    userInfo() {
      return this.$store.state.user
    },
  },
  watch: {
    treeKeyword(newValue) {
      // console.log(78,newValue);
      this.$refs['tree'].filter(newValue)
    }
  },
  mounted() {
    this.initData()

  },
  methods: {
    initData() {
      if (this.templateId === 10027) {
        this.merberList = [
          {id: 10027, templateId: 10027, label: '大规模核酸检采样点', children: []}
        ]
        const {cydz, cydzlxdh, id, yljg, abzz, abzzlxdh, xxzz, xxzzlxdh, zyzzz, zyzzzlxdh} = this.cydData
        let merberList = this.merberList[0].children
        merberList = [
          {
            label: `${yljg}（站长：${cydz}）`,
            id,
            phoneNumber: cydzlxdh,
            userId: cydzlxdh,
            type: 1,
            principalType:0,
            cyd: yljg,
            name: `站长：${cydz}`,
          },
        ]
        if (abzz && abzzlxdh) {
          merberList.push({
            label: `${yljg}（安保组长：${abzz}）`,
            phoneNumber: abzzlxdh,
            userId: abzzlxdh,
            type: 1,
            principalType:2,
            cyd: yljg,
            name: `安保组长：${abzz}`,
          })
        }
        if (xxzz && xxzzlxdh) {
          merberList.push(
            {
              label: `${yljg}（信息组长：${xxzz}）`,
              phoneNumber: xxzzlxdh,
              userId: xxzzlxdh,
              type: 1,
              principalType:3,
              cyd: yljg,
              name: `信息组长：${xxzz}`,
            })
        }
        if (zyzzz && zyzzzlxdh) {
          merberList.push(
            {
              label: `${yljg}（志愿者组长：${zyzzz}）`,
              phoneNumber: zyzzzlxdh,
              userId: zyzzzlxdh,
              type: 1,
              principalType:1,
              cyd: yljg,
              name: `志愿者组长：${zyzzz}`,
            })
        }
        this.merberList[0].children = merberList
        this.checkedKeys.push(id)
      } else if (this.templateId === 10055) {
        this.merberList = [
          {id: 10055, templateId: 10055, label: '常规核酸采样点', children: []}
        ]
        const {id, cghsjcd, cydzz, cydzzsjhm} = this.cydData
        let item = {
          label: `${cghsjcd}(${cydzz})`,
          userId: cydzzsjhm,
          cyd: cghsjcd,
          name: cydzz,
          phoneNumber: cydzzsjhm,
          id,
          type: 0,
        }
        this.merberList[0].children.push(item)
        this.checkedKeys.push(id)
      } else {
        this.templateId = 10027
        this.getSampPointList(10027)
        this.getSampPointList(10055)
      }
    },
    async getSampPointList(templateId) {
      let params = {
        page: 1,
        pageSize: 99999,
        showModal: false,
      }
      params.templateId = templateId
      let res = await getSampPointList(params)
      if (res) {
        let dataList = res.data.map(i => {
          if (templateId === 10027) { //大规模
            const {cydz, cydzlxdh, id, szxxdz, yljg} = i
            return {
              label: `${yljg}(${cydz?cydz:"无"})`,
              userId: cydzlxdh,
              name: cydz,
              cyd: yljg,
              id,
              phoneNumber: cydzlxdh,
              type: 1,
              principalType:0,
              disabled: cydzlxdh ? false : true
            }
          } else { //常规
            const {id, cghsjcd, cydzz = '无', cydzzsjhm} = i
            if(cghsjcd==='广州市第一人民医院南沙医院') i.sort = 1
            if(cghsjcd==='绿轴采样点') i.sort = 2
            if(cghsjcd==='南沙区妇幼保健院') i.sort = 3
            return {
              label: `${cghsjcd}(${cydzz})`,
              userId: cydzzsjhm,
              cyd: cghsjcd,
              name: cydzz,
              phoneNumber: cydzzsjhm,
              id,
              type: 0,
              principalType:0,
              sort:i.sort,
              disabled: cydzzsjhm ? false : true
            }
          }
        })
        dataList.sort((a,b)=>{
          return a.sort - b.sort
        })
        this.merberList.map(v => {
          if (v.templateId === templateId) {
            v.children = dataList
          }
        })
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.checkedKeys);
      });
    },
    //发起视频邀请
    async postPlayVideo() {
      const {roomId, natPrincipals, userInfo} = this
      let initiator = {
        id: userInfo.id,
        type: 3,
        phoneNumber:userInfo.mobile,
        name:userInfo.username,
        cyd: '发起人',
        userId: userInfo.mobile,
      }

      let allNatPrincipals = [initiator, ...natPrincipals]
      let params = {
        roomId,
        natPrincipals: allNatPrincipals
      }
      await postPlayVideo(params).then(res => {
        this.$store.commit('common/SET_NATPRINCIPALS', this.natPrincipals)
        this.$emit('closeStreamUser', this.natPrincipals)
        console.log('发起成功');
        if(res){
          this.$message.error(res)
        }else {
          this.$message.success('已发送邀请')
        }
      }).catch(e => {
        this.$message.error("邀请失败");
        console.log(e);
      });
    },
    getCheckedNodes() {
      let checkItems = this.$refs.tree.getCheckedNodes()
      if (checkItems.length === 0) return this.$message('请选择会议成员')
      if (checkItems[0].children) {
        this.natPrincipals = checkItems[0].children
      } else {
        this.natPrincipals = checkItems
      }
      if (this.templateId === 10027) {
        this.natPrincipals.map(v => { //大规模选择安保、信息组长等赋值站长id
          if (!v.id) {
            v.id = this.natPrincipals[0].id
          }
        })
      }
      this.$store.commit('common/SET_NATPRINCIPALS', this.natPrincipals)
      this.$emit('closeStreamUser', this.natPrincipals)
      console.log('已选成员', this.natPrincipals, this.roomId);
      this.postPlayVideo()
    },

    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    handleNodeClick(node) {
      if (!node.phoneNumber) return this.$message.error('该采样点无站长手机号码，不可邀请')
    },
    checkChange(e) {
      console.log(183, e);
    },
    handleDropUser(tag, index) {
      let arr = [].concat(this.currUsers)
      arr.splice(index, 1)
      this.$emit('change', arr)
    },

    clear() {
      this.$emit('change', [])
    }


  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.setuser {
  position: relative;
  height: 580px;
  overflow: hidden;

  .treebox {
    box-sizing: border-box;
    //border: 1px solid #dae3ec;
    height: 100%;

    .treebox-header {
      padding: 8px;
    }

    .treebox-filter {
      padding: 8px;
    }

    .treebox-box {
      position: absolute;
      top: 50px;
      left: 8px;
      right: 8px;
      bottom: 8px;
      overflow: auto;

      .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
      }

      ::v-deep.el-tree-node__content:hover {
        background-color: #3458d0;
      }

      ::v-deep.el-tree-node:focus > .el-tree-node__content {
        background-color: #3458d0;
      }

      ::v-deep.el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: #787b83;
        border-color: #DCDFE6;
      }
    }
  }

  .setuser-tree {
    position: relative;
    background: #20326F;
    box-shadow: inset 0px 0px 2px 0px rgba(60, 137, 219, 0.58);
    opacity: 0.95;
    border: 1px solid rgba(52, 98, 240, 0.5);
    width: 100%;
    height: 100%;

    .el-tree {
      background: #20326F;
      color: #FFFFFF;
    }

  }

  .setuser-achive {
    box-sizing: border-box;
    padding: 8px 8px;
    margin-left: 405px;
    height: 100%;
    border: 1px solid rgba(206, 209, 219, 0.2);
    overflow: auto;

    .el-tag {
      margin: 0 4px 6px 0;
    }

    .el-tree {
      background: #20326F;
      color: #FFFFFF;
    }

    ::v-deep.el-tree-node__content:hover {
      background-color: #3458d0;
    }

    ::v-deep.el-tree-node:focus > .el-tree-node__content {
      background-color: #3458d0;
    }

    .add_input {
      width: 70px;
      border: transparent;
      outline: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
  }
}
</style>
