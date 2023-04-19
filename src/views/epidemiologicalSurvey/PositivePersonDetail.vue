<template>
  <el-dialog
    :visible="true"
    top="10vh"
    title="阳性人员详情"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="900px"
  >
    <el-tabs v-model="currTab" type="card">
      <el-tab-pane label="基本信息" name="base">
        <div class="base-info">
          <table>
            <tr>
              <td>所属专项：</td>
              <td>{{ baseInfo.glsj }}</td>
            </tr>
            <tr>
              <td>姓名：</td>
              <td>{{ baseInfo.xm }}</td>
            </tr>
            <tr>
              <td>国籍：</td>
              <td>{{ baseInfo.gj }}</td>
            </tr>
            <tr>
              <td>证件类型：</td>
              <td>{{ baseInfo.zjlx }}</td>
            </tr>
            <tr>
              <td>有效证件号：</td>
              <td>{{ baseInfo.sfzhm }}</td>
            </tr>
            <tr>
              <td>联系方式：</td>
              <td>{{ baseInfo.lxfs }}</td>
            </tr>
            <tr>
              <td>目前所处位置：</td>
              <td>{{ baseInfo.mqscwz }}</td>
            </tr>
            <tr>
              <td>住址：</td>
              <td>{{ baseInfo.xzz }}</td>
            </tr>
            <tr>
              <td>职业：</td>
              <td>{{ baseInfo.zy }}</td>
            </tr>
            <tr>
              <td>工作单位：</td>
              <td>{{ baseInfo.gzdw }}</td>
            </tr>
            <tr>
              <td>关联病例：</td>
              <td>{{ baseInfo.glbl }}</td>
            </tr>
            <tr>
              <td>密接类型：</td>
              <td>{{ baseInfo.mjlx }}</td>
            </tr>
          </table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="流调活动轨迹" name="track">
        <div class="track-list">
          <el-timeline :reverse="false">
            <el-timeline-item
              v-for="(item, index) in trackList"
              :key="index"
              :timestamp="item.time"
            >
              {{ item.name }}, {{ item.location }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>

      <el-tab-pane label="重点人员清单" name="keyPerson">
        <import-data-table
          :conf="keyPersonConf"
          ref="keyPersonTable"
        ></import-data-table>
      </el-tab-pane>

      <el-tab-pane label="发病及诊疗经过" name="sickHistory">
        <div class="empty">暂无数据</div>
      </el-tab-pane>

      <el-tab-pane label="实验室结果" name="labResult">
        <div class="empty">暂无数据</div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import moment from "moment";
import ImportDataTable from "@/views/common/ImportDataTable";

export default {
  name: "PositivePersonDetail",
  components: {
    ImportDataTable,
  },
  props: {
    cond: {
      type: Object,
      default() {
        return {}; //id, ldId 流调id, glbl 关联病例
      },
    },
  },
  data() {
    return {
      currTab: "base",
      baseInfo: {}, //基本信息
      trackList: [], //流调轨迹
      keyPersonConf: {}, //重点人员请求参数配置
    };
  },
  async mounted() {
    await this.getBaseInfo();
    await this.getTrackList();
    this.getkeyPersonList();
  },
  methods: {
    //基本信息
    async getBaseInfo() {
      const { id } = this.cond;
      const res = await this.$Api().ImportDataController.post_dataPage.request({
        path: { templateId: 10096 },
        data: {
          condition: {
            id,
          },
          page: 1,
          pageSize: 1,
        },
        headers: { hideNotify: true },
      });
      this.baseInfo = res.data[0];
    },

    //重点人员清单
    getkeyPersonList() {
      this.keyPersonConf = {
        id: 10097,
        condition: {
          glbl: this.cond.ldId,
        },
      };
    },

    //流调活动轨迹
    async getTrackList() {
      const { ldId } = this.baseInfo; //流调id
      const res = await this.$Api().ImportDataController.post_dataPage.request({
        path: { templateId: 10098 },
        headers: { hideNotify: true },
        data: {
          condition: { ldId },
          page: 1,
          pageSize: 9999,
        },
      });
      this.trackList = res.data.map(item => {
        const { csdz, csmc, hdsj } = item;
        return {
          name: csmc,
          location: csdz,
          time: this.getTimeRange(hdsj),
        };
      });
    },

    getTimeRange(str) {
      try {
        const [start, end] = str.split(",");
        if (start && end) {
          const diff = moment(end).diff(moment(start), "hours");
          return `${str}  ${diff}小时`;
        } else {
          return str;
        }
      } catch (error) {
        return str;
      }
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.track-list {
  padding: 1em 2em;
  max-height: 500px;
  overflow: auto;

  .el-timeline-item__wrapper {
    background-color: #f0f0f0;
  }
}
.base-info {
  padding: 0 1em;
  table {
    width: 100%;
    tr {
      td {
        padding: 0.3em 0.5em;
      }
      td:first-child {
        width: 100px;
      }
    }
  }
}
.empty {
  padding: 6em 2em;
  text-align: center;
}
</style>
