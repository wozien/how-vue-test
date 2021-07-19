import Vue from 'vue'
import App from './App.vue'
import { fetchListData } from './api/api'

Vue.config.productionTip = false

fetchListData('top')
  .then(items => {
    window.items = items
    new Vue({
      render: h => h(App),
    })
  })

