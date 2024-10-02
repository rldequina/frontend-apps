<template>
  <div>
    <el-dialog v-model="showConfDialog" title="Delete" width="500">
      <span>Are you sure you want to delete this member?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button round @click="closeDialog">Cancel</el-button>
          <el-button
            v-if="!isDeleting"
            round
            class="deleteBtn"
            @click="confirmDelete"
          >
            <el-icon><Delete /></el-icon>
            Delete
          </el-button>
          <el-button v-else round class="is-loading" loading
            ><el-text style="color: indianred">Deleting</el-text>
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-card class="card" shadow="always">
      <div class="addNewBtn">
        <el-button
          v-if="!isLoading"
          round
          class="defaultBtn_outline"
          @click="addEditMember('add')"
          icon="Plus"
          style="width: 70px"
        >
          New
        </el-button>
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
        <el-table-column fixed="right" label="Action" width="170">
          <template #default="scope">
            <el-button
              round
              class="defaultBtn"
              size="small"
              @click="addEditMember('edit', scope.row)"
            >
              <el-icon><EditPen /></el-icon>
              Edit
            </el-button>
            <el-button
              round
              class="deleteBtn"
              size="small"
              @click="confirmationDialog(scope.row.id)"
            >
              <el-icon><Delete /></el-icon>
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :page-size="12"
            :total="paginationTotal"
            @current-change="handlePageChange"
          />
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      members: null,
      isLoading: true,
      isDeleting: false,
      showConfDialog: false,
      selectedMemberId: '',
      paginationTotal: 12,
    };
  },
  created() {
    this.handlePageChange(1);
  },
  methods: {
    async loadMembers(currentPage) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('members/loadMembersList');

        const itemsPerPage = 12;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        this.members = this.$store.getters['members/getMembersList'].slice(
          startIndex,
          endIndex
        );

        this.isLoading = false;

        this.paginationTotal =
          this.$store.getters['members/getMembersList'].length;
      } catch (err) {
        console.log('error', err);
      }
    },
    addEditMember(action, memberData) {
      if (action == 'edit') {
        this.$router.push({
          name: 'addEditMember',
          query: {
            id: JSON.stringify(memberData.id),
          },
        });
      } else if (action == 'add') {
        this.$router.push({
          name: 'addEditMember',
        });
      }
    },
    async deleteMember(memberId) {
      if (memberId) {
        await this.$store.dispatch('members/deleteMember', memberId);
      }

      this.isDeleting = false;
      this.selectedMemberId = '';
      this.closeDialog();
      this.loadMembers(1);
    },
    confirmDelete() {
      this.isDeleting = true;
      this.deleteMember(this.selectedMemberId);
    },
    confirmationDialog(memberId) {
      this.showConfDialog = true;
      this.selectedMemberId = memberId;
    },
    closeDialog() {
      this.showConfDialog = false;
      this.selectedMemberId = '';
    },
    handlePageChange(currentPage) {
      this.loadMembers(currentPage);
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 1100px) {
  .card {
    height: auto;
  }
}

.deleteBtn {
  color: #fff;
  background-color: indianred;
}

.deleteBtn:hover {
  color: #fff;
  background-color: rgb(173, 81, 81);
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
  color: indianred;
  font-size: 15px;
}
</style>
