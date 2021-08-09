import Vuex from 'vuex'
import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import ItemList from '../ItemList.vue'
import flushPromises from 'flush-promises'
import Item from '../../components/Item.vue'
import mergeWith from 'lodash.mergewith'

const localVue = createLocalVue()
localVue.use(Vuex)
// localVue.mixin(titleMixin)

describe('ItemList.vue', () => {
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
        },
        $route: {
          params: { type: 'top' }
        }
      },
      localVue,
      store: createStore(),
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
    return shallowMount(ItemList, mergeWith(config, mountConfig, customizer))
  }
  
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

  test('dispatch fetchListData with $route.params.type', async () => {
    const store = createStore()
    store.dispatch = jest.fn(() => Promise.resolve())
    const type = 'a type'
    const mocks = {
      $route: {
        params: { type }
      }
    }
    createWrapper({ mocks, store })

    expect(store.dispatch).toHaveBeenCalledWith('fetchListData', { type })
  })

  test('render 1/5 when on page 1 of 5', () => {
    const store = createStore({
      getters: {
        maxPage: () => 5
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.text()).toContain('1 / 5')
  })

  test('render 2/5 when on page 2 of 5', () => {
    const store = createStore({
      getters: {
        maxPage: () => 5
      }
    })
    const mocks = {
      $route: {
        params: { page: 2 }
      }
    }
    const wrapper = createWrapper({ store, mocks })
    expect(wrapper.text()).toContain('2 / 5')
  })

  test('call $router.replace when page is greater than maxPage', async () => {
    const store = createStore({
      getters: {
        maxPage: () => 5
      }
    })
    const mocks = {
      $route: {
        params: { page: 100 }
      },
      $router: {
        replace: jest.fn()
      }
    }
    createWrapper({ mocks, store })
    await flushPromises()
    expect(mocks.$router.replace).toHaveBeenCalledWith('/top/1')
  })

  test('renders a RouterLink with the previous page if one exists', () => {
    const mocks = {
      $route: {
        params: { page: 2 }
      }
    }
    const wrapper = createWrapper({ mocks })
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/top/1')
    expect(wrapper.findComponent(RouterLinkStub).text()).toBe('< prev')
  })

  test('renders a RouterLink with the next page if one exists', () => {
    const store = createStore({
      getters: {
        maxPage: () => 3
      }
    })
    const mocks = {
      $route: {
        params: { page: 1 }
      }
    }
    const wrapper = createWrapper({ mocks, store })
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/top/2')
    expect(wrapper.findComponent(RouterLinkStub).text()).toBe('more >')
  })

  test('set document title with route.params.type', () => {
    const mocks = {
      $route: { params: { type: 'new' }}
    }
    createWrapper({ mocks })
    expect(document.title).toBe('New')
  })
})