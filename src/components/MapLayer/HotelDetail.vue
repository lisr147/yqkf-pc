<template>
  <div class="detail_content">
    <div class="title">
      基本信息
    </div>
    <div class="basis_info">
      <div class="info_item" v-for="(item, key) in data" :key="key" v-if="hotelLabelMap[key]">
        <label>{{hotelLabelMap[key]}} : </label>
        <span v-if="key == 'jddh'" v-cellphone>{{item || '0'}}</span>
        <span v-else>{{item || '0'}}</span>
      </div>

      <!--<div class="info-opt" >-->
        <!--<div class="cu-btn" @click="showVideoList" >查看实时视频</div>-->
      <!--</div>-->
    </div>

    <!-- <div class="title">
      <div>房间列表 (使用中: <span class="room_count">{{data.rooms ? data.rooms.length : '0'}}</span>间)</div>
      <div class="legend">
        <div class="main_icon"><i></i>密接者</div>
        <div class="minor_icon"><i></i>次密接者</div>
      </div>
    </div>
    <div class="room_list">
      <div class="room" v-for="item in data.rooms" :key="item.fjh">
        <div class="room_name">房间{{item.fjh}}</div>
        <div class="room_member">
          <div class="person" v-for="v in item.personnels" @click="showContactDetail(v)" :key="v.sfzhzhm">
            <i :class="v.mjlx === '密切接触者' ? 'main' : 'minor'"></i>
            <div class="person_name">{{v.xm}}</div>
          </div>
        </div>
      </div>
      <div class="room_list_empty" v-if="data.rooms && !data.rooms.length">当前没有房间</div>
    </div> -->
    <div class="three-group-detail">
      <!-- <div class="three-group-detail-h">
        <span>隔离人数:{{data.persons.length}}人</span>
      </div> -->
      <div class="group-item">
        <!-- <div class="base-info" >
          <div class="info-item">
            <div class="box-label">组名</div><div class="box-value">{{group.name}}</div>
          </div>
          <div class="info-item">
            <div class="box-label">所属镇街</div><div class="box-value">{{group.street}}</div>
          </div>
        </div> -->

        <data-empty-box title="暂无人员明细数据"  v-if="data.persons.length == 0">
        </data-empty-box >

        <div class="members-table" v-else-if="JSON.stringify(labelMap) !== '{}'">
          <table>
            <thead>
              <tr>
                <th v-for="item in labelSort" :key="item">{{item}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pData) in data.persons" :key="pData.uniqueHash" >
                <td v-for="(item, index) in getPersonListData(pData)" :key="index">{{item}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTemplateConfig } from '@/api/mapData.js'
import DataEmptyBox from "@/views/big/layer/DataEmptyBox";
export default {
  name: 'HotelDetail',
  components: {DataEmptyBox},
  props: ['data'],
  data () {
    return {
      basisInfo: {
        ssjz: {
          label: '所属镇街'
        },
        sswg: {
          label: '所属网格'
        },
        // jddh: {
        //   label: '酒店助理及电话'
        // },
        fjs: {
          label: '房间数'
        },
        kyfjs: {
          label: '可用房间数'
        },
        syfjs: {
          label: '剩余房间数'
        },
        jdfl: {
          label: '接待人员分类'
        },
        jddz: {
          label: '地址'
        }
      },
      personListData: [],
      labelMap: {},
      labelSort: [
        '一码通编码',
        '姓名',
        '证件类型',
        '证件号码',
        '身份证号码',
        '人员分类',
        '境内联系手机',
        '紧急人联系人',
        '紧急人及联系方式',
        '性别',
        '出生日期',
        '年龄',
        '是否为留学生',
        '国籍',
        '职业',
        '入住酒店',
        '入住时间',
        '入住房间号',
        '扫码入店操作人姓名',
        '扫码入店操作人手机号',
        '酒店归属区县',
        '入境时间',
        '入境口岸',
        '抵达交通工具',
        '航班号/车牌号',
        '座位号',
        '抵达时间',
        '同行人数',
        '户籍地址',
        '隔离开始时间',
        '隔离结束时间',
        '是否中高风险来粤人员',
        '是否阳性同航班人员',
        '隔离类型',
        '是否疟疾地区'
      ],
      hotelLabelMap: {}
    }
  },
  methods: {
    showContactDetail (data) {
      this.$emit('showContactDetail', data)
    },
    async getLabel(id) {
      let res = await getTemplateConfig({id})
      let labelMap = {}
      res.columns.forEach(item => {
        if (item.header && !['longitude','latitude'].includes(item.storeFiled)) {
          labelMap[item.storeFiled] = item.header
        }
      })
      if (id === '10048') {
        this.labelMap = Object.assign({}, labelMap)
      }
      if (id === '10047') {
        this.hotelLabelMap = Object.assign({}, labelMap)
      }
    },
    getPersonListData(data) {
      let result = []
      let resultMap = {}
      for (const key in data) {
        if (this.labelMap[key]) {
          resultMap[this.labelMap[key]] = data[key]
        }
      }
      this.labelSort.forEach(item => {
        result.push(resultMap[item])
      })
      return result
    },
    showVideoList(){
      this.$emit('popUp', {eventType: 'showVideoList', attributes: {ssdw: this.data.name, layerId: 'hotel-video'}})
    }
  },
  async mounted() {
    await this.getLabel('10048')
    await this.getLabel('10047')
  }
}
</script>

<style lang="scss" scoped>
.three-group-detail {
  //max-height: 400px;
  overflow: auto;

  &-h{
    padding: 1em 0;
    color: #fff;
  }

  .group-item{
    margin: 1em 0;
    color: #fff;
  }

  .base-info {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 96%;

    .info-item {
      width: calc(50% - 1px);
      display: flex;
      border: 1px solid #465da3;
      margin-right: -1px;
      margin-bottom: -1px;
      position: relative;

      .box-label {
        width: 120px;
        min-height: 20px;
        padding: 8px 16px;
        flex-shrink: 0;
        background-color: rgba(45, 85, 208, 0.3);
      }
      .box-value {
        box-sizing: border-box;
        padding: 8px 16px;
        border-left: 1px solid #465DA3;
        width: 100%;
      }
    }
  }
  .members-table{
    position: relative;
    height: 200px;
    width: 100%;
    overflow: scroll;
    table{
      border-collapse: collapse;
      thead{
        position: sticky;
        top: 0;
        tr{
          th{
            position: sticky;
            background: #0f286a;
          }
        }
      }
    }

    th,td{
      padding: .5em;
      border: 1px solid #465da3;
      white-space: nowrap;
    }
  }
}
.detail_content {
  position: relative;
  max-height: 550px;

  .title {
    color: #4E7CFC;
    font-size: 14px;
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    .room_count {
      color: #fff;
    }
    .legend {
      display: flex;
      color: #fff;
      div {
        margin: 0 5px;
      }
      i {
        vertical-align: top;
        width: 18px;
        height: 18px;
        display: inline-block;
      }
    }
    .main_icon {
      i {
        background-image: url("../../assets/image/mainContact.png");
        background-size: 100%;
      }
    }
    .minor_icon {
      i {
        background-image: url("../../assets/image/minorContact.png");
        background-size: 100%;
      }
    }
  }
  .basis_info {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-height: 90px;
    max-height: 250px;
    overflow: auto;

    .info_item {
      min-width: 40%;
      max-width: 100%;
      color: #fff;
      line-height: 28px;

      label {
        display: inline-block;
        margin-right: 6px;
      }
    }

    .info-opt{
      position: absolute;
      top: 0em;
      right: 2em;
    }

  }
  .room_list {
    display: flex;
    flex-wrap: wrap;
    max-height: 340px;
    overflow: auto;

    &_empty{
      padding: 3em;
      width: 100%;
      background-color: #102460;
      text-align: center;
      color: #ddd;
    }

    .room {
      color: #fff;
      font-size: 12px;
      width: 153px;
      height: 70px;
      margin-right: 12px;
      margin-bottom: 15px;
      background: #1D306D;
      border: 1px solid rgba(40, 71, 168, 0.52);
    }
    .room_name {
      margin-left: 6px;
      margin-top: 5px;
    }
    .room_member {
      display: flex;
      justify-content: center;
    }
    .person {
      cursor: pointer;
      height: 46px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 40px;
      margin: 0 2px;
      i {
        display: inline-block;
        width: 26px;
        height: 26px;
        background-size: 100%;
      }
      .main {
        background-image: url("../../assets/image/mainContact.png");
      }
      .minor {
        background-image: url("../../assets/image/minorContact.png");
      }
      .person_name {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
