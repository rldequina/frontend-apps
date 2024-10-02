export default {
  setUser(state, payload) {
    state.email = payload.email;
    state.token = payload.token;
    state.user = payload.userId;
    state.tokenExpiration = payload.tokenExpiration;

    localStorage.setItem('email', payload.email);
    localStorage.setItem('token', payload.token);
    localStorage.setItem('user', payload.userId);
    localStorage.setItem('tokenExpiration', payload.tokenExpiration);
  },
  setTokenStatus(state, payload) {
    state.isTokenValid = payload;
  },
};
