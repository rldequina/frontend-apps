<template>
  <!-- TOPICS PAGE -->
  <div v-if="isTopicPage">
    <el-card shadow="hover">
      <template #header>
        <div
          @click="showTopicDetails"
          style="font-weight: bold; cursor: pointer"
        >
          {{ title }}
        </div>
      </template>
      <div class="row_2">
        <div class="group_1">
          <el-avatar>{{ initials }}</el-avatar>
          <div class="group_1_1">
            <div style="margin-left: 20px; font-style: italic">
              {{ content.slice(0, 20) }}...
            </div>
            <div id="fullName" style="margin-left: 20px">{{ createdBy }}</div>
          </div>
        </div>

        <div class="group_2">
          <div
            :class="!isClicked ? 'likes' : 'hidden'"
            style="margin-right: 20px"
            @click="toggleLike"
          >
            <span v-if="hasLiked">❤️</span>
            <span v-else>🤍</span>
            {{ likes }}
          </div>

          <el-icon :class="isClicked ? 'is-loading' : 'hidden'">
            <Loading />
          </el-icon>

          <div style="margin-right: 20px">💬 {{ comments }}</div>
          <div>{{ formattedDate }}</div>
        </div>
      </div>
    </el-card>
  </div>
  <!-- HOME PAGE -->
  <div v-else @click="showTopicDetails">
    <el-card shadow="hover">
      <template #header>
        <div style="font-weight: bold">
          {{ title }}
        </div>
      </template>
      <div class="row_2">
        <div class="group_1">
          <div id="profileImage">{{ initials }}</div>
          <div class="group_1_1">
            <div style="margin-left: 20px; font-style: italic">
              {{ content.slice(0, 20) }}...
            </div>
            <div id="fullName" style="margin-left: 20px">
              {{ createdBy }}
            </div>
          </div>
        </div>

        <div class="group_2">
          <div style="margin-right: 20px">
            <span v-if="hasLiked">❤️</span>
            <span v-else>🤍</span>
            {{ likes }}
          </div>
          <div style="margin-right: 20px">💬 {{ comments }}</div>
          <div>
            {{ this.$moment(dateCreated).format('D/MM/YYYY HH:mm') }}
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: [
    'topicId',
    'title',
    'createdBy',
    'likes',
    'content',
    'dateCreated',
    'comments',
    'hasLiked',
  ],
  emits: ['showDetails', 'likeUnlike'],
  created() {
    this.initializeProfileImage();
  },
  data() {
    return {
      initials: '',
      isClicked: false,
    };
  },
  watch: {
    likes: function () {
      // Handle prop like changes
      this.isClicked = false;
    },
  },
  computed: {
    formattedDate() {
      const date = this.$moment(this.dateCreated).format('D/MM/YYYY HH:mm');
      return date;
    },
    isTopicPage() {
      if (this.$route.fullPath === '/topics') {
        return true;
      }
      return false;
    },
  },
  methods: {
    initializeProfileImage() {
      // Profile Photo: Name Initials
      const initials = this.createdBy
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase();

      this.initials = initials;
    },
    showTopicDetails() {
      this.$emit('showDetails', this.topicId);
    },
    toggleLike() {
      this.isClicked = true;
      this.$emit('likeUnlike', this.topicId);
    },
  },
};
</script>

<style scoped>
:deep(.el-card__header) {
  padding: 5px 0 5px 10px;
}

.el-card {
  margin: 15px 0;
}

.row_2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.group_1 {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.group_1_1 {
  display: flex;
  flex-direction: column;
}

.group_2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
}

.likes {
  display: block;
  cursor: pointer;
}

@media screen and (max-width: 950px) {
  .row_2 {
    display: flex;
    flex-direction: column;
  }

  .group_2 {
    display: flex;
    flex-direction: column;
  }
}

.hidden {
  display: none;
}

.is-loading {
  display: block;
  color: mediumseagreen;
  font-size: 20px;
  margin-right: 33px;
}

.el-avatar {
  width: 50px;
  height: 50px;
  background: mediumseagreen;
  font-size: 18px;
  color: #fff;
  font-weight: bold;
}
</style>
