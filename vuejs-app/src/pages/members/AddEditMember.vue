<template>
  <div>
    <el-card class="card form-container">
      <el-form
        @submit.prevent
        ref="addEditForm"
        :model="addEditForm"
        :rules="rules"
        label-width="auto"
      >
        <!-- NAME -->
        <el-form-item label="Name:" prop="name" for="name">
          <el-input
            id="name"
            type="text"
            v-model.trim="addEditForm.name"
            style="width: 240px; margin-bottom: 5px"
            clearable
          />
        </el-form-item>

        <!-- SEX -->
        <el-form-item label="Sex:" prop="sex" for="sex">
          <el-radio-group v-model="addEditForm.sex">
            <el-radio id="sex" value="Male">Male</el-radio>
            <el-radio id="sex" value="Female">Female</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- BIRTHDAY -->
        <el-form-item label="Birthday:" prop="birthday" for="birthday">
          <el-date-picker
            id="birthday"
            v-model="addEditForm.birthday"
            type="date"
            style="width: 100%"
          />
        </el-form-item>

        <!-- OCCUPATION -->
        <el-form-item label="Occupation:" prop="occupation" for="occupation">
          <el-input
            id="occupation"
            type="text"
            v-model.trim="addEditForm.occupation"
            style="width: 240px; margin-bottom: 5px"
            clearable
          />
        </el-form-item>

        <!-- PHONE -->
        <el-form-item label="Phone:" prop="phone" for="phone">
          <el-input
            id="phone"
            type="text"
            v-model.trim="addEditForm.phone"
            style="width: 240px; margin-bottom: 5px"
            clearable
            status-icon
          />
        </el-form-item>

        <!-- EMAIL -->
        <el-form-item label="Email:" prop="email" for="email">
          <el-input
            id="email"
            type="email"
            v-model.trim="addEditForm.email"
            style="width: 240px; margin-bottom: 5px"
            clearable
          />
        </el-form-item>

        <!-- INTEREST -->
        <el-form-item label="Interest:" prop="interest" for="interest">
          <el-input
            id="interest"
            type="text"
            v-model.trim="addEditForm.interest"
            style="width: 240px; margin-bottom: 5px"
            clearable
          />
        </el-form-item>

        <div>
          <el-button
            round
            class="defaultBtn"
            style="width: 100px; margin: 0 5px"
            v-if="!isProcessing"
            @click="submitForm"
          >
            {{ actionButton }}
          </el-button>
          <el-button v-else round class="is-loading" loading
            ><el-text style="color: mediumseagreen"
              >{{ actionButton }}ing</el-text
            >
          </el-button>
          <el-button
            round
            class="defaultBtn_outline"
            style="width: 100px; margin: 0 5px"
            @click="resetForm()"
          >
            Cancel
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CONFIGDATA from '../../configData.json';
import addEditMemberRules from '../../formRules/addEditRules.js';

export default {
  data() {
    return {
      isProcessing: false,
      selectedMemberId: '',
      actionButton: 'Add',
      addEditForm: CONFIGDATA.ADDEDIT_FORMDATA,
      rules: addEditMemberRules,
    };
  },
  created() {
    if (this.$route.query.id) {
      this.getMemberData(JSON.parse(this.$route.query.id));
      this.actionButton = 'Edit';
    } else {
      // TODO: try to remove this next time
      this.addEditForm = {
        id: '',
        name: '',
        sex: 'Male',
        birthday: '',
        occupation: '',
        phone: '',
        email: '',
        interest: '',
      };
    }
  },
  methods: {
    async submitForm() {
      this.isProcessing = true;
      this.$refs.addEditForm.validate(async (isValid) => {
        if (isValid) {
          if (!this.$route.query.id) {
            await this.$store.dispatch('members/addMember', this.addEditForm);
          } else if (this.$route.query.id) {
            await this.$store.dispatch('members/editMember', this.addEditForm);
          }
          await this.$store.dispatch('members/loadMembersList');
          this.resetForm();
          this.isDeleting = false;
        }
      });
    },
    async getMemberData(memberId) {
      const member = await this.$store.dispatch(
        'members/fetchEditMemberData',
        memberId
      );

      Object.keys(member).forEach((item) => {
        this.addEditForm[item] = member[item];
      });
      this.addEditForm['id'] = memberId;
    },
    resetForm() {
      this.actionButton = 'Add';
      this.$refs.addEditForm.resetFields();

      this.$store.commit('members/clearEditMember');
      this.$router.replace('/members');
    },
  },
};
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  width: 50%;
  padding: 20px 0;
}

button {
  float: right;
  width: calc(100% - 200px);
}

.errorMsg {
  color: red;
  font-size: 14px;
  font-style: italic;
  padding: 0;
  margin: -5px 0px 10px 50px;
}

.is-loading {
  color: mediumseagreen;
  font-size: 25px;
}
</style>
