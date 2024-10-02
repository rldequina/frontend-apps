<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      text-color="#3cb371"
      active-text-color="#2E8B57"
      :router="true"
    >
      <el-menu-item class="nav-item" index="/home"> Home </el-menu-item>
      <el-menu-item index="/members"> Members </el-menu-item>
      <el-menu-item index="/topics"> Topics </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  computed: {
    activeIndex() {
      const currentPath = this.$route.fullPath;
      if (currentPath.includes('home')) {
        return '/home';
      } else if (currentPath.includes('members')) {
        return '/members';
      } else if (currentPath.includes('topic')) {
        return '/topics';
      }
      return '/home';
    },
  },
};
</script>

<style scoped>
.el-menu {
  justify-content: center;
  width: 500px;
}

.el-menu-item {
  font-size: 18px;
}

.el-menu :deep(.el-menu-item:hover) {
  background-color: transparent !important;
  color: seagreen !important;
  text-shadow: 1px 0.5px 1px mediumseagreen;
}

.el-menu :deep(.el-menu-item.is-active) {
  background-color: transparent !important;
  color: mediumseagreen;
  font-weight: bold;
}

/* @media screen and (max-width: 767px) {
  .web-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }
} */

@media (max-width: 700px) {
  .el-menu {
    width: 150px;
  }
}
</style>
