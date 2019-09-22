import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isHome: false,
    coordinate: [] as number[],
  },
  mutations: {
    toggleOnHome(state) {
      state.isHome = !state.isHome;
    },
    SOCKET_UPDATE_COORDINATE(state, coordinate: number[]) {
      state.coordinate = coordinate;
    }
  },
  actions: {
    socket_updateCoordinate({ dispatch, commit }, coordinates: any) {
      //console.log(coordinates);
      commit("SOCKET_UPDATE_COORDINATE", coordinates);
    }

  },
});
