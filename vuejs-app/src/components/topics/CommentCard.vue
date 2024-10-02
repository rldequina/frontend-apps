<template>
  <div>
    <el-card shadow="hover">
      <div class="row_1">
        <div class="group_1">
          <el-avatar>{{ initials }}</el-avatar>
          <div class="group_1_1">
            <div style="margin-left: 20px; font-style: italic">
              {{ createdBy }}
            </div>
            <div class="date-created" style="margin-left: 20px">
              {{ dateCreated }}
            </div>
          </div>
        </div>

        <div class="group_2">
          <div v-if="hasRightToDelete">
            <el-button
              round
              class="defaultBtn_outline"
              icon="Delete"
              style="width: 70px"
              v-if="!isDeleting"
              @click="handleDelete"
            >
              Delete
            </el-button>
            <el-icon v-else class="is-loading">
              <Loading />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="comment-content">
        {{ comment }}
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: [
    'initials',
    'topicOwner',
    'id',
    'createdBy',
    'dateCreated',
    'comment',
  ],
  emits: ['delComment'],
  data() {
    return {
      isDeleting: false,
    };
  },
  computed: {
    hasRightToDelete() {
      if (this.topicOwner == this.$store.getters['email']) {
        return true;
      }
      return false;
    },
  },
  methods: {
    handleDelete() {
      this.isDeleting = true;
      this.$emit('delComment', this.id);
    },
  },
};
</script>

<style scoped>
.row_1 {
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
  align-items: flex-start;
}

.likes {
  cursor: pointer;
}

.topic-content {
  margin-top: 20px;
}

.comment-content {
  margin-top: 10px;
  margin-left: 70px;
}

.date-created {
  font-size: 12px;
}

.is-loading {
  color: mediumseagreen;
  font-size: 25px;
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
