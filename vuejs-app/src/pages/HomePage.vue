<template>
  <div>
    <!-- CAROUSEL BANNER -->
    <div class="carousel">
      <el-carousel :interval="2000">
        <el-carousel-item v-for="(item, index) in banners" :key="item">
          <el-image :src="item" :alt="`Banner ${index}`" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- MEMBERS LIST -->
    <el-card class="card" shadow="always">
      <div class="headerItems">
        <h2 style="font-weight: bold">Members</h2>
        <el-link href="#/members"> View All </el-link>
      </div>
      <el-table
        v-loading="isLoading"
        element-loading-text="Loading members..."
        border
        stripe
        :data="this.members"
        style="width: 100%"
      >
        <el-table-column fixed prop="name" label="Name" />
        <el-table-column prop="sex" label="Sex" width="80" />
        <el-table-column prop="birthday" label="Birthday" />
        <el-table-column prop="occupation" label="Occupation" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="email" label="Email" width="150" />
        <el-table-column prop="interest" label="Interest" />
      </el-table>
    </el-card>

    <!-- TOPICS LIST -->
    <el-card
      class="card"
      shadow="always"
      v-loading="isLoading"
      element-loading-text="Loading topics..."
    >
      <div class="headerItems">
        <h2 style="font-weight: bold">Topics</h2>
        <el-link href="#/topics"> View All </el-link>
      </div>
      <div v-for="entry in topics" :key="entry.id" class="topics-card">
        <topic-card
          :topicId="entry.id"
          :title="entry.title"
          :createdBy="entry.createdBy"
          :content="entry.content"
          :likes="entry.likes"
          :hasLiked="entry.hasLiked"
          :comments="entry.comments"
          :dateCreated="entry.dateCreated"
          @showDetails="showTopicDetails"
        ></topic-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import TopicCard from '../components/topics/TopicCard.vue';

export default {
  components: {
    TopicCard,
  },
  data() {
    return {
      isLoading: false,
      members: null,
      topics: null,
      banners: [
        require(`../assets/banners/1.jpg`),
        require(`../assets/banners/2.jpg`),
        require(`../assets/banners/3.jpg`),
        require(`../assets/banners/4.jpg`),
      ],
    };
  },
  created() {
    this.loadMembers();
    this.loadTopics();
  },
  methods: {
    async loadMembers() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('members/loadMembersList');
      } catch (err) {
        console.log('error', err);
      }

      this.members = this.$store.getters['members/getMembersList'].slice(0, 8);
      this.isLoading = false;
    },
    async loadTopics() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('topics/loadTopicsList');
      } catch (err) {
        console.log('Error in Loading Topics at HomePage', err);
      }

      this.topics = this.$store.getters['topics/getTopicsList'].slice(0, 4);
      this.isLoading = false;
    },
    showTopicDetails(topicId) {
      this.$router.push({
        name: 'topicDetail',
        query: {
          id: JSON.stringify(topicId),
        },
      });
    },
  },
};
</script>

<style scoped>
h2 {
  color: seagreen;
}

.headerItems {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.carousel {
  display: block;
  text-align: center;
  margin-top: 10px;
}

.carousel_item {
  margin-top: 60px;
  color: #fff;
}

.topics-card {
  cursor: pointer;
}

.el-link {
  margin-left: 8px;
}

/* :deep(.el-loading-spinner .path),
:deep(.el-loading-spinner .el-loading-text) {
  color: mediumseagreen;
  stroke: mediumseagreen;
} */
</style>
