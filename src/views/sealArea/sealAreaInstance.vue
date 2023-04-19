<template>
  <div class="seal-area screen-wrap">
    <screen-header :navItemVisible="false" />
    <seal-map-layer
      ref="baseMapLayer"
      @layerClicked="handelLayerClicked"
      @layersReady="isLayerReady = true"
      :layer-ids="layerIds"
    />

    <!--标题-->
    <div class="caption">{{ currSealArea.name || "封控管理区" }}</div>

    <!--图例-->
    <map-legend
      style="right:20px;"
      @gridLayerSwitch="handleGridSwitch"
      @gridLayerFilter="handleGridFilter"
      @bgMapChange="handleByMapChange"
      @partyLayerSwitch="handlePartyToggle"
      @gotoLocation="handleGotoLocation"
    >
    </map-legend>

    <div class="area-opt">
      <div class="btn danger" v-show="removeAble" @click="removeArea">
        删除当前区域
      </div>
      <div class="btn" @click="back">返回封控管理区</div>
      <div class="btn" @click="editBaseInfo">编辑基本信息</div>
      <div class="btn primary" @click="saveRange">保存</div>
    </div>

    <el-dialog
      title="基本信息"
      width="600px"
      :visible.sync="formVisible"
      class="screen-dialog"
      v-dialogDrag
    >
      <el-form :rules="rules" ref="baseForm" :model="form" label-width="120px">
        <el-form-item label="名称" required prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="类型" required prop="type">
          <el-select v-model="form.type" placeholder="请选择区域类型">
            <el-option
              :label="item"
              :value="item"
              :key="index"
              v-for="(item, index) in typeList"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="面积(平方米)">
          <el-input v-model="form.mj"></el-input>
        </el-form-item>

        <el-form-item label="流动人口(人)">
          <el-input :value="form.ldrk" readonly></el-input>
        </el-form-item>

        <el-form-item label="户籍人口(人)">
          <el-input :value="form.hjrk" readonly></el-input>
        </el-form-item>

        <el-form-item label="总人口(人)">
          <el-input :value="form.zrk" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SealMapLayer from "./layer/SealMapLayer";
import ScreenHeader from "@/components/screen/ScreenHeader";
import BigScreenMethods from "@/mixins/BigScreenMethods.js";
import MapLegend from "@/views/big/MapLegend";
import {
  addSealArea,
  deleteSealArea,
  editSealArea,
  getPeopleSum
} from "@/api/sealarea";

export default {
  name: "sealAreaInstance",
  components: {
    SealMapLayer,
    ScreenHeader,
    MapLegend
  },
  mixins: [BigScreenMethods],
  data() {
    return {
      //声明所有图层
      layerIds: [],

      //当前区域包含的网格
      includeGrids: [],

      isLayerReady: false,

      formVisible: false,
      form: {
        id: null,
        name: "",
        type: null,
        mj: 0, //面积
        hjrk: 0, //户籍人口
        ldrk: 0, //流动人口
        zrk: 0 //总人口
      },
      typeList: ["封闭区", "封控区", "防控区", "健康管理区"],
      rules: {
        name: [
          { required: true, message: "请输入区域名称", trigger: "blur" },
          { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择区域类型", trigger: "change" }]
      }
    };
  },
  watch: {
    includeGrids() {
      if (this.isLayerReady) {
        this.draw();
        this.fixPeopleCount();
      }
    },
    isLayerReady(val) {
      if (val) {
        this.draw();
        this.fixPeopleCount();
      }
    },
    "form.type"(val) {
      if (this.isLayerReady) {
        this.draw();
      }
    }
  },
  computed: {
    //当前封控区域信息
    currSealArea() {
      const { mode, data } = this.$route.params;
      let info;

      switch (mode) {
        case "edit":
          info = data;
          break;
        case "create":
          info = {};
          break;
        default:
          // info = JSON.parse(Cookie.get('_sealarea_instance_data') || '{}')
          info = JSON.parse(localStorage._sealarea_instance_data || "{}");
          break;
      }
      return info;
    },
    removeAble() {
      return this.form.id;
    }
  },
  created() {
    //保存当前区域信息到cookie
    //以防刷新页面时信息丢失
    this.saveDataInCookie();

    let arr = [
      { id: "boundary", visible: true },
      { id: "grid", visible: true },
      { id: "rangLayer", visible: true }
    ];
    this.layerIds = arr;

    //初始化表单数值
    this.initForm();
  },
  mounted() {},
  methods: {
    initForm() {
      const { name, id, type, mj } = this.currSealArea;

      if (Object.keys(this.currSealArea).length) {
        this.form.id = id;
        this.form.type = type;
        this.form.name = name;
        this.form.mj = mj;
        //初始化绘制范围图层
        if (this.currSealArea.sswg) {
          this.includeGrids = this.currSealArea.sswg.split(",");
        }
        //人口数量通过fixPeopleCount()更新
      } else {
        this.form.type = null;
        this.form.name = "";
        this.form.mj = 0;
      }
    },

    saveDataInCookie() {
      if (Object.keys(this.currSealArea).length) {
        // Cookie.set('_sealarea_instance_data', this.currSealArea)
        localStorage._sealarea_instance_data = this.currSealArea;
      }
    },

    handelLayerClicked({ layerId, attributes, target }) {
      var { name } = attributes;

      switch (layerId) {
        case "grid":
        case "rangLayer":
          var index = this.includeGrids.indexOf(name);

          if (index == -1) {
            this.includeGrids.push(name);
          } else {
            this.includeGrids.splice(index, 1);
          }
          console.log(`includeGrids ${this.includeGrids}`);
          break;
        default:
          break;
      }
    },

    draw() {
      this.$refs["baseMapLayer"].renderRange(this.includeGrids, {
        type: this.form.type
      });
    },

    removeArea() {
      this.$confirm(
        "此操作将永久删除该区域,删除后返回到封控管理首页。",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.remove();
      });
    },

    async remove() {
      await deleteSealArea(this.currSealArea.id);
      //清除cookie
      // Cookie.remove("_sealarea_instance_data");
      localStorage.removeItem('_sealarea_instance_data')
      //跳转后清除当前区域
      this.$router.push({ name: "sealArea", query: {} });
    },

    validForm() {
      return new Promise(resolve => {
        const form = this.$refs["baseForm"];

        if (form) {
          form.validate(valid => {
            resolve(valid);
          });
        } else {
          const { name, type } = this.form;
          const res = name !== "" && type !== null ? true : false;
          resolve(res);
        }
      });
    },

    async saveRange() {
      const valid = await this.validForm();

      if (!valid) {
        this.$message({
          message: "请检查基本信息是否填写完整",
          type: "warning"
        });
        return;
      }
      if (this.includeGrids.length <= 0) {
        this.$message({
          message: "请选择至少一个网格作为封控区域",
          type: "warning"
        });
        return;
      }

      const { id, name, type, mj, hjrk, ldrk, zrk } = this.form;

      const params = {
        lx: type, //类型
        fw: name, //名称
        mj, //面积
        ldrk, //流动人口
        hjrk, //户籍人口
        zrk, //总人口
        sfqy: 0, //是否启用 0启用 1禁用
        sswg: this.includeGrids.join(",") //网格
      };

      var res;
      if (id) {
        //编辑
        await editSealArea(id, params);
      } else {
        //新建
        res = await addSealArea(params);
        this.form.id = res.id;
      }

      this.formVisible = false;
      this.$message.success(`保存成功`);
    },

    editBaseInfo() {
      this.formVisible = true;
    },

    //根据所选网格计算人口情况
    async fixPeopleCount() {
      const data = await getPeopleSum({
        sswg: this.includeGrids.join(","),
        showModal: false
      });
      const { hjrk, lsrk, zjrk } = data;

      this.form.hjrk = hjrk;
      this.form.ldrk = lsrk;
      this.form.zrk = zjrk;
    },

    back() {
      this.$router.push({ path: "/sealarea/index" });
    }
  }
};
</script>

<style lang="scss" type="text/scss">
.seal-area {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #20326f;

  .caption {
    position: absolute;
    left: 50%;
    top: 90px;
    z-index: 1000;
    padding: 0.2em 0;
    min-width: 350px;
    max-width: 600px;
    transform: translateX(-50%);
    color: #fff;
    font-size: 30px;
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(0, 231, 255, 0) 0%,
      #00bace 30%,
      #00b8c9 76%,
      rgba(0, 231, 255, 0) 100%
    );
  }

  .area-opt {
    position: absolute;
    bottom: 7em;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
