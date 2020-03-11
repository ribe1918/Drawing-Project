import Vue from 'vue'
import App from './App.vue'
import router from './router'

import io from 'socket.io-client'
import vuetify from './plugins/vuetify'
import VueCanvas from '@/components/main'
import store from './store'

Vue.component(VueCanvas.name, VueCanvas)

const socket = io('http://192.168.0.25:3000/game')

Vue.prototype.$socket = socket

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
