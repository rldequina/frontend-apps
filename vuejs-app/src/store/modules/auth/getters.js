export default {
  token(state) {
    return state.token || localStorage.getItem('token');
  },
  email(state) {
    return state.email || localStorage.getItem('email');
  },
  user(state) {
    return state.user || localStorage.getItem('user');
  },
  tokenValidity(state) {
    return state.tokenExpiration || localStorage.getItem('tokenExpiration');
  },
  tokenStatus(state) {
    return state.isTokenValid;
  },
  isAuthenticated(state) {
    return !!state.token;
  },
};
