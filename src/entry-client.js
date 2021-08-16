import Vue from 'vue'
import { createApp } from './app'
import ProgressBar from './components/ProgressBar.vue'

const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

const { app, store } = createApp()

// todo client asyncData

if(window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

app.$mount('#app')