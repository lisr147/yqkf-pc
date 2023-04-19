<template>
  <el-form label-width="100px" size="mini">
    <!-- 用户选择by南沙3街6巷 -->
    <div class="c-select-users-from-street">
      <el-form-item
        v-for="item in usersList"
        :key="item.town"
        :label="item.town"
      >
        <el-input
          readonly
          :value="item.selected ? item.selected.map(v=>v.fullName).join(',') : ''"
          @click.native="showSelector(item)"
        />
        <select-user
          v-model="item.showDialog"
          @chooseUser="chooseUser"
          :selectedUsers="item.selected"
        ></select-user>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
import SelectUser from "@/components/common/SelectUser";
export default {
  name: "SelectUsersFromStreet",
  components: {
    SelectUser,
  },
  props: {
    selected: Array
  },
  watch: {
    selected: {
      immediate: true,
      deep: true,
      handler(val) {
        let hasData = false
        if(val.length) {
          val.map(v=>{
            let obj = this.usersList.find(item => item.town===v.town)
            if(obj) hasData =true
          })
          if(!hasData) return
          this.usersList = val.map(v => ({
            town: v.town,
            showDialog: false,
            selected: v.userInfos.map(item => ({
              ...item,
              id: item.userId,
              fullName: item.name
            }))
          }))
        }
      }
    }
  },
  data() {
    return {
      showUserSelector: false,
      currentStreet: null,
      usersList: [
        {
          town: "黄阁镇",
          selected: [],
          showDialog: false
        },
        {
          town: "东涌镇",
          selected: [],
          showDialog: false
        },
        {
          town: "大岗镇",
          selected: [],
          showDialog: false
        },
        {
          town: "榄核镇",
          selected: [],
          showDialog: false
        },
        {
          town: "横沥镇",
          selected: [],
          showDialog: false
        },
        {
          town: "万顷沙镇",
          selected: [],
          showDialog: false
        },
        {
          town: "南沙街",
          selected: [],
          showDialog: false
        },
        {
          town: "珠江街",
          selected: [],
          showDialog: false
        },
        {
          town: "龙穴街",
          selected: [],
          showDialog: false
        },
      ],
    };
  },
  methods: {
    chooseUser(selectedList) {
      const { currentStreet } = this;
      this.usersList.find(i => i.town === currentStreet).selected = selectedList;
      this.$emit('updateSelected', this.usersList);
    },
    showSelector(item) {
      item.showDialog = true;
      this.currentStreet = item.town;
    }
  },
};
</script>
<style lang="scss">
.c-select-users-from-street {
  display: flex;
  flex-wrap: wrap;
  background-color: #f9f9f9;
  margin: 5px 0px;
  padding: 5px 0px;
  >.el-form-item {
    margin: 5px;
    width: 45%;
    .el-input {
      width: 100%;
    display: inline-block;
    margin: 0px 4px;
    }
  }
}
</style>
