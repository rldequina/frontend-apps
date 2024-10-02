import { createStore } from 'vuex';

import membersModule from './modules/members/index.js';
import topicsModule from './modules/topics/index.js';
import authModule from './modules/auth/index.js';

const store = createStore({
  modules: {
    members: membersModule,
    topics: topicsModule,
    auth: authModule,
  },
  state() {
    return {
      memberId: '',
    };
  },
  getters: {
    memberId(state) {
      return state.memberId;
    },
  },
});

export default store;
