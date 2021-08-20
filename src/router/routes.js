import ItemList from '../views/ItemList.vue'
import ItemView from '../views/ItemView.vue'

export default [
  {
    path: '/:type(top|new|show|ask|job)/:page?',
    component: ItemList
  },
  {
    path: '/',
    redirect: '/top'
  },
  { path: '/item/:id(\\d+)', component: ItemView },
]