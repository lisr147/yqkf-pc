<template>
  <div class="video-list">
    <table-page
      :data="tableListData"
      :filter="filter"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      :hideKeyFilter="true"
      :customClass="'staff_table'"
      :hideSearch="true"
      :height="400"
    >
    </table-page>
  </div>
</template>

<script>
import TablePage from "zkzc-table-page";
import TablePageFunc from "@/utils/tablepage";
import { getMapLayerData } from "@/api/mapData.js";
import SETTING from "@/config/MapSetting.js";
import { getVideoFromUid } from "@/api/mapData.js";

//   const DYNAMIC_VIDEO_LIST = [
//     "driverWorkPoint-video",
//     "driverWorkPoint",
//     'detectionPoint',
//     'detectionPoint-video',
//     'bigDetectionPoint',
//     'bigDetectionPoint-video',
//     'school',
//     'school-video',
//     "coldWarehouse",
//     "coldWarehouse-video",
//     "maternityCenter",
//     "maternityCenter-video",
//     "nurseHouse",
//     "nurseHouse-video",
//     "detectPointAround",
//     "detectPointAround-video",
//     "industry",
//     "industry-video",
//     "gcyKeyplace",
//     "gcyKeyplace-video",
//     "therapyStation",
//     "therapyStation-video",
//     "hospital",
//     "hospital-video",
//     "recovery-video",
//     "maternalChild-video",
//     "mentalHealth-video",
//     "socialServiceCenter-video",
//     "constructionSite-video",
//     "religionPlace-video",
//   ]

const PLAYBCK_ENABLR_LIST = [
  "driverWorkPoint-video",
  "driverWorkPoint",
  "detectionPoint",
  "detectionPoint-video",
  "bigDetectionPoint",
  "bigDetectionPoint-video",
  "coldWarehouse",
  "coldWarehouse-video"
];

export default {
  name: "VideoList",
  components: {
    TablePage
  },
  props: {
    cond: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  mixins: [TablePageFunc],
  data() {
    return {
      filter: {
        pageNum: 1,
        pageSize: 15,
        rowTotal: 1,
        pageSizes: [15, 50, 100, 200]
      },
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: (function(cond) {
          const { layerId } = cond;
          let res = [];
          switch (layerId) {
            case "school":
            case "school-video":
              res = [
                {
                  id: "uid",
                  label: "设备UID",
                  minWidth: 100
                },
                {
                  id: "ssdw",
                  label: "所属学校名称"
                },
                {
                  id: "csfl",
                  label: "场所分类"
                },
                {
                  id: "szxxdz",
                  label: "安装地址"
                }
              ];
              break;
            case "gcyKeyplace":
            case "gcyKeyplace-video":
              res = [
                {
                  id: "uid",
                  label: "设备UID",
                  minWidth: 100
                },
                {
                  id: "cslx",
                  label: "场所类型"
                },
                {
                  id: "szxxdz",
                  label: "安装地址"
                },
                {
                  id: "csfl",
                  label: "场所分类"
                }
              ];
              break;
            default:
              res = [
                {
                  id: "uid",
                  label: "设备UID",
                  minWidth: 100
                },
                {
                  id: "sszj",
                  label: "所属镇街"
                },
                {
                  id: "ssdw",
                  label: "所属单位"
                },
                {
                  id: "sswg",
                  label: "所属网格"
                },
                {
                  id: "csfl",
                  label: "场所分类"
                }
              ];
              break;
          }
          return res;
        })(this.cond),
        tableFunctions: (function(vm) {
          const recordEnable = PLAYBCK_ENABLR_LIST.includes(vm.cond.layerId);

          const opts = [
            {
              label: "实时视频",
              method: vm.showVideo
            }
          ];

          if (recordEnable) {
            opts.push({
              label: "回放视频",
              method: vm.showRecord
            });
          }

          return opts;
        })(this),
        columnFunctionsWidth: 180
      }
    };
  },
  watch: {
    cond(val) {
      console.log(`videoList change: ${val}`);
      this.getData();
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取所属单位名称
    //不同图层使用了不同的字段名
    getSSDW() {
      var { ssdw, layerId, grid, name, spTemplateId } = this.cond;
      const layerSetting = SETTING.getLayerInfo(layerId);
      var newSSWD;

      if (ssdw) {
        newSSWD = ssdw;
      } else if (layerSetting.ssdwKey) {
        let arr = layerSetting.ssdwKey.split(",");
        let sswds = arr.map(v => this.cond[v]).filter(v => v !== undefined);
        newSSWD = sswds[0];
      }

      return {
        ssdw: newSSWD,
        layerId,
        grid: grid || name,
        spTemplateId
      };
    },

    async getData() {
      //ssdw所属单位 请求
      let { ssdw, layerId, grid, spTemplateId } = this.getSSDW();
      if (layerId === "detectionPoint" && this.cond.templateId === 10027) {
        // 由于常规和大规模都合在一个图层展示，所以弹框得layerid都是一个，这里要把大规模的改回去，才能请求正确的template
        layerId = "bigDetectionPoint";
      }
      var videoLayerId = layerId.includes("-video")
        ? layerId
        : `${layerId}-video`;
      const layerSetting = SETTING.getLayerInfo(videoLayerId);
      if (!layerSetting) {
        console.error(`videoList没有获取到图层${layerId} 的配置`);
        return;
      }
      const condition = {
        ssdw: ssdw, //所属单位
        sswg: grid, //所属网格
        layerId //用于调试，非必填
      };
      if (layerSetting.templateId === 10119) {
        condition.tags = layerSetting.label.split("视频")[0];
      }
      var res = await getMapLayerData({
        condition,
        templateId: spTemplateId || layerSetting.templateId,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize
      });

      //处理数据，增加设备名称
      res.data.forEach(item => {
        switch (layerId) {
          case "school":
          case "school-video":
            item.videoName = item.szxxdz;
            break;
          default:
            item.videoName = item.ssdw;
            break;
        }
      });

      this.tableListData.tableData = res.data;
      this.filter.rowTotal = res.total;
    },

    //显示回放视频
    showRecord({ row }) {
      this.$emit("popUp", { eventType: "showVideoRecord", attributes: row });
    },

    //显示直播视频
    async showVideo({ row }) {
      if (this.$store.state.map.floatVideoList.length >= 9) {
        this.$message({
          message: "最多只能有9个视频",
          type: "warning"
        });
        return;
      }

      const hasSame = this.$store.state.map.floatVideoList.filter(
        item => item.deviceUid === row.uid
      );
      if (hasSame.length) {
        this.$message({
          message: `视频已存在 - 设备UID:${row.uid}`,
          type: "warning"
        });
        return;
      }

      const { templateId, uid, videoName } = row;

      // 兼容 海康H5播放器 使用，videoInfo 存放有服务供应商字段
      let videoInfo = await getVideoFromUid({ templateId, deviceUid: uid });
      videoInfo.deviceUid = uid;
      this.$store.commit("map/ADD_VIDEO", {
        name: `${videoName} - ${uid}`,
        url: videoInfo.url,
        videoInfo,
        templateId,
        deviceUid: uid
      });
      /*
        const {id} = SETTING.getLayerInfo({templateId})
        if (DYNAMIC_VIDEO_LIST.includes(id)) {
          const {url} = await getVideoFromUid({templateId, deviceUid: uid})
          this.$store.commit('map/ADD_VIDEO', {name: `${videoName} - ${uid}`, url, templateId, deviceUid: uid})
        } else {
          //摄像头名称 sxtmc
          this.$store.commit('map/ADD_VIDEO', {name: row.sxtmc, url: row.url, templateId, deviceUid: uid})
        }*/

      this.$emit("popUp", { eventType: "showVideoDetail" });
    }
  }
};
</script>

<style lang="scss" type="text/scss">
.video-list {
}
</style>
