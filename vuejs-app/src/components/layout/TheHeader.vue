<template>
  <div>
    <el-header class="header_items" height="5rem">
      <div>
        <el-image :src="logoUrl" alt="app-logo" @click="backHome" />
      </div>

      <the-nav></the-nav>

      <div class="dropdown-container">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ userName }}
          </span>
          <template #dropdown>
            <el-dropdown-menu size="large">
              <el-dropdown-item @click="logout"> Logout </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
  </div>
</template>

<script>
import TheNav from './TheNav.vue';
import logoUrl from '@/assets/logo.png';

export default {
  components: {
    TheNav,
  },
  data() {
    return {
      userName: '',
      logoUrl,
    };
  },
  created() {
    this.userName = this.$store.getters['email'];
  },
  methods: {
    backHome() {
      this.$router.push('/home');
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.replace('/login');
    },
  },
};
</script>

<style scoped>
header {
  top: 0px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  z-index: 999;
}

.header_items {
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-image {
  height: 3rem;
  cursor: pointer;
  width: 50px;
}

.el-dropdown-link {
  display: flex;
  font-size: 16px;
  color: mediumseagreen;
  cursor: pointer;
}

.el-dropdown-menu :deep(li) {
  color: mediumseagreen;
  font-size: 14px;
  width: 100px;
  justify-content: center;
}

@media (max-width: 400px) {
  .dropdown-container {
    word-break: break-all;
  }
}

.el-dropdown-menu :deep(li):hover {
  color: mediumseagreen;
  background: rgba(60, 179, 114, 0.1);
}
</style>
