<template>
  <div>
    <el-card class="card" shadow="hover">
      <el-result
        title="404"
        sub-title="The page you requested cannot be found or is temporarily unavailable."
      >
        <template #icon>
          <el-empty description="Page Not Found" />
        </template>
        <template #extra>
          <el-button link tag="router-link" to="/home">
            Return to Home
          </el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<style scoped>
.card {
  margin-top: 0px;
  width: 500px;
  text-align: center;
  border: 3px solid mediumseagreen;
}

:deep(.el-result__title p) {
  color: seagreen;
  font-weight: bold;
  font-size: 30px;
}

:deep(.el-button > span):hover {
  color: mediumseagreen;
}
</style>
