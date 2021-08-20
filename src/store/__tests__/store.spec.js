import Vuex from 'vuex'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import { createLocalVue } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import { fetchListData } from '../../api/api'
import flushPromise from 'flush-promises'
import storeConfig from '../index'
import routerConfig from '../../router/index'

jest.mock('../../api/api.js')

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Router)
const store = new Vuex.Store(storeConfig)
const router = new Router(routerConfig)
sync(store, router)

describe('store', () => {
  test('dispatch fetchListData update displayItems', async () => {
    const items = Array(21).fill().map((v,i) => i)
    const store = new Vuex.Store(cloneDeep(storeConfig))
    fetchListData.mockImplementationOnce(type => {
      return Promise.resolve(type === 'top' ? items : [])
    })
    store.dispatch('fetchListData', { type: 'top' })
    await flushPromise()

    expect(store.getters.displayItems).toEqual(items.slice(0, 20))
  })
})