import { createApp } from 'vue';

import configData from './configData.json';
import router from './router.js';
import store from './store/index.js';

import ElementPlus from 'element-plus';
import moment from 'moment';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(store);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.config.globalProperties.$moment = moment;
app.config.globalProperties.$CONFIGDATA = configData;

// prevent the transition of homepage upon loading
// router.isReady().then(() => {
app.mount('#app');
// });
