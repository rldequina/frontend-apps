<template>
  <div>
    <el-card class="card">
      <div v-if="isFetchingData" class="is-loading">
        <el-skeleton :rows="12" animated></el-skeleton>
      </div>
      <div v-if="!isFetchingData" class="addNewBtn">
        <el-button
          round
          class="defaultBtn_outline"
          icon="Plus"
          style="width: 70px"
          @click="addTopic()"
        >
          New
        </el-button>
      </div>

      <div v-for="entry in topics" :key="entry.id" class="topic-card">
        <topic-card
          :topicId="entry.id"
          :title="entry.title"
          :createdBy="entry.createdBy"
          :content="entry.content"
          :likes="entry.likes"
          :hasLiked="entry.hasLiked"
          :comments="entry.comments"
          :dateCreated="entry.dateCreated"
          :isFetchingData="isFetchingData"
          @likeUnlike="handleLike"
          @showDetails="showTopicDetails"
        ></topic-card>
      </div>

      <template #footer>
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :page-size="5"
            :total="paginationTotal"
            @current-change="handlePageChange"
          />
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import TopicCard from '../../components/topics/TopicCard.vue';

export default {
  components: { TopicCard },
  data() {
    return {
      isFetchingData: false,
      topics: [],
      isLoading: false,
      currentPage: 1,
      paginationTotal: 5,
    };
  },
  created() {
    this.isFetchingData = true;
    this.handlePageChange(1);
  },
  methods: {
    addTopic() {
      this.$router.push('/topic/edit');
    },
    async loadTopics() {
      try {
        await this.$store.dispatch('topics/loadTopicsList');
      } catch (err) {
        console.log('error', err);
      }

      const itemsPerPage = 5;
      const startIndex = (this.currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      this.topics = this.$store.getters['topics/getTopicsList'].slice(
        startIndex,
        endIndex
      );

      this.isFetchingData = false;
      this.paginationTotal = this.$store.getters['topics/getTopicsList'].length;
    },
    showTopicDetails(topicId) {
      this.$router.push({
        name: 'topicDetail',
        query: {
          id: JSON.stringify(topicId),
        },
      });
    },
    async handleLike(topicId) {
      try {
        await this.$store.dispatch('topics/likeUnlike', {
          topicId: topicId,
          user: this.$store.getters['user'],
        });
      } catch (err) {
        console.log('topicLoadError', err);
      }
      this.$forceUpdate();
      this.loadTopics(1);
    },
    handlePageChange(currentPage) {
      this.loadTopics(currentPage);
      this.currentPage = currentPage;
    },
  },
};
</script>

<style scoped>
.card {
  width: 60%;
}

.addNewBtn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
}

.pagination :deep(li.is-active),
.pagination :deep(li:hover) {
  color: mediumseagreen;
}

.is-loading {
  color: mediumseagreen;
  font-size: 25px;
}
</style>
