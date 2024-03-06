import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') || null
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getTokenFromLocalStorage: () => {
      return localStorage.getItem('token');
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    }
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearToken');
    }
  },
  modules: {
  }
})
