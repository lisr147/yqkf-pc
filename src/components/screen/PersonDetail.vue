<template>
  <div class="person-detail">
    <div class="person-detail-t">
      <div class="item" :class="{active: index==currIndex}"
        @click="currIndex=index" v-for="(item,index) in tabs" :key="index" >{{item.label}}</div>
    </div>

    <!--基本信息-->
    <div class="person-detail-b" v-show="currIndex==0">
      <section>
        <h4>人员信息</h4>
        <div>
          <table class="std">
            <tr>
              <td><span>身份证号码：</span><span>{{data.sfzhzhmMasking || '-'}}</span></td>
              <td><span>境外输入病例：</span><span>{{data.sfjwsrbl || '-'}}</span></td>
            </tr>
            <tr>
              <td><span>家庭住址：</span><span>{{data.jtzz || '-'}}</span></td>
              <td><span>应解除观察日期：</span><span>{{data.yjcgcrq || '-'}}</span></td>
            </tr>
            <tr>
              <td><span>职业：</span><span>{{data.zy || '-'}}</span></td>
            </tr>
          </table>
          <div class="timeline">
            <ul >
              <li v-for="(item,index) in timeline" :key="index" :class="{active: item.active}" v-if="item.time">
                <span class="t">{{item.time}}</span>
                <span class="v">{{item.value}}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h4>人员信息</h4>
        <div>
          <table class="std">
            <tr>
              <td><span>关联病例：</span><span class="prim">{{data.glblxm || '-'}}</span></td>
              <td><span>与患者关系：</span><span>{{data.yhzgx || '-'}}</span></td>
              <td><span>关系类型：</span><span>{{data.gxlx || '-'}}</span></td>
            </tr>
            <tr>
              <td><span>接触频率：</span><span>{{data.jcpv || '-'}}</span></td>
              <td><span>接触地址：</span><span>{{data.jcdd || '-'}}</span></td>
              <td><span>接触方式：</span><span>{{data.jcfs || '-'}}</span></td>
            </tr>
            <tr>
              <td><span>最后接触日期：</span><span>{{data.zhjcrq || '-'}}</span></td>
            </tr>
          </table>
        </div>
      </section>
      <section v-if="closeRelativeMap">
        <h4>人员关系图谱</h4>
        <RelativeMap :id="data.sfzhzhm" @closeRelativeMap="closeRelativeMap = false"/>
      </section>
    </div>

    <!--健康登记-->
    <div class="person-detail-b"  v-show="currIndex==1">
      <section>
        <h4>核酸检测</h4>
        <div class="hlist" v-if="hsList.length===0">暂无数据</div>
        <div class="hlist">
          <ul>
            <li v-for="(item,index) in hsList" :key="index">
              <div class="l">
                <p>核酸采集时间：{{item.time}}</p>
                <p>结果：{{item.value}}</p>
              </div>
              <div class="r">
                <p>备注：{{item.remark}}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section>
        <h4>健康检查</h4>
        <div class="hlist" v-if="healthList.length===0">暂无数据</div>
        <div class="hlist">
          <ul>
            <li v-for="(item,index) in healthList" :key="index">
              <div class="l">
                <p>健康检查时间：{{item.time}}</p>
                <p>体温：{{item.temp}}</p>
              </div>
              <div class="r">
                <p>症状：{{item.hasState}}</p>
                <p>备注：{{item.remark}}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import RelativeMap from '@/components/MapLayer/RelativeMap.vue'
  export default {
    name: 'PersonDetail',
    props: ['data'],
    components: {
      RelativeMap
    },
    data() {
      return {
        tabs:[
          {label: '基本信息'},
          {label: '健康登记'},
        ],
        currIndex: 0,
        timeline: [
          // {time: '2021-05-12 12:13', value: '开始隔离时间',active:false},
          // {time: '2021-05-12 12:13', value: '转为密接日期',active:false},
          // {time: '2021-05-12 12:13', value: '解除隔离日期',active:true},
          {
            value: "最后接触日期",
            time: this.data.zhjcrq,
          },
          {
            value: "转为密接日期",
            time: this.data.zwmjrq,
          },
          {
            value: "开始隔离时间",
            time: this.data.ksglsj,
          },
          {
            value: "开始观察日期",
            time: this.data.ksgcrq,
          },
          // {
          //   value: "应解除观察日期",
          //   time: this.data.yjcgcrq,
          // },
          // {
          //   value: "结束时间",
          //   time: this.data.jssj,
          // }
        ],
        hsList:[
        ],
        healthList:[
        ],
        relativeMapLength: 1,
        closeRelativeMap: true
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData(){
        // var {sfzhzhm} =this.data

        // todo: 增加空数据展示

        const healthData = await this.$Api().HealthExaminationController.get_searchExamination.request({path:{
          personId: this.data._id
        }})
        this.healthList = healthData.map(item=>{
          return {
            time: item.examinationTime,
            hasState: parseInt(item.symptom) > 0 ? '有' : '无',
            temp: item.temperature + '°C',
            remark: item.remarks
          }
        })

        const nucleicData = await this.$Api().NucleicAcidExaminationController.get_searchExamination.request({
          path: {
            personId: this.data._id
          }
        })

        this.hsList = nucleicData.map(item => {
          return {
            time: item.examinationTime,
            value: parseInt(item.result) > 0 ? '阳性' : '阴性',
            remark: item.remarks
          }
        })

      }
    }
  }
</script>

<style lang="scss" type="text/scss">
.person-detail{
  color: #fff;

  &-t{
    margin: 1em 0;
    .item{
      position: relative;
      display: inline-block;
      margin: 0 4px;
      padding: .5em 1em;
      color: #fff;
      z-index: 2;
      cursor: pointer;

      &:before{
        content:'';
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height: 100%;
        background-color: #142652;
        transform: skewX(-15deg);
        z-index: -1;
      }

      &:hover,
      &.active{

        &::before{
          background-color: #2251f4;
        }

      }
    }
  }
  &-b{
    max-height: 500px;
    overflow: auto;
    section{
      padding: 0.5em 0;
      h4{
        padding: .5em;
        color: #4E7CFC;
        font-weight: normal;
      }
    }
    .timeline{
      padding: 1em;
      ul{
        position: relative;
        display: flex;
        flex-direction: row;

        &::before{
          content: '';
          position: absolute;
          top:2.2em;
          left:2em;
          right:2em;
          border-top:2px solid #2251f4;
        }

        li{
          flex: 1;
          position: relative;
          height: 60px;
          box-sizing: border-box;
          text-align: center;

          &:after{
            content:'';
            position: absolute;
            top: 1.8em;
            left: 49%;
            width:10px;
            height: 10px;
            border: 2px solid #2251f4;
            background-color: #1d3677;
            border-radius: 50%;
          }

          &.active{
            &:after{
              background-color: #fff;
            }
          }

          .t{
            display: inline-block;
            padding: 0 0.5em;
            background-color: #2251f4;
            height: 16px;
            border-radius: 8px;
          }
          .v{
            display: block;
            margin-top: 1.8em;
            text-align: center;
          }
        }
      }


    }
    .std{
      width: 100%;

      .prim{
        color: #6786ef;
      }

      td{
        padding: 0.5em;
      }
    }
    .hlist{
      li{
        display: flex;
        flex-direction: row;
        padding:.6em;
        margin: 0 0 4px;
        background: rgba(25, 42, 87,0.5);


        & > div{
          flex: 1;
        }
        p{
          line-height: 1.5em;
          color: #fff;
        }
      }
    }
  }
}
</style>
