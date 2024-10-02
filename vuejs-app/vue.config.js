const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/TrainingForPH/Ralph/practice7/dist',
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
      overlay: false,
    },
  },
});
