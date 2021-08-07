import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import storeConfig from '../index'
import cloneDeep from 'lodash.clonedeep'
import { fetchListData } from '../../api/api'
import flushPromise from 'flush-promises'

jest.mock('../../api/api.js')

const localVue = createLocalVue()
localVue.use(Vuex)

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