import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isHome: false,
  },
  mutations: {
    toggleOnHome(state) {
      state.isHome = !state.isHome;
    },
  },
  actions: {

  },
});
