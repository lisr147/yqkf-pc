<template>
  <div class="medical-dialog-wrapper" v-if="showData">
    <templateData v-if="showData.type === 'template'" :props="showData" />
    <fetchData v-if="showData.type === 'api'" :props="showData" />
  </div>
</template>
<script>
// 医疗下钻数据
const dataType = {
  医院总数: {
    type: "template",
    id: "100081",
    condition: {
      lb: "医院"
    },
    filter: ["mc", "bmbh", "szxxdz"],
    tableKeys:['mc','sszj','sswg','sscj',"szxxdz","lxr","lxdh","yssl","hssl"]
  },
  科室总数: {
    type: "api",
    id: "hospitalDept",
    showSearch: true,
    condition: {
      tjlx: "ks"
    }
  },
  发热门诊数: {
    type: "api",
    id: "hospitalDept",
    showSearch: true,
    condition: {
      type: '发热门诊',
      tjlx: "ks"
    }
  },
  儿科门诊数: {
    type: "api",
    id: "hospitalDept",
    showSearch: true,

    condition: {
      type: '儿科门诊',
      tjlx: "ks"
    }
  },
  产科门诊数: {
    type: "api",
    id: "hospitalDept",
    showSearch: true,

    condition: {
      type: '产科门诊',
      tjlx: "ks"
    }
  },
  急诊门诊数: {
    type: "api",
    id: "hospitalDept",
    showSearch: true,

    condition: {
      type: '急诊门诊',
      tjlx: "ks"
    }
  },
  其他门诊数: {
    type: "api",
    id: "hospitalDept",
    showSearch: true,

    condition: {
      type: '其他门诊',
      tjlx: "ks"
    }
  },
  // 门急诊就诊记录
  就诊总数: {
    type: "api",
    id: "mjzjzssjl",
    showSearch: true,

    condition: {
      tjlx: 'mjzjl',
    },
  },
  发热门诊就诊数: {
    type: "api",
    id: "mjzjzssjl",
    showSearch: true,

    condition: {
      tjlx: 'mjzjl',
      type: '发热门诊',
    },
  },
  儿科门诊就诊数: {
    type: "api",
    id: "mjzjzssjl",
    showSearch: true,

    condition: {
      tjlx: 'mjzjl',
      type: '儿科门诊',
    },
  },
  产科门诊就诊数: {
    type: "api",
    id: "mjzjzssjl",
    showSearch: true,

    condition: {
      tjlx: 'mjzjl',
      type: '产科门诊',
    },
  },
  急诊门诊就诊数: {
    type: "api",
    id: "mjzjzssjl",
    showSearch: true,

    condition: {
      tjlx: 'mjzjl',
      type: '急诊门诊',
    },
  },
  其他门诊就诊数: {
    type: "api",
    id: "mjzjzssjl",
    showSearch: true,

    condition: {
      tjlx: 'mjzjl',
      type: '其他门诊',
    },
  },
  // 挂号情况
  挂号总数: {
    type: "api",
    id: "jhxx",
    showSearch: true,
    condition: {
      tjlx: 'jhxx',
    },
  },
  发热门诊挂号数: {
    type: "api",
    id: "jhxx",
    showSearch: true,
    condition: {
      tjlx: 'jhxx',
      type: '发热门诊',
    },
  },
  儿科门诊挂号数: {
    type: "api",
    id: "jhxx",
    showSearch: true,
    condition: {
      tjlx: 'jhxx',
      type: '儿科门诊',
    },
  },
  产科门诊挂号数: {
    type: "api",
    id: "jhxx",
    showSearch: true,
    condition: {
      tjlx: 'jhxx',
      type: '产科门诊',
    },
  },
  急诊门诊挂号数: {
    type: "api",
    id: "jhxx",
    showSearch: true,
    condition: {
      tjlx: 'jhxx',
      type: '急诊门诊',
    },
  },
  其他门诊挂号数: {
    type: "api",
    id: "jhxx",
    showSearch: true,
    condition: {
      tjlx: 'jhxx',
      type: '其他门诊',
    },
  },
};

export default {
  name: "medicalDialog",
  props: ["data"],
  components: {
    templateData: () => import("@/views/common/importData.vue"),
    fetchData: () => import("@/views/fetchDataList/index.vue")
  },
  data() {
    return {
      showData: null
    };
  },
  mounted() {
    this.showData = dataType[this.data.item.name];
    if (!this.showData) {
      return;
    }
    this.showData.condition = Object.assign(this.showData.condition, {
      sszj: this.data.town,
      sswg: this.data.grid,
      sscj: this.data.village
    });
  }
};
</script>
<style lang="scss" scoped>
.medical-dialog-wrapper {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
}
</style>
