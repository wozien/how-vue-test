import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import storeConfig from './store'
import ProgressBar from './components/ProgressBar.vue'

Vue.use(Vuex)
Vue.config.productionTip = false

const bar = new Vue(ProgressBar).$mount()
Vue.prototype.$bar = bar
document.body.appendChild(bar.$el)

new Vue({
  el: '#app',
  store: new Vuex.Store(storeConfig),
  render: h => h(App)
}) 