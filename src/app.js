import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import storeConfig from './store'
import routerConfig from './router'
import { titleMixin } from './utils/mixins'
import {
  timeAgo,
  host
} from './utils/filters'

Vue.mixin(titleMixin)
Vue.filter('timeAgo', timeAgo)
Vue.filter('host', host)
Vue.use(Vuex)
Vue.use(Router)

export function createApp() {
  const router = new Router(routerConfig)
  const store = new Vuex.Store(storeConfig)

  // sync(store, router)

  const app = new Vue({
    store,
    router,
    render: h => h(App)
  })

  return { app, store, router }
}