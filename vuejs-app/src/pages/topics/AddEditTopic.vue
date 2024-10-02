<template>
  <div>
    <el-card class="card form-container">
      <el-form
        @submit.prevent
        ref="addEditForm"
        :model="addEditForm"
        :rules="rules"
        label-width="50px"
      >
        <!-- Title -->
        <el-form-item label="Title:" prop="title" for="title">
          <el-input
            id="title"
            type="text"
            v-model="addEditForm.title"
            style="width: 400px; margin-bottom: 5px"
            clearable
          />
        </el-form-item>

        <!-- Content -->
        <!-- TODO: Content must suppot HTML Content -->
        <el-form-item label="Content:" prop="content" for="content">
          <el-input
            id="content"
            type="textarea"
            :rows="12"
            v-model="addEditForm.content"
            style="width: 400px; margin-bottom: 5px"
            clearable
          />
        </el-form-item>

        <div>
          <el-button
            v-if="!isProcessing"
            round
            class="defaultBtn"
            style="width: 100px; margin: 0 5px"
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
import addEditRules from '../../formRules/addEditRules.js';

export default {
  data() {
    return {
      isProcessing: false,
      selectedMemberId: '',
      actionButton: 'Add',
      addEditForm: {
        title: '',
        content: '',
        likes: 0,
        comments: 0,
        createdBy: this.$store.getters['email'],
        dateCreated: new Date(),
      },
      rules: addEditRules,
    };
  },
  created() {
    if (this.$route.query.id) {
      this.actionButton = 'Edit';
      this.fetchTopicDetails(this.$route.query.id);
    } else {
      // TODO: try to remove this next time
      this.addEditForm = {
        title: '',
        content: '',
        likes: 0,
        comments: 0,
        createdBy: this.$store.getters['email'],
        dateCreated: new Date(),
      };
    }
  },
  methods: {
    async submitForm() {
      this.isProcessing = true;
      this.$refs.addEditForm.validate(async (isValid) => {
        if (isValid) {
          if (!this.$route.query.id) {
            await this.$store.dispatch('topics/addTopic', this.addEditForm);
          } else if (this.$route.query.id) {
            await this.$store.dispatch('topics/editTopic', this.addEditForm);
          }
        }

        this.resetForm();
        this.isProcessing = false;
      });
    },
    async fetchTopicDetails(topicId) {
      try {
        await this.$store.dispatch('topics/fetchTopicDetails', topicId);
      } catch (err) {
        console.log('errorFetchingTopicDetails', err);
      }

      const topicDetails = this.$store.getters['topics/getTopicDetails'][0];

      Object.keys(topicDetails).forEach((item) => {
        this.addEditForm[item] = topicDetails[item];
      });
      this.addEditForm['id'] = topicId;
    },
    resetForm() {
      this.actionButton = 'Add';
      this.$refs.addEditForm.resetFields();

      if (this.$route.query.id) {
        this.$router.replace({
          name: 'topicDetail',
          query: {
            id: JSON.stringify(this.addEditForm.id),
          },
        });
      } else {
        this.$router.replace('/topics');
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  width: 50%;
}

button {
  float: right;
}

.is-loading {
  color: mediumseagreen;
  font-size: 25px;
}
</style>
