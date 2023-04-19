<template>
  <div class="person-detail">

    <div class="basis_info">
      <div class="item">姓名: {{data.xm}}</div>
      <div class="item">房间号: {{data.fh}}</div>
      <div class="item">电话号码:  {{data.lxfs}}</div>
    </div>

    <!-- <ul class="time-tab">
      <li class="item " :class="{active:currIndex == index}"
          @click="currIndex=index" v-for="(item,index) in listData" :key="index">{{item.date}}<span v-if="item.count>0">({{item.count}})</span></li>
    </ul> -->

    <div class="time-line">
      <div class="title" style="margin-bottom:10px;">核酸检测数据</div>
      <!-- <el-timeline v-if="listData[currIndex]">
        <el-timeline-item
          v-for="(item, index) in listData[currIndex].data"
          :key="index"
          :timestamp="item.createTime"
          color="#3462F0"
          placement='top'>
          <div class="time-line-content">
            {{item.title}}
          </div>
        </el-timeline-item>
      </el-timeline>
      <div class="empty" v-show="listData[currIndex] && listData[currIndex].data.length == 0">
        没有数据
      </div> -->


      <table-page
      :data="tableListData"
      :customClass="'staff_table'"
      :hideKeyFilter="true"
      :hideSearch="true"
      :filter="filter"
    />
    </div>

  </div>
</template>

<script>
// import {getStaffTimeline} from '@/api/mapData'
import tablePage from 'zkzc-table-page'
export default {
  name: 'PersonDetail',
  props: ['data'],
  components:{tablePage},
  data () {
    return {
      basisInfo: {
        name: '张无忌',
        room: 401,
        mobile: 1454234234
      },
      listData: [
      ],
      currIndex: 0,
      filter:{

      },
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: [
          {
            id: "CYRQ",
            label: "采样日期",
            minWidth: 120,
          },
          {
            id: "CYDD",
            label: "采样地点",
            minWidth: 140,
          },
          {
            id: "JCSJ",
            label: "检测时间",
            minWidth: 120,
          },
          {
            id: "JCJIEGUO",
            label: "检测结果",
            minWidth: 80,
          },

        ],
        tableFunctions: [],
      },
    }
  },
  watch:{
    data: {
      handler: function (obj) {
        if (obj.id) {
          this.getData()
        }
      },
      immediate: true
    }
  },
  methods: {
    async getData(){
      // var {dates} = await getStaffTimeline({id: this.data.id})

      // dates.forEach(item=>{
      //   item.date = item.date.split(' ')[0].replace('2021-','')
      //   item.count = item.data.length
      // })
      // this.listData = dates

      // 获取核酸结果
      // this.data.sfzh = '441224199404220823'
      if(!this.data.sfzh){
        return
      }

      let res = await this.$Api().HSCheckController.get_query.request({
        path:{
          idcard:this.data.sfzh
        }
      })
      res.forEach(v=>{
        if(v.JCSJ){
          v.JCSJ = v.JCSJ.slice(0,10)+' '+v.JCSJ.slice(10)
        }
        if(v.CYRQ){
          v.CYRQ = v.CYRQ.slice(0,10)+' '+v.CYRQ.slice(10)
        }
        for(let i in v){
          v[i] = v[i]||'-'
        }

      })
      res.sort((a,b)=>{
        return new Date(b.CYRQ).getTime() - new Date(a.CYRQ).getTime()
      })
      this.tableListData.tableData = res
      console.log(res)

    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.person-detail{
  .basis_info{
    display: flex;
    flex-direction: row;
    margin: 0 10px;
    padding: 8px 10px;
    background-color: #192B61;
    font-size: 14px;

    .item {
      flex: 1;
    }
  }
  .time-tab {
    display: flex;
    flex-direction: row;
    padding: 14px 10px;
    flex-wrap: wrap;

    .item{
      margin: 3px;
      padding: 6px 10px;
      width: 10%;
      font-size: 12px;
      text-align: center;
      background-color: #192B61;
      cursor: pointer;
      border-radius: 4px;
      &:last-child{
        margin-right: 0;
      }
      &.active {
        background-color: #5478E4;
      }
    }
  }
  .time-line {
    padding: 20px;
    max-height: 300px;
    overflow: auto;

    .empty{
      padding: 3em;
      text-align: center;
      background-color:#192B61;
      color: #fff;
    }
  }
}
</style>
<style lang="scss">
.person-detail {
  .el-timeline-item__tail {
    border-left: 3px solid #5478E4;
  }
  .el-timeline-item__timestamp {
    color: #fff;
    font-size: 15px;
  }
  .time-line-content {
    color: #fff;
    background-color: #192B61;
    padding: 6px 10px;
    border-radius: 3px;
    margin-top: 12px;
    width: 90%;
    font-size: 15px;
  }
}

.community .el-dialog.dialog-person{
  top: 35vh;
  left:20vw ;
  transform: translateX(0);
}
</style>
