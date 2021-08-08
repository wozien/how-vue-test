import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ItemList from '../ItemList.vue'
import flushPromises from 'flush-promises'
import Item from '../../components/Item.vue'
import mergeWith from 'lodash.mergewith'

const localVue = createLocalVue()
localVue.use(Vuex)

function customizer(objValue, srcValue) {
  if(Array.isArray(srcValue)) {
    return srcValue
  }
  if(srcValue instanceof Object && Object.keys(srcValue).length === 0) {
    return srcValue
  }
}

function createStore(storeConfig) {
  const config = {
    getters: {
      displayItems: jest.fn()
    },
    actions: {
      fetchListData: jest.fn(() => Promise.resolve())
    }
  }
  return new Vuex.Store(mergeWith(config, storeConfig, customizer))
}

function createWrapper(mountConfig) {
  const config = {
    mocks: {
      $bar: {
        start: jest.fn(),
        finish: jest.fn(),
        fail: jest.fn()
      }
    },
    localVue,
    store: createStore()
  }
  return shallowMount(ItemList, mergeWith(config, mountConfig, customizer))
}

describe('ItemList.vue', () => {
  test('renders Item with data in store.getters.displayItem', () => {
    expect.assertions(4)
    const items = [{id:1}, {id:2}, {id:3}]
    const store = createStore({
      getters: {
        displayItems: () => items
      }
    })
    const wrapper = createWrapper({store})
    const Items = wrapper.findAllComponents(Item)
    expect(Items).toHaveLength(items.length)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.props().item).toBe(items[i])
    })
  })

  test('call $bar start on load', () => {
    const $bar = {
      start: jest.fn()
    }
    createWrapper({ mocks: { $bar }})
    expect($bar.start).toHaveBeenCalled()
  })

  test('call $bar finish when load is successful', async () => {
    const $bar = {
      finish: jest.fn()
    }
    createWrapper({ mocks: { $bar }})
    await flushPromises()
    expect($bar.finish).toHaveBeenCalled()
  })

  test('call $bar fail when load is unsuccessful', async () => {
    const $bar = {
      fail: jest.fn()
    }
    const store = createStore({
      actions: {
        fetchListData: jest.fn(() => Promise.reject())
      }
    })
    createWrapper({ mocks: { $bar }, store })
    await flushPromises()

    expect($bar.fail).toHaveBeenCalled()
  })
})