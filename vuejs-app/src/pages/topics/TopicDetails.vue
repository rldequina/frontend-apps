<template>
  <div>
    <el-card class="card" shadow="always">
      <template #header>
        <div @click="showTopicDetails" class="topic-title">
          <span v-if="topicData.title !== ''">{{ topicData.title }}</span>
          <el-skeleton v-else :rows="0" animated></el-skeleton>

          <el-button
            round
            class="defaultBtn_outline"
            icon="ArrowLeft"
            @click="backToTopicLists()"
          >
            Back to Topics List
          </el-button>
        </div>
      </template>
      <div class="row_2">
        <div class="group_1">
          <div v-if="initials !== ''" id="profileImage">{{ initials }}</div>
          <el-skeleton v-else :rows="0" animated></el-skeleton>
          <div class="group_1_1">
            <div
              v-if="topicData.created !== ''"
              style="margin-left: 20px; font-style: italic"
            >
              {{ topicData.createdBy }}
            </div>
            <el-skeleton v-else :rows="0" animated></el-skeleton>

            <div
              v-if="formattedDate !== 'Invalid date'"
              class="date-created"
              style="margin-left: 20px"
            >
              {{ formattedDate }}
            </div>
            <el-skeleton v-else :rows="0" animated></el-skeleton>
          </div>
        </div>

        <div class="group_2">
          <div v-if="hasRightToEdit">
            <el-button
              round
              class="defaultBtn_outline"
              icon="EditPen"
              style="width: 70px"
              @click="editTopicDetails"
            >
              Edit
            </el-button>
          </div>
          <div
            :class="!isClicked ? 'likes' : 'hidden'"
            style="margin: 0 10px 5px 30px"
            @click="handleLike"
          >
            <span v-if="topicData.hasLiked">❤️</span>
            <span v-else>🤍</span>
            {{ topicData.likes }}
          </div>

          <el-icon :class="isClicked ? 'is-loading' : 'hidden'">
            <Loading />
          </el-icon>
        </div>
      </div>
      <div>
        <!-- add html content here -->
        <el-card class="topic-content" shadow="always">
          <div v-if="topicData.content" v-html="topicData.content"></div>
          <el-skeleton v-else :rows="2" animated></el-skeleton>
        </el-card>
      </div>
      <div>
        <h4 style="margin: 15px 0 10px 5px">Comments:</h4>
      </div>
      <div
        class="comment-card"
        v-for="comment in topicData.comments"
        :key="comment.id"
      >
        <comment-card
          :initials="comment.createdBy.slice(0, 1).toUpperCase()"
          :id="comment.id"
          :createdBy="comment.createdBy"
          :dateCreated="comment.dateCreated"
          :comment="comment.comment"
          :topicOwner="topicData.createdBy"
          @delComment="deleteComment"
        ></comment-card>
      </div>

      <div v-if="hasMoreComments" class="more-comments">
        <div v-if="!showOtherComments">
          <el-button link class="defaultBtn" @click="toggleComments">
            Show more Comments
          </el-button>
        </div>
        <div v-else class="more-comments">
          <el-button link class="defaultBtn" @click="toggleComments">
            Hide Comments
          </el-button>
        </div>
      </div>

      <template #footer>
        <el-form @submit.prevent ref="addCommentForm" :model="addCommentForm">
          <el-form-item label="" prop="comment">
            <el-input
              v-model="addCommentForm.comment"
              type="textarea"
              :rows="3"
              style="width: 100%"
              resize="none"
              placeholder="Comment here"
            />
          </el-form-item>

          <div>
            <el-button
              v-if="!isSendingComment"
              round
              class="defaultBtn"
              style="width: 100px; float: right; margin-bottom: 10px"
              :disabled="addCommentForm.comment == ''"
              @click="addComment"
            >
              Send
            </el-button>
            <el-button
              v-else
              round
              class="is-loading"
              style="width: 100px; float: right; margin-bottom: 10px"
              loading
              ><el-text style="color: mediumseagreen">Sending</el-text>
            </el-button>
          </div>
        </el-form>
      </template>
    </el-card>
  </div>
</template>

<script>
import CommentCard from '../../components/topics/CommentCard.vue';

export default {
  components: {
    CommentCard,
  },
  created() {
    this.fetchTopicDetails();
    this.fetchCommentsList();
  },
  data() {
    return {
      initials: '',
      isClicked: false,
      isSendingComment: false,
      hasRightToEdit: false,
      hasMoreComments: false,
      showOtherComments: false,
      topicData: {
        id: '',
        title: '',
        createdBy: '',
        dateCreated: '',
        content: '',
        likes: 0,
        comments: [],
      },
      addCommentForm: {
        comment: '',
      },
    };
  },
  computed: {
    formattedDate() {
      const date = this.$moment(this.topicData.dateCreated).format(
        'D/MM/YYYY HH:mm'
      );
      return date;
    },
  },
  methods: {
    async fetchTopicDetails() {
      try {
        await this.$store.dispatch(
          'topics/fetchTopicDetails',
          JSON.parse(this.$route.query.id)
        );
      } catch (err) {
        console.log('error Fetching TopicDetails', err);
      }

      const topicDetails = this.$store.getters['topics/getTopicDetails'][0];

      Object.keys(topicDetails).forEach((item) => {
        this.topicData[item] = topicDetails[item];
      });
      this.topicData['id'] = JSON.parse(this.$route.query.id);

      // validate if current user has rights to Edit
      if (this.topicData.createdBy == this.$store.getters['email']) {
        this.hasRightToEdit = true;
      } else {
        this.hasRightToEdit = false;
      }

      this.initializeProfileImage();
      this.isClicked = false;
    },
    async fetchCommentsList() {
      try {
        await this.$store.dispatch(
          'topics/fetchComments',
          JSON.parse(this.$route.query.id)
        );
      } catch (err) {
        console.log('Error Fetching Comments List in TopicDetails', err);
      }

      const commentsList = await this.$store.getters['topics/getCommentsList'];

      this.topicData.comments = commentsList.slice(0, 4);

      if (commentsList.length > 4) {
        this.hasMoreComments = true;
      } else {
        this.hasMoreComments = false;
      }

      // toggling of show and hide comments
      if (this.showOtherComments) {
        this.topicData.comments = commentsList;
      } else {
        this.topicData.comments = commentsList.slice(0, 4);
      }

      this.isSendingComment = false;
    },
    editTopicDetails() {
      this.$router.push({
        name: 'addEditTopic',
        query: {
          id: this.topicData.id,
        },
      });
    },
    async addComment() {
      this.isSendingComment = true;
      try {
        await this.$store.dispatch('topics/addTopicComment', {
          topicId: this.topicData.id,
          comment: this.addCommentForm.comment,
          createdBy: this.$store.getters['email'],
          dateCreated: this.$moment(new Date()).format('D/MM/YYYY HH:mm'),
        });
      } catch (err) {
        console.log('Error Adding Comment in TopicDetails', err);
      }

      this.addCommentForm.comment = '';
      this.fetchCommentsList();
    },
    async deleteComment(commentId) {
      try {
        await this.$store.dispatch('topics/deleteTopicComment', {
          topicId: this.topicData.id,
          commentId: commentId,
        });
      } catch (err) {
        console.log('Error Deleting Comment in TopicDetails', err);
      }

      this.fetchCommentsList();
    },
    async handleLike() {
      this.isClicked = true;

      try {
        await this.$store.dispatch('topics/likeUnlike', {
          topicId: JSON.parse(this.$route.query.id),
          user: this.$store.getters['user'],
        });
      } catch (err) {
        console.log('topicLoadError', err);
      }

      this.fetchTopicDetails();
    },
    toggleComments() {
      this.showOtherComments = !this.showOtherComments;
      this.hasMoreComments = !this.hasMoreComments;

      this.fetchCommentsList();
    },
    initializeProfileImage() {
      // Profile Photo: Name Initials
      const initials = this.topicData.createdBy
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase();

      this.initials = initials;
    },
    backToTopicLists() {
      this.$router.push('/topics');
    },
  },
};
</script>

<style scoped>
:deep(.el-card__header) {
  padding: 5px 5px 5px 10px;
}

.topic-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

.group_2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
}

.likes {
  cursor: pointer;
}

.topic-content {
  margin-top: 20px;
}

.comment-card {
  margin: 10px 0;
}

.date-created {
  font-size: 14px;
}

.more-comments {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.hidden {
  display: none;
}

.is-loading {
  display: block;
  color: mediumseagreen;
  font-size: 20px;
  margin-right: 20px;
  margin-bottom: 5px;
}

#profileImage {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: mediumseagreen;
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 50px;
  margin: 1px 0;
}
</style>
