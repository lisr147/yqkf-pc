<template>
  <div>
    <table class="std">
      <tr>
        <td>
          <span>总人数（人）：</span
          ><span class="red">{{ data[`zrs_total`] }}</span>
        </td>
        <td>
          <span>现有人数（人）：</span
          ><span class="red">{{ data[`xyr_total`] }}</span>
          <div class="btn" @click="showPeopleDetail">人员明细</div>
        </td>
      </tr>
      <tr>
        <td>
          <span>转移到隔离酒店人数（人）：</span
          ><span>{{ data[`zydgl_total`] }}</span>
        </td>
        <td>
          <span>离开后已回嘉安花园人数：</span
          ><span>{{ data[`lkhyhjahy_total`] }}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span>5月25日前离开嘉安，不在珠江辖内人数：</span
          ><span>{{ data[`wywrqlkjabzzjxn_total`] }}</span>
        </td>
        <td>
          <span>离开后未回嘉安但在珠江辖内人数：</span
          ><span>{{ data[`lkhwhjadzzjxn_total`] }}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span>5月25日后离开，不在珠江辖内人数：</span
          ><span>{{ data[`wyeswrhlkbzzjxn_total`] }}</span>
        </td>
        <td>
          <span>其他：</span><span>{{ data[`qt_total`] }}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span>重点人群人数：</span><span>{{ data[`jsbzdrqlb_total`] }}</span>
          <br />
          （如残疾、独居老人、怀孕、困难人员、精神病、自闭症等）
        </td>
      </tr>
      <!-- <tr>
        <td><span>涉疫单元数：</span><span>123</span></td>
      </tr> -->
    </table>
  </div>
</template>

<script>
export default {
  name: "BuildingDetail",
  props: ["data"],
  data() {
    return {};
  },
  methods: {
    async showPeopleDetail() {
      this.$emit("addDetail", {
        ...this.data,
        id: new Date().getTime() + this.data.j + this.data.d,
        name: "房号人员列表",
        component: "StaffTable",
        // top:'2vh',
        class:'dialog-staff'
        // width:'1000px'
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.std {
  width: 100%;
  .prim {
    color: #6786ef;
  }
  td {
    padding: 0.5em;
    color: #fff;
    width: 50%;
    .red {
      color: #e8463f !important;
    }
    span {
      &:nth-child(2) {
        color: #ffff00;
        font-weight: 800;
      }
    }
  }
}
.btn {
  background-image: url("~@/assets/image/btn1.png");
  width: 111px;
  height: 37px;
  background-size: 100%;
  background-repeat: no-repeat;
  display: inline-block;
  line-height: 37px;
  color: #86d5fc;
  text-align: center;
  cursor: pointer;
  margin-left: 10px;
}
</style>
<style lang="scss">
.community .el-dialog.dialog-building{
  left: 30vw ;
  top: 10vh ;
  transform:translateX(0);
}
</style>
