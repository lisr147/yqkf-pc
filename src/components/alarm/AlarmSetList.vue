<template>
  <div class="alarm-list-box">
    <el-dialog
        :visible="true"
        top="10vh"
        title="告警设置规则"
        :close-on-click-modal="false"
        @close="$emit('close')"
        width="90vw"
    >
      <div>
        <el-form :model="form" ref="alarmListForm">
<!--          <div class="push-group">-->
<!--            <el-form-item label="选择推送到群："  >-->
<!--              <el-select v-model="form.xztsdq" placeholder="请选择推送群" style="width:15%">-->
<!--                <el-option-->
<!--                    v-for="item in groupList"-->
<!--                    :key="item.value"-->
<!--                    :label="item.label"-->
<!--                    :value="item.value">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </div>-->

          <el-table
              :data="form.table_data"
              style="width: 100%"
              :max-height="480"
              ref="tableData"
          >
            <el-table-column
                align="center"
                v-for="(item,index,key) in form.table_columns"
                :item="item"
                :key="key"
                :index="index"
                :label="item.label"
                :width="item.width"
            >
              <template slot-scope="scope">
                <el-form-item>
                  <template>
                    <el-select :disabled="!scope.row.edit" v-if="item.type==='select'" v-model="scope.row[item.prop]" :multiple="item.multiple"  @change="changeSelect(scope.row,scope.column,scope.row[item.prop],scope.$index)">
                      <el-option
                          v-for="(v,index) in item.list"
                          :key="v.id"
                          :label="v.label"
                          :value="item.prop==='send_time'?v.label:v.id"
                      >
                      </el-option>
                    </el-select>
                    <!--选择告警规则-->
                    <el-input readonly :disabled="!scope.row.edit" v-else-if="item.type==='checks'&&!['0','在岗'].includes(scope.row['zgzt'])" v-model="scope.row[item.prop]"
                              @focus="gjgzFocus(scope.row,scope.row[item.prop],scope.$index)"></el-input>
                    <el-select :disabled="!scope.row.edit" v-else-if="item.type==='checks'&&['0','在岗'].includes(scope.row['zgzt'])" v-model="scope.row[item.prop]" :multiple="item.multiple" >
                        <el-option
                            v-for="(v,index) in gjgz1"
                            :key="v.id"
                            :label="v.label"
                            :value="v.label"
                        />
                    </el-select>
                    <!--选择人员-->
                    <el-input class="user-input" v-else-if="item.type==='selectUser'" v-model="scope.row[item.prop]" readonly
                              :disabled="!scope.row.edit" @focus="onzxryFocus(scope.row,scope.row[item.prop],scope.$index)" ></el-input>
                    <el-input v-else  :disabled="!scope.row.edit"
                              v-model="scope.row[item.prop]"
                              :placeholder="item.label"
                    ></el-input>
                  </template>
<!--                  <span v-else>{{ scope.row[item.prop]}}</span>-->
                </el-form-item>
              </template>


            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">

                <!-- 编辑 -->
                <div v-if="!scope.row.edit" @click="handleEdit(scope.$index, scope.row)" style="color:#409EFF">修改</div>

                <div v-if="scope.row.edit" class="btn-group">
                  <span @click="handleSave(scope.$index, scope.row)">保存</span>
                  <span @click="handleDelete(scope.$index, scope.row)">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div style="width: 100%;margin: 20px 0 0;text-align: center">
          <el-button style="width: 100%" @click="handleAdd()" icon="el-icon-plus">新增</el-button>
        </div>
      </div>
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="$emit('close')">取消</el-button>-->
<!--        <el-button type="primary" @click="save">确定</el-button>-->
<!--      </div>-->
    </el-dialog>
    <user v-model="userVisible" :showme="showme" @chooseUser="chooseUser" :selectedUsers="selectedzxryList"></user>
    <!--告警规则-->
    <el-dialog
        width="500px"
        title="选择告警规则"
        :visible="gjgzCheckVisible"
        @close="gjgzCheckVisible=false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :modal="true"
    >
      <div class="gjgz-check">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item" v-for="(item,index) in gjgz" :key="index"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gjgzCheckVisible=false">取消</el-button>
        <el-button type="primary" @click="saveGjgz">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import User from "@/components/supervision/User";
import {getHighRiskDictionary,getHighRiskAlarmList,saveHighRiskAlarm,deleteHighRiskAlarm} from '@/api/alarm'

export default {
  components: {
    User,
  },
  data() {
    return {
      showme:false,
      groupList: [{
        value: '1',
        label: '区政数局'
      }, {
        value: '2',
        label: '南沙区商务局'
      }, {
        value: '3',
        label: '区住房和城乡建设局'
      }, {
        value: '4',
        label: '区委政法委'
      }, {
        value: '5',
        label: '南沙区卫生健康局'
      }],
      checkList:[],
      form: {
        xztsdq: '', //推送到群
        //表头信息
        table_columns: [
          {
            prop: "fxgwlx",
            label: "风险岗位类型",
            width: "300",
            type: 'select',
          },
          {
            prop: "gkrylx",
            label: "管控人员类型",
            type: 'input'
          },
          {
            prop: "zgzt",
            label: "在岗状态",
            type: 'select',
          },
          {
            prop: "gjgz",
            label: "告警规则",
            // type: 'select',
            type: 'checks',
          },
          {
            prop: "receiver",
            label: "告警接收人员",
            type: 'selectUser',
            width: "250",
          }
        ],
        //表格数据
        table_data: [],
      },
      userVisible: false,
      gjgzCheckVisible: false, //告警规则
      selectedzxryList: [],
      new_date_json: {}, //数据结构
      multipleSelection: [], //复选框，数据
      is_edit: true, //是否可编辑
      is_delete: true, //是否可删除
      selection: true, //是否需要复选框
      radio: false, //单选变色
      scopeIndex: 0, //选择人员索引
      gjgz:[],
      gjgz1:[],//告警规则
      gjgz2:[],//告警规则
    };
  },
  watch: {
    table_data: function () {
      //监听数据变化
    }
  },
  mounted () {
    this.initEditAttribute();
    this.getHighRiskDictionary();
  },
  methods: {
    // handle(row,column,event,cell) {
    //   console.log(224,row,column,event,cell)
    // },
    //告警规则列表
    async getHighRiskAlarmList() {
      let res = await getHighRiskAlarmList()
      let data = Object.assign([],res)
      data.forEach((v)=>{
        v.send_time=v.send_time?v.send_time.split(','):''
        let fullNames = []
        if(v.userInfo){
          v.userInfo.map((item)=>{
            fullNames.push(item.name)
          })
        }
        v.receiver =fullNames?fullNames.join(','):''
      })
      this.form.table_data = data
    },
    async getHighRiskDictionary() {
      let res = await getHighRiskDictionary()
      const {fxgwlx, gjgz, zgzt} = res
      this.fxgwlx = fxgwlx
      this.form.table_columns.map((v)=>{
        if(v.prop==='fxgwlx') v.list = fxgwlx
        if(v.prop==='zgzt') v.list = zgzt
      })
      gjgz[0].label.map(v=>{
        // this.gjgz1.push(v.label)
        this.gjgz1.push({id:v.id,label:v.label})
      })
      gjgz[1].label.map(v=>{
        this.gjgz2.push(v.label)
      })
      this.getHighRiskAlarmList();
    },

    async save() {
      // await this.$refs.alarmForm.validate();
      let data = JSON.parse(JSON.stringify(this.form))
      console.log(91, data);
    },
    //多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("selection:", this.multipleSelection);
    },
    //编辑
    handleEdit(index, row) {
      // console.log(index, row);
      this.$set(row,"edit",true)
    },
    //删除
     handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm('确定删除该告警规则?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        if(row.alarmId){
          let res = deleteHighRiskAlarm({ids:row.alarmId})
          if(res){
            this.form.table_data.splice(index, 1);
            this.$message({
              message: "删除成功！",
              type: "success"
            });
          }
        }else {
          this.form.table_data.splice(index, 1);
          this.$message({
            message: "删除成功！",
            type: "success"
          });
        }
      })
    },
    //保存
    async handleSave(index, row) {
      // console.log(178, index, row);
      let obj = Object.assign({},row)
      delete obj.add;
      delete obj.edit;
      delete obj.send_time;
      let result = Object.values(obj).every(item => item == "");
      if(result) return this.$message({message: "表单不能为空", type: "warning"});
      let rules = ['fxgwlx','gkrylx','gjgz','zgzt']
      for (const indexKey in obj) {
        if (rules.includes(indexKey)&&row[indexKey] === '') {
          return this.$message({
            message: "请正确填写表单",
            type: "warning"
          });
        }
      }
      row.edit = false;
      delete this.form.table_data[index].add;
      const {fxgwlx,gjgz,gkrylx,receiver,receiverIds,send_time,zgzt,userInfo} =row
      let params = {
        fxgwlx,
        gkrylx,
        zgzt,
        gjgz,
        // send_time:send_time.join(','),
        receiver:receiverIds?receiverIds.join(','):''
      }
      if(row.alarmId){ //编辑
        params.id =row.alarmId
        let userIds = []
        if(!receiverIds&&userInfo){
          userInfo.map((item)=>{
           userIds.push(item.userId)
          })
          params.receiver =userIds?userIds.join(','):''
        }
      }
      let res = await saveHighRiskAlarm(params)
      if(res){
        this.$message({
          message: "保存成功！",
          type: "success"
        });
      }
    },
    handleAdd() {
      var addDataJson = {
        fxgwlx:'',
        gkrylx:'',
        zgzt:'',
        gjgz:'',
        // send_time:'',
        receiver:'',
      };
      for (var key in this.new_date_json) {
        if (key === "edit") {
          delete addDataJson[key];
        } else if (key === "add") {
          delete addDataJson[key];
        } else {
          addDataJson[key] = "";
        }
      }
      addDataJson.edit = true;
      addDataJson.add = true;
      this.form.table_data.push(addDataJson);
      this.selectedzxryList = [];
      this.$nextTick(() => {
        this.$refs.tableData.bodyWrapper.scrollTop = this.$refs.tableData.bodyWrapper.scrollHeight
      })
    },
    //初始化编辑属性
    initEditAttribute() {
      let dataArray = []
      if (dataArray.length > 0) {
        //添加编辑事件
        for (let index in dataArray) {
          dataArray[index]["edit"] = false;
          this.from.table_data.push(dataArray[index]);
        }

        if (Object.keys(this.new_date_json).length === 0) {
          //新增时，初始化数据结构
          this.initAddDataJson(dataArray[0]);
        }
      }
      console.log("this.tableData:", this.form.table_data);
    },
    initAddDataJson(dataArray) {
      //新增时，初始化数据结构
      let dataJson = dataArray;
      let newDateJson = {};
      for (let key in dataJson) {
        if (key === "edit") {
          newDateJson[key] = "true";
        } else {
          newDateJson[key] = "";
        }
      }
      newDateJson["add"] = true;
      this.new_date_json = newDateJson;
    },

    //选择人员
    chooseUser(list) {
      console.log(434,list);
      list.map(item=>item.fullName = item.name?item.name:item.fullName)
      this.selectedzxryList = list.map(item => ({
        // ...item,
        id: item.id,
        fullName: item.fullName,
        name:item.fullName,
        userId:item.id,
      }))
      this.form.table_data[this.scopeIndex].receiver = list.map(item => item.fullName).join(',')
      this.form.table_data[this.scopeIndex].receiverIds = list.map(item => item.id)
      this.form.table_data[this.scopeIndex].userInfo =this.selectedzxryList
    },
    onzxryFocus(item,userNames, scopeIndex) {
      console.log(408,item);
      this.scopeIndex = scopeIndex
      if(item.userInfo){
        item.userInfo.map(v=>{
          v.fullName =v.name
          v.id =v.userId
        })
      }
      this.selectedzxryList = item.userInfo || [];
      this.showme = this.selectedzxryList.length==0?true:false
      this.userVisible = true
    },
    onzxryRemove(val) {
      console.log(this.selectedzxryList);
      let index = this.selectedzxryList.findIndex(item => item.id === val)
      this.selectedzxryList.splice(index, 1)
    },


    changeSelect(row,column,value,scopeIndex){
      console.log(429,row,column,value,scopeIndex);
      // let zgztArr =['在岗','轮休','离岗']
      let zgztArr =['0','1','2']
      if(column.label==='在岗状态'&&zgztArr.includes(value)){
        this.$set(this.form.table_data[scopeIndex],"gjgz",'')
        if(row.zgzt&&value==='0'){
          this.gjgz = this.gjgz1
          this.$set(this.form.table_data[scopeIndex],"gjgz",this.gjgz1[0].label)
        }else {
          this.gjgz = this.gjgz2
        }
      }
    },

    gjgzFocus(i,value,scopeIndex){
      console.log(443,i,value,scopeIndex);
      if(i.gjgz) {
        if(i.zgzt==='0'||i.zgzt==='在岗'){
          this.gjgz =this.gjgz1
        }else {
          this.gjgz =this.gjgz2
        }
        this.checkList =i.gjgz.split(',')
        this.gjgzCheckVisible = true
      }else {
        this.checkList = []
        switch (i.zgzt) {
          case'0':
            this.gjgz =this.gjgz1
            this.gjgzCheckVisible = true
            break
          case'1':
          case'2':
            this.gjgz =this.gjgz2
            this.gjgzCheckVisible = true
            break
          default:
            this.$message({
              type: 'warning',
              message: "请先选择在岗状态"
            });
            break;
        }
      }
      this.scopeIndex =scopeIndex
    },

    saveGjgz(){
      this.gjgzCheckVisible=false
      // this.form.table_data[this.scopeIndex].gjgz = this.checkList.join(',')
      this.$set(this.form.table_data[this.scopeIndex],"gjgz",this.checkList.join(','))
    }
  },


};
</script>
<style lang="scss" scoped>
.alarm-list-box {
  .el-form-item {
    margin: 8px 0;
  }
  .gjgz-check{
    .el-checkbox{
      margin:5px 10px;
      width: 28%;
    }
  }
  .btn-group {
    color: #409EFF;
    width: auto;
    span {
      margin: 0 8px;
    }
  }
  .push-group{
    margin: -20px 0 20px;
    //text-align: center;
  }
  //.user-input::v-deep{
  //  .el-input__inner{
  //    color: rgb(64, 158, 255)!important;
  //  }
  //}
  ::v-deep.el-input.is-disabled .el-input__icon{
    display: none;
  }
  ::v-deep.el-select .el-input.is-disabled .el-input__inner{
    border: none;
    background: #fff;
    color: #606266;
    text-align: center;
  }
  ::v-deep.el-input.is-disabled .el-input__inner{
    border: none;
    background: #fff;
    color: #606266;
    text-align: center;
  }
  ::v-deep.el-select__tags{
    max-width: 220px!important;
    //justify-content: center;
  }
}
</style>