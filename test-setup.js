import Vue from 'vue'
import titleMixin from './src/utils/mixins'
import {
  timeAgo,
  host
} from './src/utils/filters'

Vue.config.productionTip = false // #A

Vue.mixin(titleMixin) // #B
Vue.filter('timeAgo', timeAgo)
Vue.filter('host', host)