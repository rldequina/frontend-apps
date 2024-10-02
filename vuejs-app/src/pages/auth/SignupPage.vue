<template>
  <el-container direction="vertical" class="container">
    <el-image
      :src="require(`@/assets/logo.png`)"
      alt="logo"
      style="margin-bottom: 30px; width: 150px; height: 150px"
    />

    <el-form
      @submit.prevent
      ref="signupForm"
      :model="signupForm"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="Email:" prop="email">
        <el-input
          type="email"
          v-model.trim="signupForm.email"
          style="width: 240px; margin-bottom: 5px"
          autocomplete="off"
          clearable
          required
        />
      </el-form-item>

      <el-form-item label="Password:" prop="password">
        <el-input
          type="password"
          v-model.trim="signupForm.password"
          style="width: 240px; margin-bottom: 5px"
          show-password
          autocomplete="off"
          clearable
          required
        />
      </el-form-item>
    </el-form>

    <div>
      <el-button class="signupBtn" round @click="signup"> Sign Up </el-button>
    </div>
    <div>
      <el-button link tag="router-link" to="/login">
        Already have an account? Login now.
      </el-button>
    </div>
  </el-container>
</template>

<script>
import signupRules from '../../formRules/signupRules';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      signupForm: {
        email: '',
        password: '',
      },
      rules: signupRules,
    };
  },
  methods: {
    async signup() {
      this.$refs.signupForm.validate(async (isValid) => {
        if (isValid) {
          try {
            await this.$store.dispatch('authUp', {
              mode: 'signup',
              email: this.signupForm.email,
              password: this.signupForm.password,
            });

            ElMessage({
              message: 'Signed Up Successfully.',
              type: 'success',
              plain: true,
              offset: 600,
              duration: 2000,
            });

            this.$router.replace('/login');
          } catch (err) {
            if (err.message == 'EMAIL_EXISTS') {
              ElMessage({
                message: 'Email Exists! Please try another.',
                type: 'error',
                offset: 600,
              });
            }
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.signupBtn {
  background-color: mediumseagreen;
  border: 1px solid mediumseagreen;
  cursor: pointer;
  color: white;
  font-size: 14px;
  margin: 10px 0;
}

.signupBtn:hover,
.signupBtn:active {
  background-color: seagreen;
  border-color: seagreen;
  color: white;
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
