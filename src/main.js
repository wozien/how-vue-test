import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import App from './App.vue'
import storeConfig from './store'
import routerConfig from './router'
import ProgressBar from './components/ProgressBar.vue'

Vue.use(Vuex)
Vue.use(Router)
Vue.config.productionTip = false

const bar = new Vue(ProgressBar).$mount()
Vue.prototype.$bar = bar
document.body.appendChild(bar.$el)

new Vue({
  el: '#app',
  router: new Router(routerConfig),
  store: new Vuex.Store(storeConfig),
  render: h => h(App)
}) 