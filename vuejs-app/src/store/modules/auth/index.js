import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  state() {
    return {
      email: null,
      user: null,
      token: null,
      isTokenValid: null,
      tokenExpiration: null,
    };
  },
  mutations,
  actions,
  getters,
};
