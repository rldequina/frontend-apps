import CONFIGDATA from '../../../configData.json';
import router from '../../../router.js';

export default {
  async handleError(context, response) {
    if (!response.ok) {
      if (response.status === 401) {
        await context.dispatch('checkTokenStatus', false);
        const error = new Error(response.statusText || 'Failed to fetch!');
        throw error;
      }
    }
  },
  checkTokenStatus(context, isValidToken) {
    const currentTime = new Date().getTime();
    const validTime = +context.rootGetters.tokenValidity;
    const timeRemaining = validTime - currentTime;

    if (isValidToken === false) {
      context.commit('setTokenStatus', false);
    } else if (currentTime > validTime) {
      context.commit('setTokenStatus', false);
      context.dispatch('logout');
    } else {
      setTimeout(function () {
        context.commit('setTokenStatus', false);
        context.dispatch('logout');
      }, timeRemaining);
    }
  },
  async authUp(context, payload) {
    let endpoint = '';

    if (payload.mode == 'signup') {
      // signup endpoint
      endpoint = CONFIGDATA.SIGNUP_URL.concat(CONFIGDATA.FIREBASE_API_KEY);
    } else if (payload.mode == 'login') {
      // login endpoint
      endpoint = CONFIGDATA.LOGIN_URL.concat(CONFIGDATA.FIREBASE_API_KEY);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (responseData.error.message === 'EMAIL_EXISTS') {
        const error = new Error(
          responseData.error.message || 'Email already exists.'
        );
        throw error;
      } else if (responseData.error.message === 'INVALID_LOGIN_CREDENTIALS') {
        const error = new Error(
          responseData.error.message || 'Invalid login credentials.'
        );
        throw error;
      }
    }

    const expiresIn = new Date().getTime() + responseData.expiresIn * 1000;

    context.commit('setUser', {
      email: responseData.email,
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: expiresIn,
    });

    context.commit('setTokenStatus', true);

    // set timeout function here
    context.dispatch('checkTokenStatus');
  },
  logout(context) {
    context.commit('setUser', {
      email: null,
      token: null,
      userId: null,
      tokenExpiration: null,
    });

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');

    router.replace('/login');
  },
};
