<template>
  <el-dialog v-model="showDialog" :title="dialogTitle" width="500">
    <span>{{ dialogDesc }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button round class="defaultBtn" @click="closeDialog"
          >Okay</el-button
        >
      </div>
    </template>
  </el-dialog>

  <router-view v-slot="slotProps">
    <transition name="fade" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      dialogTitle: '',
      dialogDesc: '',
    };
  },
  watch: {
    '$store.getters.tokenStatus'(status) {
      if (status == false) {
        this.$router.replace('/login');
        this.dialogTitle = 'Session Expired';
        this.dialogDesc = 'Token expired or invalid. Please Login again.';
        this.showDialog = true;
      }
    },
  },
  methods: {
    closeDialog() {
      this.showDialog = false;
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Titillium Web', sans-serif;
  font-weight: 400;
  font-style: normal;
}

body {
  height: 100%;
  min-height: 100%;
  margin-top: 6.5rem;
  margin-bottom: 4rem;
  overflow-x: hidden;
  overflow-y: scroll;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.card {
  border-radius: 12px;
  padding: 10px;
  margin: 25px auto;
  max-width: 90%;
}

.defaultBtn {
  color: #fff;
  background-color: mediumseagreen;
}

.defaultBtn:hover {
  color: #fff;
  background-color: seagreen;
}

.defaultBtn_outline {
  color: seagreen;
  border: 0.5px solid mediumseagreen;
}

.defaultBtn_outline:hover {
  color: #fff;
  background-color: mediumseagreen;
}

/* scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px transparent;
  border-radius: 15px;
}

::-webkit-scrollbar-thumb {
  background: mediumseagreen;
  border-radius: 15px;
}

::-webkit-scrollbar-thumb:hover {
  background: seagreen;
}
</style>
