import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nickname: sessionStorage.getItem('nickname'),
    colorCode: '',
    answer: '',
    point: 0,
    isLogin: false
  },
  mutations: {
    getNickname (state) {
      state.log = sessionStorage.getItem('nickname')
    },
    delNickname (state) {
      sessionStorage.removeItem('nickname')
      state.log = null
    },
    setColorCode (state) {
      state.colorCode = state
    }
  },
  actions: {
  },
  modules: {
  }
})
