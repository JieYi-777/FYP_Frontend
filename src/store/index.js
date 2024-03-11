import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getToken: state => state.token,
    getUsername: state => state.username
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
    setUsername(state, username) {
      state.username = username;
      localStorage.setItem('username', username);
    },
    clearUsername(state) {
      state.username = null;
      localStorage.removeItem('username');
    }
  },
  actions: {
    login({ commit }, { token, username }) {
      commit('setToken', token);
      commit('setUsername', username);
    },
    logout({ commit }) {
      commit('clearToken');
      commit('clearUsername');
    }
  },
  modules: {
  }
})
