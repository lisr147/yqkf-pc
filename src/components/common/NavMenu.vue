<template>
  <el-menu :collapse="isCollapse" @select="handleMenuSelect" ref="menu">
    <template v-for="item in menuData">
      <!-- 有子菜单 -->
      <el-submenu v-if="item.children" :index="item.id" :key="item.id">
        <template slot="title">
          <i :class="['iconfont', item.icon]" />
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="node in item.children"
            :index="node.id"
            v-bind:key="node.id"
            :title="node.name"
          >
            {{ node.name }}
            <i v-if="node.openType == 'newTag'" class="iconfont outlink" />
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!-- 根节点 -->

      <el-menu-item
        v-else
        :index="item.type === 'link' ? undefined : item.id"
        :key="item.id + '_2'"
        style="padding-left: 16px;"
        :title="item.name"
      >
        <a
          :href="item.href"
          :target="item.target || '_self'"
          v-if="item.type === 'link'"
        >
          <i :class="['iconfont', item.icon]" />
          <span>{{ item.name }}</span>
          <i
            v-if="item.openType == 'newTag'"
            class="iconfont outlink"
            style="margin-left: 12px;"
          />
        </a>
        <div v-else style="color:#bfcbd9;">
          <i :class="['iconfont', item.icon]" />
          <span>{{ item.name }}</span>
          <i
            v-if="item.openType == 'newTag'"
            class="iconfont outlink"
            style="margin-left: 12px;"
          />
        </div>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
export default {
  name: "NavMenu",
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuDataMap: {}
    };
  },
  computed: {
    menuData() {
      return this.$store.state.authority.menuData || [];
    }
  },
  created() {
    // 将导航菜单数据拍扁
    this.flattenMenuData(this.menuData);
  },
  mounted() {
    // this.$refs.menu.open(this.menuData[0].id)
  },
  methods: {
    // 处理菜单数据
    flattenMenuData(data) {
      data.forEach(item => {
        if (this.menuDataMap[item.id]) {
          throw new Error("出现重复的菜单项id");
        } else {
          this.menuDataMap[item.id] = {
            path: item.path,
            name: item.name,
            openType: item.openType
          };
          if (item.children) {
            item.children.forEach(subItem => {
              this.menuDataMap[subItem.id] = {
                path: subItem.path,
                name: subItem.name,
                openType: subItem.openType
              };
            });
          }
        }
      });
      // console.log(this.menuDataMap)
    },
    // 处理菜单项的点击事件
    handleMenuSelect(index, indexPaths) {
      let path = this.menuDataMap[index].path;
      let openType = this.menuDataMap[index].openType;

      if (openType === "newTag") {
        // 新页面打开
        window.open(path);
      } else if (openType === "iframe") {
        // 页面嵌入
        this.$router.push({ path: `/frame/index?url=${path}` });
      } else if (/^http/.test(path)) {
        // 外部链接
        window.location.href = path;
      } else {
        // 内部链接
        this.$router.push({ path });
      }
    }
  }
};
</script>

<style scoped></style>
