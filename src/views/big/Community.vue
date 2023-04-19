<template>
  <div class="community">

    <!--地图-->
    <community-map-layer @choosed="handleChoose" :layerVisible="layerVisible"></community-map-layer>

    <el-dialog
      v-dialogDrag
      :width="item.width||'722px'"
      :custom-class="item.class||''"
      v-for="(item, key) in detailList"
      v-if="detailList[key]"
      :title="item.name"
      :visible="true"
      :modal="false"
      :key="key"
      :id="`dialog_${key}`"
      :close-on-click-modal="false"
      @hook:mounted="dialogMounted(`dialog_${key}`)"
      @close="() => {
        detailList[key] = false
      }"
    >

      <component
        :is="item.component"
        :data="item"
        @addDetail="addDetail"
      />

    </el-dialog>


    <!--左侧数据统计-->
    <sidebar-panel class="community-l" title="嘉安花园整体情况">
      <div class="">
        <section>
          <p>总人数：<count-to :end-val="summary.zrs_total" class="bn" /></p>
          <!--<p>6月4日前人员情况（人）：<span class="n">215</span></p>-->
          <p>离开后已回嘉安花园人数：<span class="n">{{summary.lkhyhjahy_total}}</span></p>
          <p> 离开后未回嘉安但在珠江辖内人数：<span class="n">{{summary.lkhwhjadzzjxn_total}}</span></p>
          <p>5月25日前离开嘉安，不在珠江辖内人数：<span class="n">{{summary.wywrqlkjabzzjxn_total}}</span></p>
          <p>5月25日后离开，不在珠江辖内人数：<span class="n">{{summary.wyeswrhlkbzzjxn_total}}</span></p>
        </section>
        <section>
<!--          <p>现有人数：<count-to :end-val="summary.xyr_total" class="bn" /></p>-->
          <p>现有人数：<count-to :end-val="3729" class="bn" /></p>
          <p>重点人群人数：<span class="n">{{summary.jsbzdrqlb_total}}</span>（如残疾、独居老人、怀孕、困难人员、精神病、自闭症等）</p>
        </section>
        <section>
          <p>转移到隔离酒店人数（人）：<span class="n">{{summary.zydgl_total}}</span></p>
          <p>其他：<span class="n">{{summary.qt_total}}</span></p>
        </section>
      </div>
    </sidebar-panel>

    <!--右侧图例和按钮-->
    <div class="community-r">
      <div class="legend">
        <img src="@/assets/image/community/legend.png"/>
      </div>
      <div class="toolbar">
        <div class="rbtn" @click="gotoZD"><span>嘉安花园重点人群情况</span></div>
        <div class="rbtn" @click="imgVisible=true"><span>无人机巡航图片</span></div>
        <div class="rbtn" @click="videoVisible=true"><span>无人机巡航视频</span></div>
        <div class="rbtn" @click="layerVisible=!layerVisible"><span>{{layerVisible?'隐藏':'显示'}}楼栋图层</span></div>
      </div>
    </div>

    <!--巡航图片查看-->
    <image-viewer v-model="imgVisible"/>

    <!--巡航视频查看-->
    <video-viewer v-model="videoVisible" />

    <!--<el-dialog-->
      <!--:visible="true"-->
      <!--v-dialogDrag-->
      <!--title="测试"-->
      <!--width="900px">-->
      <!--<div style="height:200px;background-color: #2f89ef"></div>-->
    <!--</el-dialog>-->
    <!--append-to-body-->

  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import CommunityMapLayer from "@/components/Community/CommunityMapLayer";
  import BuildingDetail from '@/components/Community/BuildingDetail'
  import StaffTable from '@/components/Community/StaffTable'
  import RoomDetail from '@/components/Community/RoomDetail'
  import PersonDetail from '@/components/Community/PersonDetail'
  import ImageViewer from "@/components/Community/ImageViewer";
  import VideoViewer from "@/components/Community/VideoViewer";
  import SidebarPanel from "@/components/screen/SidebarPanel"
  import { getBuildingSummary, getSummaryOfCommunity } from '@/api/mapData.js'


  export default {
    name: "Community",
    components: {
      SidebarPanel,
      ImageViewer,
      VideoViewer,
      CommunityMapLayer,
      BuildingDetail,
      StaffTable,
      RoomDetail,
      PersonDetail,
      CountTo
    },
    data() {
      return {
        detailList: {},
        imgVisible: false,
        videoVisible: false,
        layerVisible: true,
        //小区概况
        summary: {}
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData(){

        //todo: 当前接口数据有误
        // this.summary = await getSummaryOfCommunity()

        this.summary = {
          //总人数
          "zrs_total": 4687 ,
          //现有人数
          "xyr_total": 3538,
          //重点人群人数
          "jsbzdrqlb_total": 127,
          //离开后已回嘉安花园人数
          "lkhyhjahy_total": 52 ,
          //离开后未回嘉安但在珠江辖内人数
          "lkhwhjadzzjxn_total": 72,
          //5月25日前离开嘉安，不在珠江辖内人数
          "wywrqlkjabzzjxn_total": 107,
          //5月25日后离开，不在珠江辖内人数
          "wyeswrhlkbzzjxn_total": 92,
          //转移到隔离酒店人数
          "zydgl_total": 188,
          //其他
          "qt_total": 95,
        }

      },
      async handleChoose(event) {
        //todo: 查看楼栋
        console.log(event)
        let res = await getBuildingSummary({buildingName: event.name})
        this.$set(this.detailList, event.name ,{...res, name: event.name, component: 'BuildingDetail',class:'dialog-building'})
      },
      async addDetail (data) {
        this.$set(this.detailList, data.id ,{...data})
      },
      gotoZD(){
        window.open(`${location.origin + location.pathname}#/community/jaImportant`)
      },
      async dialogMounted(id){
        let dom = document.getElementById(id)
        let zIndex = await this.$store.dispatch('common/getDialogZIndex')
        dom.style.zIndex = zIndex
        console.log('dialogMounted',id,dom)
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
.community{
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;

  .rbtn{
    margin: .5em 0;
    position: relative;
    box-sizing: border-box;
    border: 10px solid;
    border-image: url('~@/assets/image/community/rect-btn.png') 10;
    color: #fff;
    background: transparent;
    min-width: 170px;
    text-align: center;
    cursor: pointer;
    opacity: 0.7;

    span{
      display: block;
      width: 100%;
      background-color: #0f286a;
      z-index: -1;
    }

    &:hover{
      opacity: 1;
    }
  }

  &-l{
    position: absolute;
    top: 6em;
    left: 2em;
    box-sizing: border-box;
    height: calc(100vh - 120px);

    section{
      padding: 1em 0;

      p{
        line-height: 2em;
        color: #fff;
      }
      .n{
        font-family: BeBas;
        color: #ffff00;
        font-size: 1.5em;
      }
      .bn{
        font-family: BeBas;
        color: #ff312c;
        font-size: 2em;
      }
    }
  }
  &-r{
    position: absolute;
    top: 5em;
    right: 2em;

    .toolbar{
      position: absolute;
      top:0;
      right: 190px;
    }

    .legend {
      width: 176px;
      height: 261px;
    }
  }
}
</style>
