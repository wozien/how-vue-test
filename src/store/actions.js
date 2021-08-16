import { fetchListData } from '../api/api'

export default {
  fetchListData({ commit }, { type }) {
    console.log('start fetchListData')
    return fetchListData(type).then(items => {
      commit('setItems', { items })
      console.log(items)
      return true
    })
  }
}