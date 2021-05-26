import Vue from 'vue'
import Vuex from 'vuex'
import mapbox from "./modules/mapbox"
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mapbox,
  },
})
