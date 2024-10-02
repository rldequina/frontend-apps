<template>
  <div>
    <the-header></the-header>
    <router-view v-slot="slotProps">
      <transition :name="transitionName">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
    <the-footer></the-footer>
  </div>
</template>

<script>
import TheHeader from '../components/layout/TheHeader.vue';
import TheFooter from '../components/layout/TheFooter.vue';
import { ElMessage } from 'element-plus';

export default {
  components: {
    TheHeader,
    TheFooter,
  },
  data() {
    return {
      transitionName: null,
      currentPageIndex: null,
    };
  },
  watch: {
    $route(newRoute) {
      const index = newRoute.meta.index;

      if (index > this.currentPageIndex) {
        this.transitionName = 'toLeft';
        this.currentPageIndex = index;
      } else {
        this.transitionName = 'toRight';
        this.currentPageIndex = index;
      }
    },
  },
  mounted() {
    ElMessage.closeAll();
  },
};
</script>

<style scoped>
.toLeft-enter-active,
.toLeft-leave-active,
.toRight-enter-active,
.toRight-leave-active {
  transition: all 0.75s ease-out;
  width: 100%;
}

.toLeft-enter-to,
.toLeft-leave-from {
  position: absolute;
  right: 0;
}

.toLeft-enter-from {
  position: absolute;
  right: -100%;
}

.toLeft-leave-to {
  position: absolute;
  right: 100%;
}

.toRight-enter-to,
.toRight-leave-from {
  position: absolute;
  left: 0;
}

.toRight-enter-from {
  position: absolute;
  left: -100%;
}

.toRight-leave-to {
  position: absolute;
  left: 100%;
}

:deep(.el-loading-spinner .path),
:deep(.el-loading-spinner .el-loading-text) {
  color: mediumseagreen;
  stroke: mediumseagreen;
}
</style>
