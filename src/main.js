import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { firestorePlugin } from 'vuefire'
import ToggleButton from 'vue-js-toggle-button'

Vue.use(firestorePlugin)
Vue.use(ToggleButton)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
