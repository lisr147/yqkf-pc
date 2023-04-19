<template>
  <div class="data-total" v-if="data">
    <div class="title">数据总览</div>
    <!-- 重点关注 -->
    <div class="block">
      <div class="block-content">
        <div class="root-line">
          <div class="root box">
            重点关注
          </div>
        </div>
        <div class="import-box">
          <div v-if="data.importantList" class="import-box-item">
            <div class="data-line">
              <div
                class="data box"
                v-for="item in data.importantList"
                :key="item.id"
              >
                {{ item.name }}
                <label
                  :style="{
                    color: item.color,
                  }"
                  >{{ item.value || "-"
                  }}<span>{{ item.value ? "人" : "" }}</span></label
                >
              </div>
            </div>
            <div class="update-time">
              更新时间 : {{ data.importantListTime }}<br/>
              数据来源 : {{ data.datasource||'区卫生健康局' }}
            </div>
          </div>

          <div v-if="data.nsq7Dayhsjc" class="import-box-item">
            <div class="data-line">
              <div class="data box">
                {{ data.nsq7Dayhsjc.name }}
                <label
                  >{{ data.nsq7Dayhsjc.value || "-"
                  }}<span>{{ data.nsq7Dayhsjc.value ? "人" : "" }}</span></label
                >
              </div>
            </div>
            <div class="update-time">
              更新时间 : {{ data.nsq7Dayhsjc.updateTime }}<br/>
              数据来源 : {{ data.nsq7Dayhsjc.datasource||'区共享平台' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 疾控流调 -->
    <div class="block">
      <div class="block-content">
        <div class="root-line">
          <div class="root box">
            {{ data.jkldry.name }}
            <label
              >{{ data.jkldry.value || "-"
              }}<span>{{ data.jkldry.value ? "人" : "" }}</span></label
            >
          </div>
        </div>
        <div class="data-line">
          <div class="data box">
            {{ data.jkmjry.name }}
            <label
              >{{ data.jkmjry.value || "-"
              }}<span>{{ data.jkmjry.value ? "人" : "" }}</span></label
            >
            <div class="more">
              <div class="more-info box">
                {{ data.jkmjry.jkmjgljdry.name }}
                <label
                  >{{ data.jkmjry.jkmjgljdry.value || "-"
                  }}<span>{{
                    data.jkmjry.jkmjgljdry.value ? "人" : ""
                  }}</span></label
                >
              </div>
              <div class="more-info box font-red">
                {{ data.jkmjry.jkmjwgljdry.name }}
                <label
                  >{{ data.jkmjry.jkmjwgljdry.value || "-"
                  }}<span>{{
                    data.jkmjry.jkmjwgljdry.value ? "人" : ""
                  }}</span></label
                >
              </div>
            </div>
          </div>

          <div class="data box">
            {{ data.jkcmjry.name }}
            <label
              >{{ data.jkcmjry.value || "-"
              }}<span>{{ data.jkcmjry.value ? "人" : "" }}</span></label
            >
            <div class="more">
              <div class="more-info box">
                {{ data.jkcmjry.jkcmjgljdry.name }}
                <label
                  >{{ data.jkcmjry.jkcmjgljdry.value || "-"
                  }}<span>{{
                    data.jkcmjry.jkcmjgljdry.value ? "人" : ""
                  }}</span></label
                >
              </div>
              <div class="more-info box font-red">
                {{ data.jkcmjry.jkcmjwgljdry.name }}
                <label
                  >{{ data.jkcmjry.jkcmjwgljdry.value || "-"
                  }}<span>{{
                    data.jkcmjry.jkcmjwgljdry.value ? "人" : ""
                  }}</span></label
                >
              </div>
            </div>
          </div>

          <div class="data box">
            {{ data.jkybjcz.name }}
            <label
              >{{ data.jkybjcz.value || "-"
              }}<span>{{ data.jkybjcz.value ? "人" : "" }}</span></label
            >
          </div>

          <div class="data box">
            {{ data.jkzdrq.name }}
            <label
              >{{ data.jkzdrq.value || "-"
              }}<span>{{ data.jkzdrq.value ? "人" : "" }}</span></label
            >
          </div>

          <div class="data box">
            {{ data.jkybrq.name }}
            <label
              >{{ data.jkybrq.value || "-"
              }}<span>{{ data.jkybrq.value ? "人" : "" }}</span></label
            >
          </div>

          <div class="data box">
            {{ data.jkqtrq.name }}
            <label
              >{{ data.jkqtrq.value || "-"
              }}<span>{{ data.jkqtrq.value ? "人" : "" }}</span></label
            >
          </div>
        </div>

        <div class="total-line">
          {{ data.jkygljdry.name }}
          <label
            >{{ data.jkygljdry.value || "-"
            }}<span>{{ data.jkygljdry.value ? "人" : "" }}</span></label
          >
        </div>

        <div class="update-time">
          更新时间 : {{ data.jkldry.updateTime }} <br/>
          数据来源 : {{ data.jkldry.datasource || '区卫生健康局'}}
         </div>
      </div>
    </div>
    <!-- 公安流调 -->
    <div class="block">
      <div class="block-content">
        <div class="root-line">
          <div class="root box">
            {{ data.galdry.name }}
            <!-- 公安流调人员关系结构图 -->
            <label
              >{{ data.galdry.value || "-"
              }}<span>{{ data.galdry.value ? "人" : "" }}</span></label
            >
          </div>
        </div>
        <!-- <img src="static/images/dataTotal.png" /> -->

        <div class="data-line" v-if="true">
          <div
            class="data box"
            v-for="(item, index) in data.galdry.children"
            :key="index + item.name"
          >
            {{ item.name }}
            <div class="more">
              <div class="more-info box">
                {{ item.glcs.name }}
                <label
                  >{{ item.glcs.value || "-"
                  }}<span>{{ item.glcs.value ? "个" : "" }}</span></label
                >
              </div>
              <div class="more-info box">
                {{ item.glmj.name }}
                <label
                  >{{ item.glmj.value || "-"
                  }}<span>{{ item.glmj.value ? "人" : "" }}</span></label
                >
              </div>
              <div class="more-info box">
                {{ item.glcmj.name }}
                <label
                  >{{ item.glcmj.value || "-"
                  }}<span>{{ item.glcmj.value ? "人" : "" }}</span></label
                >
              </div>
              <div class="more-info box">
                {{ item.glybjc.name }}
                <label
                  >{{ item.glybjc.value || "-"
                  }}<span>{{ item.glybjc.value ? "人" : "" }}</span></label
                >
              </div>
            </div>
          </div>
        </div>

        <div class="update-time">
          <!-- 更新时间 : {{ data.galdry.updateTime }}<br/> -->
          数据来源：市公安局南沙区分局

          <!-- 数据来源 : {{ data.galdry.datasource }} -->
        </div>
      </div>
    </div>

    <div class="block tips">
      <label style="color: #f00; margin: 10px; font-size: 16px">
        <i class="el-icon-warning" />说明 :
        以上数据是基于各委办局导入数据进行统计，所有查询结果由于数据上报存在时间等差异，查询统计结果仅供参考
      </label>
    </div>
  </div>
</template>
<script>
import {
  get_DataStatistics,
  get_covidInfo,
  get_GotoLwNoHSJC,
  get_nsq7Dayhsjc,
  get_NulacidGetUpdateTime,
} from "@/api/epidemicM";

export default {
  name: "data-total",
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    this.data = await this.$Api().YqgkryController.get_getldryMsg.request();
    this.data.galdry.children.forEach((v) => {
      let name = v.name.split("");
      v.name = "";
      name.forEach((n, i) => {
        if (i > 0) {
          v.name += "*";
        } else {
          v.name += n;
        }
      });
    });

    // 2022-1-24 添加重点关注,from移动端 @黄广聪
    let res2 = await get_DataStatistics();
    if (res2.hasOwnProperty("type")) {
      delete res2.rawData;
      localStorage.setItem("yqIndex_DataStatistics", JSON.stringify(res2));
    } else {
      res2 = JSON.parse(localStorage.getItem("yqIndex_DataStatistics")) || {};
    }
    this.data.importantListTime = res2.updateTime;
    this.data.datasource = res2.datasource;
    const colorArr = ["#9E2F31", "#C86935", "#C86935", "#C8A035", , "#C8A035"];
    this.data.importantList = res2.optionData.map((item, index) => {
      // item.count = item.value;
      item.color = colorArr[index];

      // switch (item.id) {
      //   case "1":
      //     // item.id = "qzrs";
      //     // item.count = item.count;
      //     break;
      //   case "2":
      //     // item.id = "yjzs";
      //     break;
      //   case "3":
      //     // item.id = "mjzs";
      //     break;
      //   case "4":
      //     // item.id = "cmjzs";
      //     break;
      // }
      return item;
    });

    const res4 = await get_nsq7Dayhsjc();
    this.data.nsq7Dayhsjc = res4.optionData.map((item) => {
      item.count = item.value;
      switch (item.id) {
        case "6":
          item.id = "near7s";
          break;
      }
      return item;
    });
    this.data.nsq7Dayhsjc = this.data.nsq7Dayhsjc[0];
    // const res5 = await get_NulacidGetUpdateTime();
    this.data.nsq7Dayhsjc.updateTime = res4.updateTime;
    this.data.nsq7Dayhsjc.datasource = res4.datasource;
    console.log(this.data);
    this.$forceUpdate()
  },
};
</script>
<style lang="scss" scoped>
.box {
  padding: 10px 0px;
  text-align: center;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  line-height: 26px;
  background-color: #dde5f2;
  width: 150px;
  height: fit-content;
  label {
    font-size: 20px;
    font-weight: 600;
    color: #4081e3;
    line-height: 30px;
  }
}
.data-total {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  width: fit-content;
  .title {
    font-size: 36px;
    margin: 20px;
  }
}
.block {
  margin: 20px;
  width: fit-content;
  .import-box{
        display: flex;
        .import-box-item{
          margin:0px 30px;
          .data-line{
            justify-content: start !important;
            .data.box{
              padding: 5px 10px;
            }
          }
        }
      }
  .root-line {
    display: flex;
    justify-content: center;
    position: relative;
    .root.box {
      width: 200px;
      // background-color: #4081e3;
      background-color: #cad7ec;

      // color: #fff;
      label {
        // color: #ffff33;
      }
      position: relative;
    }
    .root::after {
      content: " ";
      width: 2px;
      display: block;
      background-color: #999;
      height: 15px;
      position: absolute;
      bottom: -15px;
      left: calc(50% - 1px);
    }
  }
  .data-line {
    display: flex;
    position: relative;
    margin-top: 30px;
    .box {
      margin: 0px 10px;
      position: relative;
    }
    .more {
      margin-top: 10px;
      .more-info {
        width: 130px;
        background-color: #cad7ec;
      }
      .more-info.font-red {
        label {
          color: #b16c34;
        }
      }
    }
    .data.box::before {
      content: " ";
      width: 2px;
      display: block;
      background-color: #999;
      height: 15px;
      position: absolute;
      top: -15px;
      left: calc(50% - 1px);
    }
  }
  .data-line::after {
    content: " ";
    height: 2px;
    display: block;
    background-color: #999;
    width: calc(100% - 170px);
    position: absolute;
    top: -15px;
    left: 85px;
  }
  .total-line {
    background-color: #dde5f2;
    padding: 10px 40px;
    margin: 10px;
    width: fit-content;
    label {
      font-size: 20px;
      font-weight: 600;
      color: #4081e3;
      line-height: 30px;
    }
  }
  .update-time {
    padding: 10px 40px;
    margin: 10px;
    width: fit-content;
    font-size: 12px;
    background-image: linear-gradient(to right, #e0e0e0, rgba(0, 0, 0, 0));
    text-align: left;
  }
}
</style>
