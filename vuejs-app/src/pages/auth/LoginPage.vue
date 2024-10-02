<template>
  <el-container direction="vertical" class="container">
    <el-image
      :src="require(`@/assets/logo.png`)"
      alt="logo"
      style="margin-bottom: 30px; width: 150px; height: 150px"
    />
    <el-form @submit.prevent :model="form" label-width="auto">
      <el-form-item label="Email:">
        <el-input
          type="email"
          id="email"
          name="email"
          v-model.trim="form.email"
          @input="clearError"
          style="width: 240px; margin-bottom: 5px"
          clearable
          required
        />
      </el-form-item>

      <el-form-item label="Password:">
        <el-input
          type="password"
          id="password"
          name="password"
          v-model.trim="form.password"
          @input="clearError"
          style="width: 240px; margin-bottom: 5px"
          show-password
          clearable
          required
        />
      </el-form-item>
    </el-form>
    <div v-if="!!error">
      <p class="errorMsg">Invalid Email or Password!</p>
    </div>
    <div v-if="!!isAuth">
      <p class="errorMsg">Login first!</p>
    </div>
    <div>
      <el-button class="loginBtn" round @click="login" v-if="!isLogging">
        Login
      </el-button>
      <el-icon v-else class="is-loading">
        <Loading />
      </el-icon>
    </div>
    <div>
      <el-button link tag="router-link" to="/signup">
        Don't have an account yet? Sign up now.
      </el-button>
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isLogging: false,
      isFormValid: true,
      error: null,
      isAuth: null,
      form: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    clearError() {
      this.error = null;
    },
    async login() {
      if (this.isFormValid && this.email !== '' && this.password !== '') {
        this.isLogging = true;
        try {
          await this.$store.dispatch('authUp', {
            mode: 'login',
            email: this.form.email,
            password: this.form.password,
          });

          this.$router.replace('/home');
        } catch (err) {
          if (err.message == 'INVALID_LOGIN_CREDENTIALS') {
            this.error = 'Invalid Email or Password.';
            this.isLogging = false;
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.loginBtn {
  background-color: mediumseagreen;
  border: 1px solid mediumseagreen;
  cursor: pointer;
  color: white;
  font-size: 14px;
  margin: 10px 0;
}

.loginBtn:hover,
.loginBtn:active {
  background-color: seagreen;
  border-color: seagreen;
  color: white;
}

.is-loading {
  color: mediumseagreen;
  font-size: 25px;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: seagreen;
  margin: 100px 0;
}

.errorMsg {
  color: red;
  font-size: 14px;
  font-style: italic;
  padding: 0;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration-line: underline;
}
</style>
